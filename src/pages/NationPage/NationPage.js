import React, { Component } from "react";
import { useHistory } from 'react-router-dom';
import { Box, ChakraProvider, Container, Heading, SimpleGrid, TableContainer,
  Table,
  TableCaption,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Text, } from "@chakra-ui/react";


import * as api from "../../modules/api"
import theme from "../../theme";
import { Button } from "react-scroll";
import ApiSelect from "../../components/Select/Select";


class NationPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      nationsList: [],
      requests: {},
      backendHealth: true, 
      headers: ["species", "requested_quota", "allocated_quota", "requested_license", "allocated_license"],
      year: 2024,
      nationName: this.props.match.params.id || ""
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
      var requests = JSON.parse(localStorage.getItem("requests")) 
      this.setState({"requests": requests})
      this.getRequests(this.state.year, requests);
    }).catch(exception => {
      this.state.backendHealth = false;
    })
  }

  getRequests = (year, request) => {
    if (Object.keys(request).length === 0) {
      const requestsPromises = this.state.speciesList.map(species => {
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
      
        this.setState({ requests: updatedRequests }, () => {
          localStorage.setItem("requests", JSON.stringify(this.state.requests));
        });
      });
    }
  }

  setYear = (e) => {
    const year = e.target.value
    this.setState({year: year})
    this.getRequests(year, {})
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
      <Container maxW="container.xl" mt={8}>
        <Heading as="h1" size="2xl" mb={8}>
          {this.state.nationName}
        </Heading>  
        <SimpleGrid columns={2} spacing={8}>
          <ApiSelect 
            list={this.state.nationsList} 
            listType="nation" 
            defaultValue={this.state.nationName}
            onSelect={(e) => this.setState({nationName: e.target.value})}
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
                    : <Text>gs</Text>
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
  
          {/* Second Card */}
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              Analytics
            </Heading>
            {/* Add content for Analytics card */}
          </Box>
  
          {/* Third Card */}
          <Box p={6} boxShadow="xl" borderRadius="md" bg="white">
            <Heading as="h2" size="lg" mb={4}>
              Users
            </Heading>
            {/* Add content for Users card */}
          </Box>
  
        </SimpleGrid>
      </Container>
      </ChakraProvider>
    );
  
  }
}

export default NationPage;
