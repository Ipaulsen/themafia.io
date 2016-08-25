//define our player class
var Player = function(name) {
	this.id = 0; //this probably should be set on creation
	this.name = name; //the player's name, "john", "susan", etc...
  	this.role = "citizen"; //default
  	this.alive = true;
  	this.doused = false; //doused is set to true when the arsonist douses the player.
  	this.doctor_kill = false;
  	this.doctor_save = false; //doctor_save and _kill are booleans for if the doctor has used their save or kill power yet.
  	this.lover_id = false; //set this to the id of the player's lover, if cupid makes you a lover.
  	this.socket_id = false; //this will probably need to be initialized on creation as well.
    this.ready_to_proceed = false; //this is a boolean that will tell us if that player is ready to proceed to the next game state.
    this.vote_count = 0; //this keeps track of how many people have voted for this person.
};

var REVIEW_CHARACTER_STATE = "review";
var CUPID_STATE = "cupid"; //instead of using int's we will use strings for better readability when debugging.
var DISCUSSION_STATE = "discussion";
var NOMINATION_STATE = "nomination";
var TRIAL_STATE = "trail";
var VOTE_STATE = "vote";
var LYNCH_STATE = "lynch"; //we might not need this state.
var MAFIA_VOTE_STATE = "mafia_vote";
var SPECIAL_CHARACTER_VOTE_STATE = "special_char_vote";

//this is initilized by main.js
// var io = io.connect();


var players = [];
var current_state;

function new_game_pressed(){
	//send 'board_connect' message. get a message back with our unique game ID to display for controllers to connect to
}

function start_game_pressed(){
	//send 'start_game' message to server.
	//randomly assign roles to everyone in the game.
	current_state = REVIEW_CHARACTER_STATE;
	//notify all characters in game of their role. (send notify_controllers message to server)
	//start a 30 second timer.
}

io.on('ready_to_proceed', function(action) {
	//update ready to proceed for that player.
	//check if all the players are ready to proceed
		//if yes, then zero the timer and call timer_up()
		//if no, then keep waiting.
});

function timer_up(){ //this could also be called after everyone is "ready_to_proceed"
	if (current_state == REVIEW_CHARACTER_STATE){
		current_state = CUPID_STATE;
		//notify cupid to do his thang. 'notify_controller' action = "cupid"
		//start a timer.
	}else if (current_state == DISCUSSION_STATE){
		state = NOMINATION_STATE;
		//notify everyone to start nominating
		//kick off the timer
	}
}

io.on('notify_board', function(picked_players) {
	if (current_state == CUPID_STATE){
		//update lovers with whoever was picked
		current_state = DISCUSSION_STATE;
		//kick off the discussion state, start the 2:00 timer.
	}else if (current_state == CUPID_STATE){
		//update lovers with whoever was picked
	}else if (current_state == NOMINATION_STATE){
		//update board with votes.
		//check if all votes are in
			//if yes, then zero the timer and call timer_up()
	}
});