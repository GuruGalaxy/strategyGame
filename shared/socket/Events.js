(function(exports){

    exports.ROOMS = {
        REQUESTS : {
            JOIN_ROOM : "JOIN_ROOM",
            LEAVE_ROOM : "LEAVE_ROOM",
            MESSAGE_ROOM : "MESSAGE_ROOM",
            SWITCH_READY : "SWITCH_READY"
        },

        RESPONSES : {
            ROOMS : "ROOMS",

            JOINED_ROOM : "JOINED_ROOM",
            LEFT_ROOM : "LEFT_ROOM",
            MESSAGED_ROOM : "MESSAGED_ROOM",
            SWITCHED_READY : "SWITCHED_READY",
            MATCH_STARTED : "MATCH_STARTED",

            OK : "OK",
            ERROR : "ERROR"
        }
    };

    exports.MATCHES = {
        REQUESTS : {
            JOIN_MATCH : "JOIN_MATCH",
            LEAVE_MATCH : "LEAVE_MATCH",
            SWITCH_READY : "SWITCH_READY",
            MAKE_MOVE : "MAKE_MOVE"
        },

        RESPONSES : {
            JOINED_MATCH : "JOINED_MATCH",
            LEFT_MATCH : "LEFT_MATCH",
            SWITCHED_READY : "SWITCHED_READY",
            EXECUTED_TURN : "EXECUTED_TURN",
            MATCH_ENDED : "MATCH_ENDED"
        }
    }

})(typeof exports === 'undefined'? this['EVENTS']={}: exports);