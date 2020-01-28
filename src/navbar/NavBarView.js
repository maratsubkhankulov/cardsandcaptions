import React, { Component } from 'react';
import './NavBarView.css';

class NavBarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onClickListener: props.onClickListener,
		}
	}

	componentDidMount() {
	}

  render() {
		return (
			<div className="navbar">
				<div className="navbar-item" onClick={() => this.state.onClickListener('back')}>Back</div>
				<div className="navbar-item" onClick={() => this.state.onClickListener('start_game')}>Start game</div>
			</div>
		);
  }
}

export default NavBarView;
