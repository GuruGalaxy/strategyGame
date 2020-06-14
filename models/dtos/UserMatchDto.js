module.exports = class UserMatchDto {
	constructor(id, login, connected = false) {
		this.id = id;
        this.login = login;
        this.connected = connected;
	}

	static fromObject(object) {
		let id = null;
        let login = null;
        let connected = false;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		if(object.hasOwnProperty('login'))
		{
			login = object.login;
        }
        
        if(object.hasOwnProperty('connected'))
		{
			connected = object.connected;
		}

		return new this(id, login, connected);
	}
}

//export default UserDto;