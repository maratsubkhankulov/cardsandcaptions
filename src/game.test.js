import {Game, Player, CaptionCard} from './game.js';
import {fillCardStacks} from './game_utils.js';

let player1 = null;
let player2 = null;
let player3 = null;

function setup() {
	player1 = new Player("Steven");
	player2 = new Player("Jack");
	player3 = new Player("Alice");
}

it('Run sets up a multiplayer game', () => {
	setup();
	let game = new Game();

	game.addPlayer(player1);
	game.addPlayer(player2);
	game.addPlayer(player3);

	console.log(game.players.length == 3, game.players);
});

describe('Full turn', () => {
	it('Plays a full turn', () => {
		setup();
		let game = new Game();

		game.addPlayer(player1);
		game.addPlayer(player2);
		game.addPlayer(player3);

		fillCardStacks(game); 
		game.playersFillHands();

		for (var i = 0; i < game.players.length; i++) {
			let player = game.players[i];
			console.assert(player.hand.length == Player.maxHandSize(),
				`Player(${player.name}) hand should be full. Has ${player.hand.length} cards.`);
		}

		game.startGame();

		let judge = game.getCurrentJudge();
		console.assert(judge.name === player1.name);
		game.collectCaptionCard(judge);

		game.revealCaptionCard(judge);

		// Voters play cards, judge collects cards
		let image_stack_size = game.image_stack.length;

		game.voteImageCard(player2, player2.hand[0]);
		game.voteImageCard(player3, player3.hand[3]);

		console.assert(judge.votes.length == 2, "Expected 2 cards to be played");

		// Judge chooses winning card
		console.log(judge.votes);
		let winner = game.chooseWinningCard(judge, judge.votes[1]);

		console.assert(winner === player3, `Unexpected winner Player(${winner.name})`);
		
		expect(game.image_stack.length).toBe(image_stack_size + 2);

		console.assert(judge.votes.length == 0, "Expected votes to be cleared");

		// End of turn
		game.endTurn();

		console.assert(game.currentJudge == -1);

		// Players have refilled their hands
		for (var i = 0; i < game.players; i++) {
			let player = game.players[i];
			console.assert(player.hasFullHand());
		}
	})
});

