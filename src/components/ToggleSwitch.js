import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ enabled, onChange }) => {

	const [ on, setOn ] = useState(!!enabled);

	const switchClass = 'toggle-switch' + (on ? ' on' : ' off');

	function handleClick(e) {
		e.preventDefault();
		const newState = !enabled;

		setOn(newState);

		// return the event in the onChange parameter
		// but add the 'isOn' attribute to the event
		// target.
		e.target = {...e.target, isOn: newState};

		onChange(e);
	}

	return (
		<div className={switchClass} onClick={(e) => handleClick(e)}>
			<div className='thumb'/>
		</div>
	);
}

export default ToggleSwitch;

ToggleSwitch.propTypes = {
	enabled: PropTypes.bool,
	onChange: PropTypes.func
}