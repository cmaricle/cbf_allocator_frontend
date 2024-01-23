import React, { useEffect, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import { jwtDecode } from "jwt-decode";
import { useHistory, Link as ReactRouterLink } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  ChakraProvider,
  Container,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
  Stack,
  useToast,
  Flex,
  Card,
  Heading,
} from '@chakra-ui/react';
import WebsiteHeader from '../../components/WebsiteHeader/WebsiteHeader';
import theme from '../../theme';
import * as api from '../../modules/api';
import { useAuth } from '../../AuthContext';
import ErrorPage from '../Error';


const LoginPage = () => {
  const toast = useToast();
  const history = useHistory();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const onLogin = () => {
    setLoading(true);
  };

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
        <WebsiteHeader/>
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="75vh"
          p={4}
        >
          <Card maxW="md" p="10" boxShadow="lg">
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
          <AlertDialog isOpen={sessionTimeout} onClose={() => setSessionTimeout(false)}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Session Timeout
                </AlertDialogHeader>
                <AlertDialogBody>
                  Your session has timed out. Please log in again.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="blue" onClick={() => setSessionTimeout(false)}>
                    Close
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
        </>
        )
        : (<ErrorPage/>)
      }
      {/* </Container> */}
    </ChakraProvider>
  );
};

export default LoginPage;
