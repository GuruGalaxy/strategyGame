var express = require('express');
var router = express.Router();

// Require controller modules.
var roomController = require('../controllers/RoomController');
// Require service modules.
var userService = require('../services/UserService');

// Use authentication middleware
router.use(function(req, res, next){
    let isSessionAuthenticated = userService.checkAuth(req.session);

    if(isSessionAuthenticated)
    {
        return next();
    }
    res.status(401);
    res.send();
});

// GET
router.get('/', roomController.index);

// GET
router.get('/rooms', roomController.getRoomsAsync);

module.exports = router;