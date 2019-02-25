import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';
import socketIOClient from 'socket.io-client';

const uuid = require('uuid/v4');

class App extends Component {
	constructor() {
		super()

		if (window.FBInstant && window.FBInstant.player.getId) {
			console.log(window.FBInstant.player.getId);
			this.state = {
				gameState: null,
				playerId: window.FBInstant.player.getId(),
				playerName: window.FBInstant.player.getName(),
				activeGamesStates: {},
			}
		} else {
			let id = uuid();
			this.state = {
				gameState: null,
				playerId: id,
				playerName: `User_${id.substring(0,1)}`,
				activeGamesStates: {},
			}
		}

		let app = this;
		//let host = "https://like-llama.glitch.me";
		let host = "http://localhost:4000";
		this.socket = socketIOClient(host, function() { console.log(`Connected to ${host}`)});
		//TODO refactor into socket client interface
		this.socket.on('game-created', function(data) {
			console.log(`server: game-created with id ${data.gameState.id}`);
			app.createdGame(data);
		});

		this.socket.on('joined-game', function(data) {
			console.log(`server: joined-game with id ${data.gameState.id}`);
			app.joinedGame(data);
		});

		this.socket.on('active-games', function(data) {
			app.setState(
				(state, props) => {
					return { activeGamesStates: data.games }
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
			playerName: this.state.playerName,
		});
	}

	joinGame(gameId) {
		this.socket.emit('join-game', {
			gameId: gameId,
			playerId: this.state.playerId,
			playerName: this.state.playerName,
		});
	}

	joinedGame(data) {
		if (data.gameState) {
			this.setState(
				(state, props) => {
					return {
						gameState: data.gameState,
					};
				},
				() => {
					console.log(`gameState updated`);
				});
		}
	}

	createdGame(data) {
		if (data.gameState) {
			this.setState(
				(state, props) => {
					return {
						gameState: data.game,
					};
				},
				() => {
					console.log(`gameId updated`);
				});
		}
	}

  render() {
		let gameView;
		if (this.state.gameState) {
			gameView = (
					<GameView
						socket={this.socket}
						gameState={this.state.gameState}
						playerId={this.state.playerId}
					/>
			)
		}

		let gamesListView = Object.keys(this.state.activeGamesStates).map((key, index) => {
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
