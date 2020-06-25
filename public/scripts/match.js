var userId = null;
var currentMatch = null;
var activeField = null;
var targetField = null;
var armyPercentage = 100;
sessionStorage.removeItem('roomId');

const socket = io('/matches');

var showError = function(msg){
	alert(msg);//---
};

$("document").ready(function(){

    // --- INIT CHECKS
    socket.emit(EVENTS.MATCHES.REQUESTS.JOIN_MATCH);

	// --- ELEMENT DEFINITIONS
	var userListWrapper = $("#user-list-wrapper");
	var userListElement = $("#user-list-inside-userlist");

	var matchScreenWrapper = $('#match-screen-wrapper');
    var matchScreenElement = $('#match-screen-inside');
    
    var canvas = document.querySelector('#game-screen-canvas');
	var ctx = canvas.getContext('2d');
	
	var endGameWindow = $("#endgame-window");

	var btnReady = $('#btnReady');
	var btnLeave = $('#btnLeave');
	var btnZoomIn = $('#btnZoomIn');
	var btnZoomOut = $('#btnZoomOut');
	var btnBack = $('#back-btn');

	// --- ELEMENT OPERATIONS
	canvas.addEventListener('click', function(evt) {
		let rect = canvas.getBoundingClientRect();
		let x = evt.clientX - rect.left;
		let y = evt.clientY - rect.top;

		if(currentMatch.map.fields[Math.ceil(x / fieldSize)][Math.ceil(y / fieldSize)].ownerId == userId)
		{
			setActiveField(currentMatch.map.fields[Math.ceil(x / fieldSize)][Math.ceil(y / fieldSize)]);
		}
	}, false);
	
	$(document).keydown(function(e) {
		if(!activeField) return false;

		switch(e.which){
			case 38 : {
				if(activeField.y > 1)
				{console.log("up");
					setTargetField(currentMatch.map.fields[activeField.x][activeField.y - 1]);
				}
				break;
			}
			case 40 : {
				if(activeField.y < currentMatch.config.mapSize)
				{console.log("down");
					setTargetField(currentMatch.map.fields[activeField.x][activeField.y + 1]);
				}
				break;
			}
			case 37 : {
				if(activeField.x > 1)
				{console.log("left");
					setTargetField(currentMatch.map.fields[activeField.x - 1][activeField.y]);
				}
				break;
			}
			case 39 : {
				if(activeField.x < currentMatch.config.mapSize)
				{console.log("right");
					setTargetField(currentMatch.map.fields[activeField.x + 1][activeField.y]);
				}
				break;
			}
		}
	});

	btnLeave.on("click", leaveMatch);
	btnReady.on("click", switchReady);
	btnZoomIn.on("click", enlargeCanvas);
	btnZoomOut.on("click", shrinkCanvas);
	btnBack.on("click", goToRooms);

	// --- FUNCTIONS
	function renderUserList(users){
		clearUserList();console.log("users",users);

		const renderPromises = [];

		users.forEach(user => {
			renderPromises.push( renderExtTemplate(userListElement, user, "matchUserListItem") );
		});
	};

	function clearUserList(){
		userListElement.empty();
	};

	// --- INTERFACE OPERATIONS

	function switchReady(){
		socket.emit(EVENTS.MATCHES.REQUESTS.SWITCH_READY);
	}

	function leaveMatch(){
		socket.emit(EVENTS.MATCHES.REQUESTS.LEAVE_MATCH);
	}

	function enlargeCanvas(){
		canvasSize += 25;

		if(currentMatch)
		{
			prepareCanvas(canvas, currentMatch.config);
			renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
			prepareMap(ctx, currentMatch.config);
		}
		
	}

	function shrinkCanvas(){
		canvasSize -= 25;

		if(currentMatch)
		{
			prepareCanvas(canvas, currentMatch.config);
			renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
			prepareMap(ctx, currentMatch.config);
		}
	}

	function goToRooms(){console.log("goToRooms");
		window.location.assign('/rooms');
	}

	function setActiveField(field){
		// must be own field
		if(!field.ownerId == userId) return false;

		activeField = field;

		prepareCanvas(canvas, currentMatch.config);
		renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
		prepareMap(ctx, currentMatch.config);

		drawActiveField(ctx, field);
	}

	function setTargetField(field){
		// cannot be mountain
		if(field.type == tileTypes.TYPES.MOUNTAIN) return false;

		targetField = field;

		prepareCanvas(canvas, currentMatch.config);
		renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
		prepareMap(ctx, currentMatch.config);

		drawActiveField(ctx, activeField);
		drawTargetField(ctx, targetField);

		sendMoveIntention();
	}

	function clearActiveField(){
		activeField = null;
	}

	function clearTargetField(){
		targetField = null;
	}

	function sendMoveIntention(){
		console.log("sendMoveIntention", activeField, targetField, armyPercentage);
		let moveIntention = MoveIntention.fromObject({
			fieldFrom : activeField,
			fieldTo : targetField,
			armyPercentage : armyPercentage
		});

		console.log("sendMoveIntention", moveIntention);

		console.log("moveIntention", moveIntention);

		if(moveIntention) socket.emit(EVENTS.MATCHES.REQUESTS.MAKE_MOVE, moveIntention);
	}

    console.log("Match view ready", EVENTS);
	
	// --- WEBSOCKET RESPONSE HANDLERS
	socket.on('connect', function(match){


		socket.on(EVENTS.MATCHES.RESPONSES.ERROR, function(error){
			console.log('EVENTS.MATCHES.RESPONSES.ERROR', error);
			showError(error)
		});

		socket.on(EVENTS.MATCHES.REQUESTS.JOIN_MATCH, function(data){
			console.log('EVENTS.MATCHES.REQUESTS.JOIN_MATCH', data);
			userId = data.userId;
			currentMatch = data.matchDto;
			
			renderUserList(currentMatch.users)
            prepareCanvas(canvas, currentMatch.config);
            renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
            prepareMap(ctx, currentMatch.config);
            
		});
	
		socket.on(EVENTS.MATCHES.REQUESTS.LEAVE_MATCH, function(info){
			console.log('EVENTS.MATCHES.REQUESTS.LEAVE_MATCH', info);
		});
	
		socket.on(EVENTS.MATCHES.RESPONSES.JOINED_MATCH, function(matchDto){
			console.log('EVENTS.MATCHES.RESPONSES.JOINED_MATCH', matchDto);
			currentMatch = matchDto;
			renderUserList(matchDto.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.LEFT_MATCH, function(matchDto){
			console.log('EVENTS.MATCHES.RESPONSES.LEFT_MATCH', matchDto);
			currentMatch = matchDto;
			renderUserList(matchDto.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.SWITCHED_READY, function(matchDto) {
			console.log('EVENTS.MATCHES.RESPONSES.SWITCHED_READY', matchDto);
			currentMatch = matchDto;
			renderUserList(matchDto.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.MATCH_STARTED, function(matchDto){
			console.log("EVENTS.MATCHES.RESPONSES.MATCH_STARTED", matchDto);
			currentMatch = matchDto;
		});

		socket.on(EVENTS.MATCHES.RESPONSES.EXECUTED_TURN, function(data){
			console.log("EVENTS.MATCHES.RESPONSES.EXECUTED_TURN", data);
			currentMatch.map = data.map;

			if(targetField)
			{
				if(currentMatch.map.fields[targetField.x][targetField.y].ownerId == userId)
				{
					setActiveField(currentMatch.map.fields[targetField.x][targetField.y]);
				}
			}

			prepareCanvas(canvas, currentMatch.config);
			renderFields(ctx, currentMatch.config, currentMatch.users, currentMatch.map);
			renderUserList(data.users);
			prepareMap(ctx, currentMatch.config);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.MATCH_ENDED, function(data){
			console.log("EVENTS.MATCHES.RESPONSES.MATCH_ENDED", data);
			prepareCanvas(canvas, data.config);
			renderFields(ctx, data.config, data.game.users, data.game.map);
			renderUserList(data.users);
			prepareMap(ctx, data.config);

			let winner = data.users.find(user => user.lost == false);

			endGameWindow.find("#endgame-window-login").text(winner.login);
			endGameWindow.show();
		});
	});
});

// $(document).keypress(function(e) {
// 	if(e.which == 13) {
// 		login();
// 	}
// });