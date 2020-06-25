const UserGameDto = require('../dtos/UserGameDto');
const MapGenerator = require('../../engine/MapGenerator');
const FieldTypes = require('../../shared/engine/field-types');
const Move = require('../../engine/move');

module.exports = class Game {
    constructor({id, users, config}){
        this.id = id;
        this.users = users;
        this.config = config;

        this.turnsSinceSpawn = 0;
        this.ended = false;

        let map = MapGenerator.generateMap(config);
        this.map = MapGenerator.populateMap(users, map, config);
        //MapGenerator.debugMap(this.map);

        this.checkIsMoveIntentionValid = function(userId, moveIntention){
            // check if given user can move from given field
            if(!moveIntention.fieldFrom.ownerId == userId) return false;
            if(moveIntention.fieldTo.x < 1 && moveIntention.fieldTo.x >= this.map.fields.length) return false;
            if(moveIntention.fieldTo.y < 1 && moveIntention.fieldTo.y >= this.map.fields.length) return false;
            if(moveIntention.fieldTo.type == FieldTypes.TYPES.MOUNTAIN) return false;

            return true;
        }

        this.addMoveIntention = function(userId, moveIntention){
            let gameUserDto = this.users.find( user => user.id === userId );
            
            if(!gameUserDto) return false;

            gameUserDto.pendingMoveIntention = moveIntention;
        }

        this.removeUser = function(userId){
            let defeatedUser = this.users.find(user => user.id == userId);
            defeatedUser.lost = true;

            // find all fields owned by defeatedPlayer and make them unowned
            for(let col = 1; col <= this.config.mapSize; col++)
            {
                for(let row = 1; row <= this.config.mapSize; row++)
                {
                    if(this.map.fields[col][row].ownerId == userId) this.map.fields[col][row].ownerId = null;
                }
            }

            // end game if only one users is left undefeated
            let undefeatedUsersLeft = this.users.filter(user => !user.lost);
            if(undefeatedUsersLeft.length <= 1) this.ended = true;
        };

        this.resolveConflict = function(conflict){
            // if any move is from the defender, merge armies first
            let alliedMove = conflict.moves.find((move) => move.userId == conflict.field.ownerId);
            if(alliedMove)
            {
                conflict.field.army += alliedMove.army;
                alliedMove.army = 0;
            }

            // see which attacking army is biggest
            let biggestArmy = Math.max.apply(Math, conflict.moves.map(function(move){return move.army;}))
            let biggestAttacker = conflict.moves.find(function(move){ return move.army == biggestArmy; })

            console.log("biggestAttacker", biggestAttacker);
            // substract second biggest army from the biggest army TODO

            // check if the biggest attacking army is bigger than 120% of defending army, draws are won by defenders
            console.log("biggestArmy > Math.floor(conflict.field.army * 1.2)", biggestAttacker.army, Math.floor(conflict.field.army * 1.2));
            if(biggestAttacker.army > Math.floor(conflict.field.army * 1.2))
            {
                // if yes, remove player from game if that was a capital they lost
                if(conflict.field.type == FieldTypes.TYPES.CAPITAL) this.removeUser(conflict.field.ownerId);

                // next, substract 120% of defender army from biggest attacking army and set field as attacker's
                biggestAttacker.army -= Math.floor(conflict.field.army * 1.2);
                conflict.field.ownerId = biggestAttacker.userId;
                conflict.field.army = biggestAttacker.army;
            }
            else
            {
                // if not, substract 80% of biggest attacker army from defender army
                conflict.field.army -= Math.floor(biggestAttacker.army * 0.8);
            }
            // return conflicted field
            return conflict.field;
        }

        this.executeTurn = function(){
            // don't execute turn if game has already ended
            if(this.ended) return false;

            // spawn armies
            for(let col = 1; col <= this.config.mapSize; col++)
            {
                for(let row = 1; row <= this.config.mapSize; row++)
                {
                    if(this.map.fields[col][row].type == FieldTypes.TYPES.FIELD && this.map.fields[col][row].ownerId && this.turnsSinceSpawn == 30) this.map.fields[col][row].army++;
                    else if(this.map.fields[col][row].type == FieldTypes.TYPES.CITY && this.map.fields[col][row].ownerId) this.map.fields[col][row].army++;
                    else if(this.map.fields[col][row].type == FieldTypes.TYPES.CAPITAL) this.map.fields[col][row].army++;
                }
            }

            if(this.turnsSinceSpawn == 30)
            {
                this.turnsSinceSpawn = 0;
            }

            // create list of all moves from move intentions
            let moves = [];
            this.users.forEach((user) => {

                if(user.pendingMoveIntention)
                {
                    
                    let transferedArmy = Math.floor(this.map.fields[user.pendingMoveIntention.fieldFrom.x][user.pendingMoveIntention.fieldFrom.y].army * (user.pendingMoveIntention.armyPercentage / 100));
                    this.map.fields[user.pendingMoveIntention.fieldFrom.x][user.pendingMoveIntention.fieldFrom.y].army -= transferedArmy;
    
                    user.pendingMoveIntention.army = transferedArmy;
                    user.pendingMoveIntention.userId = user.id;
    
                    let move = Move.fromObject(user.pendingMoveIntention);
                    if(move) moves.push(move);
                }
                
            });

            // check if there are conflicts
            let conflicts = [];
            moves.forEach((move) => {
                let existingConflict = conflicts.find( conflict => (conflict.field.x == move.fieldTo.x && conflict.field.y == move.fieldTo.y) );

                if(existingConflict){
                    existingConflict.moves.push(move);
                }
                else{
                    conflicts.push({
                        field: move.fieldTo,
                        moves: [move]
                    });
                }
            });

            conflicts.forEach( conflict => {
                let resolvedField = this.resolveConflict(conflict);
                this.map.fields[resolvedField.x][resolvedField.y].army = resolvedField.army;
                this.map.fields[resolvedField.x][resolvedField.y].ownerId = resolvedField.ownerId;
            } );

            // after calculating a turn, clear move intetnions
            this.users.forEach((user) => {
                user.pendingMoveIntention = null;
            });
            
            this.turnsSinceSpawn++;
        };

        this.renderVisibleFields = function(userGameDto){

        }
    }

    static fromObject({
        id = null, 
        users = null, 
        config = null
    }){
        if(id && users && config)
        {
            let newGame = {
                id : id,
                config : config,
                users : []
            };
    
            

            users.forEach(user => {
                newGame.users.push( UserGameDto.fromObject(user) );
            });
     
            return new this(newGame);
        }
        return false;
	}
}