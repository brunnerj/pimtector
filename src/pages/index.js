import React, { useEffect, useReducer } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import { Helmet } from 'react-helmet-async';

import { PANELS } from '../components/Panel';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

import Receiver from '../components/Receiver';

import '../assets/scss/main.scss';

// Action Types
const CONNECT = 'connect';
const CONNECTED = 'connected';
const DISCONNECT = 'disconnect';
const PLAY = 'play';
const PAUSE = 'pause';
const BATTERY = 'battery';
const RECEIVER = 'receiver';
const CLEAR = 'clear';
const ERROR = 'error';
const PANEL = 'panel';
const PANEL_TIMEOUT = 'panelTimeout';
const CONFIGURE = 'configure';

// Action creators
const connect = d => ({ type: CONNECT, data: d });
const connected = () => ({ type: CONNECTED });
const disconnect = () => ({ type: DISCONNECT });
const panel = p => ({ type: PANEL, data: p });
const timeout = () => ({ type: PANEL_TIMEOUT, data: true }); 
const play = () => ({ type: PLAY });
const pause = () => ({ type: PAUSE });
const clear = () => ({ type: CLEAR });
const battery = level => ({ type: BATTERY, data: level });
const receiver = traces => ({ type: RECEIVER, data: traces });
const throwError = e => ({ type: ERROR, data: e });
const configure = settings => ({ type: CONFIGURE, data: settings });

let dispatch = () => {};

// Application State
const initialState = {
	panel: PANELS.CONNECTION,
	panelTimeout: true,

	isConnected: false,
	isConnecting: false,
	isPlaying: false,

	error: null,
	battery: null,
	traces: [],

	settings: {
		sound: true,
		theme: 'light',
		showtips: true,
		
		threshold_dBm: -105,
		min_power_dBm: -130,
		max_power_dBm: -80,
		historyLength_ms: 20000,

		spectrum_traces: 16,
		spectrum_trace_color: { R: 242, G: 194, B: 79 }, // trace-color: 242, 194, 79

		pass_color: '#00bb00', // pass-color in _vars.scss
		fail_color: '#ff0000', // error-color in _vars.scss
		threshold_line_dark: '#1b1f22', // theme-light-fg
		threshold_line_light: '#e4e0dd' // theme-dark-fg
	}
};

// Reducer - take action types and update
// application state
const reducer = (state = initialState, action = {}) => {

	let panel = state.panel;
	let panelTimeout = state.panelTimeout;

	switch (action.type) {
		case CONNECT:
			
			dispatch = action.data;

			Receiver.connect({
				batteryFn: (level) => { dispatch(battery(level)); },
				receiverFn: (traces) => { 
					dispatch(receiver(traces)); 
				}
				})
				.then(() => {
					dispatch(connected());
				})
				.catch(e => {
					dispatch(disconnect());
					dispatch(throwError(e));
				});
			return {
				...state,
				isConnecting: true
			}
		case CONNECTED:
			return {
				...state,
				isConnecting: false,
				isConnected: true,
				panel: PANELS.GAUGES,
				panelTimeout: true
			}
		case DISCONNECT:

			Receiver.disconnect().catch(e => {
				dispatch(throwError(e));
			});

			return {
				...state,
				panel: PANELS.CONNECTION,
				panelTimeout: !state.isConnected,
				isPlaying: false,
				isConnecting: false,
				isConnected: false,
				battery: null
			};
		case PLAY:
			Receiver.play().catch(e => dispatch(throwError(e)));
			return {
				...state,
				isPlaying: true
			};
		case PAUSE:
			Receiver.pause().catch(e => dispatch(throwError(e)));
			return {
				...state,
				isPlaying: false
			};
		case BATTERY:
			return {
				...state,
				battery: action.data
			};
		case RECEIVER:
			return {
				...state,
				traces: action.data
			};
		case CLEAR:
			Receiver.clear();
			return {
				...state,
				traces: []
			};
		case ERROR:
			const e = action.data;

			if (!e) {
				// no errors - pick new panel
				panel = state.isConnected ? PANELS.GAUGES : PANELS.CONNECTION;
			} else {
				panel = PANELS.ERROR;
			}

			return {
				...state,
				panelTimeout: false,
				panel: panel,
				error: e
			};
		case PANEL:
			panel = action.data;

			if (state.panel !== panel) {
				panelTimeout = false;
			}
			return {
				...state,
				panelTimeout: panelTimeout,
				panel: panel
			};
		case PANEL_TIMEOUT:
			return {
				...state,
				panelTimeout: action.data
			}
		case CONFIGURE:
			return {
				...state,
				settings: action.data
			}
		default:
			return state;
	}
};

const IndexPage = () => {

	const siteInfo = useStaticQuery(
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
		setTimeout(() => { dispatch(timeout()) }, 350);
	}, [state.panelTimeout]);

	const configureFn = settings => {
		if (settings) {
			dispatch(configure(settings));
		} else {
			if (state.panel === PANELS.SETTINGS) {
				dispatch(panel(state.isConnected 
					? PANELS.GAUGES 
					: PANELS.CONNECTION));
			} else {
				dispatch(panel(PANELS.SETTINGS));
			}
		}
	}

	return (
		<>
			<Helmet
				title={siteInfo.site.siteMetadata.title}
				meta={[
					{
						name: 'description',
						content: siteInfo.site.siteMetadata.description,
					},
					{
						name: 'keywords',
						content: siteInfo.site.siteMetadata.keywords,
					},
				]}>
				<html lang="en" />
			</Helmet>

			<div className='wrapper'>
				<Header 
					isConnected={state.isConnected}
					isPlaying={state.isPlaying}

					play={() => dispatch(play())}
					pause={() => dispatch(pause())}
					canPlay={state.isConnected && !state.errors}

					clear={() => dispatch(clear())}
					canClear={state.isConnected && state.traces.length > 0}

					configure={configureFn}
					canConfigure={!state.errors && !state.isConnecting}

					battery={state.battery}

					settings={state.settings}
				/>

				<Main
					panel={state.panel}
					panelTimeout={state.panelTimeout}

					connect={() => dispatch(connect(dispatch))}
					disconnect={() => dispatch(disconnect())}
					isConnecting={state.isConnecting}
					isConnected={state.isConnected}
					
					isPlaying={state.isPlaying}

					throwError={e => dispatch(throwError(e))}
					error={state.error}

					settings={state.settings}
					configure={configureFn}

					traces={state.traces}
				/>

				<Footer show={state.panel !== PANELS.GAUGES} theme={state.settings.theme} />
			</div>
		</>
	);
}

export default IndexPage;
