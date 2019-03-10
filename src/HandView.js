import React, { Component } from 'react';
import CardView from './CardView.js';
import './HandView.css';

class HandView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: props.cards,
			faceUp: props.faceUp,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			cards: nextProps.cards,
			faceUp: nextProps.faceUp,
		});  
	}

	render() {
		const view = this;
		const cardItems = this.state.cards.map((c) => {
			return (
				<CardView
					key={c.id}
					id={c.id}
					selected={c.selected}
					faceUp={view.state.faceUp}
					imgUrl={c.imgUrl}
					onClick={c.onClick}
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
