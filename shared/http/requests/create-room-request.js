(function(exports){

    exports.fromObject = function({
        name = null,
        usersLimit = null,
        seed = null,
        mapSize = null,
        mapCoverPercentage = null
    }){
        if(name && usersLimit && seed && mapSize && mapCoverPercentage)
        {
            return {
                name : name,
                usersLimit : parseInt(usersLimit, 10),
                seed : seed,
                mapSize : parseInt(mapSize, 10),
                mapCoverPercentage : parseInt(mapCoverPercentage, 10)
            }
        }
        else
        {
            return null;
        }
        
    }

})(typeof exports === 'undefined'? this['CreateRoomRequest']={}: exports);