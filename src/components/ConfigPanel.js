import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import ToggleSwitch from './ToggleSwitch';

const ConfigPanel = ({ panel, panelTimeout, config, setConfig, isConnected, onDisconnect }) => {

	return (
		<Panel id='settings' hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<div className='item'>
				<ToggleSwitch enabled={config.sound} onChange={(e) => setConfig({ ...config, sound: e.target.isOn })} />
				<label>Sound: {config.sound ? 'On' : 'Off'}</label>
			</div>

			<div className='item'>
				<ToggleSwitch enabled={config.darktheme} onChange={(e) => setConfig({ ...config, darktheme: e.target.isOn })} />
				<label>Theme: {config.darktheme ? 'Dark' : 'Light'}</label>
			</div>

			<div className='divider' />

			<div className='item'>
				<button className='icon fa-unlink'
					onClick={onDisconnect}
					disabled={!isConnected}
					title='Disconnect'>
					Disconnect
				</button>
			</div>
		
		</Panel>
	);
};

export default ConfigPanel;

ConfigPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	config: PropTypes.object,
	setConfig: PropTypes.func
}