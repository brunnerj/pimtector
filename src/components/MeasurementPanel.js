import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from './Panel';

import Slider from './Slider';

import ToneGenerator from './ToneGenerator';
import SpectrumPlot from './SpectrumPlot';

import HistoryPlot from './HistoryPlot';

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

			<Slider name='Threshold' value={settings.threshold_dBm} unit='dBm'
				min={settings.min_power_dBm} max={settings.max_power_dBm} 
				setValue={handleChangeThreshold} />

			<div id='gauges-charts'>
				<SpectrumPlot traces={traces} settings={settings} />

				<HistoryPlot reset={traces.length === 0} peak_dBm={max_power_dBm} settings={settings} />

			</div>

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