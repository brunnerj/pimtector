import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from './Panel';

const ErrorPanel = ({ panel, panelTimeout, throwError, error }) => {

	if (!error) return null;

	return (
		<Panel id={PANELS.ERROR} hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<p>{error.message}</p>

			<button className='icon fa-check-circle'
				onClick={() => throwError()}
				title='Clear'>Clear
			</button>

		</Panel>
	);
};

export default ErrorPanel;

ErrorPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	throwError: PropTypes.func,
	error: PropTypes.object
}