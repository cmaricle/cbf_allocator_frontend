import React, { Component, useState, useEffect } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { IoHomeOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

import { Link as ReactRouterLink } from 'react-router-dom'
import { FormLabel, Link as ChakraLink, LinkProps, Center } from '@chakra-ui/react'


import { 
  Box,
  ButtonGroup,
  Flex, 
  Heading,
  Grid,
  useDisclosure, 
} from '@chakra-ui/react'

import { HamburgerIcon } from "@chakra-ui/icons";

const Footer  = ({hidden=false}) => {
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scrollY, setScrollY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('green.800');
  const [fontColor, setFontColor] = useState("white")

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="999"
      p="4"
      width="100%"
      bg={backgroundColor}
      color={fontColor}
      hidden={hidden}
    >
      <Grid >
      <Center>
        <Heading size='sm'>DISTRIBUTION MANAGEMENT</Heading>
      </Center>
      </Grid>
    </Box>
  );
}

export default Footer;
