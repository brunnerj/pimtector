import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ className, color }) => (
	<svg viewBox="0 0 480 480" className={className}>
		<path
			fill={color}
			d="m310,187.34c0,41.64 -37.5,69.8 -37.5,102.66l-19.92,0c0,-20.79 9.97,-38.26 19.68,-55.13c9.12,-15.85 17.74,-30.83 17.74,-47.53c0,-31.08 -25.17,-47.34 -50.04,-47.34c-24.83,0 -49.96,16.26 -49.96,47.34c0,16.7 8.62,31.68 17.74,47.53c9.71,16.87 19.66,34.34 19.67,55.13l-19.91,0c0,-32.86 -37.5,-61.03 -37.5,-102.66c0,-43.43 34.98,-67.34 69.96,-67.34c35.02,0 70.04,23.94 70.04,67.34zm-40,117.66c0,2.76 -2.24,5 -5,5l-50,0c-2.76,0 -5,-2.24 -5,-5s2.24,-5 5,-5l50,0c2.76,0 5,2.24 5,5zm0,20c0,2.76 -2.24,5 -5,5l-50,0c-2.76,0 -5,-2.24 -5,-5s2.24,-5 5,-5l50,0c2.76,0 5,2.24 5,5zm-17.01,31.59c-1.9,2.16 -4.65,3.41 -7.53,3.41l-10.93,0c-2.88,0 -5.62,-1.25 -7.52,-3.41l-14.51,-16.59l55,0l-14.51,16.59z"
		/>
		<path
			fill="transparent"
			stroke={color}
			strokeLinejoin="round"
			strokeWidth="20"
			d="m20,90l220,360l220,-360l-440,0z"
		/>
	</svg>
);

Logo.propTypes = {
	className: PropTypes.string,
	color: PropTypes.string,
};

Logo.defaultProps = {
	className: undefined,
	color: '#F00',
};

export default Logo;
