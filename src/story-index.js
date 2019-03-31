import React from 'react';
import ReactDOM from 'react-dom';
import GameViewStory from './GameView.story.js';

window.onload = function () {
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
	return (
			<div>
				<GameViewStory/>
			</div>
	)
}
