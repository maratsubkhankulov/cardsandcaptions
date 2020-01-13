import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './GameView.css';
import CardView from './CardView.js';
import PlayerPanelView from './PlayerPanelView.js';
import HandView from './HandView.js';
import AvatarView from './AvatarView.js';

const uuid = require('uuid/v4');

class GameViewStory extends Component {
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

			let cards = [
				{
					id: 1,
					selected: true,
					imgUrl: 'img/1.jpg',
				},
				{
					id: 2,
					selected: false,
					imgUrl: 'img/2.jpg',
				},
				{
					id: 3,
					selected: false,
					imgUrl: 'img/5.jpg',
				},
				{
					id: 4,
					selected: false,
					imgUrl: 'img/4.jpg',
				},
			]

		let hand = (
				<HandView
					cards={cards}
					faceUp={true}
				/>
		);

		let winner = (
			<CardView
				selected={false}
				faceUp={true}
				imgUrl={'img/4.jpg'}
			/>
		)

		return (
				<div>
					<div className="Header">
					</div>
					<div className="Button">
						A button
					</div>
					<PlayerPanelView
						players={players}
					/>
					<div className="Banner">
						<div>
						Steve won this round!
						</div>
						<div className="Timer">:07</div>
					</div>
					<div className="CaptionArea">
						When you read a very long caption and it just doesn't seem to end
					</div>
					{winner}
					{hand}
				</div>
		)
	}
}

export default GameViewStory;
