module.exports = class Move {
    constructor({fieldFrom = null, fieldTo = null, userId = null, army = null}){
        this.fieldFrom = fieldFrom;
        this.fieldTo = fieldTo;
        this.userId = userId;
        this.army = army;
    }

    static fromObject({
        fieldFrom = null,
        fieldTo = null,
        userId = null,
        army = null
    }){
        if(fieldFrom && fieldTo && userId && army != null)
        {
            let newMove = {
                fieldFrom : fieldFrom,
                fieldTo : fieldTo,
                userId : userId,
                army : army
            };
    
            return new this(newMove);
        }
        return false;
	}
}