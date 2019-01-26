import {Game, Player, Card} from './game.js';

export function runTests() {
	console.log("Running tests.js");

	let tests = [
		{
			name: "Count turns",
			func: countTurns
		},
		{
			name: "Create a multi player game",
			func: multiPlayerGame
		},
	]

	for (var i = 0; i < tests.length; i++) {
		console.log(`Test ${i}: ${tests[i].name}`);
		tests[i].func();
		console.log("Test complete");
	}

	console.log("Tests complete");
}

function countTurns() {
	let game = new Game();

	console.assert(game.turn_number == 0, game); 

	game.startGame();

	for (var i = 0; i < Game.maxTurns(); i++) {
		console.assert(game.turn_number == i + 1, game.turn_number, i);

		game.collectVotes();
		game.decideWinner();
		game.startNextTurn();
	}

	console.assert(game.turn_number == Game.maxTurns());
}

function multiPlayerGame() {
	let game = new Game();

	let player1 = new Player("Steven");
	let player2 = new Player("Jack");
	let player3 = new Player("Alice");

	game.addPlayer(player1);
	game.addPlayer(player2);
	game.addPlayer(player3);

	console.log(game.players.length == 3, game.players);
}

function badStateTransitions() {
}

