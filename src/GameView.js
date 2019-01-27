import React, { Component } from 'react';
import './GameView.css';
import { Game } from './game';
import { fillCardStacks, fillPlayers } from './game_utils';

import wonka from './img/wonka.jpg';

let game = new Game();

fillCardStacks(game);

//TODO  remove - testing only
fillPlayers(game);

game.startGame();

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePlayer: null,
		}
	}

	selectImageCard() {
		alert("Image card selected");
	}

	selectPlayer(id, name) {
		console.log(`Select player ${name}`);
		this.state.activePlayer = game.getPlayer(id);
	}

  render() {
		const players = game.players;
		const playerItems = players.map((p) => <b onClick={() => this.selectPlayer(p.id, p.name)} key={p.id}> {p.name} </b>);
    return (
      <div className="Game">
				<div className="PlayerPanel">
					{playerItems}
				</div>
				<div className="Caption">
					<div className="card">
						This is a caption
					</div>
				</div>
				<div className="SelectCard">
					<div className="card" onClick={this.selectImageCard}>
						<img src={wonka} className="card" alt="logo" />
					</div>
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
