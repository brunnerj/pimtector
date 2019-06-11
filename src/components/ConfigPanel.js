import React from 'react';
import PropTypes from 'prop-types';

import Panel from './Panel';
import ToggleSwitch from './ToggleSwitch';

const ConfigPanel = ({ panel, panelTimeout, config, setConfig, onCloseConfigure }) => {

	return (
		<Panel id='configure' panel={panel} panelTimeout={panelTimeout}>

			<div className='config-item'>
				<ToggleSwitch enabled={config.sound} onChange={(e) => setConfig({ ...config, sound: e.target.isOn })} />
				<label>Sound</label>
			</div>
		
			<div className='close' onClick={onCloseConfigure}
		/>
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