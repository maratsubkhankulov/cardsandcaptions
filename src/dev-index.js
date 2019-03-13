import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

const uuid = require('uuid/v4');

function invitePlayers() {
	console.log('Invite players');
}

window.onload = function () {
	let id = uuid();
	let name = `User_${id.substring(0,1)}`;
	ReactDOM.render(
		<App
			playerId={id}
			playerName={name}
			playerImgUrl="https://source.unsplash.com/random/75x75"
			//server="https://memegame-server.herokuapp.com"
			server="http://localhost:4000"
			contextId="dev-context"
			invitePlayers={invitePlayers}
		/>, document.getElementById('root'))
}
