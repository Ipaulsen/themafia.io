// global vars
var palyerCount;

//controller vars
var playerID;

//gameboard vars
var dashBoard = {};

var io = io.connect();

io.on('connect', function() {
	if (window.location.href.indexOf('?id=') > 0) {
	  io.emit('controller_connect', window.location.href.split('?id=')[1]);
	  	io.on('controller_connected', function(connected,playerNumber) {
	  	//switch to controller view and hide gameBoard
	  	$("#gameBoard").css("display","none");
	  	$("#controller").css("display", "block");
		  if (connected) {

		    alert("Your a controller - Connected! "+playerNumber);
		    $("#controllerMessage").append("Player :"+playerNumber);
		    var playerObject = {playerNumber: playerNumber}
		    io.emit('updateGB', playerObject);

		  } else {

		    alert("Your a controller - Not connected!");
		  }

	});
	} else {
	  io.emit('game_connect');
		var game_connected = function() {
		  var url = "http://***your-ip***?id=" + io.id;
		  $("#urlController").append("Url for Mafia members only: "+"<a href=\""+url+"\" target=\"_blank\">"+url+"</a>");
		  io.removeListener('game_connected', game_connected);
		};

		io.on('game_connected', game_connected);
	}
	//game board updates
	io.on('updateGB', function(playerObject){
		if(playerObject.playerNumber){
			console.log("Player Number: "+playerObject.playerNumber);
			addOne();
		}
	});
});