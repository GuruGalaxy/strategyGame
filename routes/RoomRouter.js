var express = require('express');
var router = express.Router();

// Require controller modules.
var roomController = require('../controllers/RoomController');

// GET
router.get('/', roomController.index);

// POST
router.post('/rooms', roomController.getRoomsAsync);

module.exports = router;