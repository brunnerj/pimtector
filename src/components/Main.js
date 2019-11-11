import React from 'react';
import PropTypes from 'prop-types';

import ConnectionPanel from './ConnectionPanel';
import MeasurementPanel from './MeasurementPanel';
import ConfigPanel from './ConfigPanel';
import ErrorPanel from './ErrorPanel';
import TipsPanel from '../components/TipsPanel';


const Main = ({ 
	darktheme, 
	panel, 
	panelTimeout, 
	onConnect, 
	isConnecting, 
	isConnected, 
	isPlaying, 
	onError, 
	error, 
	config, 
	setConfig, 
	onDisconnect, 
	data }) => {

	const cls = 'main theme-' + (darktheme ? 'dark' : 'light');

	return (
		<div className={cls}>

			<ConnectionPanel panel={panel} panelTimeout={panelTimeout}
				onConnect={onConnect} isConnecting={isConnecting} />

			<MeasurementPanel isPlaying={isPlaying} panel={panel} panelTimeout={panelTimeout} 
				data={data} config={config} setConfig={setConfig} />

			<TipsPanel panel={panel} panelTimeout={panelTimeout}
				config={config} 
				setConfig={setConfig} />

			<ConfigPanel panel={panel} panelTimeout={panelTimeout}
				config={config} setConfig={setConfig} onError={onError}
				isConnected={isConnected} onDisconnect={onDisconnect} />

			<ErrorPanel panel={panel} panelTimeout={panelTimeout}
				onError={onError} error={error} />

		</div>
	)
}

Main.propTypes = {
	panel: PropTypes.string,
	panelTimeout: PropTypes.bool,
	onConnect: PropTypes.func,
	onDisconnect: PropTypes.func,
	isConnecting: PropTypes.bool,
	isPlaying: PropTypes.bool,
	onError: PropTypes.func,
	error: PropTypes.string,
	config: PropTypes.object,
	setConfig: PropTypes.func,
	data: PropTypes.array,
	threshold_dBm: PropTypes.number
};


export default Main;