import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';


class App extends Component {
  render() {
    return (
      <div className="App">
				<GameView />
			</div>
		)
  }
}

export default App;
