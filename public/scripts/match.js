var currentMatch = null;
var activeField = null;
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
	var userListElement = $("#user-list-inside-roomlist");

	var matchScreenWrapper = $('#match-screen-wrapper');
    var matchScreenElement = $('#match-screen-inside');
    
    var canvas = document.querySelector('#game-screen-canvas');
    var ctx = canvas.getContext('2d');

	var btnReady = $('#btnReady');
	var btnLeave = $('#btnLeave');
	var btnZoomIn = $('#btnZoomIn');
	var btnZoomOut = $('#btnZoomOut');

	// --- ELEMENT OPERATIONS
	canvas.addEventListener('click', function(evt) {
		let rect = canvas.getBoundingClientRect();
		let x = evt.clientX - rect.left;
		let y = evt.clientY - rect.top;
		

		console.log("x" + Math.ceil(x / fieldSize) + ", y" + Math.ceil(y / fieldSize));
		console.log(currentMatch.game.map.fields[Math.ceil(x / fieldSize)][Math.ceil(y / fieldSize)]);

		// if(currentMatch.game.map.fields[Math.ceil(x / fieldSize)][Math.ceil(y / fieldSize)].ownerId == 1) // TODO : owner recognition (who am i ?)
		// {
			setActiveField(currentMatch.game.map.fields[Math.ceil(x / fieldSize)][Math.ceil(y / fieldSize)]);
		// }
	}, false);
	
	$(document).keypress(function(e) {
		if(!activeField) return false;

		switch(e.which){
			case 38 : {
				break;
			}
			case 40 : {
				break;
			}
			case 37 : {
				break;
			}
			case 39 : {
				break;
			}
		}
	});

	btnLeave.on("click", leaveMatch);
	btnReady.on("click", switchReady);
	btnZoomIn.on("click", enlargeCanvas);
	btnZoomOut.on("click", shrinkCanvas);

	// --- FUNCTIONS
	function renderUserList(users){
		clearUserList();console.log("users",);

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
			prepareCanvas(canvas, ctx, currentMatch.config);
			renderFields(ctx, currentMatch.config, currentMatch.game);
			prepareMap(ctx, currentMatch.config);
		}
		
	}

	function shrinkCanvas(){
		canvasSize -= 25;

		if(currentMatch)
		{
			prepareCanvas(canvas, ctx, currentMatch.config);
			renderFields(ctx, currentMatch.config, currentMatch.game);
			prepareMap(ctx, currentMatch.config);
		}
	}

	function setActiveField(field){
		// must be own field
		//if(!field.ownerId == 1) return false;// TODO : owner recognition (who am i ?)

		activeField = field;

		prepareCanvas(canvas, ctx, currentMatch.config);
		renderFields(ctx, currentMatch.config, currentMatch.game);
		prepareMap(ctx, currentMatch.config);

		drawActiveField(ctx, field);
	}

	function setTargetField(field){
		// cannot be mountain
		if(field.type == tileTypes.TYPES.MOUNTAIN) return false;

		targetField = field;

		prepareCanvas(canvas, ctx, currentMatch.config);
		renderFields(ctx, currentMatch.config, currentMatch.game);
		prepareMap(ctx, currentMatch.config);

		drawActiveField(ctx, activeField);
		drawTargetField(ctx, field);
	}

	function clearActiveField(){

	}

	function clearTargetField(){

	}

    console.log("Match view ready", EVENTS);
	
	// --- WEBSOCKET RESPONSE HANDLERS
	socket.on('connect', function(match){


		socket.on(EVENTS.MATCHES.RESPONSES.ERROR, function(error){
			console.log('EVENTS.MATCHES.RESPONSES.ERROR', error);
			showError(error)
		});

		socket.on(EVENTS.MATCHES.REQUESTS.JOIN_MATCH, function(match){
			console.log('EVENTS.MATCHES.REQUESTS.JOIN_MATCH', match);
			currentMatch = match;
			
			renderUserList(match.users)
            prepareCanvas(canvas, ctx, match.config);
            renderFields(ctx, match.config, match.game);
            prepareMap(ctx, match.config);
            
		});
	
		socket.on(EVENTS.MATCHES.REQUESTS.LEAVE_MATCH, function(info){
			console.log('EVENTS.MATCHES.REQUESTS.LEAVE_MATCH', info);
		});
	
		socket.on(EVENTS.MATCHES.RESPONSES.JOINED_MATCH, function(match){
			console.log('EVENTS.MATCHES.RESPONSES.JOINED_MATCH', match);
			currentMatch = match;
			renderUserList(match.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.LEFT_MATCH, function(match){
			console.log('EVENTS.MATCHES.RESPONSES.LEFT_MATCH', match);
			currentMatch = match;
			renderUserList(match.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.SWITCHED_READY, function(match) {
			console.log('EVENTS.MATCHES.RESPONSES.SWITCHED_READY', match);
			currentMatch = match;
			renderUserList(match.users);
		});

		socket.on(EVENTS.MATCHES.RESPONSES.MATCH_STARTED, function(match){
			console.log("EVENTS.MATCHES.RESPONSES.MATCH_STARTED", match);
			currentMatch = match;
		});
	});
});

// $(document).keypress(function(e) {
// 	if(e.which == 13) {
// 		login();
// 	}
// });