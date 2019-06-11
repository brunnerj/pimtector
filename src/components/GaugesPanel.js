import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import Gauge from './Gauge';
import HistoryPlot from './HistoryPlot';
import ToneGenerator from './ToneGenerator';

const GaugesPanel = ({ panel, panelTimeout, isPlaying, data, config }) => {

	const value = (data && data.length && data.slice(-1)[0][1].toFixed(1)) || null;
	
	// choose frequency on a line between the hi and low
	// points according to a linear fit: freqHi_Hz - freqLo_Hz = m * (-80 - (-110))
	// So, solving for m:
	//		m = (791 - 202) / (-80 - (-110)) = 19.6333333...
	// giving:
	//		freq_Hz = 19.6333 * value + 2361.6333

	let freq_Hz = 0;
	let beep = false;

	if (value) {
		freq_Hz = 19.6333 * value + 2361.6333;
		beep = isPlaying && value >= config.threshold_dBm && config.sound;
	}

	return (
		<Panel id='gauges' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<ToneGenerator play={beep} frequency={freq_Hz} />
			
			<Gauge data={data} />

			<HistoryPlot data={data} config={config} />

		</Panel>
	);
};

export default GaugesPanel;

GaugesPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	isPlaying: PropTypes.bool,
	data: PropTypes.array,
	threshold_dBm: PropTypes.number
}