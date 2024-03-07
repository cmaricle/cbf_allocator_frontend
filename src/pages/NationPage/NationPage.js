import React, { Component } from "react";
import { useHistory } from 'react-router-dom';
import { Box, ChakraProvider, Container, Heading, SimpleGrid, TableContainer,
  Alert, 
  AlertIcon,
  Center,
  Table,
  Divider,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Text,
  Stat,
  Progress,
  StatLabel,
  StatNumber,
  Spacer,
  Stack,
  Radio,
  StatHelpText,
  Card,
  Tooltip,
  RadioGroup, } from "@chakra-ui/react";


import * as api from "../../modules/api"
import theme from "../../theme";
import ApiSelect from "../../components/Select/Select";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";
import RunAlgorithmChart from "../../components/BarChart/BarChart";
import { Select } from "chakra-react-select";


class NationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nationsList: [],
      speciesList: [],
      yearRequests: [],
      requests: {},
      requestChartData: [],
      backendHealth: true, 
      headers: ["species", "requested_quota", "allocated_quota", "requested_license", "allocated_license"],
      year: 2024,
      nationName: this.props.match.params.id || "",
      requestsLoading: false,
      variablesLoading: false,
      grantsLoading: false,
      nationVariables: {},
      requestChartDisplayType: "quota",
      grants: {},
      species: "*",
      speciesToShow: [],
      yearToShowInSelect: [{"value": 2024, "label": 2024}],
    }
  }

  componentDidMount() {
    api.getHealth().then(response => {
      if (response.statusCode !== 200) {
        this.state.backendHealth = false;
      } 
      const nationsList = JSON.parse(localStorage.getItem("nationsList"));
      const speciesList = JSON.parse(localStorage.getItem("speciesList"));
      if(nationsList && speciesList) {
        this.setState({ nationsList: nationsList, speciesList: speciesList})
      } else {
        api.getSpeciesList().then(response => {
          if (response.statusCode === 200) {
            const speciesList = response["body"]
            this.setState({speciesList: speciesList});
            localStorage.setItem('speciesList', JSON.stringify(speciesList))
          }
  
        })    
        api.getNationsList().then(response => {
          if (response.statusCode === 200) {
            const nationsList = response["body"]
            this.setState({nationsList: nationsList});
            localStorage.setItem('nationsList', JSON.stringify(nationsList))
          }
        })
      }
      if (!(nationsList.includes(this.state.nationName))) {
        window.location.href = "/404"
      }
      this.getGrants(this.state.year, this.state.nationName, this.state.grants)
      this.getRequests(this.state.year, speciesList, {});
      this.getNationVariables(this.state.nationName, this.state.nationVariables)

    }).catch(exception => {
      this.state.backendHealth = false;
    })
  }

  componentWillUnmount() {
    localStorage.removeItem("requests")
    localStorage.removeItem("grants")
    localStorage.removeItem("nationVariables")
  }

  addItemToChartObject(item, year, resultArray, multiYear=false) {
    for (let speciesName in item) {
      if (item.hasOwnProperty(speciesName)) {
        const speciesData = item[speciesName];
        for (let nationName in speciesData) {
          if (speciesData.hasOwnProperty(nationName)) {
            if (multiYear && this.state.species === "*" && this.state.nationName === nationName) {
              this.setState({species: speciesName})
            }
            const nationData = speciesData[nationName];
            let resultToPush = {
              name: multiYear ? year : speciesName,
              requested_quota: nationData.requested_quota,
              requested_license: nationData.requested_license,
              allocated_quota: "allocated_quota" in nationData ? nationData.allocated_quota : 0,
              allocated_license: "allocated_license" in nationData ? nationData.allocated_license : 0,
              nation_name: nationName
            };
            if (multiYear) {
              resultToPush["species"] = speciesName
            }
            resultArray.push(resultToPush)
          }
        }
      }
    }
    return resultArray
  }
  
  transformObjectToArray(inputObject, updateSpecies=true) {
    var resultArray = [];
    if (Object.keys(inputObject).length > 1) {
      inputObject.forEach((item, key) => {
        let year = this.state.yearToShowInSelect[key]["value"] 
        this.addItemToChartObject(item, year, resultArray, true)        
      })
    } else {
      inputObject = Object.entries(inputObject)[0][1]
      this.setState({species: "*"})
      this.addItemToChartObject(inputObject, 0, resultArray, false)
    }
    if (updateSpecies) {
      this.setSpeciesToShowInSelect(resultArray, this.state.yearToShowInSelect, this.state.nationName)
    }
    return resultArray;
  }
  
  getRequests = (year, species, request) => {
    if (!request || Object.keys(request).length === 0) {
      const requestsPromises = species.map(value => {
        this.setState({requestsLoading: true})
        return api.getYearRequestForSpecies(value, year).then(response => {
          if ("body" in response && response.statusCode === 200) {
            return JSON.stringify(response["body"]);
          }
        });
      });
      Promise.all(requestsPromises).then(requests => {
        const updatedRequests = requests.reduce((acc, value, index) => {
          if (value !== null) {
            acc[this.state.speciesList[index]] = JSON.parse(value);
          }
          return acc;
        }, {});
        this.setState({requestsLoading: false})
        this.setState({ yearRequests: [ ...this.state.yearRequests, updatedRequests] }, () => {
          localStorage.setItem("requests", JSON.stringify(this.state.requests));
          this.setState({requestChartData: this.transformObjectToArray(this.state.yearRequests)})
        });
      });
    } else {
      this.setState({requestChartData: this.transformObjectToArray(this.state.yearRequests)})
    }
  }

  getNationVariables = (nation, variables) => {
    if (Object.keys(variables).length === 0) {
      this.setState({variablesLoading: true})
      api.getNationVariables(nation).then(response => {
        if (response.statusCode === 200) {
          if (Object.keys(response["body"]).includes("_nation_name")) {
            delete response["body"]["_nation_name"]
          }
          this.setState({nationVariables: response["body"]})
          localStorage.setItem("nationVariables", JSON.stringify(response["body"]))
        }
        this.setState({variablesLoading: false})
      })
    }
  }

  setSpeciesToShowInSelect(result, yearToShowInSelect, nationName) {
    let speciesToShowList = new Set()
    console.log(yearToShowInSelect)
    if (yearToShowInSelect.length === 1) {
      speciesToShowList.add("*")
      this.setState({species: "*"})
    }
    result.forEach(item =>
      nationName === item["nation_name"] ? speciesToShowList.add("species" in item ? item["species"] : item["name"]) : {}
    )
    if (nationName !== this.state.nationName && this.state.yearRequests.length > 1) {
      this.setState({species: [...speciesToShowList][0]})
    }
    this.setState({speciesToShow: Array.from(speciesToShowList)})
  }

  setNation = (e) => {
    const nation = e.target.value
    if (!this.state.yearRequests) {
      this.getRequests(this.state.year, this.state.speciesList, this.state.requests)
    }
    this.setSpeciesToShowInSelect(this.state.requestChartData, this.state.yearToShowInSelect, e.target.value)
    this.setState({nationName: nation})
    this.getNationVariables(nation, {})
  }

  setYear = (e) => {
    const year = e.target.value
    this.setState({year: year})
    this.getRequests(year, this.state.speciesList, {})
    this.getGrants(year, this.state.nationName, {})
  }

  isNationInRequests = () => {
    for (const species in this.state.requests) {
      if (this.state.requests[species] !== null && this.state.nationName in this.state.requests[species]) {
        return true
      }
    }
    return false
  }

  isNationInGrants = () => {
    for (const key in this.state.grants) {
      if (this.state.nationName in this.state.grants[key]) {
        return true
      }
    }
    return false
  }

  getGrants = (year, nation, grants) => {
    this.setState({grantsLoading: true})
    if (Object.keys(grants).length === 0) {
      api.getGrant(year).then(response => {
        if (response.statusCode === 200) {
          this.setState({grants: response["body"]})
        }
        this.setState({grantsLoading: false})
      })
    } 
  }

  formatNumber = (val) => {
    if (val) {
      var formattedNumber = val.toLocaleString()
      return formattedNumber
    }
    return val
  }

  formatStat = (val) => {
    if (val) {
      return val.substring(0, val.length - 1)
    }
    return val
  }

  handleYearInputVariable = (event) => {
    console.log(event)
    if (event.length > 0) {
      let newYear = event.filter(x => !this.state.yearToShowInSelect.includes(x))
      this.setState({yearToShowInSelect: event})
      if (newYear.length > 0) {
        this.getRequests(newYear[0]["value"], this.state.speciesList, {})
      } else {
          let difference = this.state.yearToShowInSelect.filter(x => !event.includes(x))
          let indexOfDeleted = this.state.yearToShowInSelect.indexOf(difference[0])
          let updatedYearRequests = this.state.yearRequests
          updatedYearRequests.splice(indexOfDeleted, 1)
          
          this.setSpeciesToShowInSelect(updatedYearRequests, event, this.state.nationName)
          this.setState({yearToShowInSelect: event})
          this.setState({yearRequests: updatedYearRequests})
          this.setState({requestChartData: this.transformObjectToArray(updatedYearRequests, false)})  
        }
    }
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
      <WebsiteHeader></WebsiteHeader>
      <Container maxW="container.xl" mt={16}>
        <SimpleGrid columns={2} spacing={8}>
          <ApiSelect 
            list={this.state.nationsList} 
            listType="nation" 
            defaultValue={this.state.nationName}
            onSelect={this.setNation}
            >
          </ApiSelect>
          <Select 
            placeholder={"Select years"} 
            options={
            [2024, 2025, 2026, 2027, 2028].map(year => ({
              value: year,
              label: year
            }))
          }
          isMulti
          onChange={this.handleYearInputVariable}
          value={this.state.yearToShowInSelect}
          ></Select>
        </SimpleGrid>

        <SimpleGrid columns={[1]} spacing={8}>
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Box p={2}>
              <Center><Heading variant="solid">Requests</Heading></Center>
            </Box>
            <Divider/>
            { this.state.requestChartData && this.state.yearRequests ? 
            <>
            <Center p={2}>
              <RadioGroup hidden={this.state.requestsLoading} defaultValue="quota" onChange={(e) => { this.setState({requestChartDisplayType: e}); }}> 
              <Stack spacing={4} direction='row'>
                <ApiSelect 
                  list={this.state.speciesToShow} 
                  listType="species" 
                  onSelect={(e) => this.setState({species: e.target.value})}
                  defaultValue={this.state.species}
                  value={this.state.species}
                  ></ApiSelect>
                <Radio value="quota">Quota</Radio>
                <Radio value="license">License</Radio>
              </Stack>
            </RadioGroup></Center>
            <Box hidden={this.state.requestsLoading}>
              <RunAlgorithmChart 
                aspectRatio={5} 
                barOneDataKey={`requested_${this.state.requestChartDisplayType}`} 
                barTwoDataKey={`allocated_${this.state.requestChartDisplayType}`} 
                data={
                this.state.requestChartData.filter(
                  item => item.nation_name === this.state.nationName && (this.state.species === "*" || item.species === this.state.species)
                )}
              ></RunAlgorithmChart></Box></> : <></>
            }
            { this.state.requestsLoading ? <Progress isIndeterminate size="xs" variant="basic"></Progress> : 
            !this.state.yearRequests ? (<Alert status="warning"><AlertIcon/>{"No Requests"}</Alert>) :
            <>
            <TableContainer>
              <Table>
                <Thead>
                <Tr>
                  {
                    this.state.headers.map((header, index)  => {
                      return (<Tooltip 
                        placement="top"
                        label={
                        !header.includes("allocated") ? "" : "Total allocated amount for year, see Allocations section for more details"
                        }>
                        <Th isNumeric={index !== 0}>{header}</Th>
                      </Tooltip>)
                                              
                    })
                  }
                </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.entries(this.state.yearRequests).map(([key, item]) => (
                      Object.entries(item).map(([species, requests]) => (
                        requests && (this.state.species === "*" || species === this.state.species) ?
                        Object.entries(requests).filter(
                          ([k, v]) => k === this.state.nationName
                          ).map(([key, value], index) => (
                          <Tr>
                            <Td>{species}</Td>
                          { this.state.headers.map((header, index) => (
                            index > 0 ? 
                            <React.Fragment key={header}>
                              <Td isNumeric>{header in value ? value[header] : 0}</Td>
                            </React.Fragment>
                            : <></>
                          ))
                          }
                          </Tr>
                    )) : <></>
                      ))))
                    } 
                  
                </Tbody>
              </Table>
            </TableContainer>
            </>
            }
          </Box>
  
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Box p={2}>
              <Center><Heading variant="solid">Allocations</Heading></Center>
            </Box>
            <Divider/>
              {
                this.state.grantsLoading ? <Progress isIndeterminate size="xs" variant="basic"></Progress> : <></>
              }
              {
                !this.isNationInGrants() && !this.state.grantsLoading ? <Alert status="warning"><AlertIcon/>{"No Grants"}</Alert> : <></>
              }
              <SimpleGrid columns={3}>
              { 
                !this.state.grantsLoading && this.isNationInGrants() ? 
                  Object.entries(this.state.grants).map(([species, value]) => (
                    this.state.nationName in value ? 
                      value[this.state.nationName].map((grant, index) => 
                      <Box maxW="sm" align="center" p={4}>
                      <Tooltip 
                        label={
                            "user_id" in grant ? 
                            <>
                            <Text>{grant["timestamp"]}</Text>
                            <Center><Text>Submitted by: {grant["user_id"]}</Text></Center>
                            </> :
                            <Text>{grant["timestamp"]}</Text>
                        }
                      >
                      <Card maxW="xs">
                        <Stat>
                          <StatLabel>{species}</StatLabel>
                          <StatNumber>{
                            "granted_quota" in grant && grant["granted_quota"] !== 0 ? "quota: " + this.formatStat(this.formatNumber(grant["granted_quota"])) : ""}
                            { "granted_license" in grant && grant["granted_license"] !== 0 ? "license: " + this.formatNumber(grant["granted_license"]) : ""}
                            </StatNumber>
                          <StatHelpText>{`$${this.formatNumber(grant["cost"])}`}</StatHelpText>
                        </Stat>
                        </Card>
                        </Tooltip>
                      </Box>
                    )
                     : <></>
                  )) : <></>
              }
              </SimpleGrid>
          </Box>
  
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Box p={2}>
              <Center><Heading variant="solid">Variables</Heading></Center>
            </Box>
            <Divider/>
            { this.state.variablesLoading ? <Progress size="xs" isIndeterminate variant="basic"></Progress> : 
            <TableContainer>
              <Table>
                <Thead>
                <Tr>
                  {
                    Object.keys(this.state.nationVariables).map(key => {
                      return( 
                      <Tooltip placement="top"
                      label={
                        key === "funds" ? "Original percentage of total funds" : 
                        key === "availability" ? "List of species nation has availibilty to" 
                      : key === "updated_funds" ? "Nations unused funds, as percentage of total funds" 
                      : key === "allocation_fulfillment_ratio" ? "Rolling ratio of granted amount / requested amount, recalculated after each recommendation is run" : ""}>
                        <Th isNumeric={key !== "availability"}>{key}</Th>
                      </Tooltip>)
                    })
                  }
                </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.keys(this.state.nationVariables).length > 0 ?
                    Object.entries(this.state.nationVariables).map(([key, val]) => (
                      <Td isNumeric={key !== "availability"}>{
                        key === "availability" ? val.join(", ") :
                        key.includes("funds") ?  Math.round(val * 100000) / 100000 + "%" :
                        key.includes("allocation") ? Math.round((val * 100) * 100000) / 100000  + "%" :
                        val
                      }</Td>
                    ))                 
                    : <></>
                  }
                </Tbody>
              </Table>
            </TableContainer>
              }
          </Box>
  
        </SimpleGrid>
      </Container>
      </ChakraProvider>
    );
  
  }
}

export default NationPage;
