//start the server
var express = require('express'),//web frame work
    http    = require('http'),//
    app     = express(),
    util = require('util'),
    server  = http.createServer(app),
    port    = 8080,
    game_sockets = {};

server.listen(port);

// Serve static files under the /public directory
app.use("/public", express.static(__dirname + '/public'));

//set up serve index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
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
	});

	socket.on('controller_connect', function(game_id){
		//This message is going to be sent when the user selects "join a game", and then inputs the game id.
		//look up the game board and make sure that it's 'open'.
		//add a controller to the game board
		//notify the game board of the new player.
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