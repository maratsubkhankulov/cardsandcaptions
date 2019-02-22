import React, { Component } from 'react';
import './GameView.css';
import { Game, Vote, Player } from './game';
import { fillCardStacks, fillPlayers } from './game_utils';

// Import static images
require.context('../public/img', true);

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			votes: [],
			players: [],
		}
		this.socket = props.socket;
		this.game = new Game();

		for (var playerId in props.players) {
			let p = new Player(playerId, playerId.substr(0, 4));
			this.game.addPlayer(p);
		}
	}

	componentDidMount() {
		const gameView = this;

		let view = this;
		this.setState(
			(state, props) => {
				return { players: view.game.players};
			},
			() => {
				console.log('Updated player list');
			});

		this.socket.on('joined-game', (data) => {
			console.log(`Player ${data.playerId} joined`);
			let p = new Player(data.playerId, data.playerId.substr(0, 4));
			this.game.addPlayer(p);
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
		
		this.socket.on('move', function(move) {
			console.log(`Remote player move: ${move.type}`);
			if (move.type === 'selectImageCard') {
				gameView._selectImageCard(move.playerId, move.cardId);
			} else
			if (move.type === 'selectWinningCard') {
				gameView._selectWinningCard(move.playerId, move.voterId, move.cardId);
			}
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
		fillCardStacks(this.game);

		this.game.playersFillHands();
		this.game.startGame();

		let judge = this.game.getCurrentJudge();
		this.game.collectCaptionCard(judge);
		this.game.revealCaptionCard(judge);
		this.selectPlayer(this.game.players[0].id);
		this.setState();
	}

	selectImageCard(id) {
		this.sendSelectImageCard(this.state.activePlayer.id, id);
		if (!this.state.activePlayer) {
			throw "No active player, can't select card."
		}
		this._selectImageCard(this.state.activePlayer.id, id);
	}

	_selectImageCard(playerId, cardId) {
		let player = this.game.getPlayer(playerId);
		if (player === null) {
			console.error(`Player ${playerId} is null`);
		}
		if (!this.game.canPlayerVote(player)) {
			console.error(`Player ${playerId} cannot vote`);
			return;
		}
		this.game.voteImageCard(player, cardId);
		this.setState(
			(state, props) => {
				let newVotes = this.state.votes.concat(new Vote(player, cardId));
				return { votes: newVotes };
			},
			() => {
				console.log(`Vote occurred.`);
			});
	}

	selectWinningCard(vote) {
		let playerId = this.state.activePlayer.id;
		this.sendSelectWinningCard(playerId, vote.player.id, vote.card.id);
		this._selectWinningCard(playerId, vote.player.id, vote.card.id)
	}

	_selectWinningCard(playerId, voterId, cardId) {
		let judge = this.game.getCurrentJudge();
		if (judge.id !== playerId) {
			console.error("Only the judge can select the winner");
			return;
		}
		let vote = judge.getVote(voterId, cardId);

		if (vote === null) {
			console.error('Vote is null');
		}

		if (!this.game.canChooseWinningCard()) {
			console.error("Cannot choose winning card right now");
			return;
		}
		let winningPlayer = this.game.chooseWinningCard(this.game.getCurrentJudge(), vote);
		if (winningPlayer.points.length >= Game.maxScore()) {
			alert(`Winner: ${winningPlayer.name}!`);
			this.initGame();
			return;
		}

		this.game.endTurn();

		this.game.startGame();
		this.game.playersFillHands();

		let newJudge = this.game.getCurrentJudge();
		this.game.collectCaptionCard(newJudge);
		this.game.revealCaptionCard(newJudge);

		this.setState(
			(state, props) => {
				return { winningPlayer: winningPlayer }
			},
			() => {
				console.log(`chooseWinningPlayer updated state: ${this.game.getState()}`);
			});
	}

	selectPlayer(id) {
		this.setState(
			(state, props) => {
				return {activePlayer: this.game.getPlayer(id)};
			},
			() => {
				console.log(`Selected player ${this.state.activePlayer.name}`);
			});
	}

	isActivePlayer(id) {
		return this.state.activePlayer && this.state.activePlayer.id === id
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
						<b
							className={className}
							onClick={onClick}
							key={p.id}
						>
								{p.name}({p.points.length})
						</b>
					)
			});

		let imageCardsContent = "Not an active player";
		if (this.state.activePlayer) {
			const hand = this.state.activePlayer.hand;
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

		console.log(`Judge exists: ${this.game.existsJudge()}`);
		console.log(`Judges caption card: ${this.game.existsJudge() ? this.game.getCurrentJudge().captionCard : null}`);
    return (
      <div className="Game">
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
