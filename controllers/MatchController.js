// Model classes

// Service instances
const MatchService = require('../services/MatchService');

// Display list of all rooms
exports.index = async function(req, res) {
    console.log("req.session", req.session);

    // let match = await MatchService.getMatch(req.params.matchId);

    res.render("../views/match.html");
};

// 
exports.getRoomsAsync = async function(req, res) {

    var rooms = await MatchService.getActiveRooms();

    res.json(rooms);
    res.end();
};

exports.getRoomByIdAsync = async function(req, res) {

};

exports.addRoomAsync = async function(req, res) {
    
};