(function(exports){

    exports.fromObject = function({
        fieldFrom = null,
        fieldTo = null,
        armyPercentage = null,
    }){
        if(fieldFrom && fieldTo && armyPercentage)
        {
            if(armyPercentage > 100) armyPercentage = 100;
            if(armyPercentage < 0) armyPercentage = 0;
            
            return {
                fieldFrom : fieldFrom,
                fieldTo : fieldTo,
                armyPercentage : armyPercentage
            }
        }
        else
        {
            return null;
        }
        
    }

})(typeof exports === 'undefined'? this['MoveIntention']={}: exports);