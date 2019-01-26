import {Game, Player, Card} from './game.js';

export function runTests() {
	console.log("Running tests.js");

	let tests = [
		{
			name: "InstantiateGame",
			func: instantiateGame
		}
	]

	for (var i = 0; i < tests.length; i++) {
		console.log(`Test ${i}: ${tests[i].name}`);
		tests[i].func();
		console.log("Test complete");
	}

	console.log("Tests complete");
}

function instantiateGame() {
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
