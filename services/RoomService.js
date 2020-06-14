const { v4: uuidv4 } = require('uuid');

const UserDto = require('../models/dtos/UserDto');
const UserRoomDto = require('../models/dtos/UserRoomDto');
const ActiveRoom = require('../models/classes/ActiveRoom');


var ActiveRooms = [
    new ActiveRoom("Test Room", {usersLimit : 2}),
    new ActiveRoom("Super Hyper Room Overdrive", {usersLimit : 4}),
];

//
module.exports = {
    getActiveRooms: function() {
        return ActiveRooms;
    },

    getActiveRoom: function(activeRoomId) {
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        return activeRoom;
    },

    addActiveRoom: function(name, config) {
        let newActiveRoom = new ActiveRoom(name, config);

        ActiveRooms.push(newActiveRoom);

        return newActiveRoom;
    },

    removeActiveRoom: function(activeRoomId){
        let roomIndex = ActiveRooms.findIndex( room => room.id === activeRoomId );

        if(roomIndex >= 0)
        {
            ActiveRooms.splice(roomIndex, 1);

            return true;
        }
        
        return false;
    },

    addUserToActiveRoom: function(activeRoomId, userRoomDto){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        if(activeRoom == undefined)
        {
            return false;
        }

        activeRoom.users.push(userRoomDto);

        return true;
    },

    removeUserFromActiveRoom: function(activeRoomId, userId){
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
                this.removeActiveRoom(activeRoomId);
            }

            return true;
        }
        

        return false;
    },

    switchReadyForUser: function(activeRoomId, userId){
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
    },

    checkIsRoomReady : function(activeRoomId){
        let activeRoom = ActiveRooms.find( room => room.id === activeRoomId );

        // Check if there is enough users
        if(!(activeRoom.users.length == activeRoom.config.usersLimit))
        {
            return false;
        }

        // Check if every user in a room is ready
        let isEveryUserReady = true;
        activeRoom.users.forEach(user => {
            if(!user.ready) isEveryUserReady = false;
        });
        if(!isEveryUserReady)
        {
            return false;
        }

        return true;
    }
}