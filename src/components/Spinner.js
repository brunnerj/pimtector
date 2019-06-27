import React from 'react';
import PropTypes from 'prop-types';


const Spinner = ({ showing, label }) => {

	return (
		<div className={`spinner ${showing ? 'active' : ''}`}>
			<span>{label}</span>
		</div>
	);
};

export default Spinner;

Spinner.propTypes = {
	showing: PropTypes.bool.isRequired,
	label: PropTypes.string
};

Spinner.defaultProps = {
	showing: false,
	label: ''
}