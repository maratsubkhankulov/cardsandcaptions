import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

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
	window.FBInstant.updateAsync({
		action: 'CUSTOM',
		cta: 'Play',
		text: {
			default: 'Join the meme game now',
			localizations: {
				en_US: 'Join the meme game now',
			}
		},
		template: 'play_turn',
		data: { myReplayData: '...' },
		strategy: 'IMMEDIATE',
		notification: 'NO_PUSH'
	});
}

function start() {
	console.log('Start');

	ReactDOM.render(
		<App
			playerId={window.FBInstant.player.getID()}
			playerName={window.FBInstant.player.getName()}
			playerImgUrl={window.FBInstant.player.getPhoto()}
			contextId={window.FBInstant.context.getID()}
			server="https://memegame-server.herokuapp.com/"
			invitePlayers={invitePlayers}
		/>, document.getElementById('root'))
}
