var AdminModel	= require('../models/entities/Admin.js')();

//
module.exports = {

    LoginAsync: async function(login, pass) {
        var loggedAdmin = await AdminModel.findOne( { where: { login: login, password: pass } } );
           
        if(loggedAdmin)
        {
            return {
                id: loggedAdmin.id, 
                login: loggedAdmin.login,
                auth: true
            }; 
        }
        else
        {
            return null;
        }
    },

    checkAuth : function(session){
        if(session.hasOwnProperty('adminData'))
        {
            if(session.adminData.hasOwnProperty('auth'))
            {
                if(session.adminData.auth === true)
                {
                    return true
                }
            }
        }
        
        return false;
    }
}