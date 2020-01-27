import React, { Component } from 'react';
import './common.css';
import './MenuView.css';
;

class MenuView extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
	}

  render() {
		return (
			<div>
				<div className='Logo'>
					<img className='Logo' src='./img/card_back.jpg'/>
				</div>
				<div className='Button'>Play in this group</div>
				<br/>
				<div className='Button' onClick={() => this.switchContext()}>Play another group</div>
				<br/>
				<div className='Button' >Buy card game</div>
			</div>
		);
  }
}

export default MenuView;
