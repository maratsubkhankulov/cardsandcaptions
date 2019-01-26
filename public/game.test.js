import {Game, Player, CaptionCard} from './game.js';
import {fillCardStacks} from './game_room.js';

export function runTests() {
	console.log("Running tests.js");

	let tests = [
		{
			name: "Count turns",
			func: countTurns,
		},
		{
			name: "Create a multi player game",
			func: multiPlayerGame,
		},
		{
			name: "Play a full turn",
			//collect caption card, collect plays, select and award winning card.",
			func: playATurn,
		},
	]

	for (var i = 0; i < tests.length; i++) {
		setup();

		console.log(`Test ${i}: ${tests[i].name}`);
		tests[i].func();
		console.log("Test complete");
	}

	console.log("Tests complete");
}

let player1 = null;
let player2 = null;
let player3 = null;

function setup() {
	player1 = new Player("Steven");
	player2 = new Player("Jack");
	player3 = new Player("Alice");
}

function countTurns() {
	let game = new Game();

	game.addPlayer(player1);

	console.assert(game.turn_number == 0, game); 

	fillCardStacks(game);
	game.startGame();

	for (var i = 0; i < Game.maxTurns(); i++) {
		console.assert(game.turn_number == i + 1, game.turn_number, i);

		game.collectVotes();
		game.decideWinner();
		game.startNextTurn();

		// is game over?
	}

	console.assert(game.turn_number == Game.maxTurns());
}

function multiPlayerGame() {
	let game = new Game();

	game.addPlayer(player1);
	game.addPlayer(player2);
	game.addPlayer(player3);

	console.log(game.players.length == 3, game.players);
}

function playATurn() {
	let game = new Game();

	game.addPlayer(player1);
	game.addPlayer(player2);
	game.addPlayer(player3);

	fillCardStacks(game); 
	game.startGame();

	let judge = game.getCurrentJudge();
	console.assert(judge.name === player1.name);
	game.collectCaptionCard(judge);
}

