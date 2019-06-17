import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import Gauge from './Gauge';
import HistoryPlot from './HistoryPlot';
import ToneGenerator from './ToneGenerator';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

const ThresholdSlider = ({ value, unit, setValue, min, max }) => {

	return (
		<div id='slider-1' className='slider'>
			<div className='value'>
				Threshold: <span className='v'>{value}</span>{' '}<span className='unit'>{unit}</span>
			</div>
			<Slider min={min} max={max} value={value} onChange={(v) => { setValue(v); }}
				tooltip={false} />
		</div>
	);
}

const GaugesPanel = ({ panel, panelTimeout, isPlaying, data, config, setConfig }) => {

	const value = (data && data.length && data.slice(-1)[0][1]) || null;
	
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

	const handleChangeThreshold = (th) => { setConfig({ ...config, threshold_dBm: th })}

	return (
		<Panel id='gauges' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<ToneGenerator play={beep} frequency={freq_Hz} />
			
			<Gauge value={value} unit={'dBm'} 
				min={config.min_power_dBm} max={config.max_power_dBm} 
				threshold={config.threshold_dBm} />

			<ThresholdSlider
				value={config.threshold_dBm} unit={'dBm'} setValue={handleChangeThreshold}
				min={config.min_power_dBm} max={config.max_power_dBm} />

			<HistoryPlot data={data} threshold={config.threshold_dBm} />

		</Panel>
	);
};

export default GaugesPanel;

GaugesPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	isPlaying: PropTypes.bool,
	data: PropTypes.array,
	config: PropTypes.object,
	setConfig: PropTypes.func
}