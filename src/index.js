import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

let app = null;

console.log('index loading');
window.onload = function () {
	console.log('onload')
	window.FBInstant.initializeAsync().then(function() {
			console.log('init')

			window.FBInstant.setLoadingProgress(70);
			window.FBInstant.startGameAsync()
				.then(function() {
					console.log('startGameAsync');
					start();
				});
	});
}

function invitePlayers() {
	let player = window.FBInstant.player.getName();
	let payload = {
		action: 'CUSTOM',
		cta: 'Join them!',
		text: {
			default: player + ' has invited you to play.',
			localizations: {
				en_US: player + ' has invited you to play.'
			}
		},
		template: 'invite',
		data: { myCustomData: '42' },
		strategy: 'IMMEDIATE',
		notification: 'NO_PUSH'
	};

	toDataURL(
		'./img/card_back.jpg',
		function(dataUrl) {
			payload.image = dataUrl;
			// This will post a custom update.
			// If the game is played in a messenger chat thread,
			// this will post a message into the thread with the specified image and text message.
			// When others launch the game from this message,
			// those game sessions will be able to access the specified blob
			// of data through FBInstant.getEntryPointData()
			window.FBInstant.updateAsync(payload).then(function() {
				console.log('Message was posted!');
			}).catch(function(error) {
				console.log('Message was not posted: ' + error.message);
			});
		}
	);
}

function chooseAsync() {
	console.log("Switch context via chooseAsync");
	window.FBInstant.context
		.chooseAsync({
			minSize: 3,
			maxSize: 5,
		})
		.then(function() {
			app.setState((state, props) => {
				return {
					contextId: window.FBInstant.context.getID(),
				};
			},
			() => {
				console.log('Switched context');
			});
		});
}

function toDataURL(src, callback) {
	let img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function() {
		let canvas = document.createElement('CANVAS');
		canvas.height = 960;
		canvas.width = 960;
		canvas.getContext('2d').drawImage(this, 0, 0, 960, 960);
		callback(canvas.toDataURL());
	};
	img.src = src;
}

function start() {
	console.log('Start');

	app = ReactDOM.render(
		<App
			playerId={window.FBInstant.player.getID()}
			playerName={window.FBInstant.player.getName()}
			playerImgUrl={window.FBInstant.player.getPhoto()}
			contextId={window.FBInstant.context.getID()}
			server="https://memegame-server.herokuapp.com/"
			invitePlayers={invitePlayers}
			chooseAsync={chooseAsync}
		/>, document.getElementById('root'))
}
