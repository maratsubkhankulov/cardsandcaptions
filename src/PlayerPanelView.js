import React, { Component } from 'react';
import AvatarView from './AvatarView.js';
import './PlayerPanelView.css';

class PlayerPanelView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: props.players,
		}
	}

	render() {
		const playerItems = this.state.players.map((p) => {
					return (
						<AvatarView
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
			<div className="PlayerPanel">
				{playerItems}
			</div>
		);
	}
}

export default PlayerPanelView;
