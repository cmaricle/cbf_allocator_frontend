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
  SimpleGrid,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Slide,
  ScaleFade,
} from '@chakra-ui/react';

import WebsiteHeader from '../components/WebsiteHeader/WebsiteHeader';
import Form  from '../components/Form';
import * as api from '../modules/api'
import NationVariableForm from '../components/NationVariableForm'
import ApiSelect from "../components/Select"

import theme from "../theme"
import ErrorPage from './Error/Error';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Footer from '../components/Footer/Footer';


const HomePageCard = ({header, description, button}) => {
  return (
    <Container 
    maxW="container.lg" 
    textAlign={"center"}
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
    <Heading p={2} as='h1' size='4xl' mb={4} noOfLines={1} textShadow={"rgba(0, 0, 0, 0.4) 0px 4px 5px"}>
    {header}
    </Heading>
    <Text textShadow={"rgba(0, 0, 0, 0.4) 0px 4px 5px"} fontSize={"2xl"}  mb={8}>
      {description}
    </Text>
    {button}
    </Container>
  )
}

const Ellipsis = ({ totalSlides, activeSlide, setActiveSlide }) => {
  return (
    <Flex justify="center" mt={4}>
      {[...Array(totalSlides)].map((_, index) => (
        <Box
          key={index}
          w="10px"
          h="10px"
          bg={index === activeSlide ? 'green.800' : 'gray.200'}
          borderRadius="50%"
          mx={1}
          cursor="pointer"
          onClick={() => setActiveSlide(index)}
        />
      ))}
    </Flex>
  );
};


const ParallaxHeroSection = ({speciesList, nationList, image, description, heading}) => {
  const [scrollY, setScrollY] = useState(0);
  const [position, setPosition] = useState(0);
  const [hidden, setHidden] = useState(true);
  const { isOpen, onToggle } = useDisclosure()

  function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(scrollY - window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    setHidden(false);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
    <Box
      bgImage={image}
      bgSize="cover"
      bgPosition={`center ${scrollY * 0.5}px`}
      color={image ? "white" : "green.800"}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      // justifyContent="center"
    >
      <WebsiteHeader hidden={getScrollPercent() > 80}></WebsiteHeader>
      <Box flex="1"></Box> {/* This will create space for the header */}
      <Grid templateColumns='repeat(5, 1fr)'>
        <GridItem colSpan={1}>
          <Box alignContent={"end"} alignItems={"end"}>
          <IconButton 
            background="transparent" 
            icon={<ChevronLeftIcon/>}
            onClick={(e) => setPosition(position === 0 ? 2 : position - 1)}
          >
          </IconButton>
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          {
            position === 0 ?
              <HomePageCard header={heading} description={description} button={<Form buttonName={"Run Algorithm"} speciesList={speciesList} />}/> :
            position === 1 ? 
              <HomePageCard header={"Update Data"} description={"Update Nation yearly request data or modify Nation variables"} 
              button={<NationVariableForm
                speciesList={speciesList}
                nationsList={nationList}
              />}></HomePageCard> :
            <HomePageCard header={"View Profile Pages"} description={"View profile page for nations to see their requests and assests"} button={<ProfilePageModal nationList={nationList}></ProfilePageModal>}></HomePageCard>
                
          }
      </GridItem>
      <GridItem colSpan={1}>
        <Box justifyContent={"flex-end"} display={"flex"}>
          <IconButton 
          icon={<ChevronRightIcon/>}
          name="rightButton"
          background={"transparent"}
          onClick={(e) => setPosition(position === 2 ? 0 : position + 1)}
        >
          </IconButton>
          </Box>
          
      </GridItem>
      </Grid>
      <Box p={3} flex="1" position="relative" justifyContent={"center"} display={"flex"} alignItems={"flex-end"}>
        <Ellipsis
              position="absolute"
              totalSlides={3}
              activeSlide={position}
              setActiveSlide={setPosition}
            />
      </Box>
    </Box>
    <Box hidden={hidden} height={"100vh"} >
        <Slide direction='left' in={getScrollPercent() > 80} style={{ zIndex: 10 }}>
        <Grid templateColumns='repeat(6, 1fr)' templateRows="repeat(16, 1fr)">
        <GridItem colSpan={6} rowSpan={4}><Box flex="1"></Box></GridItem>
        <GridItem colSpan={1}><Box flex="1"></Box></GridItem>
        <GridItem colSpan={2} rowSpan={8}>
          <Image
            src="https://images.pexels.com/photos/15034747/pexels-photo-15034747.jpeg?cs=srgb&dl=pexels-bet%C3%BCl-kara-15034747.jpg&fm=jpg&_gl=1*1a62lz6*_ga*MjkwMTMxNTcyLjE3MDg4MDY0MzI.*_ga_8JE65Q40S6*MTcwODgwNjQzMi4xLjEuMTcwODgwNjU3MC4wLjAuMA.."
            boxSize="400px"
          >
          </Image>
          </GridItem>
          <GridItem hidden={hidden || getScrollPercent() < 95} colSpan={2} rowSpan={2}>
            <ScaleFade in={getScrollPercent() > 95}>
              <Center>
                <Heading color="green.800">How It Works</Heading>
              </Center>
            </ScaleFade>
          </GridItem>
          <GridItem hidden={hidden || getScrollPercent() < 98} colSpan={2} rowSpan={3}>
            <Slide 
              direction='right' 
              in={getScrollPercent() > 98} 
              style={{position: "relative"}}
              >
                <Text textAlign={"center"}>
                  Using a combination of fixed and calculated variables, our goal is to distribute the available assets in the fairest manner possible between the requesting nations.
                </Text>
            </Slide>
          </GridItem>
          <GridItem hidden={hidden || getScrollPercent() < 99} colSpan={2} rowSpan={2}>
            <ScaleFade in={getScrollPercent() > 99}>
              <Center>
                <Button>Learn More</Button>
              </Center>
            </ScaleFade>
          </GridItem>
          <GridItem colSpan={5}></GridItem>
        </Grid>
        </Slide>
        <Footer hidden={hidden || getScrollPercent() < 99}/>
    </Box>
</>
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
        <Box>
          <ParallaxHeroSection 
            image="website_background.jpeg"
            heading="Distribute Quota"
            description="Run algorithm to distribute quota to requesting nations"
            speciesList={this.state.speciesList}
            nationList={this.state.nationsList}
          />
       </Box>)
        : (<ErrorPage/>)
        }
      </ChakraProvider>
    );
  }
};

export default MainPage;
