import React from 'react';
import PropTypes from 'prop-types';

import ConnectionPanel from './ConnectionPanel';
import MeasurementPanel from './MeasurementPanel';
import ConfigPanel from './ConfigPanel';
import ErrorPanel from './ErrorPanel';
import TipsPanel from '../components/TipsPanel';


const Main = ({ 
	panel, 
	panelTimeout, 
	connect, 
	disconnect, 
	isConnecting, 
	isConnected, 
	isPlaying, 
	throwError, 
	error, 
	settings, 
	configure, 
	data }) => {

	return (
		<div className={'main theme-' + settings.theme}>

			<ConnectionPanel panel={panel} panelTimeout={panelTimeout}
				connect={connect} isConnecting={isConnecting} />

			<MeasurementPanel isPlaying={isPlaying} panel={panel} panelTimeout={panelTimeout} 
				data={data} settings={settings} configure={configure} />

			<TipsPanel panel={panel} panelTimeout={panelTimeout}
				settings={settings} configure={configure} />

			<ConfigPanel panel={panel} panelTimeout={panelTimeout}
				settings={settings} configure={configure} throwError={throwError}
				isConnected={isConnected} disconnect={disconnect} />

			<ErrorPanel panel={panel} panelTimeout={panelTimeout}
				throwError={throwError} error={error} />

		</div>
	)
}

Main.propTypes = {
	panel: PropTypes.string,
	panelTimeout: PropTypes.bool,
	connect: PropTypes.func,
	disconnect: PropTypes.func,
	isConnecting: PropTypes.bool,
	isConnected: PropTypes.bool,
	isPlaying: PropTypes.bool,
	throwError: PropTypes.func,
	error: PropTypes.object,
	settings: PropTypes.object,
	configure: PropTypes.func,
	data: PropTypes.array
};


export default Main;