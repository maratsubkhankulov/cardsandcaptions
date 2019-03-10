import React, { Component } from 'react';
import './CardView.css';

class CardView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			selected: props.selected,
			faceUp: props.faceUp,
			imgUrl: props.imgUrl,
			onClick: props.onClick,
		}
		this.onClick = this.onClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			selected: nextProps.selected,
			faceUp: nextProps.faceUp,
			imgUrl: nextProps.imgUrl,
		});  
	}

	onClick() {
		this.state.onClick(this.state.id);
	}

	render() {
		let className = "Card"
		if (this.state.selected) {
			className = "SelectedCard"
		}
		let url = './img/card_back.jpg';
		if (this.state.faceUp) {
			url = this.state.imgUrl;
		}
		return (
			<div className={className} key={this.state.id} onClick={this.onClick}>
				<img className={className} src={url} alt={this.state.id} />
			</div>
		)
	}
}

export default CardView;
