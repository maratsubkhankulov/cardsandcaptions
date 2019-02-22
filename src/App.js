import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';
import socketIOClient from 'socket.io-client';

const uuid = require('uuid/v4');

class App extends Component {
	constructor() {
		super()

		this.state = {
			gameId: null,
			playerId: uuid(),
			activeGames: {},
		}

		let app = this;
		//let host = "https://like-llama.glitch.me";
		let host = "http://localhost:4000";
		this.socket = socketIOClient(host, function() { console.log(`Connected to ${host}`)});
		//TODO refactor into socket client interface
		this.socket.on('game-created', function(data) {
			console.log(`server: game-created with id ${data.gameId}`);
			app.createdGame(data);
		});

		this.socket.on('joined-game', function(data) {
			app.joinedGame(data);
		});

		this.socket.on('active-games', function(data) {
			app.setState(
				(state, props) => {
					return { activeGames: data.games }
				},
				() => {
					console.log(`fetched active games`);
				});
		});

		this.socket.emit('get-active-games');

	}

	createGame() {
		this.socket.emit('create-game', {
			playerId: this.state.playerId,
		});
	}

	joinGame(gameId) {
		this.socket.emit('join-game', {
			gameId: gameId,
			playerId: this.state.playerId,
		});
	}

	joinedGame(data) {
		if (data.gameId) {
			this.setState(
				(state, props) => {
					return {
						gameId: data.gameId,
						players: data.gameInfo.players,
					};
				},
				() => {
					console.log(`gameId updated`);
				});
		}
	}

	createdGame(data) {
		if (data.gameId) {
			this.setState(
				(state, props) => {
					return {
						gameId: data.gameId,
						players: {},
					};
				},
				() => {
					console.log(`gameId updated`);
				});
		}
	}

  render() {
		let gameView;
		if (this.state.gameId) {
			gameView = (
					<GameView
						socket={this.socket}
						gameId={this.state.gameId}
						players={this.state.players}
					/>
			)
		}

		let gamesListView = Object.keys(this.state.activeGames).map((key, index) => {
			let gameId = key;
			return <div key={gameId} onClick={() => this.joinGame(gameId)}> {gameId} </div>
		});

    return (
      <div className="App">
				<div onClick={() => this.createGame()}>Create game</div>
				{gamesListView}
				{gameView}
			</div>
		)
  }
}

export default App;
