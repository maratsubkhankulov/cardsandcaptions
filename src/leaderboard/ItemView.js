import React, { Component } from 'react';
import './ItemView.css';

class ItemView extends Component {
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

	componentWillReceiveProps(props) {
		this.setState({
			name: props.name,
			selected: props.selected,
			points: props.points,
			imgUrl: props.imgUrl,
		});  
	}

	render() {
	  let className = "Container";
		if (this.state.selected) {
			className = "SelectedContainer";
		}
		return (
			<div className={className}>
				<img className="Icon" src={this.state.imgUrl}></img>
				<div className="Name">
					{this.state.name}
				</div>
				<div className="Score">
					{this.state.points}
				</div>
			</div>
		)
	}
}

export default ItemView;
