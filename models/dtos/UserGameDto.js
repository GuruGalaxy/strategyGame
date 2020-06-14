module.exports = class UserGameDto {
	constructor(id) {
		this.id = id;
	}

	static fromObject(object) {
		let id = null;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		return new this(id);
	}
}

//export default UserDto;