import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';

const ConnectionPanel = ({ panel, panelTimeout, onConnect, isConnecting }) => {

	return (
		<Panel id='connection' panel={panel} panelTimeout={panelTimeout}>

			<p>I am what you see when there is no receiver connected!</p>

			<button className='icon fa-link'
				onClick={() => onConnect()}
				title='Connect'>Connect
			</button>

			<div className={`spinner ${isConnecting ? 'active' : ''}`}>
				<div className='signal'></div>
				Connecting...
			</div>
		</Panel>
	);
};

export default ConnectionPanel;

ConnectionPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	onConnect: PropTypes.func,
	isConnecting: PropTypes.bool
}