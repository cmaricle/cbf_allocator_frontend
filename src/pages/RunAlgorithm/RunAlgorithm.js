import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';

import {
  Alert,
  AlertIcon,
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
  Tfoot
} 
from '@chakra-ui/react'

import * as api from '../../modules/api'

import Form from "../../components/Form";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";
import theme from "../../theme";

function RunAlgorithm() {
  const location = useLocation();
  const {species, quota, license, year, speciesList, loading} = location.state;
  const [algorithmResults, setAlgorithmResults] = useState({});
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [rowHeaders, setRowHeaders] = useState([]);

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
              headers.push("Requested Quota", "Granted Quota")
            }
            if (!licenseDictEmpty) {
              headers.push("Requested License", "Granted License")
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
  
  return (
  <ChakraProvider theme={theme}>
      <CSSReset />
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
                      <Td key={index} isNumeric>{value}</Td>
                    ))
                  }
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
    </ChakraProvider>
  );
}

export default RunAlgorithm;
