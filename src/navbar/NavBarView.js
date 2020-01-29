import React, { Component } from 'react';
import './NavBarView.css';

class NavBarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
		this.onClickListener = props.onClickListener;
	}

	componentDidMount() {
	}

  render() {
		return (
			<div className="navbar">
				<div className="navbar-item" onClick={() => this.onClickListener('back')}>Back</div>
				<div className="navbar-item" onClick={() => this.onClickListener('start_game')}>Start game</div>
			</div>
		);
  }
}

export default NavBarView;
