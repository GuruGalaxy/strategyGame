var express = require('express');
var router = express.Router();

// Require controller modules.
var loginController = require('../controllers/LoginController');

// GET catalog home page.
router.get('/', loginController.index);

// POST request for creating Book.
router.post('/', loginController.loginAsync);

module.exports = router;