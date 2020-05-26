var roomListItemHtml = "";
var chatUserItemHtml = "";
var currentRoomId = null;

const socket = io('/rooms');

var showError = function(msg){
	alert(msg);//---
};

$.ajax({
	url : "/partials/roomListItem.html",
	statusCode: {
		404: function(){ showError("Error during partial loading, code: 404"); },
		500: function(){ showError("Error during partial loading, code: 500"); }
	}
}).done(function(response){
	roomListItemHtml = response;
});

$.ajax({
	url : "/partials/chatUserItem.html",
	statusCode: {
		404: function(){ showError("Error during partial loading, code: 404"); },
		500: function(){ showError("Error during partial loading, code: 500"); }
	}
}).done(function(response){
	chatUserItemHtml = response;
});

$("document").ready(function(){

	// --- ELEMENT DEFINITIONS
	var roomListWrapper = $("#room-list-wrapper");
	var roomListElement = $("#room-list-inside");

	var roomScreenWrapper = $('#room-screen-wrapper');
	var roomScreenElement = $('#room-list-inside');

	var chatListWrapper = $("#chat-list-wrapper");
	var chatListElement = $("#chat-list-inside");

	var chatScreenWrapper = $('#chat-screen-wrapper');
	var chatScreenElement = $('#chat-screen-inside');

	var msgBox = $('#msgBox');
	var btnSendMsg = $('#btnSendMsg');
	var btnLeave = $('#btnLeave');

	// --- ELEMENT OPERATIONS
	btnLeave.on("click", leaveRoom);

	btnSendMsg.on("click", sendMsg)

	function renderRoomList(rooms){
		rooms.forEach(room => {
			let roomId = room.id;
			let name = room.name;
			let userCount = room.users.length;
			let userMax = room.usersLimit;

			let roomHtmlString = roomListItemHtml
			.replace("!ROOMID", roomId)
			.replace("!NAME", name)
			.replace("!NUM1", userCount)
			.replace("!NUM2", userMax);

			console.log("roomHtmlString", roomHtmlString);
			roomListElement.append(roomHtmlString);
		});

		$(".room-list-element").on("click", function(){
			joinRoom(this.id)
		});
	};

	function clearRoomList(){
		roomListElement.empty();
	};

	function renderChatList(room){
		clearChatList()

		room.users.forEach(user => {
			let login = user.login;
			let userId = user.id;

			let userHtmlString = chatUserItemHtml
			.replace("!USERID", userId)
			.replace("!LOGIN", login)

			chatListElement.append(userHtmlString);
		});
	};

	function clearChatList(){
		chatListElement.empty();
	};

	function renderMessage(message){

	}

	// --- INTERFACE OPERATIONS

	function refreshRooms(){
		$.ajax({
			method: "GET",
			url: "/rooms/rooms",
			statusCode: {
				401: function(){ showError("Błędne dane logowania"); },
				500: function(){ showError("Błąd serwera, spróbuj ponownie później"); }
			}
		}).done(function(response){

			console.log("response", response);

			clearRoomList();
			renderRoomList(response);

		});
	};

	// switch view to room list state
	function prepareRoomInterface(){
		chatListWrapper.hide();
		chatScreenWrapper.hide();

		refreshRooms();

		roomListWrapper.show();
		roomScreenWrapper.show();
	};

	// switch view to chat state
	function prepareChatInterface(room){
		console.log("prepareChatInterface", room);

		roomListWrapper.hide();
		roomScreenWrapper.hide();

		renderChatList(room);

		chatListWrapper.show();
		chatScreenWrapper.show();
	};

	function joinRoom(roomId){console.log("join", roomId);
		if(currentRoomId != null){
			showError("You already are in a room with Id: " + roomId);
			return false;
		}

		socket.emit(EVENTS.ROOMS.REQUESTS.JOIN_ROOM, roomId);
	}

	function sendMsg(){
		if(currentRoomId == null){
			showError("You are not in a room");
			return false;
		}

		let message = msgBox.val();
		console.log("message", message);

		socket.emit(EVENTS.ROOMS.REQUESTS.MESSAGE_ROOM, message);
	}

	function leaveRoom(){console.log("leave");
		if(currentRoomId == null){
			showError("You are not in a room");
			return false;
		}

		socket.emit(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM);
	}

	prepareRoomInterface();

    console.log("Rooms view ready", EVENTS);
	
	// --- WEBSOCKET RESPONSE HANDLERS

	socket.on(EVENTS.ROOMS.REQUESTS.JOIN_ROOM, function(room){
		console.log('EVENTS.ROOMS.REQUESTS.JOIN_ROOM', room);

		currentRoomId = room.id;

		prepareChatInterface(room);
	});

	socket.on(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM, function(info){
		console.log('EVENTS.ROOMS.REQUESTS.LEAVE_ROOM', info);
		currentRoomId = null;
		prepareRoomInterface();
	});

	socket.on(EVENTS.ROOMS.RESPONSES.ERROR,			showError(error));
	socket.on(EVENTS.ROOMS.RESPONSES.JOINED_ROOM,	renderChatList(room));
	socket.on(EVENTS.ROOMS.RESPONSES.LEFT_ROOM,		renderChatList(room));
	socket.on(EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM,	renderMessage(message));

    /*const socket = io('/rooms');

	socket.on('connect', () => {
		console.log(socket.id); // 'G5p5...'
	  });

	socket.on(EVENTS.ROOMS.RESPONSES.ROOMS, function(data) {
		console.log("ROOMS EVENT", data);
	});*/

});