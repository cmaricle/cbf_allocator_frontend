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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={500}
          width={300}
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
          <Bar dataKey="requested_quota" stackId="a" fill="#31473A" />
          <Bar dataKey="granted_quota" stackId="a" fill="#EDF4F2" />
        </BarChart>
        </ResponsiveContainer>
    );
  }
}

RunAlgorithmChart.propTypes = {
  data: PropTypes.object.isRequired
}

export default RunAlgorithmChart