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
  Link,
  Image,
  VStack,
  Spacer,
  Center,
  AbsoluteCenter,
} from '@chakra-ui/react';

import WebsiteHeader from '../components/WebsiteHeader/WebsiteHeader';
import Form  from '../components/Form';
import * as api from '../modules/api'
import NationVariableForm from '../components/NationVariableForm'

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
      h="300px"
      bgPosition={`center ${scrollY * 0.5}px`}
      color={image ? "white" : "green.800"}
    >
      <Container 
        maxW="container.lg" 
        p={8} 
        textAlign={image ? "center": ""}
        height="100vh"
        >
          <Heading  as="h2" mb={4} fontSize="4xl" textShadow={"rgba(0, 0, 0, 0.4) 0px 4px 5px"}>
            {heading}
          </Heading>
          <Text textShadow={"rgba(0, 0, 0, 0.4) 0px 4px 5px"} fontSize="lg" mb={8}>
            {description}
          </Text>
          <Form 
          buttonName="Run Algorithm"
          speciesList={speciesList}
          >
          </Form>
      </Container>
    </Box>
  );
};

const HomeSection = ( {speciesList, nationList} ) => {
  console.log(nationList)
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
      speciesList: [] 
    }
  }

  componentDidMount() {
    localStorage.clear()
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

  updateNation = (nationName, nationVariableData) => {
    api.updateNationVariables(nationName, nationVariableData);
  }


  render () {
    return (
      <ChakraProvider theme={theme}>
        <Box p="2">
          <WebsiteHeader></WebsiteHeader>
          {/* Hero Section with Parallax Effect */}
          <ParallaxHeroSection 
            image="fish_2.jpeg"
            heading="Distribute Quota"
            description="Run algorithm to distribute quota to requesting nations"
            speciesList={this.state.speciesList}
          />
          <Spacer></Spacer>
          <Spacer></Spacer>
          <HomeSection
            speciesList={this.state.speciesList}
            nationList={this.state.nationsList}
          ></HomeSection>
          {/* Additional Sections */}
          {/* Add more sections based on the structure of the website */}
        </Box>
      </ChakraProvider>
    );
  }
};

export default MainPage;
