const { v4: uuidv4 } = require('uuid');

class ActiveRoom {
    constructor(name, usersLimit){
        this.id = uuidv4();
        this.users = [];

        this.name = name;
        this.usersLimit = usersLimit;
    }
}

export default ActiveRoom;

/*module.exports = function(){

    this.id         = false;
    this.name       = "DeafultName";
    this.usersLimit = 4;
    this.users      = [];
}*/