import React from 'react';
import ReactDOM from 'react-dom';
import GameViewStory from './GameView.story.js';
import LeaderboardViewStory from './leaderboard/LeaderboardView.story.js';

window.onload = function () {
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
	return (
			<div>
				<LeaderboardViewStory/>
			</div>
	)
}
