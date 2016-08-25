// global vars
var playerCount;

//controller vars
var playerID;

//gameboard vars
var dashBoard = {};

var io = io.connect();

io.on('connect', function() {
	//controller connect logic
	if (window.location.href.indexOf('?id=') > 0) {
		io.emit('controller_connect', window.location.href.split('?id=')[1]);
		io.on('controller_connected', function(connected,playerNumber) {
		//switch to controller view and hide gameBoard
		console.log("enter controller_connected io on")
		$("#controller").css("display", "block");
		if (connected) {
			var playerName = prompt("Enter your name:");
			$("#controllerMessage").append(playerName+" is player :"+playerNumber);
			var playerObject = {playerNumber: playerNumber,playerName: playerName}
			io.emit('notify_board', playerObject);
		} else {
			alert("Your a controller - Not connected!");
		}

	});
	} else {
		//game board connect logic	
		io.emit('board_connect');
		$("#gameBoard").css("display","block");
		var game_connected = function(join_code) {
			console.log(game_connected+","+join_code);
			var url = "http://localhost:8080/raos?code=" + join_code;
			$("#urlController").append("Url for Mafia members only: "+"<a href=\""+url+"\" target=\"_blank\">"+url+"</a>");
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
		// }
	});
});