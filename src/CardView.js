import React, { Component } from 'react';
import './AvatarView.css';

class AvatarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			selected: props.selected,
			imgUrl: props.imgUrl,
		}
	}

	render() {
		return (
			<div key={this.state.id}>
				<img src={this.state.imgUrl} alt={this.state.id} />
			</div>
		)
	}
}

export default AvatarView;
