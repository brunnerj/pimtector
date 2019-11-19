import React from 'react';
import PropTypes from 'prop-types';

const VOLUME = 10;
const BEEP_TIME_s = 0.1; 


// Web audio API
let _ctx;
let _osc;
let _g;

const setFrequency = (value, threshold, max) => {

	const BEEP_HI_FREQ_hz = 791;
	const BEEP_LO_FREQ_hz = 202;

	// Value above threshold corresponds to an audible tone at a frequency
	// somewhere between when the value is right at the threshold (BEEP_LO_FREQ_hz)
	// and when the value is at the maximum allowed (BEEP_HI_FREQ_hz).  We just do
	// a linear fit to get the frequency when the value is somewhere in between.

	// Using the point-slope form of a line:
	//		y1 - y0 = m * (x1 - x0)
	// Our y-values are beep frequency, and our x-values are the measured power value.

	// Slope, m = (y1 - y0) / (x1 - x0)
	const m = (BEEP_HI_FREQ_hz - BEEP_LO_FREQ_hz) / (max - threshold);

	// Intercept, b, can be obtained from either known point.
	//		y1 = m * x1 + b => b = y1 - m * x1
	//		b = y1 - m * x1
	const b = BEEP_HI_FREQ_hz - m * max;

	return m * value + b;
}


const ToneGenerator = ({ isPlaying, data, settings }) => {

	// value from data is interpreted as the peak value corresponding
	// to a tonal frequency (if the value is above a threshold).
	const value = (data && data.length && data.slice(-1)[0][1]) || null;

	if (isPlaying && settings.sound && value && value >= settings.threshold_dBm) {

		// create a new AudioContext if necessary
		if (!_ctx) {
			_ctx = new AudioContext();
			_osc = _ctx.createOscillator();
			_g = _ctx.createGain();
			_g.gain.value = 0; // start silent

			_osc.connect(_g);
			_g.connect(_ctx.destination);

			_osc.start(); // start the oscillator
		}

		_osc.frequency.value = setFrequency(value, settings.threshold_dBm, settings.max_power_dBm);
		_g.gain.exponentialRampToValueAtTime(VOLUME, _ctx.currentTime + BEEP_TIME_s);

	} else {

		// ramp down volume if we've got a context
		if (_ctx) {
			_g.gain.exponentialRampToValueAtTime(0.00001, _ctx.currentTime + BEEP_TIME_s);

			// close AudioContext if we're not playing or if sound is turned off
			if (!isPlaying || !settings.sound) {

				_ctx.close().then(_ => {
					_ctx = null;
					_osc = null;
					_g = null;	
				});
			}
		}
	}

	return (
		<div style={{ display: 'none' }}></div>
	);
}

export default ToneGenerator;


ToneGenerator.propTypes = {
	isPlaying: PropTypes.bool,
	data: PropTypes.array,
	settings: PropTypes.object
}