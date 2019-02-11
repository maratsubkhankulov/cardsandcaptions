import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';
import socketIOClient from 'socket.io-client'

class App extends Component {
	constructor() {
		super()

	}

  render() {
    return (
      <div className="App">
				<GameView
					socket={socketIOClient("http://localhost:4000")}
				/>
			</div>
		)
  }
}

export default App;
