import React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from 'react-chartkick';

const GaugePlot = ({ value, min, max, passColor, failColor }) => {

	const min_percent = 0;
	const max_percent = 75;
	const value_percent = ((max_percent - min_percent) / (max - min)) * (value - max) + max_percent;
	
	const series = {
		'goodZone': value_percent,
		'alertZone': max_percent - value_percent,
		'transparent': 25
	};

	return (
		<PieChart id='gauge-1' 
			donut={true}
			data={series}
			colors={[passColor, failColor, 'rgba(0,0,0,0)']}
			library={{
				cutoutPercentage: 75,
				circumference: 2 * Math.PI,
				rotation: (3 / 4) * Math.PI,
				maintainAspectRatio: false,
				legend: false,
				elements: {
					arc: {
						borderColor: '#00f',
						borderWidth: 0
					}
				}
			}}
			
		/>
	);
};

GaugePlot.defaultProps = {
	passColor: '#00ff00',
	failColor: '#ff0000'
}

const Gauge = ({ value, unit, min, max, threshold, passColor, failColor }) => {
	
	const valueString = value ? value.toFixed(1) : '--';

	const start_deg = 45;
	const stop_deg = 315;

	const m = (stop_deg - start_deg) / (max - min);

	let needleStyle = {};
	let rotValue;
	let rot;

	if (value) {

		rotValue = m * (value - min) + start_deg;
		rot = 'rotate(' + rotValue + 'deg)';
		
		needleStyle = {
			WebkitTransform: rot,
			msTransform: rot,
			transform: rot
		}
	}

	return (
		<div className='gauge'>

			<GaugePlot passColor={passColor} failColor={failColor} value={threshold} min={min} max={max} />

			<div className='readout'>
				<div className='needle' style={needleStyle}></div>
				<div className='value'>{valueString}</div>
				<div className='unit'>{unit}</div>
			</div>

			<div className='gauge-scale'>
				<span className='min'>{min}</span>
				<span className='max'>{max}</span>
			</div>
		</div>
	);
};

export default Gauge;

Gauge.propTypes = {
	value: PropTypes.number,
	unit: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
	threshold: PropTypes.number,
	passColor: PropTypes.string,
	failColor: PropTypes.string
}

Gauge.defaultProps = {
	passColor: '#00ff00',
	failColor: '#ff0000'
}
