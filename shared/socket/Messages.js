(function(exports){

    exports.ROOMS = {
        INFOS : {
            CONFIRM : "Action completed successfully"
        },
        ERRORS : {
            UNAUTHORIZED : "Authorization error",
            ROOM_NOT_FOUND : "Room was not found",
            ROOM_FULL : "Room You are trying to access is full",
            ALREADY_IN : "You are already in a room"
        }
    };

    exports.MATCHES = {
        INFOS : {
            CONFIRM : "Action completed successfully"
        },
        ERRORS : {
            UNAUTHORIZED : "Authorization error",
            MATCH_NOT_FOUND : "Room was not found"
        }
    }

})(typeof exports === 'undefined'? this['MESSAGES']={}: exports);