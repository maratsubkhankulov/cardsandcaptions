console.log("index.js")

class Player {
	constructor() {
		this.hand = new Array(); // Cards in hand
		this.caption = null; // Current caption
		this.points = new Array(); // Caption hands won
	}
}

class Card {
	constructor(id, caption, img_url) {
		this.id = id; // Universal identifier
		this.caption = caption; // If caption card, contains caption string
		this.img_url = img_url; // If image card, points to img url
	}
}

var StateEnum = {
	WAIT_TO_START: 0, // A
	WAIT_FOR_VOTES: 1, // B
	WAIT_FOR_JUDGMENT: 2, // C
	END_OF_TURN: 3, // D
	END_OF_GAME: 4, // E
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
	COLLECT_VOTES: 1,
	JUDGE: 2,
	END_GAME: 3,
}

function ActionToString(value) {
	return EnumToStr(ActionEnum, value);
}

const num_actions = Object.keys(ActionEnum).length;

var transitions = new Array(num_states).fill(INVALID_STATE).map(() => new Array(num_states).fill(INVALID_STATE));
transitions[StateEnum.WAIT_TO_START][ActionEnum.START] = StateEnum.WAIT_FOR_VOTES;
transitions[StateEnum.WAIT_FOR_VOTES][ActionEnum.COLLECT_VOTES] = StateEnum.WAIT_FOR_JUDGMENT;
transitions[StateEnum.WAIT_FOR_JUDGMENT][ActionEnum.JUDGE] = StateEnum.END_OF_TURN;
transitions[StateEnum.END_OF_TURN][ActionEnum.END_GAME] = StateEnum.END_OF_GAME;
transitions[StateEnum.END_OF_TURN][ActionEnum.START] = StateEnum.WAIT_FOR_VOTES;
transitions[StateEnum.END_OF_GAME][ActionEnum.START] = StateEnum.WAIT_FOR_VOTES;

class Game {
	constructor() {
		this.state = StateEnum.WAIT_TO_START;
		this.players = new Array(); // Cards in hand
		this.caption_stack = new Array(); // Stack of caption cards
		this.image_stack = new Array(); // Stack of image cards
		this.turn_number = 0;
	}

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
}

let game = new Game();

console.log("Created game");
