import React, {useState, useEffect} from "react";

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
  Select,
  StackDivider,
  VStack,
  Divider,
  ChakraProvider,
} from '@chakra-ui/react'

import * as api from '../../modules/api'

import ApiSelect from "../Select/Select";
import NationFormBody from "../NationFormBody/NationFormBody";
import NationFormRequestBody from "../NationFormRequestBody/NationFormRequestBody";
import theme from "../../theme";

const NATION_VARIABLE_UPDATE_TYPE = "Submit nation's variables"
const NATION_REQUEST_UPDATE_TYPE = "Submit nation's yearly request"

function Form({ speciesList, nationsList }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nationVariablesHidden, setNationVariablesHidden] = useState(true)  
  const [fundsInputVariable, setFundsInputVariable] = useState(0);
  const [speciesInputVariable, setSpeciesInputVariable, speciesInputVariableRef] = useState({});
  const [loading, setLoading] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [userUpdated, setUserUpdated] = useState(false)
  const [updateType, setUpdateType] = useState("")  
  const [selectedNation, setSelectedNation] = useState('');
  const [quotaValue, setQuotaValue] = useState(0);
  const [licenseValue, setLicenseValue] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [selectedYear, setSelectedYear] = useState(0)

  function isInvalid (value, maxValue=100) {
    if(value > maxValue || value < 0 || typeof(value) == "string") {
      return true;
    }
    return false;
  }
  
  function anyInvalidValue () {
    for (const key in speciesInputVariable) {
      var value = speciesInputVariable[key]
      if (isInvalid(value)) {
        return true
      }
    }
    if (isInvalid(fundsInputVariable)) {
      return true
    }
    return false
  }

  function extendOnClose () {
    setNationVariablesHidden(true);
    setUpdateType("");
    setQuotaValue(0);
    setLicenseValue(0);
    onClose();
  }

  const handleNationChange = (event) => {
    const nationSelected = event.target.value;
    setSelectedNation(nationSelected);
    setUserUpdated(false);
    setNationVariablesHidden(false);
    api.getNationVariables(nationSelected).then(variables => {
      setFundsInputVariable(variables["funds"])
      setSpeciesInputVariable(variables["availability"])
    })
    setDisableSubmitButton(true)
  }

  function handleInputChange(event) {
    setUserUpdated(true);
    if (event.slice(-1) !== ".") {
      event = Number(event)
    }
    setFundsInputVariable(event);
  }

  function handleSpeciesInputVariable(event) {
    setUserUpdated(true);
    var newValue = event.target.value;
    if (newValue.slice(-1) !== ".") {
      newValue = Number(newValue)
    }
    var species = event.target.id;
    setSpeciesInputVariable(speciesInputVariable => ({
      ...speciesInputVariable,
      [species]: newValue
    }));
  }

  useEffect(() => {
    var invalidValue = false;
    if (updateType === NATION_VARIABLE_UPDATE_TYPE) {
      invalidValue = anyInvalidValue()
    } else if (updateType === NATION_REQUEST_UPDATE_TYPE) {
      invalidValue = isInvalid(quotaValue, 100000)
    }
    setDisableSubmitButton(invalidValue || !userUpdated);
  }, [speciesInputVariable, fundsInputVariable, quotaValue, userUpdated])

  useEffect(() => {
    if(loading) {
      if (updateType === NATION_VARIABLE_UPDATE_TYPE) {
        api.updateNationVariables({
          "nation_name": selectedNation, 
          "funds": fundsInputVariable, 
          "availability": speciesInputVariable
        }).then((result) => {
          setLoading(false);
          toast({
            description: result["response"],
            status: "success",
            duration: 5000,
            isClosable: true,
          })
          // extendOnClose();
        })
      } else if (updateType === NATION_REQUEST_UPDATE_TYPE){
        api.updateNationRequest(
          selectedNation,
          selectedSpecies,
          selectedYear, 
          quotaValue,
          licenseValue,
        ).then((result) => {
          setLoading(false);
          toast({
            description: result["response"],
            status: "success",
            duration: 5000,
            isClosable: true,
          })
          // extendOnClose();
        })
      }

    }
  }, [loading])

  function handleOnRun(event) {
    setLoading(true);
  }

  function handleSpeciesRequestQuota(event) {
    console.log(event)
  }

  return (
        <ChakraProvider theme={theme}>
        <Button 
          onClick={onOpen}
          variant={"solid"}
        > Enter Nation Variables</Button>

        <Modal isOpen={isOpen} onClose={extendOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Nations Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <VStack 
              spacing={2}
              align='stretch'
            >
              <Select variant={"basic"} placeholder="Select update type" onChange={(e) => setUpdateType(e.target.value)}>
                <option key="nation-request">{NATION_REQUEST_UPDATE_TYPE}</option>
                <option key="nation-variables">{NATION_VARIABLE_UPDATE_TYPE}</option>
              </Select>
              <Divider/>
              <NationFormBody
                  hidden={updateType !== NATION_VARIABLE_UPDATE_TYPE}
                  fundsInputVariable={fundsInputVariable}
                  isInvalid={isInvalid}
                  speciesInputVariable={speciesInputVariable}
                  handleNationChange={handleNationChange}
                  nationVariablesHidden={nationVariablesHidden}
                  handleSpeciesInputVariable={handleSpeciesInputVariable}
                  handleInputChange={handleInputChange}
                  nationsList={nationsList}
              ></NationFormBody>
              <NationFormRequestBody
                hidden={updateType !== NATION_REQUEST_UPDATE_TYPE}
                handleSpeciesRequestQuota={handleSpeciesRequestQuota}
                setUserUpdated={setUserUpdated}
                setQuotaValue={setQuotaValue}
                setLicenseValue={setLicenseValue}
                licenseValue={licenseValue}
                quotaValue={quotaValue}
                isInvalid={isInvalid}
                setSelectedNation={setSelectedNation}
                setSelectedSpecies={setSelectedSpecies}
                setSelectedYear={setSelectedYear}
                nationsList={nationsList}
                speciesList={speciesList}
              />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={extendOnClose} variant={"cancel"}>
                Cancel
              </Button>
              <Button 
              isLoading={loading} 
              onClick={handleOnRun} 
              isDisabled={disableSubmitButton}
              variant={"ghost"}
              >Submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </ChakraProvider>
  )
}

export default Form;
