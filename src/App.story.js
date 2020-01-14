import React, { Component } from 'react';
import './App.css';
import GameView from './GameView.js';

class AppStory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playerName: "John Doe",
			contextId: "story-context",
		}
	}

  render() {
		let gamesListView = (
				<div>
					<h4>{this.state.playerName}</h4>
					<h5>Context id: {this.state.contextId}</h5>
					<div className='Button'>Create game</div>
				</div>
			);

    return (
      <div className="App">
				{gamesListView}
			</div>
		)
  }
}

export default AppStory;
