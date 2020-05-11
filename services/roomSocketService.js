// NOTE: In reality, this service is going to be more like a controller, with 'endpoint' behavior logic

const RoomService = require('./RoomService');

import UserDto from '../models/UserDto.mjs';

checkAuth = function(session){
    if(session.hasOwnProperty('userData'))
    {
        if(session.userData.hasOwnProperty('auth'))
        {
            if(userData.auth === true)
            {
                return true
            }
        }
    }
    
    return false;
}

module.exports = function(io, sharedsession){
    var roomsNamespace = io.of('/rooms')
    .use(sharedsession)
    .use((socket, next) => {
        console.log("socket.handshake",socket.handshake);
        let isSessionAuthenticated = checkAuth(socket.handshake.session);
        if(isSessionAuthenticated)
        {
            return next();
        }
        return next(new Error('Authentication error'));
    });

    io.emit('Only for authorized');

    roomsNamespace.on('connection', function(socket){
    
        // Check handshake data, add to room
        console.log("socket handshake1", socket.handshake.session.userData);

        checkAuth(socket.handshake.session.userData);

        socket.on('joinRoom', function(roomId){
            let userDto = UserDto.fromObject(socket.handshake.session.userData);

            RoomService.AddUserToActiveRoom(roomId, userDto);
        });

        socket.on('leaveRoom', function(){

        })

        socket.on('messageRoom', function(){

        });

        socket.on('disconnect', function(){
            console.log("OUT");
        });
    });
    
    function applyToRoom(socket){
        let handshake = socket.handshake;
    
        if('roomId' in handshake)
        {
            //RoomService.
        }
        return false;
    }
};