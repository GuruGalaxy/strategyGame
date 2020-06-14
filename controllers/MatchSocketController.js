const SessionData = require('../models/classes/SessionData');
const UserService = require('../services/UserService');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

module.exports = function(io, sharedsession, session){
    const matchesNamespace = io.of('/matches')
    .use(sharedsession)
    .use((socket, next) => {
        let isSessionAuthenticated = UserService.checkAuth(socket.handshake.session);
        if(isSessionAuthenticated)
        {
            return next();
        }
        return next(new Error('Authentication error'));
    });

    const SocketMatchService = require('../services/SocketMatchService')(matchesNamespace);

    io.emit('Only for authorized');

    matchesNamespace.on('connection', function(socket){

        // When connected, check if session has a room
        let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        if(sessionData.currentMatchId != null)
        {
            // SocketRoomService.joinRoom(socket, sessionData.currentRoomId)
        }

        // Route for joining a room
        socket.on(EVENTS.MATCHES.REQUESTS.JOIN_MATCH, async function(roomId){

            //let result = SocketRoomService.joinRoom(socket, roomId);

        });

        // Route for leaving a room
        socket.on(EVENTS.MATCHES.REQUESTS.LEAVE_MATCH, function(){
            
            //let result = SocketRoomService.leaveRoom(socket);

        })

        // Route for messaging a room
        socket.on(EVENTS.MATCHES.REQUESTS.MAKE_MOVE, function(message){
            
            let result = SocketRoomService.messageRoom(socket, message)

        });

        // Route for switching ready state
        socket.on(EVENTS.MATCHES.REQUESTS.SWITCH_READY, async function(){

        });

        // Disconnection behavior
        socket.on('disconnect', function(){

            let result = SocketRoomService.leaveRoom(socket);
            
        });
    });
};