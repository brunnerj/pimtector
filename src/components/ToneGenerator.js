import React from 'react';
import PropTypes from 'prop-types';

const VOLUME = 10;
const BEEP_TIME_s = 0.05; 

const BEEP_HI_FREQ_hz = 791;
const BEEP_LO_FREQ_hz = 202;


const beeper = (() => {

	let _ctx;
	let _osc;
	let _g;

	let _freq_Hz = 440.0;
	
	function _setFreq_Hz(f) {
		_freq_Hz = f;
	}

	function _beep(on) {

		if (!_ctx) {
			_ctx = new AudioContext();
			_osc = _ctx.createOscillator();
			//_osc.type = 'triangle';
			_g = _ctx.createGain();
			_g.gain.value = 0; // start silent

			_osc.connect(_g);
			_g.connect(_ctx.destination);

			_osc.start(); // start the oscillator
		}

		if (on) {
		
			_osc.frequency.value = _freq_Hz;

			_g.gain.exponentialRampToValueAtTime(VOLUME, _ctx.currentTime + BEEP_TIME_s);

		} else {
			_g.gain.exponentialRampToValueAtTime(0.00001, _ctx.currentTime + BEEP_TIME_s)

		}
	}

	return {
		setFreq_Hz: _setFreq_Hz,
		beep: _beep
	}
})();

const ToneGenerator = ({ isPlaying, data, config }) => {

	const value = (data && data.length && data.slice(-1)[0][1]) || null;

	// Value above threshold corresponds to an audible tone at a frequency
	// somewhere between when the value is right at the threshold (BEEP_LO_FREQ_hz)
	// and when the value is at the maximum allowed (BEEP_HI_FREQ_hz).  We just do
	// a linear fit to get the frequency when the value is somewhere in between.

	// Using the point-slope form of a line:
	//		y1 - y0 = m * (x1 - x0)
	// Our y-values are beep frequency, and our x-values are the measured power value.

	// Slope, m = (y1 - y0) / (x1 - x0)
	const m = (BEEP_HI_FREQ_hz - BEEP_LO_FREQ_hz) / (config.max_power_dBm - config.threshold_dBm);

	// Intercept, b, can be obtained from either known point.
	//		y1 = m * x1 + b => b = y1 - m * x1
	//		b = y1 - m * x1
	const b = BEEP_HI_FREQ_hz - m * config.max_power_dBm;

	let freq_Hz = 0;
	let beep = false;

	if (value) {
		freq_Hz = m * value + b;
		beep = isPlaying && value >= config.threshold_dBm && config.sound;
	}

	beeper.setFreq_Hz(freq_Hz);
	beeper.beep(beep);

	return (
		<div style={{ display: 'none' }}></div>
	);
}

export default ToneGenerator;


ToneGenerator.propTypes = {
	isPlaying: PropTypes.bool,
	data: PropTypes.array,
	config: PropTypes.object
}