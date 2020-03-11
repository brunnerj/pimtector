import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

const clamp = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
}

const Slider = ({ name, value, min, max, step, unit, setValue }) => {

	const el = useRef(); // slider element DOM reference
	const [ active, setActive ] = useState(false);
	const [ height, setHeight ] = useState(0);

	// Attach drag and end events and set component active
	const handleStart = e => {
		document.addEventListener('mousemove', handleDrag);
		document.addEventListener('mouseup', handleEnd);
		setActive(true);
	}

	// Call setValue prop (if available) as slider drags
	const handleDrag = e => {
		e.stopPropagation();

		if (!setValue) return;

		setValue(position(e));
	}

	// Deactivate component and remove drag and end events
	const handleEnd = e => {
		setActive(false);
		document.removeEventListener('mousemove', handleDrag);
		document.removeEventListener('mouseup', handleEnd);
	}

	// Calculate the slider fill height based on the value
	const getPositionFromValue = value => {
		const diffMaxMin = max - min;
		const diffValMin = value - min;
		const percentage = diffValMin / diffMaxMin;
		const pos = Math.round(percentage * height);

		return pos;
	}

	// Calculate slider value based on Y-position within slider
	const getValueFromPosition = pos => {
		const percentage = clamp(pos, 0, height) / (height || 1);
		const baseVal = step * Math.round(percentage * (max - min) / step);
		const value = max - baseVal;

		return clamp(value, min, max);
	}

	// Calculate slider value based on touch/mouse event Y-coordinate
	const position = e => {
		
		const coordinate = !e.touches
			? e['clientY']
			: e.touches[0]['clientY'];

		const direction = el.current.getBoundingClientRect()['top'];
		const pos = coordinate - direction;
		const value = getValueFromPosition(pos);

		return value;
	}

	// Set the initial component height and attach resize observer
	useLayoutEffect(() => {

		// Set the height of the slider element on update
		const handleUpdate = () => {

			if (!el.current) return; // shallow rendering

			setHeight(el.current['offsetHeight']); // height of the slider element
		}
		handleUpdate();

		const resizeObserver = new ResizeObserver(handleUpdate);
		resizeObserver.observe(el.current);

		return resizeObserver.disconnect;
	}, []);

	const pos = getPositionFromValue(value);
	const fillStyle = { height: `${pos}px` };

	return (
		<div className={'slider' + (active ? ' active' : '')} id='slider-1'>
			<div className='slider__label'>
				<div className='title'>{name}</div>
				<div className='value'><span className='v'>{value}</span>{' '}<span className='unit'>{unit}</span></div>
			</div>
			<div ref={el} className='slider__wrapper'
				onMouseDown={handleStart}
				onMouseUp={handleEnd}
				onTouchStart={handleStart}
				onTouchMove={handleDrag}
				onTouchEnd={handleEnd}
				aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}>
					<h3>&laquo;SLIDE&raquo;</h3>
				<div className='slider__fill' style={fillStyle} />
			</div>
		</div>
	);
}

export default Slider;

Slider.propTypes = {
	name: PropTypes.string,
	value: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	unit: PropTypes.string,
	setValue: PropTypes.func
}

Slider.defaultProps = {
	name: 'slider',
	value: 0,
	min: 0,
	max: 100,
	step: 1,
	unit: '',
	setValue: () => {}
}