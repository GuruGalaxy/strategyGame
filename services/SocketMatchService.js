const moment = require('moment');
const MatchService = require('./MatchService');

const SessionData = require('../models/classes/SessionData');
const UserGameDto = require('../models/dtos/UserGameDto');

const MESSAGES = require('../shared/socket/Messages');
const EVENTS = require('../shared/socket/Events');

module.exports = function(matchesNamespace){
    return {
        joinMatch : function (socket){
            console.log("joinMatch");// ---
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        
            // Check if socket has matchId
            if(!sessionData.currentMatchId)
            {
                socket.emit(EVENTS.MATCHES.RESPONSES.ERROR, MESSAGES.MATCHES.ERRORS.MATCH_NOT_FOUND);
                console.log("!sessionData.currentMatchId", !sessionData.currentMatchId); // ---
                return false;
            }

            // Check if match exists
            let match = MatchService.getMatchById(sessionData.currentMatchId);
            if(!match)
            {
                socket.emit(EVENTS.MATCHES.RESPONSES.ERROR, MESSAGES.MATCHES.ERRORS.MATCH_NOT_FOUND);
                console.log("!match", !match); // ---
                return false;
            }

            // Can only join a match if user is on match's users list
            if(!match.users.some((user) => { return user.id == sessionData.id; }))
            {
                console.log("match.users.some((user) => { return user.id == sessionData.id; })", match.users.some((user) => { return user.id == sessionData.id; }));// ---
                socket.emit(EVENTS.MATCHES.RESPONSES.ERROR, MESSAGES.MATCHES.ERRORS.MATCH_NOT_FOUND);
                return false;
            }
        
            MatchService.setUserAsConnected(sessionData.currentMatchId, sessionData.id);

            socket.join(sessionData.currentMatchId);
            socket.to(sessionData.currentMatchId).emit(EVENTS.MATCHES.RESPONSES.JOINED_MATCH, match);
            socket.emit(EVENTS.MATCHES.REQUESTS.JOIN_MATCH, match);

            return true;
        },
        
        leaveMatch : function(socket){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);
        
            // Check if socket has matchId
            if(!sessionData.currentMatchId)
            {
                return false;
            }

            // Check if match exists
            let match = MatchService.getMatchById(sessionData.currentMatchId);
            if(!match)
            {
                return false;
            }

            // Can only leave a match if user is on match's users list
            if(match.users.some((user) => { return user.id == sessionData.id; }))
            {
                return false;
            }

            MatchService.setUserAsDisconnected(sessionData.currentMatchId, sessionData.id);
        },

        switchReady : function(socket){
            let sessionData = SessionData.fromObject(socket.handshake.session.userData);

            // Check if user is in a match
            if(sessionData.currentMatchId == null)
            {
                return false;
            }

            // Can only change a match if user is on match's users list
            if(match.users.some((user) => { return user.id == sessionData.id; }))
            {
                return false;
            }

            let success = MatchService.switchReadyForUser(sessionData.currentMatchId, sessionData.id);

            if(!success)
            {
                return false;
            }

            let match = MatchService.getMatchById(sessionData.currentMatchId);

            matchesNamespace.in(match.id).emit(EVENTS.MATCHES.RESPONSES.SWITCHED_READY, match);
            socket.emit(EVENTS.MATCHES.REQUESTS.SWITCH_READY, MESSAGES.MATCHES.INFOS.CONFIRM);

            return true;
        },
    }
}