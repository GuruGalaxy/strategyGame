class UserDto {
	constructor(userLogin) {
		this.userLogin = userLogin;
	}

	static fromObject(object) {
		let userLogin = null;

		if(object.hasOwnProperty('userLogin'))
		{
			userLogin = object.userLogin;
		}

		return new this(userLogin);
	}
}

export default UserDto;