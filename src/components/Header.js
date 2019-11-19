import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ 
	isConnected,
	isPlaying, 

	play, 
	pause, 
	canPlay, 

	clear, 
	canClear, 

	configure,
	canConfigure, 

	battery,

	settings }) => {

	const battery_level = (battery && parseFloat(battery)) || 0;

	let battery_class = 'empty';
	let battery_title = `${battery_level.toFixed(0)}%`;


	if (battery_level >= 95) {
		battery_class = 'full';
	} else if (battery_level >= 70) {
		battery_class = 'three-quarters';
	} else if (battery_level >= 45) {
		battery_class = 'half';
	} else if (battery_level >= 20) {
		battery_class = 'quarter';
	} else {
		battery_title = 'Battery';
	}

	return (
		<header className={'theme-' + settings.theme}>
			<nav id='left'>
				<button 
					className={'icon ' + (isPlaying ? 'fa-pause' : 'fa-play')}
					title={isPlaying ? 'Pause' : 'Play'}
					onClick={() => { isPlaying ? pause() : play(); }}
					disabled={!canPlay}>
				</button>
				<span className='branding'>PIM<span>tector</span>&trade;</span>
			</nav>
			<nav id='right'>
				<button 
					className='icon fa-trash'
					onClick={() => { clear(); }}
					title='Clear'
					disabled={!canClear}>
				</button>
				<button 
					className={'icon fa-battery-' + battery_class}
					onClick={() => { }}
					title={battery_title}
					disabled={!isConnected}>
				</button>
				<button 
					className='icon fa-cog'
					onClick={() => { configure(); }}
					title='Configure'
					disabled={!canConfigure}>
				</button>
			</nav>
		</header>
	);
}

Header.propTypes = {
	isConnected: PropTypes.bool,
	isPlaying: PropTypes.bool,

	play: PropTypes.func,
	pause: PropTypes.func,
	canPlay: PropTypes.bool,

	clear: PropTypes.func,
	canClear: PropTypes.bool,

	configure: PropTypes.func,
	canConfigure: PropTypes.bool,

	battery: PropTypes.number,
	settings: PropTypes.object
}

export default Header;


