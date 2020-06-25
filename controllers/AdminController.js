// Model classes
const User = require('../models/entities/User'); // DTO?
const SessionData = require('../models/classes/SessionData');

// Service instances
const AdminService = require('../services/AdminService');
const UserService = require('../services/UserService');

// Display admin login view
exports.login = function(req, res) {
    res.render("../views/login-admin.html");
};

// Display list of all users
exports.index = async function(req, res) {
    let users = await UserService.getAllUsersAsync();

    res.render("../views/admin.html", {users: users});
};

// 
exports.loginAsync = async function(req, res) {
    var LoginResponse = require('../shared/http/responses/LoginResponse');

    var login = req.body.login;
    var password = req.body.pass;

    var loggedAdmin = await AdminService.LoginAsync(login, password);

    if(loggedAdmin == null)
    {
        res.sendStatus(401);
    }
    else
    {
        var newSessData = SessionData.fromObject(loggedAdmin);

        var response = LoginResponse;

        response.status.success = true;
        response.status.auth 	= true;
        response.data           = loggedAdmin.id;

        req.session.adminData = newSessData;

        req.session.save(function(err) {
            res.json(response);
	        res.end();
        });
    }
};
