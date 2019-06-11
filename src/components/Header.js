import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ canPlay, canConfigure, canClear, isPlaying, onPlay, onPause, onClear, onConfigure }) => {

	return (
		<header>
			<nav id='left'>
				<button 
					className={'icon ' + (isPlaying ? 'fa-pause' : 'fa-play')}
					title={isPlaying ? 'Pause' : 'Play'}
					onClick={() => { isPlaying ? onPause() : onPlay(); }}
					disabled={!canPlay}>
				</button>
				<span className='appName'>PIMtector&reg;</span>
			</nav>
			<nav id='right'>
				<button 
					className='icon fa-trash'
					onClick={() => { onClear(); }}
					title='Clear'
					disabled={!canClear}>
				</button>
				<button 
					className='icon fa-cog'
					onClick={() => { onConfigure(); }}
					title='Configure'
					disabled={!canConfigure}>
				</button>
			</nav>
		</header>
	);
}

Header.propTypes = {
	canPlay: PropTypes.bool,
	canConfigure: PropTypes.bool,
	canClear: PropTypes.bool,
	onConfigure: PropTypes.func,
	isPlaying: PropTypes.bool,
	onPlay: PropTypes.func,
	onPause: PropTypes.func,
	onClear: PropTypes.func
}

export default Header;


