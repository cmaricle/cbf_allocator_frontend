import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Center, Heading, Box } from '@chakra-ui/react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


class RunAlgorithmChart extends PureComponent {  

  constructor(props) {
    super(props);
  }

  render() {
    return (
        Object.entries(this.props.data).length > 0 ?
        <Box>
        { this.props.header ? <Center><Heading size="md"><i>{this.props.header}</i></Heading></Center> : <></> }
        <ResponsiveContainer aspect={this.props.aspectRatio}>
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
            <YAxis allowDecimals={false}/>
            <Tooltip />
            <Legend />
            <Bar dataKey={this.props.barOneDataKey} fill="#31473A" />
            <Bar dataKey={this.props.barTwoDataKey} fill="#C4BA84" />
            {
              this.props.barThreeDataKey ? <Bar dataKey={this.props.barThreeDataKey} fill="#31473A" /> : <></>
            }
            {
              this.props.barFourDataKey ? <Bar dataKey={this.props.barFourDataKey} fill="#C4BA84" /> : <></>
            }
          </BarChart>
          </ResponsiveContainer>
        </Box>
          : <></>
    );
  }
}

RunAlgorithmChart.propTypes = {
  data: PropTypes.object.isRequired,
  aspectRatio: PropTypes.number.isRequired,
  barOneDataKey: PropTypes.string.isRequired,
  barTwoDataKey: PropTypes.string.isRequired,
  barThreeDataKey: PropTypes.string.isRequired,
  barFourDataKey: PropTypes.string.isRequired,
  header: PropTypes.string,
}

export default RunAlgorithmChart