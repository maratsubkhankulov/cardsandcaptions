export class Vote {
	constructor(player, card) {
		this.player = player;
		this.card = card;
	}
}

export class Player {
	static maxHandSize() { return 4; } // image cards are held by player
	constructor(id, name, imgUrl) {
		this.id = id;
		this.name = name;
		this.imgUrl = imgUrl;
		this.hand = []; // Cards in hand
		this.captionCard = null; // Current caption
		this.points = []; // Caption hands won
		this.votes = []; // Holds cards when this player is judge
	}

	static fromObject(object) {
		let p = new Player();

		p.id = object.id;
		p.name = object.name;
		p.imgUrl = object.imgUrl;

		p.hand = [];
		for (var i = 0; i < object.hand.length; i++) {
			p.hand.push(Object.assign(new ImageCard, object.hand[i]));
		}
		p.captionCard = Object.assign(new CaptionCard, object.captionCard);

		p.points = [];
		for (var i = 0; i < object.points.length; i++) {
			p.points.push(Object.assign(new CaptionCard, object.points[i]));
		}

		p.votes = [];
		for (var i = 0; i < object.votes.length; i++) {
			p.votes.push(Object.assign(new Vote, object.votes[i]));
		}
		return p;
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
		for (let i = 0; i < this.votes.length; i++) {
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
	REINIT: 5,
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
transitions[StateEnum.END_OF_GAME][ActionEnum.REINIT] = StateEnum.WAIT_TO_START;

export class Game {
	static maxScore() { return 5; }
	static maxPlayers() { return 5; }
	static minPlayers() { return 3; }

	constructor(id) {
		this.id = id;
		this.state = StateEnum.WAIT_TO_START;
		this.players = []; // Cards in hand
		this.caption_stack = []; // Stack of caption cards
		this.image_stack = []; // Stack of image cards
		this.turn_number = 0;
		this.currentJudge = -1;
		this.lastWin = null; // stores the most recent winning player and image card
	}

	sync(other) {
		this.state = other.state;
		this.players = [];
		console.log(`Player # ${this.players.length}`);
		for (let i = 0; i < other.players.length; i++) {
			this.players.push(Player.fromObject(other.players[i]));
		}

		this.caption_stack = [];
		for (let i = 0; i < other.caption_stack.length; i++) {
			this.image_stack.push(Object.assign(new ImageCard, other.caption_stack[i]));
		}
		
		this.image_stack = [];
		for (let i = 0; i < other.image_stack.length; i++) {
			this.image_stack.push(Object.assign(new ImageCard, other.image_stack[i]));
		}

		this.turn_number = other.turn_number;
		this.currentJudge = other.currentJudge;

		if (other.lastWin) {
			this.lastWin = {
				player: Player.fromObject(other.lastWin.player),
				card: Object.assign(new ImageCard, other.lastWin.card),
			}
		}
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

	getLastWin() {
		return this.lastWin;
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

	removePlayer(id) {
		for (var i = 0; i < this.players.length; i++) {
			let p = this.players[i];
			if (p.id === id) {
				this.players.splice(i, 1);
				return;
			}
		}
		throw `Asking to remove non-existent Player(${id})`;
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
	}

	endGame() {
		this.changeState(ActionEnum.END_GAME);
	}

	reinit() {
		this.changeState(ActionEnum.REINIT);
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

		this.lastWin = {
			player: vote.player,
			card: vote.card,
		}

		winner.takePoint(judge.captionCard);
		const votes = judge.votes;

		// Put image cards back into bottom of stack
		for (var i = 0; i < votes.length; i++) {
			let card = votes[i].card;
			this.image_stack.unshift(card);
		}

		judge.clearVotes();

		return winner;
	}

	// Casts automatic vote for players that haven't voted
	// Has no effect if everyone has voted
	autovote() {
		if (this.state === StateEnum.WAIT_FOR_VOTERS) {
			const judge = this.getCurrentJudge();
			let voters = judge.votes.map(function(vote) {
				return vote.player.id;
			});

			for (var i = 0; i < this.players.length; i++) {
				let player = this.players[i];
				if (player.id !== judge.id && !voters.includes(player.id))  {
					// Cast autovote
					const firstCard = player.hand[0]
					this._selectImageCard(player.id, firstCard.id);
				}
			}
		} if (this.state === StateEnum.WAIT_FOR_VOTERS) {
			const judge = this.getCurrentJudge();
			const firstVote = judge.votes[0];
			this._selectWinningCard(judge.id, firstVote.player.id, firstVote.card.id);
		}
	}

	// Convenience methods
	_selectImageCard(playerId, cardId) {
		let player = this.getPlayer(playerId);
		if (player === null) {
			console.error(`Player ${playerId} is null`);
		}
		if (!this.canPlayerVote(player)) {
			console.error(`Player ${playerId} cannot vote`);
			return;
		}
		this.voteImageCard(player, cardId);
	}

	_selectWinningCard(playerId, voterId, cardId) {
		let judge = this.getCurrentJudge();
		if (judge.id !== playerId) {
			console.error("Only the judge can select the winner");
			return;
		}
		let vote = judge.getVote(voterId, cardId);

		if (vote === null) {
			console.error('Vote is null');
		}

		// TODO probably shift this to client
		if (!this.canChooseWinningCard()) {
			console.error("Cannot choose winning card right now");
			return;
		}
		this.chooseWinningCard(this.getCurrentJudge(), vote);

		this.endTurn();
		return vote;
	}

	_nextTurn() {
		let judge = this.getCurrentJudge();
		judge.captionCard = null;
		
		this.startGame();
		this.playersFillHands();

		let newJudge = this.getCurrentJudge();
		this.collectCaptionCard(newJudge);
		this.revealCaptionCard(newJudge);
	}
}

