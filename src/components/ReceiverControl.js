import React from 'react';
import PropTypes from 'prop-types';

const ReceiverControl = ({ Fstart_MHz, Fstop_MHz, RBW_kHz, settings }) => {

	const span_kHz = 1000 * (Fstop_MHz - Fstart_MHz);
	const Fo_MHz = Fstart_MHz + (span_kHz / (2 * 1000));

	return (
		<div className='receiver' id='receiver-1'>
			<div className='row'>
				<div className='ind'>
					<span className='label'>Start</span><span className='value'>{Fstart_MHz.toFixed(3)}</span><span className='unit'>MHz</span>
				</div>
				<div className='ind'>
					<span className='label'>Center</span><span className='value'>{Fo_MHz.toFixed(3)}</span><span className='unit'>MHz</span>
				</div>
				<div className='ind'>
					<span className='label'>Stop</span><span className='value'>{Fstop_MHz.toFixed(3)}</span><span className='unit'>MHz</span>
				</div>
			</div>
			<div className='row'>
				<div className='ind'>
					<span className='label'>Span</span><span className='value'>{span_kHz.toFixed(3)}</span><span className='unit'>kHz</span>
				</div>

				<button className='icon fa-check-circle'
					onClick={() => { alert('Not yet implemented') }}
					title='Tune'>Band name
				</button>

				<div className='ind'>
					<span className='label'>RBW</span><span className='value'>{RBW_kHz.toFixed(3)}</span><span className='unit'>kHz</span>
				</div>
			</div>
		</div>
	);
}

export default ReceiverControl;

ReceiverControl.propTypes = {
	Fstart_MHz: PropTypes.number,
	Fstop_MHz: PropTypes.number,
	RBW_kHz: PropTypes.number,
	settings: PropTypes.object
}
