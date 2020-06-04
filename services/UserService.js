console.log("SERWER, POST: /user/login");

var UserModel	= require('../models/entities/User.js')();

//
module.exports = {

    LoginAsync: async function(login, pass) {
        var loggedUser = await UserModel.findOne( { where: { login: login, password: pass } } );
           
        if(loggedUser)
        {
            return {
                id: loggedUser.id, 
                login: loggedUser.login,
                auth: true
            }; 
        }
        else
        {
            return null;
        }
    },

    checkAuth : function(session){
        console.log('session', session);
        if(session.hasOwnProperty('userData'))
        {
            if(session.userData.hasOwnProperty('auth'))
            {
                if(session.userData.auth === true)
                {
                    return true
                }
            }
        }
        
        return false;
    }
}