import React from 'react';
//import PropTypes from 'prop-types';


const Gauge = ({ data }) => {
	
	const value = (data && data.length && data.slice(-1)[0][1].toFixed(1)) || '--';

	return (
		<div className='gauge'>

			<svg className='canvas' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
				<circle cx='25' cy='25' r='24' fill='transparent' strokeWidth='2' stroke='black' />
			</svg>

			<div className='readout'>
				<div className='value'>{value}</div>
				<div className='unit'>dBm</div>
			</div>
		</div>
	);
};

export default Gauge;

//Gauge.propTypes = {
//}