$('document').ready(function(){

	console.log("kek", CreateRoomRequest);

    var createBtn		= $("#createBtn");
    var backBtn		    = $("#backBtn");

    var inputName = $("#inputName");
    var inputUsersLimit = $("#inputUsersLimit");
    var inputSeed = $("#inputSeed");
    var inputSize = $("#inputSize");
    var inputCover = $("#inputCover");

	var showError = function(msg){
		alert(msg);//---
	}

    // go back to rooms view
    var goToRooms = function(){
        window.location.assign("/rooms");
    }

	// create room
	var createRoom = function(){console.log("test");
		let requestData = {};

        requestData.name = inputName.val();
        requestData.usersLimit = parseInt(inputUsersLimit.val(), 10);
        requestData.seed = inputSeed.val();
        requestData.mapSize = parseInt(inputSize.val(), 10);
        requestData.mapCoverPercentage = parseInt(inputCover.val(), 10);

        let createRoomRequest = CreateRoomRequest.fromObject(requestData);

        if(!createRoomRequest)
        {
            showError("Incorrect data, please check if all fields are filled");
            return false;
        }

		$.ajax({
			method: "POST",
			url: "/rooms/create",
			data: createRoomRequest,
			statusCode: {
				400: function(){ showError("Incorrect data"); },
				500: function(){ showError("Server error, try again later"); }
			}
		}).done(function(response){

            console.log("createRoomRequest", createRoomRequest);
            console.log("response", response);
            sessionStorage.setItem('roomId', response.id);
            window.location.assign('/rooms');

		});
	}

    backBtn.on("click", goToRooms);
	createBtn.on("click", createRoom);

});