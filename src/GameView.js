import React, { Component } from 'react';
import './GameView.css';
import { Game } from './game';
import { fillCardStacks, fillPlayers } from './game_utils';

// Import static images
require.context('../public/img', true);

let game = new Game();

fillCardStacks(game);

//TODO  remove - testing only
fillPlayers(game);
game.playersFillHands();

game.startGame();

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePlayer: null,
		}
	}

	selectImageCard(id) {
		alert(`Image card(${id}) selected`);
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
					return <b onClick={() => this.selectPlayer(p.id, p.name)} key={p.id}> {p.name} </b>;
				}
			});

		let imageCardsContent = "Not an active player";
		if (this.state.activePlayer) {
			const hand = this.state.activePlayer.hand;
			imageCardsContent = hand.map((card) => (
					<div className="card" onClick={() => this.selectImageCard(card.id)}>
						<img src={card.img} key={card.id} className="card" alt={card.id} />
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
					Caption area
					<div className="card">
						This is a caption
					</div>
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
