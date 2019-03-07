import React from 'react';
import ReactDOM from 'react-dom';
import './GameView.css';
import AvatarView from './AvatarView.js';
import CardView from './CardView.js';
import HandView from './HandView.js';

const uuid = require('uuid/v4');

window.onload = function () {
	let id = uuid();
	let name = `User_${id.substring(0,1)}`;
	ReactDOM.render(
		render(), document.getElementById('root'))
}

function render() {
		let players = [
			{
				id: '1',
				name: 'Sam',
				points: 2,
				selected: true,
				imgUrl: 'https://source.unsplash.com/random/50x50',
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
		const playerItems = players.map((p) => {
				let className = `${p.isActive ? "PlayerSelected":""} ${p.isJudge ? "JudgeSelected":""}`;
					return (
						<AvatarView
							key={p.id}
							id={p.id}
							name={p.name}
							points={p.points}
							selected={p.selected}
							imgUrl='https://source.unsplash.com/random/75x75'
						/>
					)
			});

		const cardItems = cards.map((c) => {
			return (
				<CardView
					key={c.id}
					id={c.id}
					selected={c.selected}
					imgUrl={c.imgUrl}
				/>
			)
		});

	return (
			<div>
				<div className="Header">
					<div className="Timer">:07</div>
				</div>
				<div className="PlayerPanel">
					{playerItems}
				</div>
				<div className="Banner">
					Waiting for players to join...
				</div>
				<div className="CaptionArea">
					When you read a very long caption and it just doesn't seem to end
				</div>
				<HandView
					cards={cards}
				/>
			</div>
	)
}
