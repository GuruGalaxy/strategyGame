const { v4: uuidv4 } = require('uuid');

const Game = require('./Game');
const UserMatchDto = require('../dtos/UserMatchDto');

const playerColors = ["green", "blue", "red", "blue"];

module.exports = class Match {
    constructor({
        id = null,
        roomId = null,
        name = null,
        config = null,
        users = null,
        game = null,
        eventEmitter = null
    }){
        this.id = id;
        this.roomId = roomId;
        this.name = name;
        this.config = config;
        this.users = users;

        this.playing = false;
        this.gameLoop = null;
        this.eventEmitter = eventEmitter;

        // function to be executed within gameLoop
        this.executeTurn = function(){
            this.game.executeTurn();

            this.game.users.forEach(user => {
                if(user.lost) this.users.find(matchUser => matchUser.id == user.id).lost = true;
            });

            if(this.game.ended)
            {
                this.eventEmitter.emit("gameEnded", this.id);

                clearInterval(this.gameLoop);
                this.playing = false;
            }
            else{
                this.eventEmitter.emit("gameExecuted", this.id);
            }

            this.game = game;
        }
    }

    static fromObject({
        id = null,
        name = null, 
        config = null, 
        users = null
    }, game = null, eventEmitter = null){
        if(id && name && config && users && game)
        {
            let newMatch = {
                id : uuidv4(),
                roomId : id,
                name : name,
                config : config,
                game : game,
                eventEmitter : eventEmitter,
                users : []
            };
    
            // assign colors to users on game init
            for(let i = 0; i < users.length; i++)
            {
                users[i].color = playerColors[i];
            }

            users.forEach(user => {
                newMatch.users.push( UserMatchDto.fromObject(user) );
            });
    
            return new this(newMatch);
        }
        return false;
	}
}