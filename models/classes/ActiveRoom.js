const { v4: uuidv4 } = require('uuid');

module.exports = class ActiveRoom {
    constructor(name, config){
        this.id = uuidv4();
        this.users = [];

        this.name = name;
        this.config = config;
    }
}

//export default ActiveRoom;

/*module.exports = function(){

    this.id         = false;
    this.name       = "DeafultName";
    this.usersLimit = 4;
    this.users      = [];
}*/