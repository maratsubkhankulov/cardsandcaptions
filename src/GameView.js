import React, { Component } from 'react';
import './GameView.css';
import { Game, Vote, Player } from './game';
import { initGame, fillCardStacks, fillPlayers } from './game_utils';
import CardView from './CardView.js';
import PlayerPanelView from './PlayerPanelView.js';
import HandView from './HandView.js';

function stateToBanner(gameState, iAmJudge, game) {
	switch (gameState) {
		case 'WAIT_TO_START':
			return 'Waiting for players to join...';
			break;
		case 'WAIT_FOR_JUDGE':
			return 'Waiting for judge to be selected';
			break;
		case 'WAIT_FOR_VOTERS':
			return 'Waiting for players to select cards';
			break;
		case 'WAIT_FOR_JUDGMENT':
			if (iAmJudge) {
				return 'Select a winning card!';
			} else {
				return 'Waiting for judge to select a winner';
			}
			break;
		case 'END_OF_TURN':
			return `${game.lastWin.player.name} won this round!`;
			break;
		case 'END_OF_GAME':
			return 'End of game';
			break;
	}
}

function defaultHand() {
		let view = this;
		return [
			{
				id: 1,
				selected: false,
				imgUrl: 'img/1.jpg',
				onClick: (id) => view.selectImageCard(id),
			},
			{
				id: 2,
				selected: false,
				imgUrl: 'img/2.jpg',
				onClick: (id) => view.selectImageCard(id),
			},
			{
				id: 3,
				selected: false,
				imgUrl: 'img/5.jpg',
				onClick: (id) => view.selectImageCard(id),
			},
			{
				id: 4,
				selected: false,
				imgUrl: 'img/4.jpg',
				onClick: (id) => view.selectImageCard(id),
			},
		]
}

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playerId: props.playerId,
			votes: [],
			players: [],
			table: [],
			hand: [],
			showCards: false,
			caption: '[empty caption]',
			bannerMessage: '[empty banner]',
			activePlayerId: null,
			lastWin: null,
		}
		this.socket = props.socket;
		this.game = new Game();
		this.game.sync(props.gameState);

		this.sendStart = this.sendStart.bind(this);
	}

	componentDidMount() {
		const view = this;

		this.onGameSynced(this.game);

		this.socket.on('joined-game', (data) => {
			console.log(`Player ${data.playerId} joined`);
			view.game.sync(data.gameState);
			view.onGameSynced(view.game);
		});

		this.socket.on('left-game', (data) => {
			console.log(`Player ${data.playerId} joined`);
			view.game.removePlayer(data.playerId);
			view.onGameSynced(view.game);
		});

		this.socket.on('sync', function(game) {
			console.log(`Sync game`);
			view.game.sync(game);
			view.onGameSynced(view.game);
		});

		this.socket.on('init-game', function(game) {
			console.log('init-game');
		  console.log(`Game state: ${JSON.stringify(game)}`);
			view.game.sync(game);
			view.onGameSynced(view.game);
		});

		fillCardStacks(this.game);
	}

	onGameSynced(game) {
		const view = this;

	  let iAmJudge = view.isJudgePlayer(game, this.state.playerId);
		const state = game.getState();
		const showCards = (iAmJudge && state === 'WAIT_FOR_JUDGMENT') || (!iAmJudge && state !== 'WAIT_TO_START');

		let players = game.players;
		let newPlayers = players.map((p) => {
				let isJudge = view.isJudgePlayer(game, p.id);
				return {
					id: p.id,
					name: p.name,
					points: p.points.length,
					selected: isJudge,
					imgUrl: p.imgUrl,
				}
		});
		let newCaption = game.existsJudge() && game.getCurrentJudge().captionCard ?
			game.getCurrentJudge().captionCard.caption : "no caption";

		let newBannerMessage = stateToBanner(game.getState(), iAmJudge, game);

		let newHand = defaultHand();
		let newTable = [];

		if (!iAmJudge) {
			newHand = [];
			const hand = game.getPlayer(this.state.playerId).hand;
			if (hand.length > 0) {
				newHand = hand.map((card) => {
					return {
						id: card.id,
						selected: false,
						imgUrl: card.img,
						onClick: (id) => view.selectImageCard(id),
					}
				});
			}
			if (state === 'WAIT_FOR_VOTERS' || state === 'WAIT_FOR_JUDGMENT') {
				// If votes hold my vote, just select that card in my hand
				const judge = game.getCurrentJudge();
				const votes = judge.votes;

				let vote;
				for (var i = 0; i < votes.length; i++) {
					vote = votes[i];
					if (vote.player.id === view.state.playerId) {
						break;
					}
				}

				if (vote) {
					newHand = view.state.hand.slice();
					// Find and select card
					for (var i = 0; i < newHand.length; i++) {
						if (newHand[i].id === vote.card.id) {
							newHand[i].selected = true;
							break;
						}
					}
				}

			}
		}

		// Show cards on the table
		if (state === 'WAIT_FOR_VOTERS' || state === 'WAIT_FOR_JUDGMENT') {
			const judge = game.getCurrentJudge();
			const votes = judge.votes;

			newTable = votes.map((vote) => {
				const card = vote.card;
				return {
					id: card.id,
					selected: false,
					imgUrl: card.img,
					onClick: (id) => view.selectWinningCard(vote),
				}
			});
		}

		let newWin = game.getLastWin();

		this.setState(
			(state, props) => {
				return {
					players: newPlayers,
					caption: newCaption,
					bannerMessage: newBannerMessage,
					table: newTable,
					hand: newHand,
					showCards: showCards,
					lastWin: newWin,
				};
			},
			() => {
				console.log('Updated state');
			});
	}

	sendStart() {
		console.log('-> startGame');
		this.socket.emit('start-game', {
			playerId: this.state.playerId,
		});
	}

	sendSelectImageCard(playerId, cardId) {
		console.log('-> sendSelectImagecard');
		this.socket.emit('actuate', {
			type: "selectImageCard",
			playerId: playerId,
			cardId: cardId,
		});
	}

	sendSelectWinningCard(playerId, voterId, cardId) {
		console.log("-> sendSelectWinningCard");
		this.socket.emit('actuate', {
			type: "selectWinningCard",
			playerId: playerId,
			voterId: voterId,
			cardId: cardId,
		});
	}

	sync() {
		this.setState(
			(state, props) => {
				return {
					players: this.game.players,
					votes: this.game.votes,
					//winningPlayer: winningPlayer,
				};
			},
			() => {
				console.log(`Successful game sync.`);
			});
	}

	selectImageCard(id) {
		if (!this.state.playerId) {
			throw "No active player, can't select card."
		}
		this.sendSelectImageCard(this.state.playerId, id);
	}

	selectWinningCard(vote) {
		this.sendSelectWinningCard(
			this.state.playerId,
			vote.player.id,
			vote.card.id);
	}

	selectPlayer(id) {
		this.setState(
			(state, props) => {
				return {activePlayerId: id};
			},
			() => {
				let player = this.game.getPlayer(this.state.activePlayerId);
				console.log(`Selected player ${player.name}`);
			});
	}

	isActivePlayer(id) {
		return this.state.activePlayerId === id
	}

	isJudgePlayer(game, id) {
		if (game.existsJudge()) {
			console.log(`is judge: ${game.getCurrentJudge().id}, ${id}, ${game.getCurrentJudge().id === id}`); 
		 	return game.getCurrentJudge().id === id;
		}
		return false;
	}

  render() {
		let startButton;
		if (this.game.getState() === 'WAIT_TO_START' &&
			this.game.players.length >= Game.minPlayers()) {
			startButton = (
				<div onClick={this.sendStart}>
					Start game
				</div>
			)
		}

		let winningCard;
		console.log(this.game.getState());
		if (this.state.lastWin && this.game.getState() === 'END_OF_TURN') {
			console.log('Render winner');
		  winningCard = (
				<CardView
					selected={false}
					faceUp={true}
					imgUrl={this.state.lastWin.card.img}
				/>
			);
		}

		let table;
		if (this.game.getState() === 'WAIT_FOR_JUDGMENT' ||
				this.game.getState() === 'WAIT_FOR_VOTERS') {
				table = (
					<HandView
						cards={this.state.table}
						faceUp={this.game.getState() === 'WAIT_FOR_JUDGMENT'}
					/>
				);
		}

		let hand;
		if (!this.isJudgePlayer(this.game, this.state.playerId)) {
			hand = (
				<HandView
					cards={this.state.hand}
					faceUp={this.state.showCards}
				/>
			);
		}

		console.log(`Image stack: ${this.game.image_stack.length}`);

    return (
      <div className="Game">
				<div className="Header">
					{startButton}
				</div>
				<PlayerPanelView
					players={this.state.players}
				/>
				<div className="Banner">
					{this.state.bannerMessage}
				</div>
				<div className="CaptionArea">
					{this.state.caption}
				</div>
				{winningCard}
				{table}
				{hand}
      </div>
    );
  }
}

export default GameView;
