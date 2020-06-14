var activeMatches = [];

const Match = require('../models/classes/Match');
const Game = require('../models/classes/Game');

//
module.exports = {
    GetMatchByIdAsync: async function(matchId) {
        let match = activeMatches.find( match => match.id === matchId );

        if(match == undefined)
        {
            return false;
        }

        return match;
    },
    CreateMatchAsync: async function(room) {
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
    RemoveMatchAsync: async function(matchId) {
        let matchIndex = activeMatches.findIndex( match => match.id === matchId );

        if(matchIndex >= 0)
        {
            activeMatches.splice(matchIndex, 1);

            return true;
        }
        
        return false;
    },
    AddMoveToMatchAsync: async function(matchId, move) {},
    RemoveMoveFromMatchAsync: async function(matchId, userMatchDto) {},
    StartMatchAsync: async function(matchId) {},
    EndMatchAsync: async function(matchId) {},
    PauseMatchAsync: async function(matchId) {},
    UnpauseMatchAsync: async function(matchId) {}
}