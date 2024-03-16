import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link as ReactRouterLink } from 'react-router-dom';

import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";

import { Link as ChakraLink, Center } from '@chakra-ui/react'


import { 
  Box,
  ButtonGroup,
  Flex, 
  Heading,
  IconButton,
  Spacer,
  useDisclosure, 
} from '@chakra-ui/react'

import { useAuth } from "../../AuthContext"
import { HamburgerIcon } from "@chakra-ui/icons";

const WebsiteHeader  = ({hidden=false, homePage=false}) => {
  const location = useLocation();

  const { logout, authenticated } = useAuth()
  const [isHidden, setIsHidden] = useState(hidden)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [scrollY, setScrollY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [fontColor, setFontColor] = useState("green.800")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 15 && homePage) {
        setBackgroundColor("white");
        setFontColor("green.800")
      } else if (window.scrollY > 15 && !homePage) {
        setIsHidden(true)
      } else if (window.scrollY < 15 && !homePage ) {
        setIsHidden(false)
      }  else if (homePage) {
        setBackgroundColor('transparent');
        setFontColor("white")
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const history = useHistory();

  const onLogout = (e) => {
    logout();
    history.push("/login");
  }
  
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999"
      p="4"
      width="100%"
      bg={backgroundColor}
      color={fontColor}
      hidden={isHidden}
    >
      <Flex minWidth='max-content' alignItems='center' gap='1'>
      <Center>
      <Box>
        <Heading size='md'>DISTRIBUTION MANAGEMENT</Heading>
      </Box>
      </Center>
      <Spacer />
      <ButtonGroup gap='0'>
        <ChakraLink as={ReactRouterLink} to={authenticated ? "/" : "/login"}>
          <IconButton 
            background="transparent"
            color={fontColor}
            icon={<IoHomeOutline/>}>
          </IconButton>
        </ChakraLink>
        <IconButton 
          background="transparent" 
          icon={<IoLogOutOutline/>}
          onClick={onLogout}
          hidden={!authenticated}
          color={fontColor}
        >
        </IconButton>
      </ButtonGroup>
    </Flex>
    </Box>
  );
}

export default WebsiteHeader;
