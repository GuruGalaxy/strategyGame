const SessionData = require('../models/classes/SessionData');

const UserService = require('../services/UserService');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

module.exports = function(io, sharedsession, session){
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
            SocketRoomService.joinRoom(socket, sessionData.currentRoomId)
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
        socket.on(EVENTS.ROOMS.REQUESTS.SWITCH_READY, function(){
            
            let result = SocketRoomService.switchReady(socket)

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