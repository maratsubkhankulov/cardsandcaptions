import React from 'react';
import ReactDOM from 'react-dom';

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
	console.log('Start')

	const App = () =>(
			<div>
					Hello world!!!!!!!!!!!!!!!!!!!!!!!!!!
			</div>
	)

	ReactDOM.render(
			<App/>,
			document.getElementById('root')
	)
}
