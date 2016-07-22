//start the server
var express = require('express'),//web frame work
    http    = require('http'),//
    app     = express(),
    util = require('util'),
    server  = http.createServer(app),
    port    = 8080,
    game_sockets = {};
    join_codes = [];

server.listen(port);

// Serve static files under the /public directory
app.use("/public", express.static(__dirname + '/public'));

//set up serve index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
	// console.log("req: "+util.inspect(req));
	// console.log("res: "+util.inspect(res));
});

//set up serve code name raos AKA the game board
app.get('/raos', function(req, res) {
	//3 options for request origins 1.Game Board 2.Join Code 3.Direct controller Url.
	var requestQuery = req.query;
	//if this is a join code route them to the right game board
	if(requestQuery.code){
		if(requestQuery.code.length == 4){
			console.log(4);
			console.log(requestQuery.code);
			for (var key in game_sockets) {
				if(requestQuery.code == game_sockets[key].join_code){
					var keyCovert = key;
					keyCovert.toString();
					console.log("key covert 1: "+keyCovert);
					keyCovert = keyCovert.replace("/#", "");
					console.log("key covert 2: "+keyCovert);
					// res.sendFile(__dirname + '/raos.html?id='+keyCovert);
					res.redirect("/raos?id="+keyCovert);
				}
			    // console.log(i+"st jc: "+ util.inspect(game_sockets[key].join_code));
			    // console.log(i+"st key: "+ util.inspect(key));
			    // i++;
			}
			//if wrong join code send them back to index
			res.redirect('/raos?error=code_not_found');
		}
	}
	else{
		res.sendFile(__dirname + '/raos.html');
	}
});

// Log that the servers running
console.log("Server running on port: " + port);
var io = require('socket.io').listen(server);

var GameBoard = function(name) {
	this.id = 0; //this probably should be set on creation
	this.socket_id = 0; //This is if we decide we want to send messages to only the game board
  	this.controllers_ids = []; //this holds all the controller id's.
  	this.open = true; //a boolean for if we are accepting new players in this game or not.
};

var ALL_BOARDS = {} //key value pairs. GameBoard objects as values, socket_id's as keys.

//when someone connects (game board or controller)
io.sockets.on('connection', function (socket) { 

	socket.on('board_connect', function(){ //a game board connected.
		//This message is going to be sent after the user selects "start a new game"
		//initiate a new game board with a unique id
        //add it to the ALL_BOARDS dictionary with the socket_id as it's key.
		//send that game board id back to the client for display
		console.log("Game connected");
		var join_code = Math.floor(1000 + Math.random() * 9000);
		//taken the random 4 digit join code and see if it is taken 
		var checkIfJoinCodeIsTaken = function(join_code_param){
			console.log("boolean join code status: "+join_codes.indexOf(join_code) > -1);
			if(join_codes.indexOf(join_code) > -1){
				join_code = Math.floor(1000 + Math.random() * 9000);
				checkIfJoinCodeIsTaken(join_code);
			}
		}
		checkIfJoinCodeIsTaken(join_code);
		game_sockets[socket.id] = {
			socket: socket,
			join_code: join_code
		};
		socket.emit("game_connected");
		console.log(util.inspect(game_sockets));
	});
	//there will be no controller id param if there has not been one created.
	socket.on('controller_connect', function(game_id,controller_id){
		//check to se if game socket exists if it does then it is a controller trying to connect
		//append game socket with /# (this was appended on the game socket creation by socket.io)
		game_id = "/#"+game_id;
		if (game_sockets[game_id]){
			//we will need another if statment to check to see if the controller is allready taken.
			//This message is going to be sent when the user selects "join a game", and then inputs the game id.
			//look up the game board and make sure that it's 'open'.
			//add a controller to the game board
			//notify the game board of the new player.
			console.log(game_id);
			game_sockets[game_id].socket.emit("controller_connected", true);
			socket.emit("controller_connected",true,0);
		}
		else {
			console.log("Controller attempted to connect but failed 1st else");
			socket.emit("controller_connected", false);
		}
	});

    socket.on('notify_controllers', function(){ //a game board connected.

        //we could change this to 'notify_controller'. Basically we need a function to pass messages from the board to one or all of the controllers.

    });

    socket.on('notify_board', function(){ //a game board connected.
        //basically this needs to just pass messages from the controller to the board.
    });


	//on socket disconnection
	socket.on('disconnect', function () {
		//if a game board disconnects then destroy the whole game. 
		//if a game controller disconnects, then destroy the player (have it be taken over by AI?)
	});
});