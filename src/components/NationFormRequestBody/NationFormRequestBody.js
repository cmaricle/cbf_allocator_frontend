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
  Spinner,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { Select, CreatableSelect, AsyncSelect } from "chakra-react-select";


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
      loading: false,
      nationOptions: [],

    };
  }
  componentDidMount() {
    this.props.nationsList.forEach(item => {
      this.state.nationOptions.push(
        {
          "value": item,
          "label": item,
          "quota": 0,
          "license": 0,
        }
      )
    })
  }

  componentWillUnmount() {
    this.handleNationChange([])
    this.props.setLoading(false)
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
    this.state.loading = true;
    api.getYearRequestForSpecies(selectedSpecies, selectedYear)
    .then((result) => {
      if (result["statusCode"] === 200) {
        if (result["body"] == null) {
          result["body"] = {};
        }
        this.setState({ speciesRequestForYear: result["body"] });
        console.log(result["body"])
        var updatedNationOptions = []
        this.props.nationToShowInSelect.forEach(nation => {
          if (nation["label"] in result["body"]) {
            updatedNationOptions.push(
              {
                ...nation,
                "quota": result["body"][nation["label"]]["requested_quota"],
                "license": result["body"][nation["label"]]["requested_license"]
              }
            )
          } else {
            updatedNationOptions.push(
              {
                ...nation,
                "quota": 0,
                "license": 0
              }
            )
          }
        })
        console.log(updatedNationOptions)
        this.props.handleNationChange(updatedNationOptions)
        this.props.setUserUpdated(false);
      }
      this.state.loading = false;
    })
    .catch(error => {
      console.error('Error:', error);
      this.state.loading = false;
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
    this.setState({loading: true});
    const quotaValue = yearRequestForSpecies[nation]?.requested_quota || 0;
    this.props.setQuotaValue(quotaValue);
    const licenseValue = yearRequestForSpecies[nation]?.requested_license || 0;
    this.props.setLicenseValue(licenseValue);
    this.setState({loading: false});
  };

  updateQuotaValue = (value, index) => {
    if(isNaN(value)) {
      value = 0
    }
    this.props.setUserUpdated(true);
    this.props.setQuotaValue(Number(value));
    var nationToShowInSelect = this.props.nationToShowInSelect
    console.log(nationToShowInSelect)
    nationToShowInSelect[index]["quota"] = value
    nationToShowInSelect[index]["updated"] = true
    this.props.handleNationChange(nationToShowInSelect)
  };


  updateLicenseValue = (value, index) => {
    if(isNaN(value)) {
      value = 0
    }
    this.props.setUserUpdated(true);
    var nationToShowInSelect = this.props.nationToShowInSelect
    nationToShowInSelect[index]["license"] = value
    nationToShowInSelect[index]["updated"] = true
    this.props.handleNationChange(nationToShowInSelect)
    this.props.setLicenseValue(Number(value));
  }

  handleNationChange = (event) => {
    Array.prototype.diff = function(a) {
      var difference = this.filter(function(i) {return a.indexOf(i) < 0;});
      if (difference) {
        return difference[0]
      }
      else {
        return null
      }
    };
    let difference = event.diff(this.props.nationToShowInSelect)
    if (this.state.speciesRequestForYear && difference && difference["label"] in this.state.speciesRequestForYear) {
      delete event[event.indexOf(difference)]
      difference["quota"] = this.state.speciesRequestForYear[difference["label"]]["requested_quota"]
      difference["license"] = this.state.speciesRequestForYear[difference["label"]]["requested_license"]
      event.push(difference)
    }
    this.props.handleNationChange(event)
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
      <VStack divider={<StackDivider borderColor='gray.200' hidden={this.props.hidden} />} spacing={2} align='stretch' hidden={this.props.hidden}>
        <Box>
        <ApiSelect listType="species" list={this.props.speciesList} onSelect={this.setSpecies} />
        </Box>
        <FormControl hidden={this.state.selectedSpecies === ""}>
          <Select
            isMulti
            name="species"
            options={this.state.nationOptions}
            placeholder={`Enter nation(s)`}
            closeMenuOnSelect={false}
            onChange={this.handleNationChange}
            value={this.props.nationToShowInSelect}
          />
        </FormControl>
        <RadioGroup p={2} hidden={this.props.nationToShowInSelect.length === 0} onChange={this.setYear} value={this.state.selectedYear}>
          <Stack direction="row">
            {[2024, 2025, 2026, 2027, 2028].map(year => (
              <Radio key={year} value={String(year)}>{year}</Radio>
            ))}
          </Stack>
        </RadioGroup>
        <Box hidden={this.state.selectedYear === ""}>
          {
            this.props.nationToShowInSelect.map((value, index) => {
              return(
              <React.Fragment>
               <Heading size={"md"}>{value["label"]}</Heading> 
               <Divider/>
              <FormControl p={2} isInvalid={this.props.isInvalid(value["quota"], MAX_QUOTA_VALUE)}>
                <SimpleGrid columns={2} spacing={10}>
                    <FormLabel>
                      Enter Quota (lbs)
                    </FormLabel>
                      { this.state.loading ?
                      (<Spinner/>) :
                      ( 
                        <NumberInput
                          min={0}
                          max={MAX_QUOTA_VALUE}
                          value={value["quota"]}
                          onChange={(_, val) => this.updateQuotaValue(val, index)}
                        >
                        <NumberInputField/>
                        {
                          this.props.isInvalid(this.props.quotaValue, MAX_QUOTA_VALUE) ? (
                            <FormErrorMessage>Enter valid quota.</FormErrorMessage>
                          ) : (
                            <FormHelperText>Enter a value between 0-100000</FormHelperText>
                          )
                        }
                        </NumberInput>
                      ) 
                    }
                </SimpleGrid>
              </FormControl>
              <FormControl p={2} isInvalid={this.props.isInvalid(value["license"], MAX_LICENSE_VALUE)}>
              <SimpleGrid columns={2} spacing={10}>
                  <FormLabel>
                    Enter License
                  </FormLabel>
                  { this.state.loading ? 
                  (<Spinner/>) :
                  (<NumberInput
                    min={0}
                    max={MAX_LICENSE_VALUE}
                    value={value["license"]}
                    onChange={(_, value) => this.updateLicenseValue(value, index)}
                  >
                    <NumberInputField />
                    {this.props.isInvalid(this.props.licenseValue, MAX_LICENSE_VALUE) ? (
                    <FormErrorMessage>Enter valid license value.</FormErrorMessage>
                  ) : (
                    <FormHelperText>Enter a value between 0-50</FormHelperText>
                  )}
                  </NumberInput>)
                }
              </SimpleGrid>
            </FormControl>
            </React.Fragment>
            )})
          }
        
        
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
  nationToShowInSelect: PropTypes.array.isRequired,
  handleNationChange: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default NationFormRequestBody;
