import React, { Component } from 'react';
import CardView from './CardView.js';
import './HandView.css';

class HandView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: props.cards,
		}
	}

	render() {
		const cardItems = this.state.cards.map((c) => {
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
			<div className="Hand">
				{cardItems}
			</div>
		)
	}
}

export default HandView;
