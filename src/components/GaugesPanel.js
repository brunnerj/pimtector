import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import Gauge from './Gauge';
import HistoryPlot from './HistoryPlot';
import ToneGenerator from './ToneGenerator';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';


const PASS_COLOR = '#28ac70'; // theme-color in _vars.scss
const FAIL_COLOR = '#ff0000'; // error-color in _vars.scss
const THRESHOLD_LINE_DARK = '#1b1f22'; // theme-light-fg
const THRESHOLD_LINE_LIGHT = '#ffffff'; // theme-dark-fg


const BEEP_HI_FREQ_hz = 791;
const BEEP_LO_FREQ_hz = 202;


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
	
	// Value above threshold corresponds to an audible tone at a frequency
	// somewhere between when the value is right at the threshold (BEEP_LO_FREQ_hz)
	// and when the value is at the maximum allowed (BEEP_HI_FREQ_hz).  We just do
	// a linear fit to get the frequency when the value is somewhere in between.

	// Using the point-slope form of a line:
	//		y1 - y0 = m * (x1 - x0)
	// Our y-values are beep frequency, and our x-values are the measured power value.

	// Slope, m = (y1 - y0) / (x1 - x0)
	const m = (BEEP_HI_FREQ_hz - BEEP_LO_FREQ_hz) / (config.max_power_dBm - config.threshold_dBm);

	// Intercept, b, can be obtained from either known point.
	//		y1 = m * x1 + b => b = y1 - m * x1
	//		b = y1 - m * x1
	const b = BEEP_HI_FREQ_hz - m * config.max_power_dBm;

	let freq_Hz = 0;
	let beep = false;

	if (value) {
		freq_Hz = m * value + b;
		beep = isPlaying && value >= config.threshold_dBm && config.sound;
	}

	const handleChangeThreshold = (th) => { setConfig({ ...config, threshold_dBm: th })}

	return (
		<Panel id='gauges' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<ToneGenerator play={beep} frequency={freq_Hz} />
			
			<Gauge value={value} unit={'dBm'}
				min={config.min_power_dBm} max={config.max_power_dBm} 
				threshold={config.threshold_dBm} 
				passColor={PASS_COLOR}
				failColor={FAIL_COLOR}
			/>

			<ThresholdSlider
				value={config.threshold_dBm} unit={'dBm'} setValue={handleChangeThreshold}
				min={config.min_power_dBm} max={config.max_power_dBm}
			/>

			<HistoryPlot data={data} threshold={config.threshold_dBm}
				passColor={PASS_COLOR} failColor={FAIL_COLOR}
				thresholdLineColor={config.darktheme ? THRESHOLD_LINE_LIGHT : THRESHOLD_LINE_DARK}
			/>

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