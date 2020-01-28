import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from './Panel';
import Spinner from './Spinner';
//import Showcase from '../images/showcase-01.png';
//import LeftWand from '../images/wand-left.png';
//import RightWand from '../images/wand-right.png';

import BgVideo from "../assets/Abstract - 26011.mp4";

const ConnectionPanel = ({ panel, panelTimeout, connect, isConnecting }) => {

	return (
		<Panel id={PANELS.CONNECTION} hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			{/*
			<div className='bg'>
				<img alt='' src={Showcase} />
				<img className='wand-left' alt='' src={LeftWand} />
				<img className='wand-right' alt='' src={RightWand} />
			</div>-->*/}

			<video poster="" id="bgvid" playsInline autoPlay muted loop>
				<source src={BgVideo} type="video/mp4"/>
`			</video>

			<div className='cta'>
				<div className='lead-in'>Introducing PIM<span>tector</span>&trade;</div>

				<div className='main-tag'>
					<span className='b'>Find</span> and <span className='b'>Fix</span> <span className='r'>PIM</span> <span className='b'>Now</span>
				</div>

				<div className='sub-tag'>
					Connect your Bluetooth LE receiver to get started.
				</div>

				<button className='icon fa-link'
					onClick={() => connect()}
					title='Connect'>Connect
				</button>

			</div>
			
			<Spinner showing={isConnecting} label={'Connecting...'} />
		</Panel>
	);
};

export default ConnectionPanel;

ConnectionPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	connect: PropTypes.func,
	isConnecting: PropTypes.bool
}