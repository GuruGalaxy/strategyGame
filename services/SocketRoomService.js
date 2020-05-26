const moment = require('moment');
const RoomService = require('./RoomService');

const SessionData = require('../models/SessionData');
const UserDto = require('../models/UserDto');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

var composeMessageString = function(login, message){
    let now = moment().format('hh:mm:ss LT');
    let messageString = now + " " + login + ": " + message;
    return messageString;
};

module.exports = function(io){
    return {
        joinRoom : function (socket, roomId){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        
            // Check if room exists
            let room = RoomService.GetActiveRoom(roomId);
            if(room == false)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ROOM_NOT_FOUND);
                return false;
            }

            // Cannot join room if already in a room
            if(sessionData.currentRoomId != null)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ALREADY_IN);
                return false;
            }

            // Cannot join room if its full
            if(room.users.length >= room.usersLimit)
            {
                socket.emit(EVENTS.ROOMS.RESPONSES.ERROR, MESSAGES.ROOMS.ERRORS.ROOM_FULL);
                return false;
            }
        
            let userDto = UserDto.fromObject(sessionData);
            console.log("joinRoom",userDto, sessionData); // ---
            RoomService.AddUserToActiveRoom(roomId, userDto);
        
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
            console.log("socket.handshake.session.userData leaveRoom", socket.handshake.session.userData);

            // Check if room exists
            let room = RoomService.GetActiveRoom(sessionData.currentRoomId);
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

            let userDto = UserDto.fromObject(socket.handshake.session.userData);
            RoomService.RemoveUserFromActiveRoom(sessionData.currentRoomId, userDto)

            // Remove roomId from session
            sessionData.currentRoomId = null;
            socket.handshake.session.userData = sessionData;

            socket.leave(room.id);
            socket.to(room.id).emit(EVENTS.ROOMS.RESPONSES.LEFT_ROOM, room);
            socket.emit(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM, MESSAGES.ROOMS.INFOS.CONFIRM);

            return true;
        },

        messageRoom : function(socket, message){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            // Check idf user is in a room
            if(sessionData.currentRoomId == null)
            {
                return false;
            }

            let fullMessage = composeMessageString(sessionData.login, message);
            socket.to(sessionData.currentRoomId).emit(EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM, fullMessage);

            return true;
        }
    }
    
}