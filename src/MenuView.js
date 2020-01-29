import React, { Component } from 'react';
import './common.css';
import './MenuView.css';
;

class MenuView extends Component {
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
			<div className='MenuContainer'>
				<br/>
				<br/>
				<div className='Logo'>
					<img className='Logo' src='./img/card_back.jpg'/>
				</div>
				<div className='Button' onClick={() => this.onClickListener('play_here')}>Return to game</div>
				<br/>
				<div className='Button' onClick={() => this.onClickListener('play_another')}>Play another group</div>
				<br/>
				<div className='Button' onClick={() => this.onClickListener('purchase')}>Buy card game</div>
			</div>
		);
  }
}

export default MenuView;
