import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';
import socketIOClient from 'socket.io-client'

class App extends Component {
	constructor() {
		super()

	}

  render() {
		let host = "https://like-llama.glitch.me";
    return (
      <div className="App">
				<GameView
					socket={socketIOClient(host, function() { console.log(`Connected to ${host}`)})}
				/>
			</div>
		)
  }
}

export default App;
