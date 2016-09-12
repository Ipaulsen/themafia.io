// global vars

var io = io.connect();

io.on('connect', function() {
	//controller connect logic
	if (window.location.href.indexOf('?id=') > 0) {
		var GBsocket = window.location.href.split('?id=')[1];
		io.emit('controller_connect', GBsocket);
		io.on('controller_connected', function(connected,playerNumber) {
		//switch to controller view and hide gameBoard
		console.log("enter controller_connected io on")
		$("#controller").css("display", "block");
		if (connected) {
			var playerName = prompt("Enter your name:");
			$("#controllerMessage").append(playerName+" is player :"+playerNumber);
			var playerObject = {playerNumber: playerNumber,playerName: playerName}
			io.emit('notify_board', playerObject, GBsocket);
		} else {
			alert("Your a controller - Not connected!");
		}


	});
	} else {
		//game board connect logic	
		io.emit('board_connect');
		$("#gameBoard").css("display","block");
		var game_connected = function(join_code) {
			console.log("Join code: "+join_code);
			$("#message").append("Join Code: "+"<span class=\"fontNumbers\">"+join_code+"</span>");
			io.removeListener('game_connected', game_connected);
		};
		io.on('game_connected', game_connected);
		console.log("New board game connected");
	}
	//game board updates
	io.on('notify_board', function(playerObject){
		console.log("playerObject:");
		console.log(playerObject.playerNumber);
		// if(playerObject.playerNumber){
			console.log("Player Number: "+playerObject.playerNumber);
			console.log("Player Name: "+playerObject.playerName);
			addOne(playerObject.playerName);
			players.push(playerObject);
		// }
	});
});