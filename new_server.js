//start the server
var express = require('express'),//web frame work
    http    = require('http'),//
    app     = express(),
    util = require('util'),
    server  = http.createServer(app),
    port    = 8080,
    game_sockets = {}; //socket_id is the key, socket_dict is the value
    join_codes = {}; //4 digit code is the key, socket_id is the value

var ALL_BOARDS = {}; //key value pairs. GameBoard objects as values, socket_id's as keys.
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
	//3 options for request origins 1.Direct controller Url. 2.Wrong join code 3.New board game request.
	var requestQuery = req.query;
	//1. If this is a join code route them to the right game board
	if(requestQuery.code && join_codes[requestQuery.code]){
		var keyCovert = join_codes[requestQuery.code];
		keyCovert = keyCovert.replace("/#", "");
		res.redirect("/raos?id="+keyCovert);
	}
	else if(requestQuery.code){
		//2. If join code does not exist then send them back to index
		res.redirect('/?error=code_not_found');
	}
	else{
		//3. This would be a new board game request
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
		while (join_codes[join_code]){
			join_code = Math.floor(1000 + Math.random() * 9000);
		}
		join_codes[join_code] = socket.id;
		game_sockets[socket.id] = socket;
		console.log("Join code: "+util.inspect(join_codes));
		//Let the board know that they are connected to the server and send the join codes for the controller to use.
		socket.emit("game_connected",join_code);
	});
	//there will be no controller id param if there has not been one created.
	socket.on('controller_connect', function(game_id,controller_id){
		//check to se if game socket exists if it does then it is a controller trying to connect
		//append game socket with /# (this was appended on the game socket creation by socket.io)
		game_id = "/#"+game_id;
		if (game_sockets[game_id]){
			//we will need another if statement to check to see if the controller is already taken.
			//This message is going to be sent when the user selects "join a game", and then inputs the game id.
			//look up the game board and make sure that it's 'open'.
			//add a controller to the game board
			//notify the game board of the new player.
			console.log(game_id);
			socket.emit("controller_connected",true,0);//right now this is 0 but should be the player number that the game board has stored.
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