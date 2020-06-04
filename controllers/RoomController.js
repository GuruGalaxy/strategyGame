// Model classes
const User = require('../models/classes/ActiveRoom'); // DTO?
const SessionData = require('../models/classes/SessionData');

// Service instances
const RoomService = require('../services/RoomService');

// Display list of all rooms
exports.index = async function(req, res) {
    console.log("req.session", req.session);

    let rooms = await RoomService.GetActiveRooms();

    res.render("../views/rooms.html", rooms);
};

// 
exports.getRoomsAsync = async function(req, res) {

    var rooms = await RoomService.GetActiveRooms();

    res.json(rooms);
    res.end();
};

exports.getRoomByIdAsync = async function(req, res) {

};

exports.addRoomAsync = async function(req, res) {
    
};