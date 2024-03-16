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
  Flex,
  Spacer,
  Spinner,
  Center,
  Progress,
  Text,
} from '@chakra-ui/react'
import { Select } from "chakra-react-select";

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
    this.props.speciesInputVariable.forEach(item => {
      this.props.speciesToShowInSelect.push(
        {
          "value": item,
          "label": item
        }
      )
    })
  }

  componentWillUnmount() {
    this.props.setLoading(false)
  }
  
  format = (val) => {
    console.log(val)
    return val === "" ? "0%" : val + '%';
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
      <FormControl isInvalid={this.props.isInvalid(this.props.fundsInputVariable)}>
        <FormLabel>Funds Percentage</FormLabel>
        <Flex>
          <SimpleGrid columns={2}>
            { this.props.fundsInputVariable === 0 || this.props.fundsUpdated || true?
              (<NumberInput 
                step={0.5} 
                clampValueOnBlur={false} 
                value={this.format(this.props.fundsInputVariable)} 
                precision={2} 
                min={0} 
                max={100} 
                onChange={(e) => this.props.handleInputChange(e)}
                >
                <NumberInputField />
              </NumberInput>) :
              (<Text p={3}>{this.props.fundsInputVariable}%</Text>)
          }
          <Center height="auto">
          <Spinner p={1} hidden={!this.props.loadingNation}/>
          </Center>
          </SimpleGrid>
          </Flex>
           { this.props.fundsInputVariable == 0 || this.props.fundsUpdated ?
           (this.props.isInvalid(this.props.fundsInputVariable) ? (
              <FormErrorMessage>Please enter valid percentage.</FormErrorMessage>
              ) : (
              <FormHelperText>Enter a percentage.</FormHelperText>
              )
           ) : <React.Fragment></React.Fragment>
          }
    </FormControl>
    </Box>
    {
      !this.props.loadingNation ?
      (<Box hidden={this.props.nationVariablesHidden}>
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
      </Box>)
      : (<Progress isIndeterminate size="xs" variant="basic"></Progress>)
    }
</VStack>

);
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
  speciesToShowInSelect: PropTypes.array.isRequired,
  loadingNation: PropTypes.bool.isRequired,
  fundsUpdated: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
}

export default NationFormBody;