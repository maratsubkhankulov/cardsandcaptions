import React from 'react';
import ReactDOM from 'react-dom';
import GameViewStory from './GameView.story.js';
import LeaderboardViewStory from './leaderboard/LeaderboardView.story.js';
import InviteListViewStory from './invite/InviteListView.story.js';

window.onload = function () {
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
	return (
			<div>
				<InviteListViewStory/>
			</div>
	)
}
