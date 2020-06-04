var currentRoomId = null;

const socket = io('/rooms');

var showError = function(msg){
	alert(msg);//---
};

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
	var btnReady = $('#btnReady');
	var btnLeave = $('#btnLeave');

	var chatUserItemTemplate = $.templates("#chatUserItem");

	// --- ELEMENT OPERATIONS
	btnLeave.on("click", leaveRoom);

	btnSendMsg.on("click", sendMsg)

	btnReady.on("click", switchReady);

	function renderRoomList(rooms){
		clearRoomList();

		const renderPromises = [];

		rooms.forEach(room => {
			room.userCount = room.users.length;
			renderPromises.push( renderExtTemplate(roomListElement, room, "roomListItem") );
		});

		Promise.all(renderPromises).then(() => {
			$(".room-list-element").on("click", function(){
				joinRoom(this.id)
			});
		});	
	};

	function clearRoomList(){
		roomListElement.empty();
	};

	function renderChatList(room){
		clearChatList()

		room.users.forEach(user => {
			renderExtTemplate(chatListElement, user, "chatUserItem");
		});
	};

	function clearChatList(){
		chatListElement.empty();
	};

	function renderMessage(message){
		$("#chat-screen-inside-messagelist").prepend("<p class = 'chat-message'>" + message + "</p>");
		
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
		msgBox.val("");

		socket.emit(EVENTS.ROOMS.REQUESTS.MESSAGE_ROOM, message);
	}

	function switchReady(){
		socket.emit(EVENTS.ROOMS.REQUESTS.SWITCH_READY);
	}

	function leaveRoom(){
		if(currentRoomId == null){
			showError("You are not in a room");
			return false;
		}

		socket.emit(EVENTS.ROOMS.REQUESTS.LEAVE_ROOM);
	}

	prepareRoomInterface();

    console.log("Rooms view ready", EVENTS);
	
	// --- WEBSOCKET RESPONSE HANDLERS
	socket.on('connect', function(){

		socket.on(EVENTS.ROOMS.RESPONSES.ERROR, function(error){
			console.log('EVENTS.ROOMS.RESPONSES.ERROR', error);
			showError(error)
		});

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
	
		socket.on(EVENTS.ROOMS.RESPONSES.JOINED_ROOM,	function(room){
			console.log('EVENTS.ROOMS.RESPONSES.JOINED_ROOM');
			renderChatList(room)
		});

		socket.on(EVENTS.ROOMS.RESPONSES.LEFT_ROOM,		function(room){
			console.log('EVENTS.ROOMS.RESPONSES.LEFT_ROOM');
			renderChatList(room)
		});

		socket.on(EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM,	function(message) {
			console.log('EVENTS.ROOMS.RESPONSES.MESSAGED_ROOM');
			renderMessage(message)
		});

		socket.on(EVENTS.ROOMS.RESPONSES.SWITCHED_READY, function(room) {
			console.log('EVENTS.ROOMS.RESPONSES.SWITCHED_READY');
			renderChatList(room)
		});
	});
});