import React from 'react';
import PropTypes from 'prop-types';

export const PANELS = {
	CONNECTION: 'connection',
	GAUGES: 'gauges',
	TIPS: 'tips',
	SETTINGS: 'settings',
	ERROR: 'error'
}

const Panel = ({ id, hideTitle, panel, panelTimeout, children }) => {

	return (
		<div id={id}
			className={`panel ${panel === id ? 'active' : ''} ${panelTimeout ? 'timeout' : ''}`}
			style={{ display: 'none' }}>

			<h2 className='major' style={hideTitle ? {display: 'none'} : {display: 'block'}}>{id}</h2>

			{children}
		</div>
	);
};

Panel.propTypes = {
	id: PropTypes.string.isRequired,
	showTitle: PropTypes.bool,
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired
};

export default Panel;