import React, { Component } from 'react';
import './App.css';
import './common.css';
import GameView from './GameView.js';
import socketIOClient from 'socket.io-client';

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			gameState: null,
			connected: false,
			playerId: props.playerId,
			playerName: props.playerName,
			playerImgUrl: props.playerImgUrl,
			contextId: props.contextId,
			showMenu: true,
		}

		let app = this;
		let host = props.server;
		this.invitePlayers = props.invitePlayers;
		this.chooseAsync = props.chooseAsync;
		this.socket = socketIOClient(host, function() { console.log(`Connected to ${host}`)});

		this.socket.on('connect', () => {
			app.setState(
				(state, props) => {
					return {
						connected: true
					}
				},
				() => {
					console.log('Update state: Connected');
				}
			);
		});

		this.socket.on('disconnect', (reason) => {
			console.log('socket disconnected, reason:' + reason);
			app.setState(
				(state, props) => {
					return {
						connected: false,
						gameState: null,
						activateGameStates: {}
					}
				},
				() => {
					console.log('Update state: Disconnected');
				}
			);
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manually
				socket.connect();
			}
			// else the socket will automatically try to reconnect
		});

		//TODO refactor into socket client interface
		this.socket.on('game-created', function(data) {
			console.log(`server: game-created with id ${data.gameState.id}`);
			app.createdGame(data);
		});

		this.socket.on('joined-game', function(data) {
			console.log(`server: joined-game with id ${data.gameState.id}`);
			app.joinedGame(data);
		});

		this.socket.on('get-game-response', function(data) {
			console.log('get-game-response');
			console.log(data);
			if (data.exists && app.state.contextId === data.gameId) {
				app.joinGame(app.state.contextId);
				return;
			}
			app.setState(
				(state, props) => {
					return { gameState: data.gameState }
				},
				() => {
					console.log(`fetched current game`);
				});
		});

		this.fetchGameByContextId(this.state.contextId);
	}

	fetchGameByContextId(contextId) {
		console.log('Get game by context: ' + contextId);
		this.socket.emit('get-game', {
			gameId: contextId
		});
	}

	createGame() {
		//this.invitePlayers();
		this.socket.emit('create-game', {
			playerId: this.state.playerId,
			playerName: this.state.playerName,
			playerImgUrl: this.state.playerImgUrl,
			contextId: this.state.contextId,
		});
	}

	joinGame(gameId) {
		this.socket.emit('join-game', {
			gameId: gameId,
			playerId: this.state.playerId,
			playerName: this.state.playerName,
			playerImgUrl: this.state.playerImgUrl,
		});
	}

	switchContext(gameId) {
		this.chooseAsync();
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

	toggleMenu() {
		this.setState(
			(state, props) => {
				return {
					showMenu: !state.showMenu
				}
			},
			() => {
				console.log('Show menu: ' + this.state.showMenu);
			});
	}

  render() {
		if (this.state.connected === false) {
			return (
				<div>Waiting for connection...</div>
			)
		}

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

		let menuView;
		if (this.state.showMenu) {
			/** TODO move to server admin console or metrics
			const list = Object.keys(this.state.activeGamesStates).map((key, index) => {
				let gameId = key;
				return <div key={gameId} onClick={() => this.joinGame(gameId)}> {gameId} </div>
			});
			*/
			let createButton;
			// Show create button if no active game state
			if (!this.state.gameState) {
					createButton = <div className='Button' onClick={() => this.createGame()}>Create game</div>
			}

			menuView = (
				<div>
					<h4>{this.state.playerName}</h4>
					<h5>Context id: {this.state.contextId}</h5>
					<div className='Button' onClick={() => this.switchContext()}>Switch game</div>
					{createButton}
				</div>
			);
		}

    return (
      <div className="App">
				<h5 onClick={() => this.toggleMenu()}>Toggle menu</h5>
				{menuView}
				{gameView}
			</div>
		)
  }
}

export default App;
