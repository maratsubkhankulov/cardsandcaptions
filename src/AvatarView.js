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

	componentWillReceiveProps(props) {
		this.setState({
			name: props.name,
			selected: props.selected,
			points: props.points,
			imgUrl: props.imgUrl,
		});  
	}

	render() {
	  let selectedBar = <div className="Unselected"/>;
		if (this.state.selected) {
			selectedBar = <div className="Selected"/>;
		}
		return (
			<div className="Container">
				{selectedBar}
				<div className="Score">
					{this.state.points}
				</div>
				<img className="Icon" src={this.state.imgUrl}></img>
					{this.state.name}
			</div>
		)
	}
}

export default AvatarView;
