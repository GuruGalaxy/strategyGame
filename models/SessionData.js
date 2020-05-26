module.exports = class SessionData {
	constructor(id, login, currentRoomId = null){
		this.id		= id;
		this.login	= login;
		this.currentRoomId = currentRoomId;
		this.auth = false;
	}

	static fromObject(object) {
		let id = null;
		let login = null;
		let currentRoomId = null;

		if(object.hasOwnProperty('id'))
		{
			id = object.id;
		}

		if(object.hasOwnProperty('login'))
		{
			login = object.login;
		}

		if(object.hasOwnProperty('currentRoomId'))
		{
			currentRoomId = object.currentRoomId;
		}

		return new this(id, login, currentRoomId);
	}
}