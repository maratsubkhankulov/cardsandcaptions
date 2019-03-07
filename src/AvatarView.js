import React, { Component } from 'react';
import './AvatarView.css';

class AvatarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			name: props.name,
			selected: props.selected,
			points: props.points,
			imgUrl: props.imgUrl,
		}
	}

	render() {
		return (
			<div className="Container">
				<div className="Score">
					{this.state.points}
				</div>
				<img className="Icon" src={this.state.imgUrl}></img>
				<div className="Name">
					{this.state.name}
				</div>
			</div>
		)
	}
}

export default AvatarView;
