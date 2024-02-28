import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Flex } from '@chakra-ui/react'


class RunAlgorithmChart extends PureComponent {  

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ResponsiveContainer aspect={2.6}>
        <BarChart
          data={this.props.data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={`requested_${this.props.type}`} stackId="a" fill="#31473A" />
          <Bar dataKey={`granted_${this.props.type}`} stackId="a" fill="#EDF4F2" />
        </BarChart>
        </ResponsiveContainer>
    );
  }
}

RunAlgorithmChart.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default RunAlgorithmChart