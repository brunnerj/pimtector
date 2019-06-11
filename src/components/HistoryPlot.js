import React from 'react';
import PropTypes from 'prop-types';

import { AreaChart } from 'react-chartkick';

const HistoryPlot = ({ data, config }) => {

	// bound the x-axis with most recent
	// point (last point in data array)
	// and minimum time of data buffer.
	let tmin, tmax;

	if (data && data.length > 0) {
		tmax = data.slice(-1)[0][0]; // latest point time value
		tmin = (new Date(tmax.getTime() - 60000)); // 60 seconds past
	}

	const rx_above_data = [];
	const rx_below_data = [];

	// For each rx data point, create 3 data sets:
	// one for threshold, one for rx data above
	// the threshold, and one for data below the
	// threshold.
	const thresholdData = data.map((point) => {

		rx_above_data.push([ point[0], Math.max(config.threshold_dBm, point[1] )]);
		rx_below_data.push([ point[0], Math.min(config.threshold_dBm, point[1] )])

		return [ point[0], config.threshold_dBm ];
	});
	const threshold = { name: 'threshold', color: '#1b1f22', points: false, data: thresholdData, dataset: { fill: false, spanGaps: true, borderWidth: 1 }};
	const rx_above = { name: 'rx_above', color: '#ff0000', points: false, data: rx_above_data, dataset: { borderColor: 'rgba(0,0,0,0)', fill: '-1', lineTension: 0 } };
	const rx_below = { name: 'rx_below', color: '#28ac70', points: false, data: rx_below_data, dataset: { borderColor: 'rgba(0,0,0,0)', fill: 'bottom', lineTension: 0 } };

	return (			
			<AreaChart 
				id='history-1'
				height='25%'
				messages={{empty: 'No data'}} 
				data={[ threshold, rx_above, rx_below ]}
				library={{ 
					maintainAspectRatio: false,
					legend: false, 
					scales: {
						xAxes: [{
							type: 'time',
							position: 'bottom',
							time: {
								min: tmin,
								max: tmax,
								tooltipFormat: 'h:mm:ss a'
							},
							ticks: {
								display: false,
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