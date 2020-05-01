console.log("SERWER, POST: /user/login");

var UserModel	= require('../models/User.js')();

//
module.exports = {

    UserLogin: function(login, pass) {

        UserModel.findOne( { where: { login: login, password: pass } }
        ).then(loggedUser => {
    
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
        });
    }
}


