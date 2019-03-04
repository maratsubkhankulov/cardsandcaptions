import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

const uuid = require('uuid/v4');

window.onload = function () {
	let id = uuid();
	let name = `User_${id.substring(0,1)}`;
	ReactDOM.render(
		<App
			playerId={id}
			playerName={name}
		/>, document.getElementById('root'))
}
