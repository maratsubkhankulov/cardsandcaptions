let player_counter = 0; 

export class Vote {
	constructor(player, card) {
		this.player = player;
		this.card = card;
	}
}

export class Player {
	static maxHandSize() { return 4; } // image cards are held by player
	constructor(name) {
		this.id = player_counter++;
		this.name = name;
		this.hand = []; // Cards in hand
		this.captionCard = null; // Current caption
		this.points = []; // Caption hands won
		this.votes = []; // Holds cards when this player is judge
	}

	takeCaptionCard(card) {
		console.assert(this.captionCard === null);
		this.captionCard = card;
	}

	takeImageCard(card) {
		console.assert(this.hand.length < Player.maxHandSize());
		this.hand.push(card);
	}

	takeVotedImageCard(voter, card) {
		this.votes.push(new Vote(voter, card));
	}

	hasFullHand() {
		return this.hand.length === Player.maxHandSize();
	}

	clearVotes() {
		this.votes = [];
	}

	getVote(playerId, cardId) {
		for (var i = 0; i < this.votes.length; i++) {
			let vote = this.votes[i];
			if (vote.player.id === playerId && vote.card.id === cardId) {
				return vote;
			}
		}
		return null;
	}

	removeCardFromHand(id) {
		for (var i = 0; i < this.hand.length; i++) {
			let card = this.hand[i];
			if (card.id === id) {
				this.hand.splice(i, 1);
				return card;
			}
		}
		throw `Asking to remove non-existent Card(${id})`;
	}

	takePoint(card) {
		this.points.push(card);
	}

	hasPlayerVoted(voter) {
		for (let i = 0; i < this.votes; i++) {
			let v = this.votes[i];
			if (v.player.id === voter.id) {
				return true;
			}
		}
		return false;
	}
}

export class CaptionCard {
	constructor(id, caption, img_url, isCaptionCard) {
		this.id = id;
		this.caption = caption;
	}
}

export class ImageCard {
	constructor(id, img) {
		this.id = id; // Universal identifier
		this.img = img;
	}
}

const StateEnum = {
	WAIT_TO_START: 0, // A
	WAIT_FOR_JUDGE: 1, // B
	WAIT_FOR_VOTERS: 2, // C
	WAIT_FOR_JUDGMENT: 3, // D
	END_OF_TURN: 4, // E
	END_OF_GAME: 5, // F
}

function EnumToStr(Enum, value) {
	for (var prop in Enum) {
		if (Enum[prop] === value) {
			return prop;
		}
	}
}

function StateToString(value) {
	return EnumToStr(StateEnum, value);
}

const INVALID_STATE = -1;
const num_states = Object.keys(StateEnum).length;

const ActionEnum = {
	START: 0,
	SHOW_CAPTION: 1,
	COLLECT_VOTES: 2,
	JUDGE: 3,
	END_GAME: 4,
}

function ActionToString(value) {
	return EnumToStr(ActionEnum, value);
}

// TODO remove

var transitions = new Array(num_states).fill(INVALID_STATE).map(() => new Array(num_states).fill(INVALID_STATE));
transitions[StateEnum.WAIT_TO_START][ActionEnum.START] = StateEnum.WAIT_FOR_JUDGE;
transitions[StateEnum.WAIT_FOR_JUDGE][ActionEnum.SHOW_CAPTION] = StateEnum.WAIT_FOR_VOTERS;
transitions[StateEnum.WAIT_FOR_VOTERS][ActionEnum.COLLECT_VOTES] = StateEnum.WAIT_FOR_JUDGMENT;
transitions[StateEnum.WAIT_FOR_JUDGMENT][ActionEnum.JUDGE] = StateEnum.END_OF_TURN;
transitions[StateEnum.END_OF_TURN][ActionEnum.END_GAME] = StateEnum.END_OF_GAME;
transitions[StateEnum.END_OF_TURN][ActionEnum.START] = StateEnum.WAIT_FOR_JUDGE;
transitions[StateEnum.END_OF_GAME][ActionEnum.START] = StateEnum.WAIT_FOR_VOTERS;

export class Game {
	static maxTurns() { return (Game.maxPlayers() - 1) * Game.maxScore() + 1; }
	static maxScore() { return 5; }
	static maxPlayers() { return 5; }

	constructor() {
		this.state = StateEnum.WAIT_TO_START;
		this.players = []; // Cards in hand
		this.caption_stack = []; // Stack of caption cards
		this.image_stack = []; // Stack of image cards
		this.turn_number = 0;
		this.currentJudge = -1;
	}

	getPlayer(id) {
		console.log(`Get player by id ${id}`);
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player.id === id) {
				return player;
			}
		}
		return null;
	}

	existsJudge() {
		return this.currentJudge >= 0 && this.currentJudge < this.players.length;
	}

	getCurrentJudge() {
		console.assert(this.currentJudge >= 0 && this.currentJudge < this.players.length, `Invalid current judge index ${this.currentJudge}`);
		return this.players[this.currentJudge];
	}

	// Game room actions
	addPlayer(player) {
		this.players.push(player);
	}

	addCaptionCard(card) {
		this.caption_stack.push(card);
	}

	addImageCard(card) {
		this.image_stack.push(card);
	}

	// Game state checks
	isVotingCompleted() {
		let judge = this.getCurrentJudge();
		return judge.votes.length === this.players.length - 1;
	}

	getState() {
		return StateToString(this.state);
	}

  // System actions
	changeState(action) {
		if (action === undefined) {
			throw "Attempting to change state with undefined action"
		}

		const new_state = transitions[this.state][action];
		if (new_state === INVALID_STATE) {
			throw `Invalid state transition: state(${StateToString(this.state)}) action(${ActionToString(action)})`;
		}
		console.log(`Transitioned state ${StateToString(this.state)} by action ${ActionToString(action)}. New state: ${StateToString(new_state)}`);
		this.state = new_state;
	}

	startGame() {
		console.assert(this.caption_stack.length > 0, "Caption stack is empty at the start of the game");
		console.assert(this.image_stack.length > 0, "Image stack is empty at the start of the game");
		this.turn_number = 1;

		this.changeState(ActionEnum.START);

		// Elect first judge
		console.assert(this.players.length > 0, "Can't start game with no players");
		this.currentJudge = (this.currentJudge + 1) % this.players.length;
	}

	collectVotes() {
		this.changeState(ActionEnum.COLLECT_VOTES);
	}

	endTurn() {
		this.changeState(ActionEnum.JUDGE);
		this.playersFillHands();
		this.turn_number += 1;
	}

	startNextTurn() {
		this.turn_number += 1;
	}

	clearJudge() {
		this.currentJudge = -1;
	}

	fillHand(player) {
		let cardsToTake = Player.maxHandSize() - player.hand.length;
		for (var i = 0; i < cardsToTake; i++) {
			console.assert(this.image_stack.length > 0);
			let card = this.image_stack.pop();
			player.takeImageCard(card);
		}
	}

	isGameOver() {
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player.countPoints() >= Game.maxPoints()) {
				return true;
			}
		}
		return this.turn_number > Game.MAX_TURNS;
	}

	// Player actions in the game
	playersFillHands() {
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			this.fillHand(player);
		}
	}

	collectCaptionCard(player) {
		console.assert(this.state === StateEnum.WAIT_FOR_JUDGE)
		let card = this.caption_stack.pop();
		player.takeCaptionCard(card);
	}

	revealCaptionCard(player) {
		console.assert(this.state === StateEnum.WAIT_FOR_JUDGE)

		let card = player.captionCard;
		console.log(`Player(${player.name}) revealed caption card: "${card.caption}"`);

		this.changeState(ActionEnum.SHOW_CAPTION);
	}

	canPlayerVote(voter) {
		if (this.state !== StateEnum.WAIT_FOR_VOTERS) {
			console.log("Not waiting for voters");
			return false;
		}
		if (voter.hand.length !== Player.maxHandSize()) {
			console.log("Player appears to have voted");
			return false;
		}

		let judge = this.getCurrentJudge();
		if (judge.hasPlayerVoted(voter)) {
			console.log("Cannot vote twice");
			return false;
		}
	
		if (judge.id === voter.id) {
			console.log("Judge cannot vote");
			return false;
		}
		return true;
	}

	voteImageCard(voter, cardId) {
		if (!this.canPlayerVote(voter)) {
			return;
		}
		let judge = this.getCurrentJudge();
		let card = voter.removeCardFromHand(cardId);
		console.assert(voter.hand.length === Player.maxHandSize() - 1);

		let numVotes = judge.votes.length;
		judge.takeVotedImageCard(voter,card);
		console.assert(judge.votes.length === numVotes + 1);

		console.log(`Voter(${voter.name}) voted Card(${card.img})`);
		if (this.isVotingCompleted()) {
			this.collectVotes();
		}
	}

	canChooseWinningCard() {
		if (this.state !== StateEnum.WAIT_FOR_JUDGMENT) {
			console.error(`Unexpected state: ${StateToString(this.state)}`);
			return false;
		}
		return true;
	}

	chooseWinningCard(judge, vote) {
		if (!this.canChooseWinningCard()) {
			return null;
		}
		console.log(`Judge(${judge.name}) chose winning Card(${vote.card.img})`);
		console.log(`CaptionCard(${judge.captionCard.caption}) goes to Player(${vote.player.name})`);

		let winner = vote.player;

		winner.takePoint(judge.captionCard);
		judge.captionCard = null;

		// Put image cards back into bottom of stack
		for (var i = 0; i < judge.votes.length; i++) {
			let card = judge.votes[i];
			this.image_stack.unshift(card);
		}

		// Clear votes
		judge.clearVotes();
		
		return winner;
	}
}
