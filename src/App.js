import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GameView from './GameView';

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
