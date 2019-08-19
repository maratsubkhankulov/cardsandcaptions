import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InviteListView from './InviteListView.js'

class InviteListViewStory extends Component {
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
				},
				{
					id: '3',
					name: 'Alice',
					points: 5,
					selected: false,
					imgUrl: 'https://source.unsplash.com/random/75x75',
				},
				{
					id: '4',
					name: 'Jeff',
					points: 3,
					selected: true,
					imgUrl: 'https://source.unsplash.com/random/75x75',
				},
				{
					id: '5',
					name: 'Ashley',
					points: 3,
					selected: false,
					imgUrl: 'https://source.unsplash.com/random/75x75',
				}
			]

		return (
				<div>
					<InviteListView
						players={players}
					/>
				</div>
		)
	}
}

export default InviteListViewStory;
