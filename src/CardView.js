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
		let className = "Card"
		if (this.state.selected) {
			className = "SelectedCard"
		}
		return (
			<div className={className} key={this.state.id}>
				<img className={className} src={this.state.imgUrl} alt={this.state.id} />
			</div>
		)
	}
}

export default CardView;
