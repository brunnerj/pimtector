import React from 'react';

const beeper = (() => {

	const VOLUME = 1;
	const BEEP_TIME_s = 0.05; 
	const BEEP_REPEAT_ms = 200; 
	let _ctx;
	let _osc;
	let _g;

	let _beeping = false;
	let _beeperTmo = null;
	let _freq_Hz = 440.0;

	function _beeper(isBeeping) {
		if (isBeeping) {
			_g.gain.exponentialRampToValueAtTime(VOLUME, _ctx.currentTime + BEEP_TIME_s);
			_g.gain.exponentialRampToValueAtTime(0.00001, _ctx.currentTime + 4 * BEEP_TIME_s);
		} else {
			_g.gain.exponentialRampToValueAtTime(0.00001, _ctx.currentTime + BEEP_TIME_s)
		}
		_beeperTmo = setTimeout(() => { _beeper(_beeping) }, BEEP_REPEAT_ms);
	}
	
	function _setFreq_Hz(f) {
		if (!_osc) return;

		_osc.frequency.value = f;
	}

	function _beep(on) {
		_beeping = !!on;

		if (_beeping && !_beeperTmo) {
			
			_ctx = new AudioContext();

			_osc = _ctx.createOscillator();
			_g = _ctx.createGain();
		
			_osc.frequency.value = _freq_Hz;
			_osc.type = 'triangle';
			_g.gain.value = 0; // start silent

			_osc.connect(_g);
			_g.connect(_ctx.destination);

			_osc.start(); // start the oscillator
			_beeper(_beeping); // start beeping
		}
	}

	return {
		setFreq_Hz: _setFreq_Hz,
		beep: _beep
	}
})();

const ToneGenerator = ({ play, frequency }) => {

	beeper.setFreq_Hz(frequency);
	beeper.beep(play);

	return (
		<div style={{ display: 'none' }}></div>
	);
}

export default ToneGenerator;