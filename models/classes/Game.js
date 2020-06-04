const Match = require('./Game');
const UserGameDto = require('../dtos/UserGameDto');

const FieldGenerator = require(); // TODO

module.exports = class Game {
    constructor({id, users, config}){
        this.id = id;
        this.users = users;
        this.field = FieldGenerator.generateField(config.fieldSize);

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
                id = id,
                config = config
            };
    
            users.forEach(user => {
                newGame.users.push( UserGameDto.fromObject(user) );
            });
    
            return new this(newGame);
        }
        return false;
	}
}