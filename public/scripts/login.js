$('document').ready(function(){

	console.log("kek", LoginRequest);

	var loginBtn		= $("#loginBtn");
	var formInputLogin	= $("#formLogin");
	var formInputPass	= $("#formPass");

	var showError = function(msg){
		alert(msg);//---
	};

	//login
	var login = function(){
		let requestData = {};

		requestData.login	= formInputLogin.val();
		requestData.pass	= formInputPass.val();

		$.ajax({
			method: "POST",
			url: "/login",
			data: requestData,
			statusCode: {
				401: function(){ showError("Błędne dane logowania"); },
				500: function(){ showError("Błąd serwera, spróbuj ponownie później"); }
			}
		}).done(function(response){

			console.log(response);//---
			if(response.status.auth && response.status.success)
			{
				window.location.assign("rooms");
			}
			else
			{
				showError("Błędne dane logowania");
			}

		});
	}

	loginBtn.on("click", login);

	$(document).keypress(function(e) {
		if(e.which == 13) {
			login();
		}
	});

});