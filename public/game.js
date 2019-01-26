let player_counter = 0; 
export class Player {
	static maxHandSize() { return 4; } // image cards are held by player
	constructor(name) {
		this.id = player_counter++;
		this.name = name;
		this.hand = new Array(); // Cards in hand
		this.captionCard = null; // Current caption
		this.points = new Array(); // Caption hands won
	}

	takeCaptionCard(card) {
			console.assert(this.captionCar == null);
			this.captionCard = card;
	}

	takeImageCard(card) {
			console.assert(this.hand.length == Player.maxHandSize() - 1);
			this.hand.push(card);
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

var StateEnum = {
	WAIT_TO_START: 0, // A
	WAIT_FOR_JUDGE: 1, // B
	WAIT_FOR_VOTES: 2, // C
	WAIT_FOR_JUDGMENT: 3, // D
	END_OF_TURN: 4, // E
	END_OF_GAME: 5, // F
}

function EnumToStr(Enum, value) {
    for (prop in Enum) {
      if (Enum[prop] == value) {
        return prop;
      }
    }
}

function StateToString(value) {
	return EnumToStr(StateEnum, value);
}

const INVALID_STATE = -1;
const num_states = Object.keys(StateEnum).length;

var ActionEnum = {
	START: 0,
	ELECT_JUDGE: 1,
	COLLECT_VOTES: 2,
	JUDGE: 3,
	END_GAME: 4,
}

function ActionToString(value) {
	return EnumToStr(ActionEnum, value);
}

const num_actions = Object.keys(ActionEnum).length;

var transitions = new Array(num_states).fill(INVALID_STATE).map(() => new Array(num_states).fill(INVALID_STATE));
transitions[StateEnum.WAIT_TO_START][ActionEnum.START] = StateEnum.WAIT_FOR_JUDGE;
transitions[StateEnum.WAIT_FOR_JUDGE][ActionEnum.ELECT_JUDGE] = StateEnum.WAIT_FOR_VOTES;
transitions[StateEnum.WAIT_FOR_VOTES][ActionEnum.COLLECT_VOTES] = StateEnum.WAIT_FOR_JUDGMENT;
transitions[StateEnum.WAIT_FOR_JUDGMENT][ActionEnum.JUDGE] = StateEnum.END_OF_TURN;
transitions[StateEnum.END_OF_TURN][ActionEnum.END_GAME] = StateEnum.END_OF_GAME;
transitions[StateEnum.END_OF_TURN][ActionEnum.START] = StateEnum.WAIT_FOR_JUDGE;
transitions[StateEnum.END_OF_GAME][ActionEnum.START] = StateEnum.WAIT_FOR_VOTES;

export class Game {
	static maxTurns() { return (Game.maxPlayers() - 1) * Game.maxScore() + 1; }
	static maxScore() { return 5; }
	static maxPlayers() { return 5; }

	constructor() {
		this.state = StateEnum.WAIT_TO_START;
		this.players = new Array(); // Cards in hand
		this.caption_stack = new Array(); // Stack of caption cards
		this.image_stack = new Array(); // Stack of image cards
		this.turn_number = 0;
		this.currentJudge = -1;
	}

	getCurrentJudge() {
		console.assert(this.currentJudge >= 0 && this.currentJudge < this.players.length, `Invalid current judge index ${this.currentJudge}`);
		console.log(`Players ${this.players.length}`);
		return this.players[this.currentJudge];
	}

	// Game room actions
	addPlayer(player) {
		this.players.push(player);
	}

  // System actions
	changeState(action) {
		if (action == undefined) {
			throw "Attempting to change state with undefined action"
		}

		const new_state = transitions[this.state][action];
		if (new_state == INVALID_STATE) {
			throw `Invalid state transition: state(${StateToString(this.state)}) action(${ActionToString(action)})`;
		}
		console.log(`Transitioned state ${StateToString(this.state)} by action ${ActionToString(action)}. New state: ${StateToString(new_state)}`);
		this.state = new_state;
	}

	addCaptionCard(card) {
		this.caption_stack.push(card);
	}

	addImageCard(card) {
		this.image_stack.push(card);
	}
	startGame() {
		console.assert(this.caption_stack.length > 0, "Caption stack is empty at the start of the game");
		console.assert(this.image_stack.length > 0, "Image stack is empty at the start of the game");
		this.turn_number = 1;

		// Elect first judge
		console.assert(this.players.length > 0, "Can't start game with no players");
		this.currentJudge = 0;
	}
	collectVotes() { }
	decideWinner() { }
	startNextTurn() {
		if (this.turn_number < Game.maxTurns()) {
			this.turn_number += 1;
		}
	}

	// Player actions onto the game
	collectCaptionCard(player) {
		console.assert(this.state === StateEnum.WAIT_FOR_JUDGE)
		let card = this.caption_stack.pop();
		player.takeCaptionCard(card);
	}

	playCard(voter, card) {
		console.log(`Voter(${voter.name}) played Card(${card.id})`);
	}
	chooseWinningCard(judge, card) {
		console.log(`Judge(${judge.name}) chose winning Card(${card.id})`);
		console.log(`Winning card goes to... {}`);
	}
}
