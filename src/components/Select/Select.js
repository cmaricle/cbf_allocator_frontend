import React, { Component, useState } from "react";
import PropTypes from 'prop-types';

import * as api from '../../modules/api'

import {
  ChakraProvider,
  Select,
} from '@chakra-ui/react'

import theme from "../../theme";

class ApiSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: this.props.list,
      loading: true,
    }
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
      <Select 
        hidden={this.props.hidden} 
        placeholder={`Select ${this.props.listType}`} 
        onChange={this.props.onSelect}
        variant={"basic"}
      >
        {
          this.props.list ? 
          (this.props.list.map((element, i) => (
            <option key={element}>{element}</option>
          ))) :
          (<></>)
        }
    </Select>
    </ChakraProvider>
    );
  }
}

ApiSelect.propTypes = { 
  list: PropTypes.array.isRequired,
  listType: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
}

export default ApiSelect;
