var express = require('express');
var router = express.Router();

// Require controller modules.
var matchController = require('../controllers/MatchController');
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
router.get('/', matchController.index);

// GET
router.get('/:matchId', matchController.indexParams);

module.exports = router;