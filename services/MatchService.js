var activeMatches = [];

const events = require('events');

const Match = require('../models/classes/Match');
const Game = require('../models/classes/Game');

//
module.exports = {
    eventEmitter: new events.EventEmitter(),

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

        match = Match.fromObject(room, game, this.eventEmitter);

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
        console.log("match", match);
        if(!match) return false;

        let user = match.users.find( user => user.id === userId );
        console.log("user", user);
        if(!user) return false;

        user.connected = false;
        console.log("match.users", match.users);
    },
    startMatch: function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        // check if match exists
        if(!match)
        {
            return false;
        }

        // dont start a match if its already started
        if(match.playing)
        {
            return false;
        }

        match.gameLoop = setInterval(() => { match.executeTurn(); console.log("INTERVAL 1500"); }, 1000);
        match.playing = true;

        return true;
    },
    endMatch: function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        // check if match exists
        if(!match)
        {
            return false;
        }

        if(match.gameLoop) clearInterval(match.gameLoop);

        this.removeMatch(match.id);

        return true;
    },
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