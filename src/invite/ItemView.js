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
	  let className = "ItemContainer";
		return (
			<div className={className}>
				<img className="ItemIcon" src={this.state.imgUrl}></img>
				<div className="ItemName">
					{this.state.name}
				</div>
        <label className="container">
          <input type="checkbox" checked={this.state.selected}/>
          <span className="checkmark"></span>
        </label>
			</div>
		)
	}
}

export default ItemView;
