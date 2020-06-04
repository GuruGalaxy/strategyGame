module.exports = class UserRoomDto {
	constructor(id, login, ready = false) {
		this.id = id;
        this.login = login;
        this.ready = ready;
	}

	static fromObject(object) {
		let id = null;
        let login = null;
        let ready = false;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		if(object.hasOwnProperty('login'))
		{
			login = object.login;
        }
        
        if(object.hasOwnProperty('ready'))
		{
			ready = object.ready;
		}

		return new this(id, login, ready);
	}
}

//export default UserDto;