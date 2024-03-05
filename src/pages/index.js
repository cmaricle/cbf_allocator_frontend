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
    <Heading 
      p={2} 
      as='h1' 
      size='4xl' 
      mb={4} 
      noOfLines={1} 
      textShadow={"rgba(0, 0, 0, 0.4) 0px 4px 5px"}
      display="block"
    >
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
  const [percent, setPercent] = useState(0)
  const [hidden, setHidden] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  useEffect(() => {
    setHidden(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
      setPercent(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setHidden(true)
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
      <WebsiteHeader hidden={percent > 80}></WebsiteHeader>
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
    {
      percent > 0 && !hidden ?
      (<Box height={"100vh"} >
        <Slide direction='left' in={percent> 80} style={{ zIndex: 10 }}>
        <Grid templateColumns={!isMobile ? "repeat(6, 1fr)" : "repeat(8, 1fr)"}  templateRows={!isMobile ? "repeat(16, 1fr)" : "repeat(4, 1fr)"}>
        <GridItem colSpan={!isMobile ? 6 : 8} rowSpan={!isMobile ? 4 : 1}><Box flex="1"></Box></GridItem>
        <GridItem colSpan={!isMobile ? 1 : 2}><Box flex="1"></Box></GridItem>
        <GridItem colSpan={!isMobile ? 2 : 4} rowSpan={!isMobile ? 8 : 2}>
          <Image
            src="https://images.pexels.com/photos/15034747/pexels-photo-15034747.jpeg?cs=srgb&dl=pexels-bet%C3%BCl-kara-15034747.jpg&fm=jpg&_gl=1*1a62lz6*_ga*MjkwMTMxNTcyLjE3MDg4MDY0MzI.*_ga_8JE65Q40S6*MTcwODgwNjQzMi4xLjEuMTcwODgwNjU3MC4wLjAuMA.."
            boxSize={!isMobile ? "400px" : "200px"}
          >
          </Image>
          </GridItem>
          { isMobile ? <GridItem colSpan={3}></GridItem> : <></>}
          <GridItem hidden={percent < 95} colSpan={!isMobile ? 2 : 3} rowSpan={!isMobile ? 2 : 1}>
            <ScaleFade in={percent > 95}>
              <Center>
                <Heading color="green.800">How It Works</Heading>
              </Center>
            </ScaleFade>
          </GridItem>
          { isMobile ? <><GridItem colSpan={2}></GridItem><GridItem colSpan={1}></GridItem></> : <></>}
          <GridItem hidden={percent < 98} colSpan={!isMobile ? 2 : 6} rowSpan={!isMobile ? 3 : 1}>
            <Slide 
              direction='right' 
              in={percent > 98} 
              style={{position: "relative"}}
              hidden={percent < 98}
              >
                <Text textAlign={"center"} hidden={percent < 98}>
                  Using a combination of fixed and calculated variables, our goal is to distribute the available assets in the fairest manner possible between the requesting nations.
                </Text>
            </Slide>
          </GridItem>
          { isMobile ? <GridItem colSpan={3}></GridItem> : <></>}
          <GridItem hidden={percent < 99} colSpan={2} rowSpan={1} >
            <ScaleFade in={percent > 99} display="flex">
              <Center>
                <Button hidden={percent < 99}>Learn More</Button>
              </Center>
            </ScaleFade>
          </GridItem>
          <GridItem colSpan={5}></GridItem>
        </Grid>
        </Slide>
        <Footer hidden={percent < 99}/>
    </Box>) : <></>}) 
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
