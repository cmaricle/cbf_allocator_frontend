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
  StatHelpText,
  Card, } from "@chakra-ui/react";


import * as api from "../../modules/api"
import theme from "../../theme";
import ApiSelect from "../../components/Select/Select";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";


class NationPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      nationsList: [],
      requests: {},
      backendHealth: true, 
      headers: ["species", "requested_quota", "allocated_quota", "requested_license", "allocated_license"],
      year: 2024,
      nationName: this.props.match.params.id || "",
      requestsLoading: false,
      variablesLoading: false,
      grantsLoading: false,
      nationVariables: {},
      grants: {},
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
      var requests = JSON.parse(localStorage.getItem("requests")) 
      this.setState({"requests": requests})
      this.getRequests(this.state.year, requests);
      this.getNationVariables(this.state.nationName, this.state.nationVariables)

    }).catch(exception => {
      this.state.backendHealth = false;
    })
  }

  getRequests = (year, request) => {
    if (Object.keys(request).length === 0) {
      const requestsPromises = this.state.speciesList.map(species => {
        this.setState({requestsLoading: true})
        return api.getYearRequestForSpecies(species, year).then(response => {
          if ("body" in response && response.statusCode === 200) {
            return JSON.stringify(response["body"]);
          } else {
            return null; // or some default value if the request fails
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
        this.setState({ requests: updatedRequests }, () => {
          localStorage.setItem("requests", JSON.stringify(this.state.requests));
        });
      });
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

  setNation = (e) => {
    console.log(this.state.requests)
    const nation = e.target.value
    this.setState({nationName: nation})
    this.getNationVariables(nation, {})
  }

  setYear = (e) => {
    const year = e.target.value
    this.setState({year: year})
    this.getRequests(year, {})
    this.getGrants(year, this.state.nationName, {})
  }

  isNationInRequests = () => {
    console.log(this.state.requests)
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

  render() {
    return (
      <ChakraProvider theme={theme}>
      <WebsiteHeader></WebsiteHeader>
      <Container maxW="container.xl" mt={8}>
        <SimpleGrid columns={2} spacing={8}>
          <ApiSelect 
            list={this.state.nationsList} 
            listType="nation" 
            defaultValue={this.state.nationName}
            onSelect={this.setNation}
            >
          </ApiSelect>
          <ApiSelect 
            list={[2024, 2025, 2026, 2027, 2028]} 
            listType="year" 
            defaultValue={this.state.year}
            onSelect={this.setYear}  
          >
          </ApiSelect>
        </SimpleGrid>

        <SimpleGrid columns={[1]} spacing={8}>
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Box p={2}>
              <Center><Heading variant="solid">Requests</Heading></Center>
            </Box>
            <Divider/>
            { this.state.requestsLoading ? <Progress isIndeterminate size="xs" variant="basic"></Progress> : 
            this.state.requests && !this.isNationInRequests() ? (<Alert status="warning"><AlertIcon/>{"No Requests"}</Alert>) :
            <TableContainer>
              <Table>
                <Thead>
                <Tr>
                  {
                    this.state.headers.map(function(header, index) {
                      return <Th isNumeric={!(index === 0)}>{header}</Th>
                    })
                  }
                </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.keys(this.state.requests).length > 0 ?
                    Object.entries(this.state.requests).map(([species, requests]) => (
                      requests && Object.keys(requests).length > 0 ?
                        Object.entries(requests).filter(([k, v]) => k === this.state.nationName).map(([key, value], index) => (
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
                    ))                  
                    : <></>
                  }
                </Tbody>
              </Table>
            </TableContainer>
              }
          </Box>
  
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Box p={2}>
              <Center><Heading variant="solid">Grants</Heading></Center>
            </Box>
            <Divider/>
              {
                this.state.grantsLoading ? <Progress isIndeterminate size="xs" variant="basic"></Progress> :
                this.isNationInGrants() ? 
                  Object.entries(this.state.grants).map(([species, value]) => (
                    this.state.nationName in value ? 
                    <Box maxW="sm" align="center" p={4}>
                    <Card maxW="xs">
                      <Stat>
                        <StatLabel>{species}</StatLabel>
                        <StatNumber>{`$${value[this.state.nationName]["cost"]}`}</StatNumber>
                        <StatHelpText>{
                          "granted_quota" in value[this.state.nationName] ? "quota: " + value[this.state.nationName]["granted_quota"] : ""}
                          { "granted_license" in value[this.state.nationName] ? value[this.state.nationName]["granted_license"] : ""}
                          </StatHelpText>
                      </Stat>
                      </Card></Box> : <></>
                  )) : <Alert status="warning"><AlertIcon/>{"No Grants"}</Alert>
              }
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
                      return <Th>{key}</Th>
                    })
                  }
                </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.keys(this.state.nationVariables).length > 0 ?
                    Object.entries(this.state.nationVariables).map(([key, val]) => (
                      <Td>{key === "availability" ? val.join(", ") : val}</Td>
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
