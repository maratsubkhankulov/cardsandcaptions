import React from 'react';
import ReactDOM from 'react-dom';
import GameViewStory from './GameView.story.js';
import AppStory from './App.story.js';
import LeaderboardViewStory from './leaderboard/LeaderboardView.story.js';
import NavBarView from './navbar/NavBarView.js';

window.onload = function () {
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
	return (
			<div>
				{/*
					<LeaderboardViewStory/>
				<AppStory/>
				*/}
				<GameViewStory/>
				<NavBarView/>
			</div>
	)
}
