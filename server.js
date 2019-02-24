const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const uuid = require('uuid/v4');
const app = express();
const server = http.Server(app);
const io = socketio(server); // Attach socket.io to our server

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
		let gameId = uuid();
		socket.join(gameId);

		games[gameId] = {
			id: gameId,
			players: {},
		}

		let playerId = data.playerId;
		games[gameId].players[playerId] = {};
		clientGameMap[clientId] = gameId;
		clientPlayerMap[clientId] = playerId;

		console.log(`Player ${playerId} created game ${gameId}`);
		socket.emit('game-created', {
			gameId: gameId
		});
		socket.emit('joined-game', { gameId: gameId, playerId: playerId, gameInfo: games[gameId]});
		socket.broadcast.emit('active-games', {games: games});
	});

	socket.on('join-game', function(data) {
		let gameId = data.gameId;
		let playerId = data.playerId;

		games[gameId].players[playerId] = {
				name: "Joe Bloggs" //TODO use actual name
			}
		clientPlayerMap[clientId] = playerId
		clientGameMap[clientId] = gameId;

		console.log(`Player ${playerId} joined ${gameId}`)

		socket.join(gameId);
		socket.emit('joined-game', { gameId: gameId, playerId: playerId, gameInfo: games[gameId]});
		socket.broadcast.to(gameId).emit('joined-game', { gameId: gameId, playerId: playerId, gameInfo: games[gameId]});
	});

	socket.on('get-active-games', () => {
		socket.emit('active-games', {games: games});
	});

	// In-game events
	socket.on('actuate', function(data) {
		// Emit the move to all other clients
		socket.broadcast.emit('move', data);
	});

	socket.on('disconnect', function() {
		console.log(`Client ${clientId} disconnected`);
		delete connections[clientId];
		let gameId = clientGameMap[clientId];
		let playerId = clientPlayerMap[clientId];
		console.log(`${gameId} ${playerId}`);
		if (gameId && playerId) {
			console.log('left game');
			socket.broadcast.to(gameId).emit('left-game', { gameId: gameId, playerId: playerId });
			delete games[gameId].players[playerId];
		}
	});
});
