import React from 'react';
import ReactDOM from 'react-dom';
import GameViewStory from './GameView.story.js';
import AppStory from './App.story.js';
import LeaderboardViewStory from './leaderboard/LeaderboardView.story.js';
import NavBarView from './navbar/NavBarView.js';
import MenuView from './MenuView.js';

window.onload = function () {
	ReactDOM.render(
		render(), document.getElementById('root'))
}

let showMenu = true;

function ActiveView(props) {
	const showMenu = props.showMenu;
	if (showMenu) {
		return <MenuView/>;
	}
	return <GameViewStory/>;
}

function setShowMenu() {
	console.log("Menu click");
	showMenu=true;
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function setShowGame() {
	console.log("Game click");
	showMenu=false;
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
	return (
			<div>
				{/*
					<LeaderboardViewStory/>
				<AppStory/>
				<GameViewStory/>
				*/}
				<ActiveView showMenu={showMenu} />
				<NavBarView
					onMenuClick={setShowMenu}
					onGameClick={setShowGame}
				/>
			</div>
	)
}
