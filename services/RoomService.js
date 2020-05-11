const { v4: uuidv4 } = require('uuid');

import UserDto from '../models/UserDto.mjs';
import ActiveRoom from '../models/ActiveRoom';
//const ActiveRoomModel = require('../models/ActiveRoom');


var ActiveRooms = [];

//
module.exports = {
    GetActiveRooms: function() {
        return ActiveRooms;
    },

    GetActiveRoom: function(roomId) {
        return ActiveRoom;
    },

    AddActiveRoom: function(name) {
        let newActiveRoom = new ActiveRoom(name, 4);

        ActiveRooms.push(newActiveRoom);

        return newActiveRoom;
    },

    RemoveActiveRoom: function(activeRoomId){
        let roomIndex = ActiveRooms.findIndex( room => room.id === activeRoomId );

        if(roomIndex >= 0)
        {
            ActiveRooms = ActiveRooms.splice(roomIndex, 0);

            return true;
        }
        
        return false;
    },

    AddUserToActiveRoom: function(roomId, userDto){
        
    },

    RemoveUserFromActiveRoom: function(){
        
    }
}