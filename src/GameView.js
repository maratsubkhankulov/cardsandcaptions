import React, { Component } from 'react';
import './GameView.css';
import './common.css';
import { Game, Vote, Player } from './game';
import { initGame, fillCardStacks, fillPlayers } from './game_utils';
import CardView from './CardView.js';
import PlayerPanelView from './PlayerPanelView.js';
import HandView from './HandView.js';
import TableView from './TableView.js';
import LeaderboardView from './leaderboard/LeaderboardView.js';
import NavBarView from './navbar/NavBarView.js';

function stateToBanner(gameState, iAmJudge, playerId, game) {
	let judge = game.getCurrentJudge();
	let hasPlayerVoted = false;
	if (typeof judge !== 'undefined') {
		let player = game.getPlayer(playerId);
		hasPlayerVoted = judge.hasPlayerVoted(player);
	}
	switch (gameState) {
		case 'WAIT_TO_START':
			return 'Waiting for players to join...';
			break;
		case 'WAIT_FOR_JUDGE':
			return 'Waiting for judge to be selected';
			break;
		case 'WAIT_FOR_VOTERS':
			if (iAmJudge) {
				return 'Waiting for players to select cards';
			} else {
				if (hasPlayerVoted) {
					return 'Waiting for others to select cards';
				}
				return 'Choose a card to match the caption';
			}
			break;
		case 'WAIT_FOR_JUDGMENT':
			if (iAmJudge) {
				return 'Select a winning card!';
			} else {
				return `Waiting for ${judge.name} to select a winner`;
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
			leaderboard: null,
		}
		this.onClickListener = props.onClickListener;
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

		this.socket.on('tick', function(time) {
			view.setState(
				(state, props) => {
					return {
						timer: time,
					};
				},
				() => {
				});
		});

		this.socket.on('init-game', function(game) {
			console.log('init-game');
		  console.log(`Game state: ${JSON.stringify(game)}`);
			view.game.sync(game);
			view.onGameSynced(view.game);
		});
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

		let newBannerMessage = stateToBanner(game.getState(), iAmJudge, this.state.playerId, game);

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
						if (vote) {
							console.log(`Vote ${vote.card}`);
							newHand.push(
								{
									id: vote.card.id,
									selected: true,
									imgUrl: vote.card.img,
									onClick: (id) => view.selectImageCard(id),
								}
							);
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
		let leaderboard = null;
		if (state == 'END_OF_GAME') {
			leaderboard = players.map((p) => {
				return {
					id: p.id,
					name: p.name,
					points: p.points.length,
					selected: false,
					imgUrl: p.imgUrl,
				}
			});
		} else {
			leaderboard = null;
		}

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
					leaderboard: leaderboard,
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
			//console.log(`is judge: ${game.getCurrentJudge().id}, ${id}, ${game.getCurrentJudge().id === id}`); 
		 	return game.getCurrentJudge().id === id;
		}
		return false;
	}

  render() {
		let startButton;
		if (this.game.getState() === 'WAIT_TO_START' &&
			this.game.players.length >= Game.minPlayers()) {
			startButton = (
				<div className='Button' onClick={this.sendStart}>
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
		if ((this.game.getState() === 'WAIT_FOR_JUDGMENT' ||
				this.game.getState() === 'WAIT_FOR_VOTERS') &&
				this.state.table.length > 0) {
				table = (
					<TableView
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

		let timer;
		if (this.state.timer > 0) {
			timer = (
				<div className="Timer">
					{this.state.timer}
				</div>
			);
		}

		if (this.state.leaderboard) {
			return (
				<LeaderboardView
					players={this.state.leaderboard}	
				/>
			);
		} else {
			return (
				<div className="Game">
					<NavBarView
						onClickListener={this.onClickListener}
					/>
					<PlayerPanelView
						players={this.state.players}
					/>
					<div className="Banner">
						<div>
						{this.state.bannerMessage}
						</div>
						{timer}
					</div>
					<div className="CaptionArea">
						{startButton}
						{this.state.caption}
					</div>
					{winningCard}
					{table}
					{hand}
				</div>
			);
		}
  }
}

export default GameView;
