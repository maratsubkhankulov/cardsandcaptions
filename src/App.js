import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Game } from './game';
import { fillCardStacks } from './game_room';

import wonka from './img/wonka.jpg';

let game = new Game();
fillCardStacks(game);

class App extends Component {
	showAlert() {
		alert("I'm an alert");
	}
  render() {
    return (
      <div className="App">
				<div className="card" onClick={this.showAlert}>
					<img src={wonka} className="card" alt="logo" />
				</div>
        <header className="App-header">
          <p>
            State: {game.state}
          </p>
          <p>
            Players: {game.players.length}
          </p>
          <p>
            Caption stack: {game.caption_stack.length}
          </p>
          <p>
            Image stack: {game.image_stack.length}
          </p>
          <p>
            Turn number: {game.turn_number}
          </p>
					<p>
						Current judge: {game.currentJudge}
					</p>
        </header>
      </div>
    );
  }
}

export default App;
