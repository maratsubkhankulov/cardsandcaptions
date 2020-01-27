import React, { Component } from 'react';
import './NavBarView.css';

class NavBarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onGameClick: props.onGameClick,
			onMenuClick: props.onMenuClick,
		}
	}

	componentDidMount() {
	}

	onGameClick() {
		this.state.onGameClick();
	}

	onMenuClick() {
		this.state.onMenuClick();
	}

  render() {
		return (
			<div className="navbar">
				<div className="navbar-item" onClick={() => this.onMenuClick()}>Menu</div>
				<div className="navbar-item" onClick={() => this.onGameClick()}>Game</div>
			</div>
		);
  }
}

export default NavBarView;
