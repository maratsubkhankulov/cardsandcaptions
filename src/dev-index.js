import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

const uuid = require('uuid/v4');
let app = null;

function invitePlayers() {
	console.log('Invite players');
}

function chooseAsync() {
	console.log('Choose async')
	const urlParams = new URLSearchParams(window.location.search);
	const contextId = urlParams.get('contextId');
	const newContextId = contextId + '1';
	urlParams.set('contextId', newContextId);
	app.setState((state, props) => {
		return {
			contextId: newContextId,
		};
	},
	() => {
		console.log('Updated state');
		window.location.href = '?' + urlParams.toString();
	});
}

window.onload = function () {
	// Switch into a new context
	start();
}

function start() {
	console.log("start new App instance with context: " + contextId);
	// Assume that in development mode playerId is stored in URL query
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('playerId');
	const contextId = urlParams.get('contextId');
	let name = `User_${id.substring(0,1)}`;
	app = ReactDOM.render(
		<App
			playerId={id}
			playerName={name}
			playerImgUrl="https://source.unsplash.com/random/75x75"
			//server="https://memegame-server.herokuapp.com"
			server="http://localhost:4000"
			contextId={contextId}
			invitePlayers={invitePlayers}
			chooseAsync={chooseAsync}
		/>, document.getElementById('root'))
}
