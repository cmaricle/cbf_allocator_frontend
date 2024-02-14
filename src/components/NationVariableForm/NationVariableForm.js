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
import AlertPopUp from "../AlertPopUp/AlertPopUp";
import theme from "../../theme";

const NATION_VARIABLE_UPDATE_TYPE = "Submit nation's variables"
const NATION_REQUEST_UPDATE_TYPE = "Submit nation's yearly request"

function Form({ speciesList, nationsList }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nationVariablesHidden, setNationVariablesHidden] = useState(true)  
  const [fundsInputVariable, setFundsInputVariable] = useState(0);
  const [fundsUpdated, setFundsUpdated] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [speciesInputVariable, setSpeciesInputVariable, speciesInputVariableRef] = useState([]);
  const [speciesToShowInSelect, setSpeciesToShowInSelect] = useState([])
  const [loading, setLoading] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [userUpdated, setUserUpdated] = useState(false)
  const [updateType, setUpdateType] = useState("")  
  const [selectedNation, setSelectedNation] = useState('');
  const [quotaValue, setQuotaValue] = useState(0);
  const [licenseValue, setLicenseValue] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [selectedYear, setSelectedYear] = useState(0)
  const [loadingNation, setLoadingNation] = useState(false);

  function isInvalid (value, maxValue=100) {
    if (String(value).slice(-1) === ".") {
      return true
    }
    if(value > maxValue || value < 0 ) {
      console.log("here")
      return true;
    }
    return false;
  }
  
  function anyInvalidValue () {
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
    setLoadingNation(true);
    api.getNationVariables(nationSelected).then(response => {
      setLoadingNation(false);
      if (response["statusCode"] === 200) {
        const variables = response["body"]
        setFundsInputVariable(Number(variables["funds"]))
        if(variables["funds"] !== 0) {
          setConfirmed(true);
        } else {
          setConfirmed(false)
        }
        if (variables["availability"].constructor !== Array){
          variables["availability"] = []
        }
        setSpeciesInputVariable(variables["availability"])
        const speciesToShowInSelect = []
        variables["availability"].forEach(item => {
          speciesToShowInSelect.push(
            {
              "value": item,
              "label": item
            }
          )
        })
        setSpeciesToShowInSelect(speciesToShowInSelect)
      }
      else {
        toast({
          description: "Error loading data",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
      setFundsUpdated(false);
    })
    setDisableSubmitButton(true)
  }

  function handleInputChange(event) {
    var strVal = String(event)
    strVal.replace('/^0*(\S+)/', '')
    if (strVal === String(fundsInputVariable) || strVal.slice(-2) === "..") {
      var value = strVal.substring(0, strVal.length - 1)
    } else {
      value = strVal  
    }
    setUserUpdated(true);
    setFundsUpdated(true);
    setFundsInputVariable(value.slice(-1) !== "." ? Number(value) : value);
  }

  function handleSpeciesInputVariable(event) {
    setUserUpdated(true);
    const species = event
    const speciesList = []
    event.forEach(item => [
        speciesList.push(item["value"])
    ])
    setSpeciesToShowInSelect(event)
    setSpeciesInputVariable(speciesList);
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

  function parseResponse(result) {
    var description = "Error submitting data"
    var statusType = "error"
    if (result["statusCode"] == 200) {
      description = result["body"]["response"]
      statusType = "success"
    }
    setLoading(false);
    toast({
      description: description,
      status: statusType,
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if(loading) {
      if (updateType === NATION_VARIABLE_UPDATE_TYPE) {
        if (confirmed) {
          api.updateNationVariables(selectedNation, {
          "_nation_name": selectedNation, 
          "funds": Number(fundsInputVariable),
          "availability": speciesInputVariable
        }).then((result) => {
          setFundsUpdated(false)
          setConfirmed(false)
          setLoading(false)
          parseResponse(result)
        }).catch((exception) => {
          setFundsUpdated(false)
          setLoading(false);
          setConfirmed(false)
          toast({
            description: "Error submitting data",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
        }
      } else if (updateType === NATION_REQUEST_UPDATE_TYPE){
        api.updateNationRequest(
          selectedNation,
          selectedSpecies,
          selectedYear, 
          quotaValue,
          licenseValue,
        ).then((result) => {
          parseResponse(result)
        }).catch((exception) => {
          setLoading(false);
          toast({
            description: "Error submitting data",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        })
      }

    }
  }, [loading, confirmed])

  function handleOnRun(event) {
    setLoading(true);
  }

  function handleSpeciesRequestQuota(event) {
    // console.log(event)
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
                  isInvalid={isInvalid}
                  fundsInputVariable={fundsInputVariable}
                  speciesInputVariable={speciesInputVariable}
                  handleNationChange={handleNationChange}
                  nationVariablesHidden={nationVariablesHidden}
                  handleSpeciesInputVariable={handleSpeciesInputVariable}
                  handleInputChange={handleInputChange}
                  nationsList={nationsList}
                  speciesList={speciesList}
                  nation={selectedNation}
                  speciesToShowInSelect={speciesToShowInSelect}
                  loadingNation={loadingNation}
                  fundsUpdated={fundsUpdated}
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
        <AlertPopUp
          isOpen={loading && fundsUpdated}
          header="Are you sure"
          dialog="Once a value for funds is submitted, it cannot be updated."
          onCancel={(e) => {setLoading(false)}} 
          onConfirm={(e) => {setConfirmed(true)}}
          loading={loading && confirmed}
        />
        </ChakraProvider>
  )
}

export default Form;
