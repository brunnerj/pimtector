import React from 'react';
import PropTypes from 'prop-types';

import ConnectionPanel from './ConnectionPanel';
import GaugesPanel from './GaugesPanel';
import ConfigPanel from './ConfigPanel';
import ErrorPanel from './ErrorPanel';

const Main = ({ panel, panelTimeout, onConnect, isConnecting, isPlaying, onError, error, config, setConfig, onCloseConfigure, data }) => {

	return (
		<div className='main'>

			<ConnectionPanel panel={panel} panelTimeout={panelTimeout}
				onConnect={onConnect} isConnecting={isConnecting} />

			<GaugesPanel panel={panel} panelTimeout={panelTimeout} 
				isPlaying={isPlaying} data={data} config={config} />

			<ConfigPanel panel={panel} panelTimeout={panelTimeout}
				config={config} setConfig={setConfig} onCloseConfigure={onCloseConfigure} />

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
	onCloseConfigure: PropTypes.func,
	data: PropTypes.array,
	threshold_dBm: PropTypes.number
};


export default Main;