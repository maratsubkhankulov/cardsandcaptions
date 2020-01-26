import React, { Component } from 'react';
import './NavBarView.css';

class NavBarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

  render() {
		return (
			<div className="navbar">
				<a href="#menu">Menu</a>
				<a href="#game">Game</a>
			</div>
		);
  }
}

export default NavBarView;
