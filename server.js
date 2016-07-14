var express = require('express'),//web frame work
    http    = require('http'),//
    app     = express(),
    util = require('util'),
    server  = http.createServer(app),
    port    = 8080,
    game_sockets = {},
	controller_sockets = {},
	playerNumbers = {},
	controllersArrays = {},
    gameStatus = {};
console.log("palyer number: "+util.inspect(playerNumbers));
server.listen(port);

// Serve static files under the /public directory
app.use("/public", express.static(__dirname + '/public'));

app

  // Set up index
  .get('/', function(req, res) {

    res.sendFile(__dirname + '/index.html');

  });

// Log that the servers running
console.log("Server running on port: " + port);

var io = require('socket.io').listen(server);

//on socket connection 
io.sockets.on('connection', function (socket) {
	socket.on('game_connect', function(){

	  console.log("Game connected");

	  game_sockets[socket.id] = {
	    socket: socket,
	    controller_id: []
	  };

	  socket.emit("game_connected");
	});

	socket.on('controller_connect', function(game_socket_id){
		console.log("****Controller Connect Start****");
		game_socket_id = "/#"+game_socket_id;

		if(!playerNumbers[game_socket_id]){
			playerNumbers[game_socket_id] = {playerCount:0};
			controllersArrays[game_socket_id] = {controllersArrayKey:[]};
		}

		console.log("palyer number: "+util.inspect(playerNumbers));
		console.log("controllersArray: "+util.inspect(controllersArrays));
	  if (game_sockets[game_socket_id] && !game_sockets[game_socket_id].controller_id[playerNumbers[game_socket_id].playerCount]) {

	    console.log("Controller connected");

	    controller_sockets[socket.id] = {
	      socket: socket,
	      game_id: game_socket_id
	    };
	    controllersArrays[game_socket_id].controllersArrayKey.push(game_socket_id+"&P="+playerNumbers[game_socket_id].playerCount);
	    playerNumbers[game_socket_id].playerCount = playerNumbers[game_socket_id].playerCount+1;
	    console.log("After +1 player: "+util.inspect(playerNumbers[game_socket_id]));
	    console.log("test controllersArray= "+controllersArrays[game_socket_id].controllersArrayKey);
	    game_sockets[game_socket_id].controller_id = controllersArrays[game_socket_id].controllersArrayKey;
	    console.log("Controllers: "+ game_sockets[game_socket_id].controller_id);

	    game_sockets[game_socket_id].socket.emit("controller_connected", true);

	    socket.emit("controller_connected",true,playerNumbers[game_socket_id].playerCount);

	  } else {

	    console.log("Controller attempted to connect but failed");

	    socket.emit("controller_connected", false);
	  }

	});
	//game board updates
	socket.on('updateGB', function(playerObject){
		console.log("Player Object: "+util.inspect(playerObject));
		io.emit('updateGB', playerObject);
	});
	//on socket disconnection
	socket.on('disconnect', function () {

	  // Game
	  if (game_sockets[socket.id]) {

	    console.log("Game disconnected");

	    if (controller_sockets[game_sockets[socket.id].controller_id]) {
	 
	      controller_sockets[game_sockets[socket.id].controller_id].socket.emit("controller_connected", false);
	      controller_sockets[game_sockets[socket.id].controller_id].game_id = undefined;
	    }

	    delete game_sockets[socket.id];
	  }

	  // Controller
	  if (controller_sockets[socket.id]) {

	    console.log("Controller disconnected");

	    if (game_sockets[controller_sockets[socket.id].game_id]) {

	      game_sockets[controller_sockets[socket.id].game_id].socket.emit("controller_connected", false);
	      game_sockets[controller_sockets[socket.id].game_id].controller_id = undefined;
	    }

	    delete controller_sockets[socket.id];
	  }
	});
});