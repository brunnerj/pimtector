import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import Spinner from './Spinner';
import Showcase from '../images/showcase-01.png';
import LeftWand from '../images/wand-left.png';
import RightWand from '../images/wand-right.png';

const ConnectionPanel = ({ panel, panelTimeout, onConnect, isConnecting }) => {

	return (
		<Panel id='connection' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<div className='cta'>
				<div className='lead-in'>Introducing PIM<span>tector</span>&trade;</div>

				<div className='main-tag'>
					<span>Find</span> and <span>Fix</span> PIM <span>Now</span></div>

				<div className='sub-tag'>
					Connect your Bluetooth LE receiver to get started.
				</div>

				<div className='button-box'>
					<button className='icon fa-link'
						onClick={() => onConnect()}
						title='Connect'>Connect
					</button>
				</div>

			</div>
			<div className='bg'>
				<img alt='' src={Showcase} />
				<img className='wand-left' alt='' src={LeftWand} />
				<img className='wand-right' alt='' src={RightWand} />
			</div>

			<Spinner showing={isConnecting} label={'Connecting...'} />
		</Panel>
	);
};

export default ConnectionPanel;

ConnectionPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	onConnect: PropTypes.func,
	isConnecting: PropTypes.bool
}