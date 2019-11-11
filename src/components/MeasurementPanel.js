import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';

import Gauge from './Gauge';
import ToneGenerator from './ToneGenerator';
import HistoryPlot from './HistoryPlot';

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

const MeasurementPanel = ({ isPlaying, panel, panelTimeout, data, config, setConfig }) => {

	const value = (data && data.length && data.slice(-1)[0][1]) || null;

	const handleChangeThreshold = (th) => { setConfig({ ...config, threshold_dBm: th })}

	return (
		<Panel id='gauges' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<ToneGenerator isPlaying={isPlaying} data={data} config={config} 
			/>

			<Gauge value={value} unit={'dBm'}
				min={config.min_power_dBm} max={config.max_power_dBm} 
				threshold={config.threshold_dBm} 
				passColor={config.pass_color}
				failColor={config.fail_color}
			/>

			<ThresholdSlider
				value={config.threshold_dBm} unit={'dBm'} setValue={handleChangeThreshold}
				min={config.min_power_dBm} max={config.max_power_dBm}
			/>

			<HistoryPlot data={data} config={config} />

		</Panel>
	);
};

export default MeasurementPanel;

MeasurementPanel.propTypes = {
	isPlaying: PropTypes.bool,
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	data: PropTypes.array,
	config: PropTypes.object,
	setConfig: PropTypes.func
}