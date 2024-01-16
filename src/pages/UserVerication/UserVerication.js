import React, { useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom'


import {
  Card,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Input,
  Link as ChakraLink,
  Button,
  Stack,
  useToast,
  ButtonGroup,
  Center,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';


import theme from '../../theme'; // Replace with the path to your Chakra UI theme file
import * as api from "../../modules/api"
import WebsiteHeader from '../../components/WebsiteHeader/WebsiteHeader';

function AccountActivationPage() {
  const [verificationToken, setVerificationToken] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false)
  const [loginButtonHidden, setLoginButtonHidden] = useState(true);

  const toast = useToast();
  const history = useHistory();

  const handleActivateAccount = () => {
    var success = true
    setLoading(true)
    api.activateAccount(username, verificationToken).then((response) => {
      setLoading(false)
      if (response["statusCode"] === 200) {
        const body = response["body"]["response"]
        if (body.includes("Invalid")) {
          success = false
        } 
        if (success) {
          setLoginButtonHidden(false)
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
            <Button 
              onClick={handleActivateAccount} 
              isLoading={loading}
              isDisabled={username === "" || verificationToken === ""}
            >
            Activate Account
          </Button>
          <Center>
          <ChakraLink 
                as={ReactRouterLink}
                to={{
                  pathname: "/login",
                }}
                hidden={loginButtonHidden}
          >
              Go to Login page
          </ChakraLink>
          </Center>
          </Stack>
        </Card>
      {/* </Container> */}
      </Flex>
    </ChakraProvider>
  );
}

export default AccountActivationPage;
