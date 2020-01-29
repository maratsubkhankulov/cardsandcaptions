import React, { Component } from 'react';
import './App.css';
import './common.css';
import GameView from './GameView.js';
import MenuView from './MenuView.js';
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

		this.onMenuClick = this.onMenuClick.bind(this);
		this.onGameClick = this.onGameClick.bind(this);

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
			} else {
				app.createGame();
				return;
			}
		});

		this.fetchGameByContextId(this.state.contextId);
	}

	// Create game if it does not exist
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

	onGameClick(buttonName) {
		let app = this;
		if (buttonName === 'back') {
			this.setState(
				(state, props) => {
					return {
						showMenu: true
					}
				},
				() => {
					console.log('showMenu: ' + app.state.showMenu);
				}
			);
		}
	}

	onMenuClick(buttonName) {
		let app = this;
		if (buttonName === 'play_here') {
			this.setState(
				(state, props) => {
					return {
						showMenu: false
					}
				},
				() => {
					console.log('showMenu: ' + app.state.showMenu);
				}
			);
		}
	}

  render() {
		if (this.state.connected === false) {
			return (
				<div>Waiting for connection...</div>
			)
		}

		let activeView;
		console.log("Render: " + this.state.showMenu);
		if (this.state.showMenu) {
			activeView = (
				<MenuView
					onClickListener={this.onMenuClick}
				/>
			);
		} else if (this.state.gameState) {
				activeView = (
						<GameView
							onClickListener={this.onGameClick}
							socket={this.socket}
							gameState={this.state.gameState}
							playerId={this.state.playerId}
						/>
				)
		}

    return (
      <div className="App">
				{activeView}
			</div>
		)
  }
}

export default App;
