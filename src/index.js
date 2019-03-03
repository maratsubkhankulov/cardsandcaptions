import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

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

function start() {
	console.log('Start');

	ReactDOM.render( <App/>, document.getElementById('root'))
}
