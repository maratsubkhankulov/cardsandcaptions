import React, { Component } from 'react';
import ItemView from './ItemView.js';
import './InviteListView.css';
import './ItemView.css';

class InviteListView extends Component {
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
			<div className="InviteList">
				<div className="InviteListTitle">
					Invite friends
				</div>
				{playerItems}
        <div className="ItemContainer">
          <div className="ItemName">
            Invite
          </div>
        </div>
			</div>
		);
	}
}

export default InviteListView;
