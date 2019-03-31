import React, { Component } from 'react';
import ItemView from './ItemView.js';
import './LeaderboardView.css';

class LeaderboardView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: props.players,
		}
		console.log(this.state.players);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ players: nextProps.players });  
	}

	render() {
		const playerItems = this.state.players.map((p) => {
			return (
				<ItemView
					key={p.id}
					id={p.id}
					name={p.name}
					points={p.points}
					selected={p.selected}
					imgUrl={p.imgUrl}
				/>
			)
			});
		return (
			<div className="Leaderboard">
				<div className="Title">
					Winner!
				</div>
				{playerItems}
			</div>
		);
	}
}

export default LeaderboardView;
