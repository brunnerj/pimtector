import React from 'react';
import PropTypes from 'prop-types';

import { LineChart } from 'react-chartkick';

const SpectrumPlot = ({ traces, settings }) => {

	return (
		<LineChart 
			id='spectrum-1'
			data={[
				{"name":"Workout","data":{"2013-02-10":3,"2013-02-17":3,"2013-02-24":3,"2013-03-03":1,"2013-03-10":4,"2013-03-17":3,"2013-03-24":2,"2013-03-31":3}},
				{"name":"Go to concert","data":{"2013-02-10":0,"2013-02-17":0,"2013-02-24":0,"2013-03-03":0,"2013-03-10":2,"2013-03-17":1,"2013-03-24":0,"2013-03-31":0}},
				{"name":"Wash face","data":{"2013-02-10":0,"2013-02-17":1,"2013-02-24":0,"2013-03-03":0,"2013-03-10":0,"2013-03-17":1,"2013-03-24":0,"2013-03-31":1}},
				{"name":"Call parents","data":{"2013-02-10":5,"2013-02-17":3,"2013-02-24":2,"2013-03-03":0,"2013-03-10":0,"2013-03-17":1,"2013-03-24":1,"2013-03-31":0}},
				{"name":"Eat breakfast","data":{"2013-02-10":3,"2013-02-17":2,"2013-02-24":1,"2013-03-03":0,"2013-03-10":2,"2013-03-17":2,"2013-03-24":3,"2013-03-31":0}}
			]}
		/>
	);
};

export default SpectrumPlot;

SpectrumPlot.propTypes = {
	traces: PropTypes.array,
	settings: PropTypes.object
}
