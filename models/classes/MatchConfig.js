module.exports = class MatchConfig {
    constructor({
        usersLimit = null,
        mapSize = null,
        seed = null,
        mapCoverPercentage = null
    }){
        this.usersLimit = usersLimit;
        this.mapSize = mapSize;
        this.seed = seed;
        this.mapCoverPercentage = mapCoverPercentage;
    }

    static fromObject({
        usersLimit = null,
        mapSize = null,
        seed = null,
        mapCoverPercentage = null
    }){
        if(usersLimit && mapSize && seed && mapCoverPercentage)
        {
            let newMatchConfig = {
                usersLimit : usersLimit,
                mapSize : mapSize,
                seed : seed,
                mapCoverPercentage : mapCoverPercentage
            };
    
            return new this(newMatchConfig);
        }
        return false;
	}
}