import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';

const ErrorPanel = ({ panel, panelTimeout, onError, error }) => {

	return (
		<Panel id='error' panel={panel} panelTimeout={panelTimeout}>

			<p>{error}</p>

			<button className='icon fa-times'
				onClick={() => onError('')}
				title='Ok'>Ok
			</button>

		</Panel>
	);
};

export default ErrorPanel;

ErrorPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	onError: PropTypes.func,
	error: PropTypes.string
}