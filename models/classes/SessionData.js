module.exports = class SessionData {
	constructor(id, login, currentRoomId = null, currentMatchId = null, auth = false){
		this.id		= id;
		this.login	= login;
		this.currentRoomId = currentRoomId;
		this.currentMatchId = currentMatchId;
		this.auth = auth;
	}

	// Configuration object
	// constructor({ id, login, currentRoomId, auth}) {
	// 	this.id = id;
	// }

	static fromObject(object) {
		let id = null;
		let login = null;
		let currentRoomId = null;
		let currentMatchId = null;
		let auth = false;

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

		if(object.hasOwnProperty('currentMatchId'))
		{
			currentMatchId = object.currentMatchId;
		}

		if(object.hasOwnProperty('auth'))
		{
			auth = object.auth;
		}

		return new this(id, login, currentRoomId, currentMatchId, auth);
	}
}