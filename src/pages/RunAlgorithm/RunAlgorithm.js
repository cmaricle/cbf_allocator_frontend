import React, { useState, useEffect, useReducer } from "react";
import { Link, useLocation } from 'react-router-dom';

import {
  Box,
  Alert,
  AlertIcon,
  ChakraProvider,
  Grid,
  GridItem,
  Progress,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Input,
  Text,
  IconButton,
  useToast,
  FormLabel,
  NumberInput,
  NumberInputField,
  FormControl,
} 
from '@chakra-ui/react'
import { IoIosSend } from "react-icons/io";
import { CheckIcon } from "@chakra-ui/icons"

import * as api from '../../modules/api'

import Form from "../../components/Form";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import theme from "../../theme";

function RunAlgorithm() {
  const location = useLocation();
  const {species, quota, license, year, speciesList, loading} = location.state;
  const [algorithmResults, setAlgorithmResults] = useState({});
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [updatedValues, setUpdatedValues] = useState({})
  const [rowHeaders, setRowHeaders] = useState([]);
  const [submit, setSubmit] = useState(false)
  const [nationSubmitted, setNationSubmitted] = useState("")
  const [nationsSubmitted, setNationsSubmitted] = useState([])
  const [loadingGrant, setLoadingGrant] = useState(false)
  const [dollarAmount, setDollarAmount] = useState(0)

  const toast = useToast();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const runAlgorithm = async (species, quota) => {
    setIsLoading(true);
    setUpdatedValues({})
    api.runAlgorithm(
        {
          "species": species, 
          "license": license, 
          "quota": quota, 
          "year": year,
        }
      ).then((response) => {
        if (response["statusCode"] === 200) {
          setError(false);
          const results = response["body"]
          if ("response" in results) {
            setNoResults(true);
            localStorage.removeItem("rows")
            localStorage.removeItem("headers")
            setAlgorithmResults(results)
          } else {
            setNoResults(false);
            const quotaDict = createRows(results)
            const licenseDict = createRows(results, "license")
            const quotaDictEmpty = Object.values(quotaDict).length === 0
            const licenseDictEmpty = Object.values(licenseDict).length === 0
            var headers = ["Nation"]
            if (!quotaDictEmpty) {
              headers.push("Requested Quota", "Granted Quota")
            }
            if (!licenseDictEmpty) {
              headers.push("Requested License", "Granted License")
            }
            headers.push("Submit")
            setRowHeaders(headers);
            var mergedDict = {}
            if (!quotaDictEmpty && !licenseDictEmpty) {
              Object.keys(quotaDict).forEach((key) => {
                mergedDict[key] = [...quotaDict[key], ...licenseDict[key]];
              });            
            } else if(!quotaDictEmpty) {
              mergedDict = quotaDict
            } else {
              mergedDict = licenseDict
            }
            setRows(mergedDict)
          }
          const pastRunVariables = "response" in results ? results : {}
          pastRunVariables["quota"] = quota
          pastRunVariables["species"] = species
          pastRunVariables["license"] = license
          setAlgorithmResults(pastRunVariables)
          localStorage.setItem("rows", JSON.stringify(mergedDict))
          localStorage.setItem("headers", JSON.stringify(headers))
          localStorage.setItem('algorithmResults', JSON.stringify(pastRunVariables))
          setIsLoading(false);
        }
        else {
          setError(true);
          setIsLoading(false);
        }
    }).catch((exception => {
        setError(true);
        setIsLoading(false);
    }))
  }
  
  const createRows = (results, type="quota") => {
    if(`${type}_response` in results) {
      const response = results[`${type}_response`]
      var mergedDict = {}
      mergedDict = { ...response[`granted_${type}`] }
      for (const key in response[`requested_${type}`]) {
        mergedDict[key] = [response[`requested_${type}`][key], mergedDict[key]]
      }
      return mergedDict
    }
    return {}
  }

  useEffect(() => {
    const localAlgorithmResults = JSON.parse(localStorage.getItem("algorithmResults"));
    var rows = localStorage.getItem("rows")
    var headers = localStorage.getItem("headers")
    if (!localAlgorithmResults || !rows || !headers || localAlgorithmResults["quota"] !== quota || localAlgorithmResults["species"] !== species) {
      runAlgorithm(species, quota);
    } else {
      setRows(JSON.parse(rows))
      setRowHeaders(JSON.parse(headers))
      setAlgorithmResults(localAlgorithmResults)
      setIsLoading(false);
    }
    console.log(isLoading)
  }, [quota, species])

  const onInputChange = (e) => {
    const changedRow = e.target.name;
    const nationName = changedRow.split("-")[0]
    var updatedNationValues = localStorage.getItem("updatedValues") ? JSON.parse(localStorage.getItem("updatedValues")) : updatedValues
    var val = e.target.value;
    if (!(nationName in updatedNationValues)) {
      updatedNationValues[nationName] = {}
    }
    if (quota > 0 && license > 0) {
        const changeType = changedRow.split("-")[1]
        if (changeType == 1) {
          updatedNationValues[nationName]["quota"] = Number(val)
        } else {
          updatedNationValues[nationName]["license"] = Number(val)
        }
    } else if (license > 0) {
      updatedNationValues[nationName]["license"] = Number(val)
    } else {
      updatedNationValues[nationName]["quota"] = Number(val)
    }
    setUpdatedValues(updatedNationValues)
    localStorage.setItem("updatedValues", JSON.stringify(updatedNationValues))
    forceUpdate()
  }

  const submitGrant = (e) => {
    setSubmit(true)
    setLoadingGrant(true)
    var finalizedQuota = 0;
    var finalizedLicense = 0;
    finalizedLicense = getValue(nationSubmitted, (quota > 0 && license > 0) ? rows[nationSubmitted][3] : rows[nationSubmitted][1], 3)
    finalizedQuota = getValue(nationSubmitted, rows[nationSubmitted][1], 1)
    api.confirmGrant(
      nationSubmitted, 
      Number(year), 
      species,
      Number(license > 0 && quota > 0 ? rows[nationSubmitted][2] : license > 0 ? rows[nationSubmitted][0] : 0),
      Number(finalizedLicense),
      Number(quota > 0 ? rows[nationSubmitted][0] : 0),
      Number(finalizedQuota),
      Number(dollarAmount),
    ).then((response) => {
      if (response["statusCode"] === 200) {
        toast({
          title: 'Grant saved!',
          description: response["response"],
          status: 'success',
          isClosable: true,
        });
        setNationsSubmitted([
          ...JSON.parse(localStorage.getItem("nationsSubmitted")),
          createdNationSubmittedRecord(nationSubmitted)
        ])
        localStorage.setItem("nationsSubmitted", JSON.stringify([
          ...JSON.parse(localStorage.getItem("nationsSubmitted")),
          createdNationSubmittedRecord(nationSubmitted)
        ]))
      } else {
        toast({
          title: 'Error saving grant',
          description: "Please try again later",
          status: 'error',
          isClosable: true,
        });
      }
      setLoadingGrant(false)
      setSubmit(false)
      setDollarAmount(0)
    })
  }
  
  const createdNationSubmittedRecord = (nationName) => {
    return {
      "nationName": nationName,
      "year": year,
      "species": species,
      "quota": quota,
      "license": license,
    }
  }

  const onSubmit = (e) => {
    setSubmit(true);
    setNationSubmitted(e.target.id)
  }

  const nationStatus = (nationName) => {
    const savedNationsSubmitted = JSON.parse(localStorage.getItem("nationsSubmitted")) || nationSubmitted
    return savedNationsSubmitted.some(obj => 
      obj.nationName === nationName && obj.year === year && obj.species === species && obj.license === license && obj.quota === quota
    )
  }

  const requestDollarAmount = () => {
    const format = (val) => {
      var strVal = String(val)
      strVal.replace('/^0*(\S+)/', '')
      return `$` + Number(strVal)
    }
    const parse = (val) => {
      val.replace(/^\$/, '')
      val.replace('/^0*(\S+)/', '')
      if (Number(val) !== NaN && !(val.includes("e"))) {
        return val
      } else {
        return dollarAmount
      }
    }

    return (
      <Box>
        <FormControl>
        <FormLabel>Please enter dollar amount for this quota:</FormLabel>
        <NumberInput min={0} value={format(dollarAmount)} onChange={(val) => setDollarAmount(parse(val))}>
          <NumberInputField></NumberInputField>
        </NumberInput>
        </FormControl>
      </Box>
    )
  }

  const format = (val) => {
    var strVal = String(val)
    strVal.replace('/^0*(\S+)/', '')
    return strVal
  }

  const getValue = (key, item, index) => {
    const updatedValues = localStorage.getItem("updatedValues") ? JSON.parse(localStorage.getItem("updatedValues")) : {}
    if (license === 0) {
      if (key in updatedValues && "quota" in updatedValues[key]) {
        return updatedValues[key]["quota"]
      } 
      return item
    } else if (quota === 0 || index === 3) {
      if (key in updatedValues && "license" in updatedValues[key]) {
        return updatedValues[key]["license"]
      } 
      return item  
    } else {
      if (key in updatedValues && "quota" in updatedValues[key]) {
        return updatedValues[key]["quota"]
      } else {
        return item 
      }
    } 
  }

  return (
  <ChakraProvider theme={theme}>
    <Grid
      templateAreas={`"header"
                      "main"
                      "footer"`}
      gap='10'
    >
      <GridItem area={"header"}>
        <WebsiteHeader/>
    </GridItem>
    <GridItem area={"main"}>
      {
      isLoading ? ((<Progress size="xs" isIndeterminate variant="basic"></Progress>)) :
        Object.keys(algorithmResults).length > 0  && !noResults ? 
      (<TableContainer>
          <Table>
            <TableCaption>{`Total available ${species} quota: ${quota} license: ${license}`}</TableCaption>
            <Thead>
              <Tr>
                {
                  rowHeaders.map((header, index) => (
                    <Th isNumeric={index !== 0} key={`header-${index}`}>{header}</Th>
                  ))
                }
              </Tr>
            </Thead>
            <Tbody>
            {
              Object.entries(rows).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  {value.map((item, index) => (
                    <Td key={`${key}-${index}`} isNumeric>
                      {(index % 2 !== 1) ? (
                        <Text>{item}</Text>
                      ) : (nationStatus(key)) ? 
                      (<Text>{getValue(key, item, index)}</Text>) :
                       (
                        <Input
                          name={`${key}-${index}`}
                          type="number"
                          min={0}
                          value={format(getValue(key, item, index))}
                          maxW={24}
                          onChange={onInputChange}
                        />
                      
                      )
                      }
                    </Td>
                  ))}
                  <Td isNumeric>
                    {nationStatus(key) ? (
                      <CheckIcon />
                    ) : (
                      <IconButton onClick={onSubmit} id={key} size="sm" icon={<IoIosSend name={key} id={key} />} />
                    )}
                  </Td>
                  <Td></Td>
                </Tr>
              ))
            }

            </Tbody>
          </Table>
        </TableContainer>)
         : noResults ? 
      (<Alert status="warning"><AlertIcon/>{algorithmResults["response"]}</Alert>) 
      : error ? (<Alert status="error"><AlertIcon/>Error processing request - please try again!</Alert>) 
      : <></>
    }
    </GridItem>
    <GridItem area={"footer"}>
      <Form 
        buttonName="Rerun Algorithm" 
        speciesList={speciesList}
      ></Form>
    </GridItem>
    </Grid>
    <AlertPopUp 
      isOpen={submit} 
      onCancel={(e) => {setSubmit(false); setDollarAmount(0)}} 
      onConfirm={submitGrant}
      header="Are you sure?"
      dialog={requestDollarAmount()}
      loading={loadingGrant}
      confirmedButtonDisabled={dollarAmount <= 0}
    />
    </ChakraProvider>
  );
}

export default RunAlgorithm;
