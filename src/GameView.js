import React, { Component } from 'react';
import './GameView.css';
import { Game, Vote } from './game';
import { fillCardStacks, fillPlayers } from './game_utils';

// Import static images
require.context('../public/img', true);

class GameView extends Component {
	constructor(props) {
		super(props);

		this.initGame();

		this.state = {
			activePlayer: null,
			players: [],
			caption: null,
			hand: [],
			table: [],
			votes: [],
		}
	}

	initGame() {
		this.game = new Game();

		fillCardStacks(this.game);

		fillPlayers(this.game);
		this.game.playersFillHands();
		this.game.startGame();

		let judge = this.game.getCurrentJudge();
		this.game.collectCaptionCard(judge);
		this.game.revealCaptionCard(judge);
		this.selectPlayer(this.game.players[0].id);
	}

	selectImageCard(id) {
		if (!this.state.activePlayer) {
			throw "No active player, can't select card."
		}
		this.game.voteImageCard(this.state.activePlayer, id);
		this.setState(
			(state, props) => {
				let newVotes = this.state.votes.concat(new Vote(this.state.activePlayer, id));
				return { votes: newVotes };
			},
			() => {
				console.log(`Vote occurred.`);
			});
	}

	selectWinningCard(vote) {
		console.log("selectWinningCard()");
		let winningPlayer = this.game.chooseWinningCard(this.game.getCurrentJudge(), vote);
		if (winningPlayer.points.length >= Game.maxScore()) {
			alert(`Winner: ${winningPlayer.name}!`);
			this.initGame();
			return;
		}

		this.game.endTurn();

		this.game.startGame();
		this.game.playersFillHands();

		let judge = this.game.getCurrentJudge();
		this.game.collectCaptionCard(judge);
		this.game.revealCaptionCard(judge);


		this.setState(
			(state, props) => {
				return { winningPlayer: winningPlayer }
			},
			() => {
				console.log(`State: ${this.game.getState()}`);
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
		const players = this.game.players;
		const playerItems = players.map((p) => {
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
