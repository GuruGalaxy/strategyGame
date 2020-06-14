const { v4: uuidv4 } = require('uuid');

const Game = require('./Game');
const UserMatchDto = require('../dtos/UserMatchDto');

module.exports = class Match {
    constructor({
        id = null,
        roomId = null,
        name = null,
        config = null,
        users = null,
        game = null
    }){
        this.id = id;
        this.roomId = roomId;
        this.name = name;
        this.config = config;
        this.users = users;
        this.game = game;

        this.playing = false;
    }

    static fromObject({
        id = null,
        name = null, 
        config = null, 
        users = null
    }, game = null){
        if(id && name && config && users && game)
        {
            let newMatch = {
                id : uuidv4(),
                roomId : id,
                name : name,
                config : config,
                game : game,
                users : []
            };
    
            users.forEach(user => {
                newMatch.users.push( UserMatchDto.fromObject(user) );
            });
    
            return new this(newMatch);
        }
        return false;
	}
}