// Match dto for front end initial message
const { v4: uuidv4 } = require('uuid');

module.exports = class MatchDto {
    constructor({
        id = null,
        roomId = null,
        name = null,
        config = null,
        users = null,
        playing = null,
        map = null
    }){
        this.id = id;
        this.roomId = roomId;
        this.name = name;
        this.config = config;
        this.users = users;
        this.playing = playing;
        this.map = map;  
    }

    static fromObject({
        id = null,
        roomId = null,
        name = null,
        config = null,
        users = null,
        playing = null,
        map = null
    }){
        if(id && roomId && name && config && users && (playing == true || playing == false) && map)
        {
            let newMatch = {
                id : id,
                roomId : roomId,
                name : name,
                config : config,
                users : users,
                playing : playing,
                map : map
            };
    
            return new this(newMatch);
        }
        return false;
	}
}