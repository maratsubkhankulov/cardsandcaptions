const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const uuid = require('uuid/v4');
const app = express();
const server = http.Server(app);
const io = socketio(server, {
	pingTimeout: 6000
}); // Attach socket.io to our server
import {Game, Player} from '../src/game';
import {initGame, fillCardStacks} from '../src/game_utils';

var port = process.env.PORT || 4000;

app.use(express.static('public')); // Serve our static assets from /public
server.listen(port, () => console.log(`server started ${port}`));

// Game server configuration
const AUTOVOTE_TIMEOUT = 10000;

/**
 * Game server state
 * Tracks games and connected clients. Some games are active, but
 * some players are in pre-game.
 *
 * - client - has a clientId and an associated socket connection
 * - game - is an instance of a meme game. An abstract game entity that players are
       a part of.
 * - player - is a game participant. A player drives makes moves in the game
       using a client.
 *
 * Autovoting will take place at certain parts of the game, during an extended period
 * of player inaction.
 */
const connections = {}; // clientId -> Socket
const games = {}; // gameId -> Game
const clientGameMap = {}; // clientId -> gameId
const clientPlayerMap = {}; // clientId -> playerId
const autovoteTimeoutMap = {}; // gameId -> timeout id

/**
 * Starts timer for autovotes to happen
 * Any player that hasn't voted will receive a random vote
 */
function startAutovoteTimer(game, socket) {
	console.log(`Autovote timer started for {timeout} ms`);

	// Clear previous timeout
	if (autovoteTimeoutMap[game.id]) {
		clearInterval(autovoteTimeoutMap[game.id]);
	}

	// Tick for some time, then autovote
	let time = AUTOVOTE_TIMEOUT;
	const INTERVAL = 1000; // tick every second
	autovoteTimeoutMap[game.id] = setInterval(function countDownThenAutovote() {
		if (time > 0) { 
			console.log('Tick, time left ' + time);
			time = time - INTERVAL;
			socket.emit('tick', time/1000); // notify initiator, convert to seconds
			socket.broadcast.to(game.id).emit('tick', time/1000);
		} else {
			clearInterval(autovoteTimeoutMap[game.id]);
			console.log('Casting autovote');
			game.autovote();
			socket.emit('sync', game); // notify initiator
			socket.broadcast.to(game.id).emit('sync', game);
		}
	},
	INTERVAL
	);
}

/**
 * onCreateGame is triggered when a game if first created.
 * A game is created by one and only one player, who is the first participants.
 * The server will then notify the other clients so that players waiting in the
 * context can connect.
 */
function onCreateGame(socket, clientId, data) {
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
  // TODO wil is broadcasting all games to all clients, which doesn't scale.
	socket.broadcast.emit('active-games', {games: games});
}

/**
 * onJoinGame is triggered when a player joins an existing game
 */
function onJoinGame(socket, clientId, data) {
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
}

/**
 * onStartGame is triggered when one player chooses to start a staged game. This player
 * must have already joined the game.
 */
function onStartGame(socket, clientId, data) {
	const gameId = clientGameMap[clientId];
	// Check to start
	const minPlayers = Game.minPlayers();
	if (games[gameId].players.length >= minPlayers) {
		console.log(`Reached minimum number of players ${games[gameId].players.length}`);

		initGame(games[gameId]);
		socket.emit('init-game', games[gameId]);
		socket.broadcast.to(gameId).emit('init-game', games[gameId]);
		startAutovoteTimer(games[gameId], socket);
	} else {
		console.log("There are not enough players to start game");
	}
}

/**
 * onSelectImageCard is called when a player selects an image card amongst
 * several options.
 */
function onSelectImageCard(socket, clientId, move) {
	const gameId = clientGameMap[clientId];
	const game = games[gameId];

	game._selectImageCard(move.playerId, move.cardId);

	socket.emit('sync', game);
	socket.broadcast.to(gameId).emit('sync', game);
}

/**
 * onSelectWinningCard is called when a judge player selects the winning card.
 * The game then either starts the next round or finishes and displays high score.
 */
function onSelectWinningCard(socket, clientId, move) {
	const gameId = clientGameMap[clientId];
	const game = games[gameId];
	const winningVote = game._selectWinningCard(move.playerId, move.voterId, move.cardId);

	// Handle end of turn and end of game events
	if (!winningVote) return;
	setTimeout(function() {
			// If max score has been reached
			if (winningVote.player.points.length >= Game.maxScore()) {
				console.log('Max turns reached. End of game.');
				game.endGame();
				socket.emit('sync', game);
				socket.broadcast.to(gameId).emit('sync', game);
				setTimeout(function() {
					game.reinit();
					initGame(game);
					socket.emit('sync', game);
					socket.broadcast.to(gameId).emit('sync', game);
					startAutovoteTimer(game, socket);
				},
				3000);
			} else {
				game._nextTurn();

				startAutovoteTimer(game, socket);
				socket.emit('sync', game);
				socket.broadcast.to(gameId).emit('sync', game);
			}
		},
		3000);
}

function onDisconnect(socket, clientId) {
	// Clean up connections
	console.log(`Client ${clientId} disconnected`);
	delete connections[clientId];
}

function onPlayerExit(socket, client) {
	let gameId = clientGameMap[clientId];
	let playerId = clientPlayerMap[clientId];
	console.log(`${gameId} ${playerId}`);
	if (gameId && playerId) {
		console.log(`Left game ${playerId}`);
		socket.broadcast.to(gameId).emit('left-game', { gameId: gameId, playerId: playerId });
		games[gameId].removePlayer(playerId);
		delete clientPlayerMap[clientId];
		if (games[gameId].players.length === 0) {
			delete games[gameId];
			delete clientGameMap[clientId];
		}
	}
}

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
		onCreateGame(socket, clientId, data);
	});

	socket.on('join-game', function(data) {
		onJoinGame(socket, clientId, data);
	});

	socket.on('start-game', function(data) {
		onStartGame(socket, clientId, data);
	});

	socket.on('get-active-games', () => {
		socket.emit('active-games', {games: games});
	});

	socket.on('get-game', (data) => {
		const id = data.gameId;
		socket.emit(
			'get-game-response',
			{
				exists: id in games, 
				gameId: id,
				gameState: games[id],
			});
	});

	// Handle player actions
	socket.on('actuate', function(move) {
		const gameId = clientGameMap[clientId];
		const game = games[gameId];

		switch (move.type) {
			case 'selectImageCard':
				onSelectImageCard(socket, clientId, move);
				break;
			case 'selectWinningCard':
				onSelectWinningCard(socket, clientId, move);
				break;
		}
		socket.emit('sync', game);
		socket.broadcast.to(gameId).emit('sync', game);
	});

	socket.on('disconnect', function() {
		onDisconnect(socket, clientId);
	});
});
