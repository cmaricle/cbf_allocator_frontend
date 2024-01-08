import React, {useState} from "react";

import { Link as ReactRouterLink } from 'react-router-dom'
import { ChakraProvider, Divider, FormLabel, Link as ChakraLink, LinkProps, Spacer } from '@chakra-ui/react'

import {
  Box,
  Button,
  VStack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  StackDivider,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react'

import ApiSelect from '../Select'
import QuotaSlider from "../QuotaSlider/QuotaSlider";
import theme from "../../theme"

function Form({buttonName, speciesList}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [quotaEntryHidden, setQuotaEntryHidden] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSpeciesChange = (event) => {
    const newSpecies = event.target.value;
    setSelectedSpecies(newSpecies);
    setQuotaEntryHidden(false)
  }

  const handleQuotaChange = (value) => {
    setSelectedQuota(value)
    setIsDisabled(false);
  }

  const handleLicenseChange = (value) => {
    setSelectedLicense(value);
    setIsDisabled(false);
  }

  const extendOnClose = (e) => {
    setSelectedSpecies("");
    setSelectedQuota(0);
    setQuotaEntryHidden(true);
    setIsDisabled(true);
    onClose();
  }

  // runAlgorithm = () => {
  //   setAlgorithmResults(onRun(selectedSpecies, selectedQuota));
  // }

  return (
    <ChakraProvider theme={theme}>
        <Button 
          onClick={onOpen} 
          variant={"solid"}
        >{buttonName}</Button>
        <Modal isOpen={isOpen} onClose={extendOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Distribute Quota</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack  
                      spacing={2}
                      align='stretch'
              >
                <Box height="80px">
                  <ApiSelect listType="species" list={speciesList} onSelect={handleSpeciesChange}/>
                </Box>
                <Divider hidden={quotaEntryHidden}></Divider>
                <Box height="80px" hidden={quotaEntryHidden}>
                  <FormLabel>Enter available quota</FormLabel>
                  <QuotaSlider 
                    onSelect={handleQuotaChange}
                    maxValue={100000}
                    step={1000}
                  />
                </Box>
                <Box height="80px" hidden={quotaEntryHidden}>
                  <FormLabel>Enter available license</FormLabel>
                  <QuotaSlider 
                    onSelect={handleLicenseChange}
                    maxValue={100}
                    step={1}
                  />
                </Box> 
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup gap='1'>
              <Button 
                variant={"cancel"}
                onClick={extendOnClose}
              >
                Cancel
              </Button>
              <ChakraLink 
                as={ReactRouterLink}
                to={{
                  pathname: "/run-algorithm",
                  state: {
                    species: selectedSpecies, 
                    quota: selectedQuota, 
                    license: selectedLicense,
                    speciesList: speciesList,
                    loading: true,
                  },
                }}
              >
                <Button
                  isDisabled={isDisabled} 
                  onClick={extendOnClose}
                  >
                  Run!
                </Button>
              </ChakraLink>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </ChakraProvider>
  )
}

export default Form;
