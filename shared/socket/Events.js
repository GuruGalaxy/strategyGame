(function(exports){

    exports.ROOMS = {
        REQUESTS : {
            JOIN_ROOM : "JOIN_ROOM",
            LEAVE_ROOM : "LEAVE_ROOM",
            MESSAGE_ROOM : "MESSAGE_ROOM"
        },

        RESPONSES : {
            ROOMS : "ROOMS",

            JOINED_ROOM : "JOINED_ROOM",
            LEFT_ROOM : "LEFT_ROOM",
            MESSAGED_ROOM : "MESSAGED_ROOM",

            OK : "OK",
            ERROR : "ERROR"
        }
    }

})(typeof exports === 'undefined'? this['EVENTS']={}: exports);