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
//set up index
app.get('/', function(req, res) {
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
			controller_sockets: {game_id_controllers:[],players:[]},
			playerNumbers: {playerCount:0},
			gameStatus: {}
		};
		socket.emit("game_connected");
		console.log(util.inspect(game_sockets));
	});
	socket.on('controller_connect', function(game_socket_id){
		console.log("  ");
		console.log("  ");
		console.log("  ");
		console.log("****Controller Connect Start****");
		game_socket_id = "/#"+game_socket_id;
		// console.log("Game Socket Before: "+util.inspect(game_sockets[game_socket_id]));
		console.log("  ");
		console.log("  ");
		console.log("  ");
		console.log("palyer number: "+util.inspect(game_sockets[game_socket_id].playerNumbers.playerCount));
		// console.log("Game Socket After: "+util.inspect(game_sockets[game_socket_id]));
		console.log("If 1: "+util.inspect(game_sockets[game_socket_id].controller_sockets));

		if (game_sockets[game_socket_id]) {
			if(game_sockets[game_socket_id].controller_sockets.game_id_controller.indexOf(game_socket_id+"&"+game_sockets[game_socket_id].playerNumbers.playerCount)){
				console.log("Controller connected");

				game_sockets[game_socket_id].controller_sockets.game_id_controllers.push(game_socket_id+"&"+game_sockets[game_socket_id].playerNumbers.playerCount+1);
				console.log(util.inspect(game_sockets[game_socket_id].controller_sockets.game_id_controllers));
				game_sockets[game_socket_id].controller_sockets.players.push(game_sockets[game_socket_id].playerNumbers.playerCount+1);

				game_sockets[game_socket_id].playerNumbers.playerCount = game_sockets[game_socket_id].playerNumbers.playerCount+1;
				console.log("After +1 player: "+util.inspect(game_sockets[game_socket_id].playerNumbers.playerCount));
				game_sockets[game_socket_id].socket.emit("controller_connected", true);
				socket.emit("controller_connected",true,game_sockets[game_socket_id].playerNumbers.playerCount);
			} else {
				console.log("Controller attempted to connect but failed 2nd else");
				socket.emit("controller_connected", false);				
			}
		} else {
			console.log("Controller attempted to connect but failed 1st else");
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
			// if (controller_sockets[game_sockets[socket.id].controller_id]) {
			// 	controller_sockets[game_sockets[socket.id].controller_id].socket.emit("controller_connected", false);
			// 	controller_sockets[game_sockets[socket.id].controller_id].game_id = undefined;
			// }
			delete game_sockets[socket.id];
		}
		// Controller
		if (game_sockets[game_socket_id].controller_sockets) {
			console.log("Controller disconnected");
			// if (game_sockets[controller_sockets[socket.id].game_id]) {
			// 	game_sockets[controller_sockets[socket.id].game_id].socket.emit("controller_connected", false);
			// 	game_sockets[controller_sockets[socket.id].game_id].controller_id = undefined;
			// }
			delete controller_sockets[socket.id];
		}
	});
});