const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const uuid = require('uuid/v4');
const app = express();
const server = http.Server(app);
const io = socketio(server); // Attach socket.io to our server
import {Game, Player} from '../src/game';
import {initGame, fillCardStacks} from '../src/game_utils';

var port = process.env.PORT || 4000;

app.use(express.static('public')); // Serve our static assets from /public
server.listen(port, () => console.log(`server started ${port}`));

const connections = {};
const games = {};
const clientGameMap = {};
const clientPlayerMap = {};

// Handle a socket connection request from web client
io.on('connection', function (socket) {
  
	console.log('New connection');

  // Find an available client number
  let clientId = uuid();
  
  // Tell the connecting client their id is
  socket.emit('client-id', clientId);
  
  connections[clientId] = socket;
  
  // Tell everyone else what client just connected
  socket.broadcast.emit('client-connect', clientId);

	// Game session events
	socket.on('create-game', function(data) {

		// Create game
		let gameId = data.contextId;
		socket.join(gameId);

		games[gameId] = new Game(gameId);

		// Update mappings
		let playerId = data.playerId;
	  // TODO dedupe with join-game
		let player = new Player(data.playerId, data.playerName, data.playerImgUrl);
		games[gameId].addPlayer(player);

		clientGameMap[clientId] = gameId;
		clientPlayerMap[clientId] = playerId;

		console.log(`Player ${playerId} created game ${gameId}`);

		// Notify
		socket.emit('game-created', { gameState: games[gameId] });
		socket.emit('joined-game', { gameId: gameId, playerId: playerId, gameState: games[gameId]});
		socket.broadcast.emit('active-games', {games: games});
	});

	socket.on('join-game', function(data) {
		let gameId = data.gameId;
		let playerId = data.playerId;

		let player = games[gameId].getPlayer(playerId);
		if (!player) {
			player = new Player(data.playerId, data.playerName, data.playerImgUrl);
			games[gameId].addPlayer(player);
			console.log(`Player ${playerId} joined ${gameId}`)
		} else {
			console.log(`Player ${playerId} rejoined ${gameId}`)
		}
		clientPlayerMap[clientId] = playerId;
		clientGameMap[clientId] = gameId;

		socket.join(gameId);
		socket.emit('joined-game', { gameId: gameId, playerId: playerId, gameState: games[gameId]});
		socket.broadcast.to(gameId).emit('joined-game', { gameId: gameId, playerId: playerId, gameState: games[gameId]});

	});

	socket.on('start-game', function(data) {
		const gameId = data.gameId;
		// Check to start
		const minPlayers = Game.minPlayers();
		if (games[gameId].players.length >= minPlayers) {
			console.log(`Reached minimum number of players ${games[gameId].players.length}`);

			initGame(games[gameId]);
			socket.emit('init-game', games[gameId]);
			socket.broadcast.to(gameId).emit('init-game', games[gameId]);
		}
	});

	socket.on('get-active-games', () => {
		socket.emit('active-games', {games: games});
	});

	// In-game events
	socket.on('actuate', function(move) {
		const gameId = clientGameMap[clientId];
		const game = games[gameId];
		if (move.type === 'selectImageCard') {
			game._selectImageCard(move.playerId, move.cardId);
		} else
		if (move.type === 'selectWinningCard') {
			let winningVote = game._selectWinningCard(move.playerId, move.voterId, move.cardId);
			if (winningVote) {
				socket.emit('winner', winningVote);
				socket.broadcast.to(gameId).emit('winner', winningVote);
			}
		}
		socket.emit('sync', game);
		socket.broadcast.to(gameId).emit('sync', game);
	});

	socket.on('disconnect', function() {
		console.log(`Client ${clientId} disconnected`);
		delete connections[clientId];
		let gameId = clientGameMap[clientId];
		let playerId = clientPlayerMap[clientId];
		console.log(`${gameId} ${playerId}`);
		if (gameId && playerId) {
			console.log(`Left game ${playerId}`);
			socket.broadcast.to(gameId).emit('left-game', { gameId: gameId, playerId: playerId });
			games[gameId].removePlayer(playerId);
		}
	});
});
