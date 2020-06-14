// Model classes
const User = require('../models/classes/ActiveRoom'); // DTO?
const SessionData = require('../models/classes/SessionData');

const CreateRoomRequest = require('../shared/http/requests/create-room-request');
const MatchConfig = require('../models/classes/MatchConfig');

// Service instances
const RoomService = require('../services/RoomService');

// Display list of all rooms
exports.index = async function(req, res) {
    console.log("req.session", req.session);

    let rooms = await RoomService.getActiveRooms();

    res.render("../views/rooms.html", rooms);
};

// Display create room page
exports.renderCreateTemplate = async function(req, res) {
    console.log("req.session", req.session);

    res.render("../views/create-room.html");
};

// 
exports.getRoomsAsync = async function(req, res) {

    var rooms = await RoomService.getActiveRooms();

    res.json(rooms);
    res.end();
};

exports.getRoomByIdAsync = async function(req, res) {

};

exports.addRoomAsync = async function(req, res) {
    let addRoomRequest = CreateRoomRequest.fromObject(req.body);

    if(!addRoomRequest){
        res.sendStatus(400);
        res.end();
        return false;
    }

    let config = MatchConfig.fromObject(addRoomRequest);

    if(!config){
        res.sendStatus(400);
        res.end();
        return false;
    }

    let result = RoomService.addActiveRoom(addRoomRequest.name, config);

    if(result){
        res.json(result);
        res.end();
    }
};