console.log("SERWER, POST: /user/login");

var UserModel	= require('../models/User.js')();

//
module.exports = {

    LoginAsync: async function(login, pass) {

        console.log("login: " + login + ", pass: " + pass);
        var loggedUser = await UserModel.findOne( { where: { login: login, password: pass } }
        )//.then(loggedUser => {
           
        console.log("loggedUser: " + loggedUser);
            if(loggedUser)
            {
                return {
                    id: loggedUser.id, 
                    login: loggedUser.login
                }; 
            }
            else
            {
                return null;
            }
        //});
    }
}