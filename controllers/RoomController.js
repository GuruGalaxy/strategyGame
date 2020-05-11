// Model classes
const User = require('../models/ActiveRoom'); // DTO?
const SessionData = require('../models/SessionData');

// Service instances
const RoomService = require('../services/RoomService');

// Display list of all rooms
exports.index = function(req, res) {
    console.log("req.session", req.session);

    let rooms = await RoomService.getRoomsAsync();

    res.render("../views/rooms.html", rooms);
};

// 
exports.getRoomsAsync = async function(req, res) {
    var LoginResponse = require('../shared/responses/LoginResponse');

    var sess = req.session.userData;

    var rooms = await RoomService.getRoomsAsync();

    /*var results = [];

    // transform Room into frontend data
    rooms.forEach(room => {
        results.push({
            id: room.id,
            name: room.name,
            userCount: room.users.length
        });
    });*/

    res.json(rooms);
    res.end();
};

exports.getRoomByIdAsync(req, res) {

};

exports.addRoomAsync(req, res) {
    
};
