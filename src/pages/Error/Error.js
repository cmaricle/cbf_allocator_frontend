import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom'

import { ChakraProvider, Link as ChakraLink, Box, Button, Heading, Text, VStack  } from '@chakra-ui/react';

import theme from '../../theme';

const ErrorPage = ({ error }) => {
  return (
    <ChakraProvider theme={theme}>
       <VStack height="100vh" justifyContent="center">
        <Box
          textAlign="center"
          p={10}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          maxW="md"
          mx="auto"
        >
          <Box color="red.500" size="2em" mb={4} />
          <Heading as="h2" size="xl" mb={4}>
            Oops! Something went wrong.
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            We're sorry, but we're experiencing technical difficulties.
          </Text>
          <Text fontSize="md" color="gray.600" mb={6}>
            Please try again later or contact support for assistance.
          </Text>
          <ChakraLink 
                as={ReactRouterLink}
                to={{
                  pathname: "/",
                }}
          >
            <Button mt={4}>
              Reload Page
            </Button>
          </ChakraLink>
        </Box>
      </VStack>
    </ChakraProvider>
  );
};

export default ErrorPage;
