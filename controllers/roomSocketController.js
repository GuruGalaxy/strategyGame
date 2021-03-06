const SessionData = require('../models/classes/SessionData');

const UserService = require('../services/UserService');
const RoomService = require('../services/RoomService');
const MatchService = require('../services/MatchService');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

module.exports = function(io, sharedsession){
    const roomsNamespace = io.of('/rooms')
    .use(sharedsession)
    .use((socket, next) => {
        let isSessionAuthenticated = UserService.checkAuth(socket.handshake.session);
        if(isSessionAuthenticated)
        {
            return next();
        }
        return next(new Error('Authentication error'));
    });

    const SocketRoomService = require('../services/SocketRoomService')(roomsNamespace);

    io.emit('Only for authorized');

    roomsNamespace.on('connection', function(socket){

        // When connected, check if session has a room
        let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        if(sessionData.currentRoomId != null)
        {
            let room = RoomService.getActiveRoom(sessionData.currentRoomId);
            if(room) SocketRoomService.joinRoom(socket, sessionData.currentRoomId);
            else {
                sessionData.currentRoomId = null;
                socket.handshake.session.userData = sessionData;
            }
        }

        // Check if session has a match that ended
        if(sessionData.currentMatchId != null)
        {
            let match = MatchService.getMatchById(sessionData.currentMatchId);
            if(!match) sessionData.currentMatchId = null;
            socket.handshake.session.userData = sessionData;
        }

        // Route for joining a room
        socket.on(EVENTS.ROOMS.REQUESTS.JOIN_ROOM, async function(roomId){

            let result = SocketRoomService.joinRoom(socket, roomId);

        });

        // Route for leaving a room
        socket.on(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM, function(){
            
            let result = SocketRoomService.leaveRoom(socket);

        })

        // Route for messaging a room
        socket.on(EVENTS.ROOMS.REQUESTS.MESSAGE_ROOM, function(message){
            
            let result = SocketRoomService.messageRoom(socket, message)

        });

        // Route for switching ready state
        socket.on(EVENTS.ROOMS.REQUESTS.SWITCH_READY, async function(){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            let room = RoomService.getActiveRoom(sessionData.currentRoomId);
            let result = SocketRoomService.switchReady(socket)
            
            if(result === true && RoomService.checkIsRoomReady(room.id))
            {
                await SocketRoomService.startCountdownAsync(socket);
                let match = null;

                if(RoomService.checkIsRoomReady(room.id))
                {
                    match = MatchService.createMatch(room);
                }

                if(match)
                {
                    SocketRoomService.startMatch(socket, match);
                    RoomService.removeActiveRoom(room.id);
                }
            }

        });

        // Disconnection behavior
        socket.on('disconnect', function(){

            let result = SocketRoomService.leaveRoom(socket);
            
        });
    });
    
    function applyToRoom(socket){
        let handshake = socket.handshake;
    
        if('roomId' in handshake)
        {
            //RoomService.
        }
        return false;
    }
};