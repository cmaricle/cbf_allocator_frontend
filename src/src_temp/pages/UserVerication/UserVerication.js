import React, { useState } from 'react';

import {
  Card,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';


import theme from '../../theme'; // Replace with the path to your Chakra UI theme file
import * as api from "../../modules/api"
import WebsiteHeader from '../../components/WebsiteHeader/WebsiteHeader';

function AccountActivationPage() {
  const [verificationToken, setVerificationToken] = useState('');
  const [username, setUsername] = useState('');

  const toast = useToast();
  const history = useHistory();

  const handleActivateAccount = () => {
    var success = true
    api.activateAccount(username, verificationToken).then((response) => {
      const body = response["response"]
      console.log(body)
      if (body.includes("Invalid")) {
        success = false
      } 
      if (success) {
        toast({
          title: 'Account Activated',
          description: body,
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Activation Failed',
          description: body,
          status: 'error',
          isClosable: true,
        });
      }
      setUsername("")
      setVerificationToken("")
    }
    )
  };

  return (
    <ChakraProvider theme={theme}>
      <WebsiteHeader/>
      <Flex
          direction="column"
          align="center"
          justify="center"
          h="75vh"
          p={4}
        >
        <Card maxW="md" p="10" boxShadow="lg">
        <Stack spacing={4}>
          <Heading size="lg">Account Activation</Heading>
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Enter Verification Token"
            value={verificationToken}
            onChange={(e) => setVerificationToken(e.target.value)}
          />
          <Button onClick={handleActivateAccount} colorScheme="teal">
            Activate Account
          </Button>
          </Stack>
        </Card>
      {/* </Container> */}
      </Flex>
    </ChakraProvider>
  );
}

export default AccountActivationPage;
