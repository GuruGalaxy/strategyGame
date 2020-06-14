const moment = require('moment');
const RoomService = require('./RoomService');

const SessionData = require('../models/classes/SessionData');
const UserRoomDto = require('../models/dtos/UserRoomDto');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

var composeMessageString = function(login, message){
    if(message.trim() === "")
    {
        return false;
    }

    let now = moment().format('hh:mm:ss LT');
    let messageString = now + " " + login + ": " + message;
    return messageString;
};

module.exports = function(roomsNamespace){
    return {
        joinRoom : function (socket, roomId){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        
            // Check if room exists
            let room = RoomService.getActiveRoom(roomId);
            if(room == false)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ROOM_NOT_FOUND);
                return false;
            }

            // Cannot join room if already in a room
            if(sessionData.currentRoomId != null)
            {
                if(!sessionData.currentRoomId === roomId)
                {
                    socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ALREADY_IN);
                    return false;
                }
            }

            // Cannot join room if its full
            if(room.users.length >= room.usersLimit)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ROOM_FULL);
                return false;
            }
        
            let userRoomDto = UserRoomDto.fromObject(sessionData);
            RoomService.addUserToActiveRoom(roomId, userRoomDto);
        
            // Add roomId to session
            sessionData.currentRoomId = roomId;
            socket.handshake.session.userData = sessionData;
            socket.handshake.session.save();

            socket.join(roomId);
            socket.to(roomId).emit(EVENTS.ROOMS.RESPONSES.JOINED_ROOM, room);
            socket.emit(EVENTS.ROOMS.REQUESTS.JOIN_ROOM, room);

            return true;
        },

        leaveRoom : function(socket){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            // Check if room exists
            let room = RoomService.getActiveRoom(sessionData.currentRoomId);
            if(room == false)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.NOT_FOUND);
                return false;
            }

            // Check if user is in a room
            if(sessionData.currentRoomId == null)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.NOT_FOUND);
                return false;
            }

            RoomService.removeUserFromActiveRoom(sessionData.currentRoomId, sessionData.id)

            // Remove roomId from session
            sessionData.currentRoomId = null;
            socket.handshake.session.userData = sessionData;

            socket.leave(room.id);
            roomsNamespace.in(room.id).emit(EVENTS.ROOMS.RESPONSES.LEFT_ROOM, room);
            socket.emit(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM, MESSAGES.ROOMS.INFOS.CONFIRM);

            return true;
        },

        messageRoom : function(socket, message){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
            let room = RoomService.getActiveRoom(sessionData.currentRoomId);

            // Check if user is in a room
            if(sessionData.currentRoomId == null)
            {
                return false;
            }

            let fullMessage = composeMessageString(sessionData.login, message);

            // check if message was generated successfully
            if(!fullMessage)
            {
                return false;
            }

            roomsNamespace.in(sessionData.currentRoomId).emit(EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM, fullMessage);

            return true;
        },

        switchReady : function(socket){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            // Check if user is in a room
            if(sessionData.currentRoomId == null)
            {
                return false;
            }

            let success = RoomService.switchReadyForUser(sessionData.currentRoomId, sessionData.id);

            if(!success)
            {
                return false;
            }

            let room = RoomService.getActiveRoom(sessionData.currentRoomId);

            roomsNamespace.in(room.id).emit(EVENTS.ROOMS.RESPONSES.SWITCHED_READY, room);
            socket.emit(EVENTS.ROOMS.REQUESTS.SWITCH_READY, MESSAGES.ROOMS.INFOS.CONFIRM);

            return true;
        },

        startCountdownAsync : async function(socket){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            for(let counter = 5; counter > 0; counter--){
                await new Promise(resolve => setTimeout(resolve, 1000));
                roomsNamespace.in(sessionData.currentRoomId).emit(EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM, "Match will start in " + counter);
            }

            return true;
        },

        startMatch : async function(socket, match){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
            roomsNamespace.in(sessionData.currentRoomId).emit(EVENTS.ROOMS.RESPONSES.MATCH_STARTED, match);
        }
    }
}