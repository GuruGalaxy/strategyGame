var express = require('express');
var router = express.Router();

// Require controller modules.
var adminController = require('../controllers/AdminController');

// Use authentication middleware
router.use(function(req, res, next){
    let isSessionAuthenticated = userService.checkAuth(req.session);

    if(isSessionAuthenticated)
    {
        return next();
    }
    // GET admin home page.
    router.get('/', adminController.login);
});

// GET admin home page.
router.get('/', adminController.index);

// POST request for logging in.
router.post('/', adminController.loginAsync);

// POST request for creating user.
router.post('/', adminController.createUserAsync);

// POST request for deleting user.
router.delete('/', adminController.deleteUserAsync);

module.exports = router;