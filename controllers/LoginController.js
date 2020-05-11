// Model classes
const User = require('../models/entities/User'); // DTO?
const SessionData = require('../models/SessionData');

// Service instances
const UserService = require('../services/UserService');

// Display list of all BookInstances.
exports.index = function(req, res) {
    res.render("../views/login.html", {test: "wartosc"});
};

// 
exports.loginAsync = async function(req, res) {
    var LoginResponse = require('../shared/responses/LoginResponse');

    var login = req.body.login;
    var password = req.body.pass;

    var loggedUser = await UserService.LoginAsync(login, password);

    
    console.log(loggedUser);

    if(loggedUser == null)
    {
        res.sendStatus(401);
    }
    else
    {
        var newSessData = new SessionData();
    
        newSessData.auth	    = true;
        newSessData.userId      = loggedUser.id;
        newSessData.userLogin   = loggedUser.login

        var response = LoginResponse;

        response.status.success = true;
        response.status.auth 	= true;
        response.data           = loggedUser.id;

        req.session.userData = newSessData;

        req.session.save(function(err) {
            res.json(response);
	        res.end();
        });
    }
};
