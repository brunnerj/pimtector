
import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../components/Panel';

const Tips = ({ panel, panelTimeout, config, setConfig }) => {

	if (panel !== 'gauges' || !config.showtips) return null;

	return (

		<Panel id='tips' hideTitle={true} panel='tips' panelTimeout={panelTimeout}>
			<button className='icon fa-check-circle'
				onClick={() => { setConfig({ ...config, showtips: false })}}
				title='Ok'>Ok, got it!
			</button>

			<div className='tip' id='play'>
				<div className='tip--tip'></div>
				Use this button to play or pause the receiver data stream.
			</div>

			<div className='tip' id='clear'>
				<div className='tip--tip'></div>
				This button clears the current stream of receiver data.
			</div>

			<div className='tip' id='threshold'>
				<div className='tip--tip'></div>
				Slide here to adjust the beeper threshold.
			</div>

			<div className='tip' id='history'>
				<div className='tip--tip'></div>
				The receiver data stream over time is shown in this area.
			</div>
		</Panel>
	);
}

export default Tips;

Tips.propTypes = {
	panel: PropTypes.string,
	config: PropTypes.object,
	setConfig: PropTypes.func
}