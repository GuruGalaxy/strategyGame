// przyjkład
const User = require('../models/User'); // DTO?
const UserService = require('../services/UserService');

// Display list of all BookInstances.
exports.index = function(req, res) {
    res.render("../views/login.html", {test: "wartosc"});
};

// 
exports.login = function(req, res) {

    var login = req.body.login;
    var password = req.body.pass;

    var loggedUser = UserService.UserLogin(login, password);

    
    console.log(loggedUserId);

    if(loggedUserId == null)
    {
        res.sendStatus(401);
    }
    else
    {
        var newSessData = new SessionData();
    
        newSessData.auth	    = true;
        newSessData.userId      = loggedUser.id;
        newSessData.userLogin   = loggedUser.login

        var response = new Response();

        response.status.success = true;
        response.status.auth 	= true;
        response.data           = loggedUser.id;

        res.json(response);
	    res.end();
    }
};
