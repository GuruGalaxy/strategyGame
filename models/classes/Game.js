const UserGameDto = require('../dtos/UserGameDto');
const MapGenerator = require('../../engine/MapGenerator');

module.exports = class Game {
    constructor({id, users, config}){
        this.id = id;
        this.users = users;

        let map = MapGenerator.generateMap(config);
        this.map = MapGenerator.populateMap(users, map, config);
        MapGenerator.debugMap(this.map);

        this.executeTurn = function(moves){

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