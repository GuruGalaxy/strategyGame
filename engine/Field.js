module.exports = class Field {
    constructor(x, y, type, army = 0, ownerId = null){
        this.x = x;
        this.y = y;
        this.type = type;
        this.army = army;
        this.ownerId = ownerId;
    }
}