const SessionData = require('../models/classes/SessionData');
const UserService = require('../services/UserService');
const MatchService = require('../services/MatchService');

const MoveIntention = require('../shared/socket/move-intention');
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

    MatchService.eventEmitter.addListener("gameEnded", (matchId) => {
        console.log("gameEnded", matchId);
        SocketMatchService.endMatch(matchId, matchesNamespace);
    });

    MatchService.eventEmitter.addListener("gameExecuted", (matchId) => {
        console.log("gameExecuted", matchId);
        SocketMatchService.sendMapToUsers(matchId, matchesNamespace);
    });

    matchesNamespace.on('connection', function(socket){

        // When connected, check if session has a match
        let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        if(sessionData.currentMatchId != null)
        {
            let match = MatchService.getMatchById(sessionData.currentMatchId);
            if(match) SocketMatchService.joinMatch(socket)
            else socket.handshake.session.currentMatchId = null;
        }

        // Route for rejoining a match
        socket.on(EVENTS.MATCHES.REQUESTS.JOIN_MATCH, async function(){

            let result = SocketMatchService.joinMatch(socket);

        });

        // Route for leaving a room
        socket.on(EVENTS.MATCHES.REQUESTS.LEAVE_MATCH, function(){
            
            let result = SocketMatchService.leaveMatch(socket);

        })

        // Route for making a move intention
        socket.on(EVENTS.MATCHES.REQUESTS.MAKE_MOVE, function(incomingMove){
            if(incomingMove)
            {
                let moveIntention = MoveIntention.fromObject(incomingMove);
                let result = SocketMatchService.addMove(socket, moveIntention)
            }
        });

        // Route for switching ready state
        socket.on(EVENTS.MATCHES.REQUESTS.SWITCH_READY, async function(){

        });

        // Disconnection behavior
        socket.on('disconnect', function(){

            let result = SocketMatchService.leaveMatch(socket);
            
        });
    });
};