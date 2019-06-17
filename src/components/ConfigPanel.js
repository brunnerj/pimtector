import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import ToggleSwitch from './ToggleSwitch';

const ConfigPanel = ({ panel, panelTimeout, config, setConfig, onCloseConfigure, onDisconnect }) => {

	return (
		<Panel id='settings' panel={panel} panelTimeout={panelTimeout}>

			<div className='item'>
				<ToggleSwitch enabled={config.sound} onChange={(e) => setConfig({ ...config, sound: e.target.isOn })} />
				<label>Sound</label>
			</div>

			<div className='item'>
				<button className='icon fa-link' onClick={onDisconnect} title='Connect'>Disconnect
			</button>

			</div>
		
			<div className='close' onClick={onCloseConfigure}></div>
		</Panel>
	);
};

export default ConfigPanel;

ConfigPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	config: PropTypes.object,
	setConfig: PropTypes.func,
	onCloseConfigure: PropTypes.func
}