const { v4: uuidv4 } = require('uuid');

const UserDto = require('../models/UserDto');
const ActiveRoom = require('../models/ActiveRoom');


var ActiveRooms = [
    new ActiveRoom("Test Room", 4),
    new ActiveRoom("Super Hyper Room Overdrive", 4),
];

//
module.exports = {
    GetActiveRooms: function() {
        return ActiveRooms;
    },

    GetActiveRoom: function(activeRoomId) {
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        return activeRoom;
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
            ActiveRooms = ActiveRooms.splice(roomIndex, 1);

            return true;
        }
        
        return false;
    },

    AddUserToActiveRoom: function(activeRoomId, userDto){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        activeRoom.users.push(userDto);

        return true;
    },

    RemoveUserFromActiveRoom: function(activeRoomId, userDto){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        let userIndex = activeRoom.users.findIndex( user => user.id === userDto.id );

        if(userIndex >= 0)
        {
            console.log("RemoveUserFromActiveRoom before", activeRoom,userIndex,userDto);
            activeRoom.users.splice(userIndex, 1);
            console.log("RemoveUserFromActiveRoom after", activeRoom);
            if(!Array.isArray(activeRoom.users) || !activeRoom.users.length)
            {
                this.RemoveActiveRoom(activeRoomId);
            }

            return true;
        }

        return false;
    }
}