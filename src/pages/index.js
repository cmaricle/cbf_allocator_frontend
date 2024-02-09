// src/components/ParallaxReplicatedWebsite.js
import React, { useState, useEffect, Component } from 'react';
import { useHistory } from 'react-router-dom';

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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import WebsiteHeader from '../components/WebsiteHeader/WebsiteHeader';
import Form  from '../components/Form';
import * as api from '../modules/api'
import NationVariableForm from '../components/NationVariableForm'
import ApiSelect from "../components/Select"

import theme from "../theme"
import ErrorPage from './Error/Error';

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

function ProfilePageModal({nationList}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory()

  return (
    <>
      <Button onClick={onOpen}>Select Nation</Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Nation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ApiSelect list={nationList} listType="nation" onSelect={(e) => history.push(`/profile/${e.target.value}`)}></ApiSelect>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}


const HomeSection = ( {speciesList, nationList} ) => {
  return (
    <Center>
    <Flex alignItems="center" minWidth='max-content'>
      {/* Left-hand side */}
      <Box flex="1" p="10" mx="center" textAlign={"center"}>
        <Heading variant={"solid"}  >
          Update Data
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
      <Box flex="1" p="10"  mx="center" textAlign={"center"}>
        <Heading variant={"solid"}>
          View Profile Pages
        </Heading>
        <Text fontSize="lg" mb="6">
          View profile page for nations to see their assets, historical requests and grants
        </Text>
        <Spacer></Spacer>
        <ProfilePageModal nationList={nationList}></ProfilePageModal>
      </Box>
    </Flex>
    </Center>
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
        (<Box p="2">
          <WebsiteHeader></WebsiteHeader>
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
       </Box>)
        : (<ErrorPage/>)
        }
      </ChakraProvider>
    );
  }
};

export default MainPage;
