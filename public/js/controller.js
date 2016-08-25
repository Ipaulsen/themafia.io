//we don't need to redefine the player and the board classes because raos.html will include both board.js and controller.js
//this is initilized by main.js
// var io = io.connect();

function join_game(game_id){
	//send 'controller_connect' message to server so it can keep track of us.
}

io.on('display_roll', function() {
	//display the users roll, and wait for them to say okay. When they do send a ready_to_proceed message to the server.
});


io.on('notify_controller', function(action, role) {
	if (action == "review_character"){
		//display our player role.

	}else if (action == "cupid"){ //the board should only send the cupid player this message.
		//display 2 player picker.

	}else if (action == "nomination"){ 
		//show the picker for nomination
	}

});

function did_pick_players(player){
	//notify game board of whom was picked.
}