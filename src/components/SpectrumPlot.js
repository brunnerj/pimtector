import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require('flot');

const SpectrumPlot = ({ traces, settings }) => {
	
	const plotRef = useRef(); // plot container DOM reference
	const plotObj = useRef(); // plot object reference

	// calculate successive trace colors
	const traceColors = [...Array(settings.spectrum_traces)].map((_, i) => {
		const c = 1 - (i / settings.spectrum_traces);
		return 'rgba(' + 
			settings.spectrum_trace_color.R + ',' + 
			settings.spectrum_trace_color.G + ',' + 
			settings.spectrum_trace_color.B + ',' + c.toFixed(2) + ')';
	});

	let trace, fstart, fstop;

	if (traces && traces.length && traces[0].data) {

		trace = traces[0];
		fstart = trace.data[0][0];
		fstop = trace.data[trace.data.length - 1][0];

		// push a negative infinity for the trace[0] fill point
		traces[0].data = traces[0].data.map(p => [ p[0], p[1], Number.NEGATIVE_INFINITY ]);

		trace.lines = { fill: true, fillColor: { colors: [ { opacity: 0 }, { opacity: 0.2 } ] }, lineWidth: 2 };
	}

	// Add the threshold trace here as trace[0]
	traces = [{ data: [ [fstart, settings.threshold_dBm ],[fstop, settings.threshold_dBm] ]}].concat(traces);

	const options = {
		series: {
			shadowSize: 0
		},
		colors: ['rgb(255,0,0)'].concat(traceColors),
		grid: {
			margin: { top: 0, right: 5, bottom: 0, left: 0 }
		},
		yaxis: {
			position: 'right',
			axisLabel: 'Power [dBm]',
			autoScale: 'none',
			min: settings.min_power_dBm,
			max: settings.max_power_dBm
		},
		xaxis: {
			axisLabel: 'Frequency [MHz]',
			autoScale: 'none',
			min: fstart,
			max: fstop,
			tickDecimals: 3,
			ticks: 5
		}
	}

	useLayoutEffect(() => {
		
		// update the plot, save the plot object
		plotObj.current = $.plot($(plotRef.current), traces, options);

	},[ traces, options ]);

	return (
		<div id='spectrum-1' ref={plotRef} />
	);
};

export default SpectrumPlot;

SpectrumPlot.propTypes = {
	traces: PropTypes.array,
	settings: PropTypes.object
}
