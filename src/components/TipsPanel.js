import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from '../components/Panel';

const Tips = ({ panel, panelTimeout, settings, configure }) => {

	if (panel !== PANELS.GAUGES || !settings.showtips) return null;

	return (

		<Panel id={PANELS.TIPS} hideTitle={true} panel='tips' panelTimeout={panelTimeout}>
			<button className='icon fa-check-circle'
				onClick={() => { configure({ ...settings, showtips: false })}}
				title='Ok'>Ok, got it!
			</button>

			<div className='tip' id='play'>
				<div className='tip--tip'></div>
				Use this button to play or pause the receiver data stream.
			</div>

			<div className='tip' id='right-buttons'>
				<div className='tip--tip'></div>
				These buttons clear the stream of receiver data, show
				the battery level and open a panel for more settings.
			</div>

			<div className='tip' id='threshold'>
				<div className='tip--tip'></div>
				Slide here to adjust the beeper threshold.
			</div>

			<div className='tip' id='history'>
				<div className='tip--tip'></div>
				The receiver data stream over time is shown in this area.
			</div>

			<div className='tip' id='tuning'>
				<div className='tip--tip'></div>
				Use this button to tune the receiver to a different band.
			</div>

			<div className='tip' id='spectrum'>
				<div className='tip--tip'></div>
				The spectrum (amplitude versus frequency) is plotted on
				a graph with older traces fading out.
			</div>

		</Panel>
	);
}

export default Tips;

Tips.propTypes = {
	panel: PropTypes.string,
	settings: PropTypes.object,
	configure: PropTypes.func
}