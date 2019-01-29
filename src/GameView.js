import React, { Component } from 'react';
import './GameView.css';
import { Game, Vote } from './game';
import { fillCardStacks, fillPlayers } from './game_utils';

// Import static images
require.context('../public/img', true);

let game = new Game();

fillCardStacks(game);

//TODO  remove - testing only
fillPlayers(game);
game.playersFillHands();
game.startGame();

let judge = game.getCurrentJudge();
game.collectCaptionCard(judge);
game.revealCaptionCard(judge);

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePlayer: null,
			players: [],
			caption: null,
			hand: [],
			table: [],
			votes: [],
		}
	}

	selectImageCard(id) {
		if (!this.state.activePlayer) {
			throw "No active player, can't select card."
		}
		game.voteImageCard(this.state.activePlayer, id);
		this.setState(
			(state, props) => {
				let newVotes = this.state.votes.concat(new Vote(this.state.activePlayer, id));
				return { votes: newVotes };
			},
			() => {
				console.log(`State: winningPlayer`);
			});
	}

	selectWinningCard(vote) {
		// TODO remove alert(`Select Card(${vote.card.id}) by Player(${vote.player.name})`)
		this.setState(
			(state, props) => {
				return { winningPlayer: vote.player }
			},
			() => {
				console.log(`State: winningPlayer`);
			});
	}

	selectPlayer(id, name) {
		this.setState(
			(state, props) => {
				return {activePlayer: game.getPlayer(id)};
			},
			() => {
				console.log(`Selected player ${this.state.activePlayer.name}`);
			});
	}

	isActivePlayer(id) {
		return this.state.activePlayer && this.state.activePlayer.id === id
	}

  render() {
		console.log("Render GameView");
		const players = game.players;
		const playerItems = players.map((p) => {
				if (this.isActivePlayer(p.id)) {
					return <b className="PlayerSelected" key={p.id}> {p.name} </b>;
				} else {
					return <b onClick={() => this.selectPlayer(p.id, p.name)} key={p.id}> {p.name}({p.id}) </b>;
				}
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
		if (game.existsJudge()) {
			const judge = game.getCurrentJudge();
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
						{game.existsJudge() ? game.getCurrentJudge().captionCard.caption : "no caption"}
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
						State: {game.getState()}
					</p>
					# Players: {game.players.length} Caption stack: {game.caption_stack.length} Image stack: {game.image_stack.length} Turn number: {game.turn_number} Current judge: {game.currentJudge}
				</div>
      </div>
    );
  }
}

export default GameView;
