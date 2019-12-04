import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require('flot');

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

const HistoryPlot = ({ reset, peak_dBm, settings }) => {

	const plotRef = useRef(); // plot container DOM reference
	const histRef = useRef([]); // history buffer

	const prevPeak = usePrevious(peak_dBm);
	const newPeak = prevPeak !== peak_dBm;
	
	let now;
	let buffer;

	if (reset || newPeak) {
		now = Date.now();

		// filter history of any points older than historyLength_ms
		buffer = reset ? [] : histRef.current.filter(p => p[0] > now - settings.historyLength_ms);
		buffer.push([ now, peak_dBm ]);

	} else {

		// use history buffer as is and pull now from the newest (i.e., the last) buffer point
		buffer = histRef.current;
		now = buffer[buffer.length - 1][0];
	}

	const failedData = [];
	const passedData = [];

	const threshold = settings.threshold_dBm;

	const thresholdData = buffer.map(p => {

		failedData.push([ p[0] - now, Math.max(threshold, p[1] ), threshold]);
		passedData.push([ p[0] - now, Math.min(threshold, p[1] ), Number.NEGATIVE_INFINITY]);

		return [ p[0] - now, threshold ];
	});
	const passColor = settings.pass_color;
	const failColor = settings.fail_color;

	const thresholdLineColor = settings.theme !== 'light' 
		? settings.threshold_line_light 
		: settings.threshold_line_dark;

	const thresholdSeries = { label: 'threshold', color: thresholdLineColor, data: thresholdData, lines: { lineWidth: 2 } };
	const failedSeries = { label: 'above', color: failColor, data: failedData, lines: { fill: true, lineWidth: 2 } };
	const passedSeries = { label: 'below', color: passColor, data: passedData, lines: { fill: true, lineWidth: 2 } };

	const traces = [ failedSeries, passedSeries, thresholdSeries ];

	const options = {
		series: {
			shadowSize: 0
		},
		grid: {
			margin: { top: 0, right: 5, bottom: 0, left: 0 },
			tickColor: "rgba(0,0,0,0)",
			borderWidth: 0
		},
		xaxis: {
			show: false,
			autoScale: 'none',
			min: -settings.historyLength_ms,
			max: 0,
			tickDecimals: 0,
			ticks: [ -settings.historyLength_ms, 0 ],
			tickLength: 0
		},
		yaxis: {
			position: 'right',
			labelWidth: 40,
			autoScale: 'none',
			min:  settings.min_power_dBm,
			max: settings.max_power_dBm,
			tickDecimals: 0,
			ticks: [ settings.min_power_dBm, threshold, settings.max_power_dBm ],
			tickLength: 0
		}
	}

	useEffect(() => {
		// save the history buffer
		histRef.current = buffer;

		$.plot($(plotRef.current), traces, options);

	},[ peak_dBm, buffer, traces, options ]);

	return (
		<div id='history-1' ref={plotRef} />
	);
};

export default HistoryPlot;

HistoryPlot.propTypes = {
	reset: PropTypes.bool,
	peak_dBm: PropTypes.number,
	config: PropTypes.object
}
