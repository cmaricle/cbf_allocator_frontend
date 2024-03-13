// src/components/ParallaxReplicatedWebsite.js
import React, { useState, useEffect, Component } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  Grid,
  GridItem,
  Card,
  Spacer,
  Center,
  Image,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'

import WebsiteHeader from '../components/WebsiteHeader/WebsiteHeader';
import Form  from '../components/Form';
import Footer from '../components/Footer'
import ErrorPage from '../pages/Error'
import * as api from '../modules/api'
import NationVariableForm from '../components/NationVariableForm'
import ProfilePageModal from '../components/ProfilePageModal/ProfilePageModal';

import theme from "../theme"


const ParallaxHeroSection = ({speciesList, image, description, heading}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(scrollY - window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      bgImage={image}
      bgSize="cover"
      h="400px"
      bgPosition={`center`}
      color={image ? "white" : "green.800"}
    >
      <Container 
        maxW="container.lg" 
        p={8} 
        textAlign={image ? "center": ""}
        >
          <Grid templateColumns={"repeat(3, 1fr)"} templateRows={"repeat(3, 1fr)"}>
            <GridItem rowSpan={1}></GridItem>
          <GridItem rowSpan={2}>
              <Center>
                <Heading size="lg" p={3}>How It Works</Heading>
              </Center>
              <Text>Using a combination of fixed and calculated variables, our goal is to distribute the available assets in the fairest manner possible between the requesting nations.</Text>
            </GridItem>
            <GridItem colSpan={2}/>
          </Grid>
      </Container>
    </Box>
  );
};

const HomeSection = ( {speciesList, nationList} ) => {
  return (
    <Flex>
      {/* Left-hand side */}
      <Box flex="1" p="10">
        <Heading variant={"solid"}  >
          Update data
        </Heading>
        <Text fontSize="lg" mb="6">
        Update Nation yearly request data or modify Nation variables
        </Text>
        <Spacer></Spacer>
        <NationVariableForm
          speciesList={speciesList}
          nationsList={nationList}
        />
      </Box>
      <Box flex="1" p="10">
        <Heading variant={"solid"}>
          View Historical Data
        </Heading>
        <Text fontSize="lg" mb="6">
          View previous requests and allocations
        </Text>
        <Spacer></Spacer>
        <Button 
            variant={"solid"}
        >
          Get Started
        </Button>
      </Box>
    </Flex>
  );
};


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nationsList: [],
      speciesList: [],
      backendHealth: true,  
    }
  }

  componentDidMount() {
    api.getHealth().then(response => {
      if (response.statusCode !== 200) {
        this.state.backendHealth = false;
      } else { 
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
      }
    }).catch(exception => {
      this.state.backendHealth = false;
    })
  }

  updateNation = (nationName, nationVariableData) => {
    api.updateNationVariables(nationName, nationVariableData);
  }


  render () {
    return (
      <ChakraProvider theme={theme}>
        { this.state.backendHealth ? 
        (
        <Box
          flexDirection="column"
          // bgImage="website_background.jpeg"
          // bgPos={"center"}
        >
          <Grid 
            maxW="100vw" maxH="100vh"
            templateRows={"repeat(12, 1fr)"}
            templateColumns={"repeat(12, 1fr)"}
          >
            <GridItem rowSpan={1}><WebsiteHeader homePage={false}></WebsiteHeader></GridItem>
            <GridItem colSpan={12}><Divider/></GridItem>
            <GridItem colSpan={2}/>
            <GridItem rowSpan={4} colSpan={4} alignItems={"center"} display={"flex"}>
              <Box alignItems={"center"}>
                <Heading p={3} textAlign={"center"} size="lg">How it Works</Heading>
                <Text textAlign={"center"} p={3}>
                  Using a combination of fixed and calculated variables, our goal is to distribute the available assets in the fairest manner possible between the requesting nations.
                </Text>
                <Center>
                  <ChakraLink as={ReactRouterLink} to='/about'>
                    <Button>
                    Learn More
                    </Button>
                  </ChakraLink>
                </Center>
              </Box>
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem rowSpan={4} colSpan={3} p={5}>
              <Image
                borderRadius={"5%"}
                src="fishing_boat_birds.jpeg"
              >
              </Image>
            </GridItem>
            <GridItem colSpan={2}></GridItem>
            <GridItem colSpan={12}/>
            <GridItem colSpan={12} alignItems={"center"} display={"flex"}><Divider/></GridItem>

            <GridItem colSpan={2}/>
            <GridItem colSpan={2} >
              <Card alignItems={"center"}>
                <CardHeader><Heading size="md">Distribute Quota</Heading></CardHeader>
                <Divider/>
                <CardBody textAlign={"center"}>
                  <Text>
                    Run algorithm to distribute quota to requesting nations
                  </Text>
                </CardBody>
                <CardFooter>
                  <Form 
                    buttonName={"Run Algorithm"}
                    speciesList={this.state.speciesList}
                    nationList={this.state.nationsList}
                  >
                  </Form></CardFooter>
              </Card>
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={2}>
              <Card alignItems={"center"} >
                <CardHeader><Heading size="md">View Profile Pages</Heading></CardHeader>
                <Divider/>
                <CardBody textAlign={"center"}>
                  <Text>
                    View profile page for nations to see their requests and assests
                  </Text>
                </CardBody>
                <CardFooter><ProfilePageModal nationList={this.state.nationsList}></ProfilePageModal></CardFooter>
              </Card>
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem colSpan={2} >
              <Card alignItems={"center"}>
                <CardHeader><Heading size="md">Update Data</Heading></CardHeader>
                <Divider/>
                <CardBody textAlign={"center"}>
                  {/* <Image src="data_entry.jpg">

                  </Image> */}
                  <Text>
                  Update Nation yearly request data or modify Nation variables
                  </Text>
                </CardBody>
                <CardFooter><NationVariableForm
                speciesList={this.state.speciesList}
                nationsList={this.state.nationsList}
                /></CardFooter>
              </Card>
            </GridItem>
            <Footer></Footer>
          </Grid>
        </Box>
        ) : <ErrorPage></ErrorPage>
      }
      </ChakraProvider>
    );
  }
};

export default MainPage;