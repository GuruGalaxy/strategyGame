module.exports = class UserDto {
	constructor(id, login) {
		this.id = id;
		this.login = login;
	}

	static fromObject(object) {
		let id = null;
		let login = null;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		if(object.hasOwnProperty('login'))
		{
			login = object.login;
		}

		return new this(id, login);
	}
}

//export default UserDto;