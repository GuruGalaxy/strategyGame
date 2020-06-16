var activeMatches = [];

const Match = require('../models/classes/Match');
const Game = require('../models/classes/Game');

//
module.exports = {
    getMatchById: function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        if(match == undefined)
        {
            return false;
        }

        return match;
    },
    createMatch: function(room) {
        // Create match only if there is no matches of the same roomId
        let existingMatch = activeMatches.find( match => match.roomId === room.id );
        if(existingMatch)
        {
            return false;
        }

        let game = Game.fromObject(room); console.log("room.config", room.users);

        // Create match only if game is created first
        if(!game)
        {
            return false;
        }
console.log("room, game", room, game);// ---
        match = Match.fromObject(room, game);
console.log("service match", match);// ---
        if(!match)
        {
            return false;
        }

        match.game = game;
        activeMatches.push(match);
        return match;
    },
    removeMatch:  function(matchId) {
        let matchIndex = activeMatches.findIndex( match => match.id === matchId );

        if(matchIndex >= 0)
        {
            activeMatches.splice(matchIndex, 1);

            return true;
        }
        
        return false;
    },
    addMoveToMatch: function(matchId, move) {},
    removeMoveFromMatch: function(matchId, userMatchDto) {},
    setUserAsConnected: function(matchId, userId){
        let match = activeMatches.find( match => match.id === matchId );
        if(!match) return false;

        let user = match.users.find( user => user.id === userId );
        if(!user) return false;

        user.connected = true;
    },
    setUserAsDisconnected: function(matchId, userId){
        let match = activeMatches.find( match => match.id === matchId );
        if(!match) return false;

        let user = match.users.find( user => user.id === userId );
        if(!user) return false;

        user.connected = false;
    },
    startMatch: function(matchId) {},
    endMatch: function(matchId) {},
    pauseMatch: function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        // check if match exists
        if(!match){
            return false;
        }

        match.playing = false;
        return true;
    },
    unpauseMatch: function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        // check if match exists
        if(!match){
            return false;
        }

        match.playing = true;
        return true;
    }
}