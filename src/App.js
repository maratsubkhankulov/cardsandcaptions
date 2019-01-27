import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Game } from './game';
import { fillCardStacks } from './game_room';

let game = new Game();
fillCardStacks(game);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
