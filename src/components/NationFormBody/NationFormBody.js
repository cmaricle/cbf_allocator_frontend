import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
  Box,
  FormErrorMessage,
  FormControl,
  FormHelperText,
  FormLabel,
  VStack,
  NumberInput,
  NumberInputField,
  StackDivider,
  SimpleGrid,
} from '@chakra-ui/react'
import { Select, CreatableSelect, AsyncSelect } from "chakra-react-select";

import ApiSelect from "../Select/Select";


class NationFormBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speciesOptions: [],
      speciesToShowInSelect: [],
    }
  }
  componentDidMount() {
    this.props.speciesList.forEach(item => {
      this.state.speciesOptions.push(
        {
          "value": item,
          "label": item
        }
      )
    })
    console.log(this.props.speciesInputVariable)
    this.props.speciesInputVariable.forEach(item => {
      this.props.speciesToShowInSelect.push(
        {
          "value": item,
          "label": item
        }
      )
    })
  }

  render() {
    return (
    <VStack divider={<StackDivider borderColor='gray.200' />} 
    spacing={2}
    align='stretch'
    hidden={this.props.hidden}
>
    <Box>
    <ApiSelect listType="nation" list={this.props.nationsList} onSelect={this.props.handleNationChange}/>
    </Box>
    <Box hidden={this.props.nationVariablesHidden}>
    <SimpleGrid columns={2} spacing={10}>
      <FormControl isInvalid={this.props.isInvalid(this.props.fundsInputVariable)}>
        <FormLabel>Funds</FormLabel>
          <NumberInput 
            step={0.5} 
            clampValueOnBlur={false} 
            value={this.props.fundsInputVariable} 
            precision={2} 
            min={0} 
            max={100} 
            onChange={this.props.handleInputChange}>
            <NumberInputField />
            { this.props.isInvalid(this.props.fundsInputVariable) ? (
              <FormErrorMessage>Please enter valid percentage.</FormErrorMessage>
              ) : (
              <FormHelperText>Enter a percentage.</FormHelperText>
              )
            }
          </NumberInput>
      </FormControl>
    </SimpleGrid>
    </Box>
    <Box hidden={this.props.nationVariablesHidden}>
      <FormControl>
      <FormLabel>
        Select Species
      </FormLabel>
      <Select
        isMulti
        name="species"
        options={this.state.speciesOptions}
        placeholder={`Species ${this.props.nation} has availability to`}
        closeMenuOnSelect={false}
        onChange={this.props.handleSpeciesInputVariable}
        value={this.props.speciesToShowInSelect}
      />
    </FormControl>
    </Box>
</VStack>);
  }
}

NationFormBody.propTypes = {
  isInvalid: PropTypes.func.isRequired,
  speciesInputVariable: PropTypes.array.isRequired,
  fundsInputVariable: PropTypes.number.isRequired,
  handleNationChange: PropTypes.func.isRequired,
  nationVariablesHidden: PropTypes.bool.isRequired,
  handleSpeciesInputVariable: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  nationsList: PropTypes.array.isRequired,
  speciesList: PropTypes.array.isRequired,
  nation: PropTypes.string.isRequired,
  speciesToShowInSelect: PropTypes.array.isRequired
}

export default NationFormBody;
