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
  RadioGroup,
  Radio,
  Stack,
  StackDivider,
  SimpleGrid,
  ChakraProvider,
} from '@chakra-ui/react';

import ApiSelect from "../Select/Select";
import * as api from '../../modules/api';
import theme from "../../theme";

const MAX_QUOTA_VALUE = 100000
const MAX_LICENSE_VALUE = 50

class NationFormRequestBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: "",
      speciesRequestForYear: {},
      selectedNation: "",
      selectedSpecies: "",
    };
  }

  setNation = e => {
    const selectedNation = e.target.value;
    this.props.setSelectedNation(selectedNation)
    this.setState({ selectedNation });
    if (this.state.selectedYear !== "" && this.state.selectedSpecies !== "") {
      this.setDefaultQuotaAndLicenseValue(this.state.speciesRequestForYear, selectedNation);
    }
  };
  
  getYearRequest = (selectedSpecies, selectedYear) => {
    api.getYearRequestForSpecies(selectedSpecies, selectedYear)
    .then((result) => {
      if (result["statusCode"] === 200) {
        console.log(result)
        if (result["body"] == null) {
          result["body"] = {};
        }
        this.setState({ speciesRequestForYear: result["body"] });
        this.setDefaultQuotaAndLicenseValue(result["body"]);
        this.props.setUserUpdated(false);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  setSpecies = e => {
    const selectedSpecies = e.target.value;
    this.props.setSelectedSpecies(selectedSpecies)
    this.setState({ selectedSpecies });
    if (this.state.selectedYear !== "") {
      this.getYearRequest(selectedSpecies, this.state.selectedYear)
    }
  };

  setYear = year => {
    this.props.setSelectedYear(year)
    this.setState({ selectedYear: year });
    this.getYearRequest(this.state.selectedSpecies, year);
    this.props.setUserUpdated(false);
  };

  setDefaultQuotaAndLicenseValue = (yearRequestForSpecies, nation = this.state.selectedNation) => {
    const quotaValue = yearRequestForSpecies[nation]?.requested_quota || 0;
    console.log(quotaValue)
    this.props.setQuotaValue(quotaValue);
    const licenseValue = yearRequestForSpecies[nation]?.requested_license || 0;
    this.props.setLicenseValue(licenseValue);
  };

  updateQuotaValue = value => {
    if(isNaN(value)) {
      value = 0
    }
    this.props.setUserUpdated(true);
    this.props.setQuotaValue(Number(value));
  };

  updateLicenseValue = value => {
    if(isNaN(value)) {
      value = 0
    }
    this.props.setUserUpdated(true);
    this.props.setLicenseValue(Number(value));
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={2} align='stretch' hidden={this.props.hidden}>
        <Box>
        <ApiSelect listType="nation" list={this.props.nationsList} onSelect={this.setNation} />
        </Box>
        <Box hidden={this.state.selectedNation === ""}>
        <ApiSelect hidden={this.state.selectedNation === ""} listType="species" list={this.props.speciesList} onSelect={this.setSpecies} />
        </Box>
        <RadioGroup hidden={this.state.selectedSpecies === ""} onChange={this.setYear} value={this.state.selectedYear}>
          <Stack direction="row">
            {[2023, 2024, 2025, 2026, 2027].map(year => (
              <Radio key={year} value={String(year)}>{year}</Radio>
            ))}
          </Stack>
        </RadioGroup>
        <Box hidden={this.state.selectedSpecies === ""}>
        <FormControl isInvalid={this.props.isInvalid(this.props.quotaValue, MAX_QUOTA_VALUE)}>
          <SimpleGrid columns={2} spacing={10}>
              <FormLabel>
                Enter quota
              </FormLabel>
              <NumberInput
                min={0}
                max={MAX_QUOTA_VALUE}
                value={this.props.quotaValue}
                onChange={(_, value) => this.updateQuotaValue(value)}
              >
                <NumberInputField />
                {this.props.isInvalid(this.props.quotaValue, MAX_QUOTA_VALUE) ? (
                <FormErrorMessage>Enter valid quota.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter a value between 0-100000</FormHelperText>
              )}
              </NumberInput>
          </SimpleGrid>
        </FormControl>
        <FormControl isInvalid={this.props.isInvalid(this.props.licenseValue, MAX_LICENSE_VALUE)}>
          <SimpleGrid columns={2} spacing={10}>
              <FormLabel>
                Enter icense
              </FormLabel>
              <NumberInput
                min={0}
                max={MAX_LICENSE_VALUE}
                value={this.props.licenseValue}
                onChange={(_, value) => this.updateLicenseValue(value)}
              >
                <NumberInputField />
                {this.props.isInvalid(this.props.licenseValue, MAX_LICENSE_VALUE) ? (
                <FormErrorMessage>Enter valid license value.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter a value between 0-50</FormHelperText>
              )}
              </NumberInput>
          </SimpleGrid>
        </FormControl>
        </Box>
      </VStack>
      </ChakraProvider>
    );
  }
}

NationFormRequestBody.propTypes = {
  hidden: PropTypes.bool.isRequired,
  setUserUpdated: PropTypes.func.isRequired,
  setQuotaValue: PropTypes.func.isRequired,
  setLicenseValue: PropTypes.func.isRequired,
  licenseValue: PropTypes.number.isRequired,
  quotaValue: PropTypes.number.isRequired,
  isInvalid: PropTypes.func.isRequired,
  setSelectedNation: PropTypes.func.isRequired,
  setSelectedSpecies: PropTypes.func.isRequired,
  setSelectedYear: PropTypes.func.isRequired,
  nationsList: PropTypes.array.isRequired,
  speciesList: PropTypes.array.isRequired,
};

export default NationFormRequestBody;