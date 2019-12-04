import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from './Panel';

import ToneGenerator from './ToneGenerator';
import SpectrumPlot from './SpectrumPlot';

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


const MeasurementPanel = ({ isPlaying, panel, panelTimeout, traces, settings, configure }) => {

	const handleChangeThreshold = threshold => { configure({ ...settings, threshold_dBm: threshold })}

	let max_power_dBm = Number.NEGATIVE_INFINITY;
	if (traces && traces[0] && traces[0].data && traces[0].data.length > 0) {
		traces[0].data.forEach(p => {
			max_power_dBm = Math.max(max_power_dBm, p[1]);
		});
	}

	return (
		<Panel id={PANELS.GAUGES} hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<ToneGenerator isPlaying={isPlaying} peak_dBm={max_power_dBm} settings={settings} />

			<SpectrumPlot traces={traces} settings={settings} />

			<ThresholdSlider value={settings.threshold_dBm}
				setValue={handleChangeThreshold} unit='dBm'
				min={settings.min_power_dBm} max={settings.max_power_dBm} />

			<HistoryPlot reset={traces.length === 0} peak_dBm={max_power_dBm} settings={settings} />

		</Panel>
	);
};

export default MeasurementPanel;

MeasurementPanel.propTypes = {
	isPlaying: PropTypes.bool,
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	traces: PropTypes.array,
	settings: PropTypes.object,
	configure: PropTypes.func
}