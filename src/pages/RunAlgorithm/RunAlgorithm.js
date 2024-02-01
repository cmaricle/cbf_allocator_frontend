import React, { useState, useEffect } from "react";
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
  Icon,
  NumberInput,
  NumberInputField,
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

  const runAlgorithm = async (species, quota) => {
    setIsLoading(true);
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
              headers.push("Requested Quota", "Granted Quota", "Submit")
            }
            if (!licenseDictEmpty) {
              headers.push("Requested License", "Granted License", "Submit")
            }
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
    setUpdatedValues(
      {
        ...updatedValues,
        [nationName]: e.target.value
      }
    )
  }

  const submitGrant = (e) => {
    setSubmit(true)
    setLoadingGrant(true)
    var finalizedGrant = 0;
    if (nationSubmitted in updatedValues) {
      finalizedGrant = updatedValues[nationSubmitted]
    } else {
      console.log(rows[nationSubmitted])
      finalizedGrant = rows[nationSubmitted][1]
    }
    api.confirmGrant(
      nationSubmitted, 
      Number(year), 
      species,
      0,
      0,
      rows[nationSubmitted][0],
      finalizedGrant,
    ).then((response) => {
      if (response["statusCode"] === 200) {
        toast({
          title: 'Grant saved!',
          description: response["response"],
          status: 'success',
          isClosable: true,
        });
        var submittedNations = nationsSubmitted
        submittedNations.push(createdNationSubmittedRecord(nationSubmitted))
        setNationsSubmitted(submittedNations)
        localStorage.setItem("nationsSubmitted", submittedNations)
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
    })
  }
  
  const createdNationSubmittedRecord = (nationName) => {
    return JSON.stringify({
      "nationName": nationName,
      "year": year,
      "species": species,
      "quota": quota,
      "license": license,
    })
  }

  const onSubmit = (e) => {
    setSubmit(true);
    setNationSubmitted(e.target.id)
  }

  const nationStatus = (nationName) => {
    return localStorage.getItem("nationsSubmitted")?.includes(createdNationSubmittedRecord(nationName))
  }

  const requestDollarAmount = () => {
    const format = (val) => {
      return `$` + val
    }
    const parse = (val) => {
      val.replace(/^\$/, '')
      if (Number(val) !== NaN && !(val.includes("e"))) {
        return val
      } else {
        return dollarAmount
      }
    }
      
    return (
      <Box>
        <Text>Please enter dollar amount for this quota:</Text>
        <NumberInput value={format(dollarAmount)} onChange={(val) => setDollarAmount(parse(val))}>
          <NumberInputField></NumberInputField>
        </NumberInput>
      </Box>
    )
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
              Object.entries(rows).map(([key, value, index]) => (
                <Tr>
                  <Td>{key}</Td>
                  { 
                    value.map((value, index) => (
                      <Td key={`${key}-${index}`} isNumeric>
                        { 
                          (index !== 1 || nationStatus(key)) ? 
                            (<Text>{value}</Text>) :
                          (index === 1 && !(key in updatedValues)) ? 
                          (<Input name={`${key}-${index}`} type="number" value={value} maxW={24} onChange={onInputChange}></Input>) :
                           (<Input name={`${key}-${index}`} type="number" value={updatedValues[key]} maxW={24} onChange={onInputChange}></Input>)
                        }
                      </Td>
                    ))
                  }
                  <Td isNumeric>
                    { 
                      (nationStatus(key)) ? 
                        <CheckIcon></CheckIcon>
                      :
                        <IconButton onClick={onSubmit} id={key} size="sm" icon={<IoIosSend id={key}/>}
                        ></IconButton>
                    }
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
      header="Are you sure"
      dialog={requestDollarAmount()}
      loading={loadingGrant}
      confirmedButtonDisabled={dollarAmount <= 0}
    />
    </ChakraProvider>
  );
}

export default RunAlgorithm;
