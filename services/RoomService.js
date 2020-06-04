const { v4: uuidv4 } = require('uuid');

const UserDto = require('../models/dtos/UserDto');
const UserRoomDto = require('../models/dtos/UserRoomDto');
const ActiveRoom = require('../models/classes/ActiveRoom');


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
            ActiveRooms.splice(roomIndex, 1);

            return true;
        }
        
        return false;
    },

    AddUserToActiveRoom: function(activeRoomId, userRoomDto){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        activeRoom.users.push(userRoomDto);

        return true;
    },

    RemoveUserFromActiveRoom: function(activeRoomId, userId){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        let userIndex = activeRoom.users.findIndex( user => user.id === userId );

        if(userIndex >= 0)
        {
            activeRoom.users.splice(userIndex, 1);
            if(!Array.isArray(activeRoom.users) || !activeRoom.users.length)
            {
                this.RemoveActiveRoom(activeRoomId);
            }

            return true;
        }
        

        return false;
    },

    SwitchReadyForUser: function(activeRoomId, userId){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        let userRoomDtoIndex = activeRoom.users.findIndex( user => user.id === userId );

        if(userRoomDtoIndex >= 0)
        {
            activeRoom.users[userRoomDtoIndex].ready = !activeRoom.users[userRoomDtoIndex].ready;
            return true;
        }

        return false;
    }
}