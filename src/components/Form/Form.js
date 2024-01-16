import React, {useState} from "react";

import { Link as ReactRouterLink } from 'react-router-dom'
import { ChakraProvider, Divider, FormLabel, Link as ChakraLink, RadioGroup, Radio, Stack, Center } from '@chakra-ui/react'

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
  const [year, setYear] = useState("2024");

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
                <ApiSelect listType="species" list={speciesList} onSelect={handleSpeciesChange}/>
                <Divider hidden={quotaEntryHidden} p={2}></Divider>
                <RadioGroup hidden={selectedSpecies === ""} onChange={e => setYear(e)} value={year}>
                  <Stack direction="row">
                    {["2024", "2025", "2026", "2027", "2028"].map(year => (
                      <Radio key={year} value={year}>{year}</Radio>
                    ))}
                  </Stack>
                </RadioGroup>
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
                    year: year,
                    speciesList: speciesList,
                    loading: true,
                  },
                }}
              >
                <Button
                  isDisabled={isDisabled || year === undefined} 
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
