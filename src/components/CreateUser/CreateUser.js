import React, { useState } from 'react';
import sha256 from 'crypto-js/sha256';

import { 
  ChakraProvider, 
  Container, 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  useToast,
  Text, 
  HStack,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react';
import theme from '../../theme';
import * as api from '../../modules/api';
import WebsiteHeader from '../WebsiteHeader/WebsiteHeader';


const CreateUser = () => {
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    try {
      // Call the API to create a new user
      const hashedPassword = sha256(password).toString()
      const result = await api.createUser( username, hashedPassword, email );
      const response = result["body"]
      if (response["response"].includes("Error")) {
        toast({
          title: 'Error',
          description: 'Failed to create a new user. Please try again.',
          status: 'error',
          isClosable: true,
        });
      } else {
        toast({
          title: 'User Created',
          description: response["response"],
          status: 'success',
          isClosable: true,
        });
      }
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmailInvalid = (email) => {
    if (email.includes("@")) {
      return true
    }
    return false
  }

  return (
    <ChakraProvider theme={theme}>
            <WebsiteHeader />
      <Container maxW="container.sm" centerContent>
        <Box mt="10">
          <Heading as="h2" size="xl" mb="6">
            Create a New User
          </Heading>
          <FormControl id="username" mb="4">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl isInvalid={isEmailInvalid(email)} id="email" mb="4">
            <FormLabel>Email</FormLabel>
            <HStack>
              <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Text>@coastnationfisheries.com</Text>
            </HStack>
            { isEmailInvalid(email) ? (
                <FormErrorMessage>Only add email username</FormErrorMessage>
                ) : (
                <FormHelperText>Only accepting users with verified CNF emails</FormHelperText>
                )
            }
          </FormControl>
          <FormControl id="password" mb="6">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl 
            id="confirmPassword" 
            mb="6"
            isInvalid={password !== confirmPassword}
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormErrorMessage>Passwords do not match</FormErrorMessage>
          </FormControl>
          <Button 
            colorScheme="teal" 
            size="lg" 
            onClick={onSubmit} 
            isLoading={loading}
            isDisabled={password !== confirmPassword || password === "" || username === "" || email === "" || isEmailInvalid(email)}
            >
            Create User
          </Button>
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default CreateUser;
