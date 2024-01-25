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

import ApiSelect from "../Select/Select";


class NationFormBody extends Component {
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
    <FormLabel>Please enter the following availability per species</FormLabel>
    {Object.entries(this.props.speciesInputVariable).map(([key, value]) => (
      <Box>
        <FormControl isInvalid={this.props.isInvalid(value)}>
          <SimpleGrid columns={2} spacing={10}>
              <FormLabel>{key}</FormLabel>
            <NumberInput 
            key={key} 
            clampValueOnBlur={false}
            step={0.5}  
            precision={2} 
            min={0} 
            max={100} 
            defaultValue={value} 
            value={value} 
            onInput={this.props.handleSpeciesInputVariable}
        
            >
              <NumberInputField key={key} id={key}/>
              { this.props.isInvalid(value) ? (
                <FormErrorMessage>Please enter valid percentage.</FormErrorMessage>
                ) : (
                <></>
                )
            }
            </NumberInput>
          </SimpleGrid>
        </FormControl>
        </Box>
    ))}
    </Box>
</VStack>);
  }
}

NationFormBody.propTypes = {
  isInvalid: PropTypes.func.isRequired,
  speciesInputVariable: PropTypes.object.isRequired,
  fundsInputVariable: PropTypes.number.isRequired,
  handleNationChange: PropTypes.func.isRequired,
  nationVariablesHidden: PropTypes.bool.isRequired,
  handleSpeciesInputVariable: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  nationsList: PropTypes.array.isRequired,
}

export default NationFormBody;
