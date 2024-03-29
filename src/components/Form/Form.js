import React, {useState} from "react";

import { Link as ReactRouterLink } from 'react-router-dom'
import { ChakraProvider, Divider, FormLabel, Link as ChakraLink, RadioGroup, Radio, Stack, Center, SimpleGrid, NumberInput, NumberInputField, FormControl } from '@chakra-ui/react'

import {
  Box,
  Button,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react'

import { RepeatIcon } from "@chakra-ui/icons"

import ApiSelect from '../Select'
import QuotaSlider from "../QuotaSlider/QuotaSlider";
import theme from "../../theme"

function Form({buttonName, speciesList, link=false}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [quotaEntryHidden, setQuotaEntryHidden] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [quotaDollarAmount, setQuotaDollarAmount] = useState(0);
  const [licenseDollarAmount, setLicenseDollarAmount] = useState(0);
  const [year, setYear] = useState("2024");

  const handleSpeciesChange = (event) => {
    const newSpecies = event.target.value;
    setSelectedSpecies(newSpecies);
    setQuotaEntryHidden(false)
  }

  const handleQuotaChange = (value) => {
    setSelectedQuota(Number(value))
    setIsDisabled(false);
  }

  const handleLicenseChange = (value) => {
    setSelectedLicense(Number(value));
    setIsDisabled(false);
  }

  const extendOnClose = (e) => {
    setSelectedSpecies("");
    setSelectedQuota(0);
    setQuotaEntryHidden(true);
    setIsDisabled(true);
    onClose();
  }

  const format = (val) => {
    var strVal = String(val)
    strVal.replace('/^0*(\S+)/', '')
    var decimalSplit = strVal.split(".")
    var finalNumber =  Number(decimalSplit[0]).toLocaleString() + (decimalSplit.length > 1 ? "." + decimalSplit[1] : "")
    return `$` + finalNumber
  }
  const parse = (val, type="quota") => {
    val.replace(/^\$/, '')
    val.replace('/^0*(\S+)/', '')
    console.log(val)
    if (Number(val) !== NaN && !val.includes("e") && !val.includes("-") &&  !val.includes("+")) {
      if (val === ""){
        return 0
      }
      return Number(val)
    } else {
      return type === "quota" ? quotaDollarAmount : licenseDollarAmount
    }
  }

  return (
    <ChakraProvider theme={theme}>
      {
        link ? 
        <Link isExternal
        onClick={onOpen} 
      >{buttonName} <RepeatIcon mx='2px'/></Link> :
      <Button        
        onClick={onOpen} 
        variant={"solid"}
      >{buttonName}</Button>
      }
       
        <Modal isOpen={isOpen} onClose={extendOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Distribute Quota</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <SimpleGrid columns={[1]} spacing={3}>
                <Box>
                <ApiSelect listType="species" list={speciesList} onSelect={handleSpeciesChange}/>
                </Box>
                <Divider hidden={quotaEntryHidden}/>
                <Box p={2} hidden={selectedSpecies === ""} >
                <RadioGroup onChange={e => setYear(e)} value={year}>
                  <Center>
                    <Stack direction="row">
                      {["2024", "2025", "2026", "2027", "2028"].map(year => (
                        <Radio variant="basic" key={year} value={year}>{year}</Radio>
                      ))}
                    </Stack>
                  </Center>
                </RadioGroup>
                </Box>
                <Divider hidden={quotaEntryHidden}></Divider>
                <SimpleGrid columns={[1]} spacing={2} hidden={quotaEntryHidden}>
                  <Box>
                  <FormLabel>Enter available quota</FormLabel>
                    <QuotaSlider 
                      onSelect={handleQuotaChange}
                      maxValue={100000}
                      step={500}
                    />
                    </Box>
                  <Box hidden={selectedQuota === 0}>
                    <SimpleGrid columns={1}>
                    <FormControl isRequired><FormLabel>Enter cost per unit</FormLabel></FormControl>
                    <NumberInput min={0} value={format(quotaDollarAmount)} onChange={(val) => setQuotaDollarAmount(parse(val))}>
                        <NumberInputField></NumberInputField></NumberInput>
                    </SimpleGrid>
                  </Box>
                </SimpleGrid>
                <Divider/>
                <SimpleGrid columns={[1]} spacing={2} hidden={quotaEntryHidden}>
                  <Box>
                  <FormLabel>Enter available license</FormLabel>
                  <QuotaSlider 
                    onSelect={handleLicenseChange}
                    maxValue={100}
                    step={1}
                  />
                    </Box>
                  <Box hidden={selectedLicense === 0}>
                    <SimpleGrid columns={1}>
                    <FormControl isRequired><FormLabel>Enter cost per unit</FormLabel></FormControl>
                    <NumberInput min={0} value={format(licenseDollarAmount)} onChange={(val) => setLicenseDollarAmount(parse(val, "license"))}>
                        <NumberInputField></NumberInputField></NumberInput>                    </SimpleGrid>
                  </Box>
                </SimpleGrid>
                <Box p={2} hidden={quotaEntryHidden}>
                </Box> 
              </SimpleGrid>
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
                    quotaCost: Number(quotaDollarAmount),
                    licenseCost: Number(licenseDollarAmount),
                    year: year,
                    speciesList: speciesList,
                    loading: true,
                  },
                }}
                key={Date.now()}
              >
                <Button
                  isDisabled={isDisabled || year === undefined || selectedLicense === 0 && selectedQuota === 0 || selectedQuota > 0 && quotaDollarAmount === 0 || selectedLicense > 0 && licenseDollarAmount === 0} 
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
