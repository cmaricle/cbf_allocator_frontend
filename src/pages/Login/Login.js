import React, { useEffect, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import { jwtDecode } from "jwt-decode";
import { useHistory, Link as ReactRouterLink } from 'react-router-dom';
import {
  Grid,
  Button,
  ChakraProvider,
  Image,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
  Stack,
  useToast,
  Box,
  Card,
  Heading,
  GridItem,
  Center,
} from '@chakra-ui/react';
import WebsiteHeader from '../../components/WebsiteHeader/WebsiteHeader';
import AlertPopUp from '../../components/AlertPopUp/AlertPopUp';
import theme from '../../theme';
import * as api from '../../modules/api';
import { useAuth } from '../../AuthContext';
import ErrorPage from '../Error';
import Footer from '../../components/Footer/Footer';


const LoginPage = () => {
  const toast = useToast();
  const history = useHistory();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  const onLogin = () => {
    setLoading(true);
  };

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
    if (localStorage.getItem("token")) {
      const currentTime =  Math.floor(new Date().getTime() / 1000);
      const tokenExp = jwtDecode(localStorage.getItem("token"))["exp"]
      if (tokenExp - currentTime < 0) {
        localStorage.removeItem("token")
        setSessionTimeout(true)
      } else {
        setSessionTimeout(false)
      } 
    } else {
      setSessionTimeout(false)
    }
    api.getHealth().then(response => {
      if (response.statusCode !== 200) {
        setBackendHealth(false);
      }
    }).catch(exception => {
      setBackendHealth(false);
    })
  }, []);

  useEffect(() => {
    if (loading) {
      const passwordInput = document.getElementById('passwordInput');
      const hashedInputValue = sha256(passwordInput.value).toString();
      api.login(username, hashedInputValue).then((response) => {
        if (response) {
          if (response.statusCode !== 200) {
            toast({
              description: "Invalid username or password.",
              status: 'error',
              isClosable: true,
            });
            setUsername('');
            passwordInput.value = '';
          } else {
            login(response["body"]["token"]);
            history.push('/');
          }
        } else {
          history.push("/error")
        }
        setLoading(false);
      });
    }
  }, [loading]);

  return (
    <ChakraProvider theme={theme}>
      { backendHealth ? 
      (
        <>
          <Grid
            height="100vh"
            templateRows='repeat(8, 1fr)'
            templateColumns='repeat(6, 1fr)'
          >
            <GridItem rowSpan={1} colSpan={8}><WebsiteHeader/></GridItem>
            <GridItem colSpan={8}/>
            <GridItem colSpan={1}/>
            <GridItem colSpan={!isMobile ? 2 : 4} rowSpan={4}  display={"grid"}>
            <Center>
              <Card maxW="sm" p="10" boxShadow="lg">
              <Heading mb="4">Login</Heading>
              <Stack spacing={4}>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    id="passwordInput"
                  />
                </FormControl>

                <Button 
                  onClick={onLogin} 
                  isLoading={loading} 
                  isDisabled={username === "" }
                >
                  Login
                </Button>
                <ChakraLink
                  as={ReactRouterLink} 
                  fontSize="sm" 
                  textAlign="center"
                  to="/create-user"
                >
                  Create a new account
                </ChakraLink>
              </Stack>
            </Card>
          </Center>
            </GridItem>
            <GridItem hidden={isMobile} colSpan={3} rowSpan={4} display={"grid"} boxSize={"xl"}>
              <Center>
              < Image src="fishing_boat.jpeg"></Image>
              </Center>
            </GridItem>
            <GridItem rowSpan={1}></GridItem>
            <GridItem rowSpan={1}><Footer/></GridItem>
          </Grid>
          <AlertPopUp
            isOpen={sessionTimeout}
            header="Session Timeout"
            dialog="Your session has timed out. Please log in again."
            onClose={() => setSessionTimeout(false)}
          />
      </>
        )
        : (<ErrorPage/>)
      }
      {/* </Container> */}
    </ChakraProvider>
  );
};

export default LoginPage;
