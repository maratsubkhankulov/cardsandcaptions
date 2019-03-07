import React, { Component } from 'react';
import './GameView.css';
import { Game, Vote, Player } from './game';
import { initGame, fillCardStacks, fillPlayers } from './game_utils';
import AvatarView from './AvatarView.js';

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playerId: props.playerId,
			votes: [],
			players: [],
			activePlayerId: null,
			winner: null,
		}
		this.socket = props.socket;
		this.game = new Game();
		this.game.sync(props.gameState);
	}

	componentDidMount() {
		const view = this;

		this.setState(
			(state, props) => {
				return { players: view.game.players};
			},
			() => {
				console.log('Updated player list');
			});

		this.socket.on('joined-game', (data) => {
			console.log(`Player ${data.playerId} joined`);
			this.game.sync(data.gameState);
			let view = this;
			this.setState(
				(state, props) => {
					return { players: view.game.players};
				},
				() => {
					console.log('Updated player list');
				});
		});

		this.socket.on('left-game', (data) => {
			console.log(`Player ${data.playerId} joined`);
			this.game.removePlayer(data.playerId);
			this.setState(
				(state, props) => {
					return { players: view.game.players };
				},
				() => {
					console.log('Updated player list');
				});
		});

		this.socket.on('winner', (data) => {
			console.log(`Player ${data.player.name} won`);
			this.setState(
				(state, props) => {
					return {
						winner: {
							name: data.player.name,
							card: data.card,
					  }
					};
				},
				() => {
					console.log('Updated player list');
				});
		});

		this.socket.on('sync', function(game) {
			console.log(`Sync game`);
			view.game.sync(game);
			view.sync();
		});

		this.socket.on('init-game', function(game) {
			console.log('init-game');
		  console.log(`Game state: ${JSON.stringify(game)}`);
			view.game.sync(game);
			view.initGame();
		});

		fillCardStacks(this.game);
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

	initGame() {
		let view = this;
		this.setState(
			(state, props) => {
				return { players: this.game.players };
			},
			() => {
				console.log(`Updated players.`);
				view.selectPlayer(this.state.playerId);
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
		this.sendSelectImageCard(this.state.activePlayerId, id);
		if (!this.state.activePlayerId) {
			throw "No active player, can't select card."
		}
	}

	selectWinningCard(vote) {
		this.sendSelectWinningCard(
			this.state.activePlayerId,
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

	isJudgePlayer(id) {
		if (this.game.existsJudge()) {
		 	return this.game.getCurrentJudge().id === id;
		}
		return false;
	}

  render() {
		console.log("Render GameView");
		const playerItems = this.state.players.map((p) => {
				let isActive = this.isActivePlayer(p.id);
				let isJudge = this.isJudgePlayer(p.id);
				let className = `${isActive ? "PlayerSelected":""} ${isJudge ? "JudgeSelected":""}`;
				let onClick=isActive ? null : () => this.selectPlayer(p.id, p.name)
					return (
						<AvatarView
							key={p.id}
							id={p.id}
							name={p.name}
							points={p.points.length}
							selected={false}
							imgUrl='https://source.unsplash.com/random/50x50'
						/>
					)
			});

		let imageCardsContent = "Not an active player";
		if (this.state.activePlayerId) {
			let player = this.game.getPlayer(this.state.activePlayerId);
			const hand = player.hand;
			imageCardsContent = hand.map((card) => (
					<div key={card.id} className="card" onClick={() => this.selectImageCard(card.id)}>
						<img src={card.img} className="card" alt={card.id} />
					</div>
				)
			);
		}

		let tableContent = "Empty table";
		if (this.game.existsJudge()) {
			const judge = this.game.getCurrentJudge();
			tableContent = judge.votes.map((vote) => (
					<div key={vote.card.id} className="card" onClick={() => this.selectWinningCard(vote)}>
						<img src={vote.card.img} className="card" alt={vote.card.id} />
					</div>
				)
			);
		}

		let winnerView;
		if (this.state.winner) {
			winnerView = (
				<div>
					<h3>
						{this.state.winner.name} wins!
					</h3>
				</div>
			)
		}

		console.log(`Judge exists: ${this.game.existsJudge()}`);
		console.log(`Judges caption card: ${this.game.existsJudge() ? this.game.getCurrentJudge().captionCard : null}`);
    return (
      <div className="Game">
				<div className="Header">
					<div className="Timer">:07</div>
				</div>
				<div className="PlayerPanel">
					{playerItems}
				</div>
				<div className="CaptionArea">
					<div className="card">
						{ this.game.existsJudge() && this.game.getCurrentJudge().captionCard ? this.game.getCurrentJudge().captionCard.caption : "no caption"}
					</div>
				</div>
				<div className="Table">
						{tableContent}
				</div>
				<div className="Hand">
						{imageCardsContent}
				</div>
				{winnerView}
				<div className="Footer">
					<h3>Debug:</h3>
					<p>
						State: {this.game.getState()}
					</p>
					# Players: {this.game.players.length} Caption stack: {this.game.caption_stack.length} Image stack: {this.game.image_stack.length} Turn number: {this.game.turn_number} Current judge: {this.game.currentJudge}
				</div>
      </div>
    );
  }
}

export default GameView;
