import React, { Component } from "react";
import { useHistory } from 'react-router-dom';

import { IoHomeOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

import { Link as ReactRouterLink } from 'react-router-dom'
import { FormLabel, Link as ChakraLink, LinkProps } from '@chakra-ui/react'


import { 
  Box,
  ButtonGroup,
  Button,
  Flex, 
  Heading,
  IconButton,
  Spacer 
} from '@chakra-ui/react'

import { useAuth } from "../../AuthContext"

const WebsiteHeader  = () => {
  const { logout, authenticated } = useAuth()
  const history = useHistory();

  
  const onLogout = (e) => {
    logout();
    history.push("/login");
  }
  
  return (
      <Flex minWidth='max-content' alignItems='center' gap='1'>
      <Box p='3'>
        <Heading color="green.800" size='lg'>Distribution Management App</Heading>
      </Box>
      <Spacer />
      <ButtonGroup gap='0'>
        <ChakraLink as={ReactRouterLink} to={authenticated ? "/" : "/login"}>
          <IconButton 
            color="green.800"
            background="white"
            icon={<IoHomeOutline/>}>
          </IconButton>
        </ChakraLink>
        <IconButton 
          color='green.800' 
          background="white" 
          icon={<IoLogOutOutline/>}
          onClick={onLogout}
          hidden={!authenticated}
        >
        </IconButton>
      </ButtonGroup>
    </Flex>
  );
}

export default WebsiteHeader;
