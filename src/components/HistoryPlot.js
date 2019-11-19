import React from 'react';
import PropTypes from 'prop-types';

import { AreaChart } from 'react-chartkick';

const HistoryPlot = ({ data, settings }) => {

	// bound the x-axis with most recent
	// point (last point in data array)
	// and minimum time of data buffer.
	let tmin, tmax;

	if (data && data.length > 0) {
		tmax = data.slice(-1)[0][0]; // latest point time value
		tmin = (new Date(tmax.getTime() - 60000)); // 60 seconds past
	}

	const aboveData = [];
	const belowData = [];

	const threshold = settings.threshold_dBm;

	// For each rx data point, create 3 data sets:
	// one for threshold, one for rx data above
	// the threshold, and one for data below the
	// threshold.
	const thresholdData = data.map((point) => {

		aboveData.push([ point[0], Math.max(threshold, point[1] )]);
		belowData.push([ point[0], Math.min(threshold, point[1] )]);

		return [ point[0], threshold ];
	});

	const passColor = settings.pass_color;
	const failColor = settings.fail_color;

	const thresholdLineColor = settings.darktheme ? settings.threshold_line_light : settings.threshold_line_dark;

	const thresholdSeries = { name: 'threshold', color: thresholdLineColor, points: false, data: thresholdData, dataset: { fill: false, spanGaps: true, borderWidth: 1 }};
	const aboveSeries = { name: 'above', color: failColor, points: false, data: aboveData, dataset: { borderColor: 'rgba(0,0,0,0)', fill: '-1', lineTension: 0 } };
	const belowSeries = { name: 'below', color: passColor, points: false, data: belowData, dataset: { borderColor: 'rgba(0,0,0,0)', fill: 'bottom', lineTension: 0 } };

	return (
		<AreaChart 
			id='history-1'
			height='25%'
			data={[ thresholdSeries, aboveSeries, belowSeries ]}
			library={{ 
				maintainAspectRatio: false,
				legend: false, 
				scales: {
					xAxes: [{
						type: 'time',
						position: 'bottom',
						time: {
							tooltipFormat: 'h:mm:ss a'
						},
						ticks: {
							display: false,
							min: tmin,
							max: tmax
						},
						gridLines: {
							display: false,
							drawTicks: false,
							drawBorder: false
						}
					}],
					yAxes: [{
						type: 'linear',
						position: 'right',
						gridLines: {
							display: false
						},
						ticks: {
							min: -130,
							max: -80,
							maxTicksLimit: 2
						}
					}]
				}
			}}
		/>
	);
};

export default HistoryPlot;

HistoryPlot.propTypes = {
	data: PropTypes.array,
	config: PropTypes.object
}
