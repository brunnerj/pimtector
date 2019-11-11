import React, { useEffect, useReducer } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Helmet from 'react-helmet';

import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

import 'chart.js';
import '../assets/scss/main.scss';

const CONNECT_DELAY_ms = 2000; // time until connected
const BUFFER_LENGTH_ms = 60000; // how deep is rx buffer
const LOOP_RATE_ms = 100; // Rx polling delay
const BUFFER_LENGTH_points = BUFFER_LENGTH_ms / LOOP_RATE_ms;

const MIN_POWER_dBm = -120; // min Rx range
const MAX_POWER_dBm = -90; // max Rx range
const NOISE_dB = 1.5;


const fakeReceiver = (function() {

	let _dispatcher = null;
	let _tid = null; // timer id
	let _prev = null; // previous Rx value

	function _rx() {
		const d = new Date();
		let min = MIN_POWER_dBm;
		let max = MAX_POWER_dBm;

		if (_prev) {
			min = Math.max(MIN_POWER_dBm, _prev - NOISE_dB);
			max = Math.min(MAX_POWER_dBm, _prev + NOISE_dB);
		}

		const newValue = Math.random() * (max - min) + min;

		_prev = Math.max(Math.min(newValue, max), min);

		return [ d, _prev ];
	}

	const _connect = (dispatcher) => {
		if (_dispatcher) return; // already connected

		_dispatcher = dispatcher;

		setTimeout(() => { _dispatcher({ type: 'connected' }); }, CONNECT_DELAY_ms);
	}

	const _disconnect = () => {
		if (!_dispatcher) return;
		if (_tid) _pause();
		_prev = null;
		_dispatcher = null;
	}

	const _play = () => {
		if (!_dispatcher) return; // fakeReceiver is not connected
		if (_tid) {
			clearTimeout(_tid);
			_tid = null;
		}
		_tid = setTimeout(() => {
			_dispatcher({ type: 'data', data: _rx() });

			if (_tid) {
				_play();
			} else {
				_pause();
			}
		}, LOOP_RATE_ms);
	}

	const _pause = () => {
		if (!_dispatcher) return; // fakeReceiver is not connected

		console.log('[IndexPage] PAUSING FakeReceiver!!!!');

		clearTimeout(_tid);
		_tid = null;
		_prev = null;
	}

	return {
		connect: _connect,
		disconnect: _disconnect,
		play: _play,
		pause: _pause
	}
}());
// window.fakeReceiver = fakeReceiver; // for console debugging

const initialState = {
	isConnected: false,
	isConnecting: false,
	isPlaying: false,
	error: '',
	panel: 'connection',
	panelTimeout: true,
	data: [],

	config: {
		sound: true,
		darktheme: false,
		showtips: true,
		
		threshold_dBm: -105,
		min_power_dBm: -130,
		max_power_dBm: -80,

		pass_color: '#28ac70', // theme-color in _vars.scss
		fail_color: '#ff0000', // error-color in _vars.scss
		threshold_line_dark: '#1b1f22', // theme-light-fg
		threshold_line_light: '#ffffff' // theme-dark-fg

	}
};

const reducer = (state, action) => {
	let panel = state.panel;
	let panelTimeout = state.panelTimeout;

	switch (action.type) {
		case 'connect':
			fakeReceiver.connect(action.data);
			return {
				...state,
				isConnecting: true
			};
		case 'connected':
			return {
				...state,
				isConnecting: false,
				isConnected: true,
				panel: 'gauges',
				panelTimeout: true
			}
		case 'disconnect':
			fakeReceiver.disconnect();
			return {
				...state,
				panel: 'connection',
				panelTimeout: !state.isConnected,
				isPlaying: false,
				isConnected: false
			};
		case 'play':
			fakeReceiver.play();
			return {
				...state,
				isPlaying: true
			};
		case 'pause':
			fakeReceiver.pause();
			return {
				...state,
				isPlaying: false
			};
		case 'data':
			const data = state.data;
			if (data.length >= BUFFER_LENGTH_points) 
				data.shift();
			data.push(action.data);

			return {
				...state,
				data: data
			};
		case 'clear':
			return {
				...state,
				data: []
			};
		case 'error':
			const error = action.data;

			if (error === '' ) {
				// no errors - pick new panel
				panel = state.isConnected ? 'gauges' : 'connection';
			} else {
				panel = 'error';
			}

			return {
				...state,
				panelTimeout: false,
				panel: panel,
				error: error
			};
		case 'panel':
			panel = action.data;

			if (state.panel !== panel) {
				panelTimeout = false;
			}
			return {
				...state,
				panelTimeout: panelTimeout,
				panel: panel
			};
		case 'panelTimeout':
			return {
				...state,
				panelTimeout: action.data
			}
		case 'config':
			return {
				...state,
				config: action.data
			}
		default:
			return state;
	}
};

const IndexPage = () => {

	const data = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						keywords
					}
				}
			}
		`
	);

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		setTimeout(() => { dispatch({ type: 'panelTimeout', data: true }) }, 350);
	}, [state.panelTimeout]);

	return (
		<>
			<Helmet
				title={data.site.siteMetadata.title}
				meta={[
					{
						name: 'description',
						content: data.site.siteMetadata.description,
					},
					{
						name: 'keywords',
						content: data.site.siteMetadata.keywords,
					},
				]}>
				<html lang="en" />
			</Helmet>

			<div className='wrapper'>
				<Header 
					darktheme={state.config.darktheme}

					canPlay={state.isConnected && state.error === ''}
					canConfigure={state.error === '' && !state.isConnecting}
					onToggleConfigure={() => {
						if (state.panel === 'settings')
						{
							dispatch({ type: 'panel', data: state.isConnected ? 'gauges' : 'connection' });
						} else {
							dispatch({ type: 'panel', data: 'settings' });
						}
					}}

					isPlaying={state.isPlaying}
					canClear={state.data.length > 0}
					onPlay={() => dispatch({ type: 'play' })}
					onPause={() => dispatch({ type: 'pause' })}
					onClear={() => dispatch({ type: 'clear' })}
				/>

				<Main
					darktheme={state.config.darktheme}
					panel={state.panel}
					panelTimeout={state.panelTimeout}
					onConnect={() => dispatch({ type: 'connect', data: dispatch })}
					onDisconnect={() => dispatch({ type: 'disconnect' })}
					isConnecting={state.isConnecting}
					isConnected={state.isConnected}
					isPlaying={state.isPlaying}
					data={state.data}
					onError={(err) => dispatch({ type: 'error', data: err })}
					error={state.error}
					config={state.config}
					setConfig={(config) => dispatch({ type: 'config', data: config })}
				/>

				<Footer darktheme={state.config.darktheme} panel={state.panel} />
			</div>
		</>
	);
}

export default IndexPage;
