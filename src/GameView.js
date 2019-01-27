import React, { Component } from 'react';
import './App.css';
import { Game } from './game';
import { fillCardStacks } from './game_room';

import wonka from './img/wonka.jpg';

let game = new Game();
fillCardStacks(game);

class GameView extends Component {
	showAlert() {
		alert("I'm an alert");
	}
  render() {
    return (
      <div className="App">
				<div className="card" onClick={this.showAlert}>
					<img src={wonka} className="card" alt="logo" />
				</div>
            State: {game.getState()} # Players: {game.players.length} Caption stack: {game.caption_stack.length} Image stack: {game.image_stack.length} Turn number: {game.turn_number} Current judge: {game.currentJudge}
        <header className="App-header">
        </header>
      </div>
    );
  }
}

export default GameView;
