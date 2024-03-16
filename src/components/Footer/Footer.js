import React, { useState } from "react";
import { useLocation } from 'react-router-dom';


import { 
  Box,
  Center,
  Heading,
  Grid,
} from '@chakra-ui/react'


const Footer  = ({hidden=false}) => {
  const location = useLocation();
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
