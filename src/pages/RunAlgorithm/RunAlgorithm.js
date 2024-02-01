import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  ButtonGroup,
  ChakraProvider,
  CSSReset,
  Grid,
  GridItem,
  Progress,
  Flex,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Tfoot,
  Input,
  Text,
  IconButton,
  useToast,
} 
from '@chakra-ui/react'

import { CheckIcon } from "@chakra-ui/icons"

import * as api from '../../modules/api'

import Form from "../../components/Form";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import theme from "../../theme";
import { Button } from "react-scroll";

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
  const [loadingGrant, setLoadingGrant] = useState(false)

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
              headers.push("Requested Quota", "Granted Quota", "Accept")
            }
            if (!licenseDictEmpty) {
              headers.push("Requested License", "Granted License", "Accept")
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
  
  const onSubmit = (e) => {
    setSubmit(true);
    setNationSubmitted(e.target.id)
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
                        { index === 1 && !(key in updatedValues) ? 
                          (<Input name={`${key}-${index}`} type="number" value={value} maxW={24} onChange={onInputChange}></Input>) :
                            (index === 1 && key in updatedValues) ? (<Input name={`${key}-${index}`} type="number" value={updatedValues[key]} maxW={24} onChange={onInputChange}></Input>) :
                            (<Text>{value}</Text>)
                        }
                      </Td>
                    ))
                  }
                  <Td isNumeric><IconButton onClick={onSubmit} id={key} size="sm" icon={<CheckIcon id={key}/>}></IconButton></Td>
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
      onCancel={(e) => {setSubmit(false)}} 
      onConfirm={submitGrant}
      header="Are you sure"
      dialog="..."
      loading={loadingGrant}
    />
    </ChakraProvider>
  );
}

export default RunAlgorithm;
