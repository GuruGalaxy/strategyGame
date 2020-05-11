$('document').ready(function(){

    console.log("Rooms view ready");
    
    const socket = io('/rooms');

	var showError = function(msg){
		alert(msg);//---
	};

});