module.exports = class UserMatchDto {
	constructor(id, login, color, connected = false, lost = false) {
		this.id = id;
		this.login = login;
		this.color = color;
		this.connected = connected;
		this.lost = lost;
	}

	static fromObject(object) {
		let id = null;
		let login = null;
		let color = null;
		let connected = false;
		let lost = false;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		if(object.hasOwnProperty('login'))
		{
			login = object.login;
		}
		
		if(object.hasOwnProperty('color'))
		{
			color = object.color;
		}
        
        if(object.hasOwnProperty('connected'))
		{
			connected = object.connected;
		}

		if(object.hasOwnProperty('lost'))
		{
			lost = object.lost;
		}

		return new this(id, login, color, connected, lost);
	}
}

//export default UserDto;