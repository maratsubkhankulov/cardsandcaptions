import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LeaderboardView from './LeaderboardView.js'

class LeaderboardViewStory extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
			let players = [
				{
					id: '1',
					name: 'Sam',
					points: 2,
					selected: true,
					imgUrl: 'https://source.unsplash.com/random/75x75',
				},
				{
					id: '2',
					name: 'Evelyn',
					points: 12,
					selected: false,
					imgUrl: 'https://source.unsplash.com/random/75x75',
				}
			]

		return (
				<div>
					<LeaderboardView
						players={players}
					/>
				</div>
		)
	}
}

export default LeaderboardViewStory;
