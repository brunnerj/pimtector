import React from 'react';
import PropTypes from 'prop-types';

import Panel, { PANELS } from './Panel';
import ToggleSwitch from './ToggleSwitch';

const ConfigPanel = ({ panel, panelTimeout, settings, configure, isConnected, disconnect, throwError }) => {

	return (
		<Panel id={PANELS.SETTINGS} hideTitle={true} panel={panel} panelTimeout={panelTimeout}>

			<div className='item'>
				<ToggleSwitch enabled={settings.sound} onChange={(e) => configure({ ...settings, sound: e.target.isOn })} />
				<label>Sound: {settings.sound ? 'On' : 'Off'}</label>
			</div>

			<div className='item'>
				<ToggleSwitch enabled={settings.theme !== 'light'} onChange={(e) => configure({ ...settings, theme: (e.target.isOn ? 'dark' : 'light')})} />
				<label>Theme: {settings.theme !== 'light' ? 'Dark' : 'Light'}</label>
			</div>

			<div className='divider' />

			<div className='item'>
				<button className='icon fa-info-circle'
					onClick={() => { 
						configure({ ...settings, showtips: true });
						configure();
					}}
					disabled={settings.showtips}
					title='Show tips'>
					Show tips
				</button>
			</div>

			<div className='item'>
				<button className='icon fa-unlink'
					onClick={disconnect}
					disabled={!isConnected}
					title='Disconnect'>
					Disconnect
				</button>
			</div>
		
			<div className='divider' />
			
			{/*
			<div className='item'>
				<button className='icon fa-bomb'
					onClick={() => { throwError(Error('This is a forced error!')) } }
					title='Force Error'>
					Force Error
				</button>
			</div>
			*/}

		</Panel>
	);
};

export default ConfigPanel;

ConfigPanel.propTypes = {
	panel: PropTypes.string.isRequired,
	panelTimeout: PropTypes.bool.isRequired,
	settings: PropTypes.object,
	configure: PropTypes.func
}