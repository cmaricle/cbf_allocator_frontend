import React, { Component } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  Center,
  Image,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
  IconButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import WebsiteHeader from '../components/WebsiteHeader/WebsiteHeader';
import Form  from '../components/Form';
import Footer from '../components/Footer'
import ErrorPage from '../pages/Error'
import * as api from '../modules/api'
import NationVariableForm from '../components/NationVariableForm'
import ProfilePageModal from '../components/ProfilePageModal/ProfilePageModal';

import theme from "../theme"


const HomePageCard = ({header, body, button, isMobile=false}) => {
  return (
    <Card alignItems={"center"} maxW={isMobile ? "150px" : ""}>
        <CardHeader><Heading textAlign={"center"} size="md" noOfLines={1}>{header}</Heading></CardHeader>
        <Divider/>
        <CardBody noOfLines={3} textAlign={"center"}>
          <Text>
            {body}
          </Text>
        </CardBody>
        <CardFooter>
          {button}
        </CardFooter>
      </Card>
  )
}


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nationsList: [],
      speciesList: [],
      backendHealth: true,  
      width: window.innerWidth,
      isMobile: window.innerWidth <= 768,
      position: 0,
    }
  }

  getHomePageCard = (type) => {
    console.log(this.state.speciesList)
    if (type === "updateData") {
      return <HomePageCard
        header="Update Data"
        body="Update Nation yearly request data or modify Nation variables"
        button={<NationVariableForm
          speciesList={this.state.speciesList}
          nationsList={this.state.nationsList}/>}
        isMobile={this.state.isMobile}
      />
    } else if (type === "runAlgo") {
      return <HomePageCard
        header="Distribute Quota"
        body="Run algorithm to distribute quota to requesting nations"
        button={<Form 
          buttonName={"Run Algorithm"}
          speciesList={this.state.speciesList}
          nationList={this.state.nationsList}
        ></Form>}
        isMobile={this.state.isMobile}
        />
    } else {
      return <HomePageCard
        header="View Profiles"
        body="View profile page for nations to see their requests and assests"
        button={<ProfilePageModal nationList={this.state.nationsList}></ProfilePageModal>}
        isMobile={this.state.isMobile}

        />
      }
  }

  handleWindowSizeChange = () => {
    this.setState({width: window.innerWidth});
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
    window.addEventListener('resize', this.handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }
  }

  updateNation = (nationName, nationVariableData) => {
    api.updateNationVariables(nationName, nationVariableData);
  }


  render () {
    return (
      <ChakraProvider theme={theme}>
        { this.state.backendHealth ? 
        (
        // <Box
        //   flexDirection="column"
        //   // bgImage="website_background.jpeg"
        //   // bgPos={"center"}
        // >
          <Grid 
            maxW="100vw" 
            maxH="100vh"
            templateRows={!this.state.isMobile ? "repeat(12, 1fr)" : "repeat(10, 1fr)"}
            templateColumns={!this.state.isMobile ? "repeat(12, 1fr)" : "repeat(4, 1fr)"}
          >
            <GridItem rowSpan={1}><WebsiteHeader homePage={false}></WebsiteHeader></GridItem>
            <GridItem colSpan={12}><Divider/></GridItem>
            <GridItem colSpan={2}/>
            <GridItem rowSpan={4} colSpan={this.state.isMobile ? 1 : 4} alignItems={"center"} display={!this.state.isMobile ? "flex" : "block"}>
              <Box alignItems={"center"}>
                <Heading p={!this.state.isMobile ? 3 : 0} textAlign={"center"} size="lg">How it Works</Heading>
                <Text textAlign={"center"} p={3}>
                  Using a combination of fixed and calculated variables, our goal is to distribute the available assets in the fairest manner possible between the requesting nations.
                </Text>
                { !this.state.isMobile ? 
                  <Center>
                    <ChakraLink as={ReactRouterLink} to='/about'>
                      <Button>
                      Learn More
                      </Button>
                    </ChakraLink>
                  </Center>
                  : <></>
                }
              </Box>
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            <GridItem rowSpan={!this.state.isMobile ? 4 : 3} colSpan={!this.state.isMobile ? 3 : 2} p={! this.state.isMobile ? 5 : 0}>
              <Image
                borderRadius={"5%"}
                src="fishing_boat_birds.jpeg"
                p={!this.state.isMobile ? 3 : 0}
              >
              </Image>
              {
                this.state.isMobile ? <Center>
                <ChakraLink as={ReactRouterLink} to='/about' p={3}>
                  <Button>
                  Learn More
                  </Button>
                </ChakraLink>
              </Center>
                 : <></>
              }
              </GridItem>
              
            <GridItem colSpan={2}></GridItem>
            <GridItem colSpan={12}>{this.state.isMobile ? <Divider/> : <></>}</GridItem>
            {
              !this.state.isMobile ? <GridItem colSpan={12} alignItems={"center"} display={"flex"}><Divider/></GridItem> : <></>
            }

            <GridItem colSpan={2}/>
            <GridItem colSpan={this.state.isMobile ? 1 : 2} display={"flex"} alignItems={"center"}>
            {
              this.state.isMobile ? 
                <IconButton 
                  icon={<ChevronLeftIcon/>}
                  name="leftButton"
                  background={"transparent"}
                  color="green.800"
                  onClick={(e) => this.setState({position: this.state.position === 2 ? 0 : this.state.position + 1})}
                  /> : <></>
              } {
                this.state.position === 0 || !this.state.isMobile ? 
                this.getHomePageCard("runAlgo", this.state) : this.state.position === 1 ? this.getHomePageCard("updateData") : this.getHomePageCard("profileCard")
              }

            </GridItem>
            <GridItem colSpan={this.state.isMobile ? 2 : 1}></GridItem>
            <GridItem colSpan={this.state.isMobile ? 1 : 2} rowSpan={this.state.isMobile ? 3 : 0} display={this.state.isMobile ? "flex" : ""} alignItems={"center"}>
              {
                this.state.position === 0 || !this.state.isMobile ? 
                this.getHomePageCard("updateData") : this.state.position === 1 ? this.getHomePageCard("profileCard") : this.getHomePageCard("profileCard")
              }{
                this.state.isMobile ? 
                  <IconButton 
                    icon={<ChevronRightIcon/>}
                    name="rightButton"
                    background={"transparent"}
                    color="green.800"
                    onClick={(e) => this.setState({position: this.state.position === 1 ? 0 : this.state.position + 1})}
                    /> : <></>
                }
            </GridItem>
            <GridItem colSpan={1}></GridItem>
            { !this.state.isMobile ? 
              <GridItem colSpan={this.state.isMobile ? 1 : 2}>
               {this.getHomePageCard("profileData")}
              </GridItem> : <></> 
            }
            <Footer></Footer>
          </Grid>
        ) : <ErrorPage></ErrorPage>
      }
      </ChakraProvider>
    );
  }
};

export default MainPage;