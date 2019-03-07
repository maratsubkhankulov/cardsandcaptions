import React, { Component } from 'react';
import './CardView.css';

class CardView extends Component {
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
			<div className="Card" key={this.state.id}>
				<img className="Card" src={this.state.imgUrl} alt={this.state.id} />
			</div>
		)
	}
}

export default CardView;
