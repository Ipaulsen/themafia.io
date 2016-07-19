// global vars
var palyerCount;

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
		$("#controller").css("display", "block");
		if (connected) {
			var playerName = prompt("Enter your name:");
			$("#controllerMessage").append(playerName+" is player :"+playerNumber);
			var playerObject = {playerNumber: playerNumber,playerName: playerName}
			io.emit('updateGB', playerObject);
		} else {
			alert("Your a controller - Not connected!");
		}

	});
	} else {
		//game board connect logic		
		io.emit('game_connect');
		$("#gameBoard").css("display","block");
		var game_connected = function() {
			var url = "http://10.0.10.34:8080?id=" + io.id;
			$("#urlController").append("Url for Mafia members only: "+"<a href=\""+url+"\" target=\"_blank\">"+url+"</a>");
			io.removeListener('game_connected', game_connected);
		};
		io.on('game_connected', game_connected);
	}
	//game board updates
	io.on('updateGB', function(playerObject){
		if(playerObject.playerNumber){
			console.log("Player Number: "+playerObject.playerNumber);
			console.log("Player Name: "+playerObject.playerName);
			addOne(playerObject.playerName);
		}
	});
});