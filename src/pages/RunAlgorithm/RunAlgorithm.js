import React, { useState, useEffect, useReducer } from "react";
import { Link as ReactRouterLink, useLocation, useHistory } from 'react-router-dom';

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
  Text,
  IconButton,
  useToast,
  Link as ChakraLink,
  Divider,
  Heading,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
  Tooltip,
  Center,
} 
from '@chakra-ui/react'
import { IoIosSend } from "react-icons/io";
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons"

import * as api from '../../modules/api'

import Form from "../../components/Form";
import WebsiteHeader from "../../components/WebsiteHeader/WebsiteHeader";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import  RunAlgorithmChart  from "../../components/BarChart/BarChart";
import theme from "../../theme";

function RunAlgorithm() {
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    history.push("/")
  }
  const {species, quota, license, quotaCost, licenseCost, year, speciesList, loading} = location.state;
  const [algorithmResults, setAlgorithmResults] = useState({});
  const [response, setResponse] = useState({});
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
  const [checkingFunds, setCheckingFunds] = useState(false)
  const [insufficientFunds, setInsufficientFunds] = useState(false)
  const [quotaRequestsAllZero, setQuotaRequestsAllZero] = useState(false)
  const [licenseRequestAllZero, setLicenseRequestAllZero] = useState(false)
  const toast = useToast();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const runAlgorithm = async (species, quota) => {
    setIsLoading(true);
    setUpdatedValues({})
    localStorage.removeItem("results")
    api.runAlgorithm(
        {
          "species": species, 
          "license": license, 
          "quota": quota, 
          "quota_cost": quotaCost, 
          "license_cost": licenseCost,
          "year": year,
        }
      ).then((response) => {
        if (response["statusCode"] === 200) {
          setLicenseRequestAllZero(false)
          setQuotaRequestsAllZero(false)
          setError(false);
          const results = response["body"]
          if ("response" in results && results["response"].includes("No nations requested")) {
            setNoResults(true);
            localStorage.removeItem("rows")
            localStorage.removeItem("headers")
            setAlgorithmResults(results)
          } else {
            setNoResults(false);
            setResponse(results);
            console.log(results)
            localStorage.setItem("results", JSON.stringify(results))
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
                if (key in quotaDict && key in licenseDict) {
                  mergedDict[key] = [...quotaDict[key], ...licenseDict[key]];
                } else if (key in quotaDict) {
                  mergedDict[key] = [...quotaDict[key], 0, 0]
                } else {
                  mergedDict[key] = [0, 0, ...licenseDict[key]]
                }
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
        console.log(exception)
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
      if (Object.values(mergedDict).flat().every(element => element === 0)){
        if(type === "quota") {
          setQuotaRequestsAllZero(true)
        } else {
          setLicenseRequestAllZero(true)
        }
      }
      return mergedDict
    }
    return {}
  }

  useEffect(() => {
    const unlisten = history.listen(() => {
      localStorage.removeItem("algorithmResults")
      localStorage.removeItem("nationsSubmitted")
  })
  }, [])

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  
  const alertUser = (e) => {
    if (Object.keys(updatedValues).length !== 0 || Object.keys(nationsSubmitted).length !== 0) {
      e.preventDefault();
    }
  }

  useEffect(() => {
    const localAlgorithmResults = JSON.parse(localStorage.getItem("algorithmResults"));
    var rows = localStorage.getItem("rows")
    var headers = localStorage.getItem("headers")
    if (!localAlgorithmResults || !rows || !headers || localAlgorithmResults["quota"] !== quota || localAlgorithmResults["species"] !== species) {
      runAlgorithm(species, quota).then(response => {

      });
    } else {
      if (rows !== undefined) {
        setRows(JSON.parse(rows))
      }
      setRowHeaders(JSON.parse(headers))
      setAlgorithmResults(localAlgorithmResults)
      setIsLoading(false);
    }
  }, [quota, species, license])

  const getTotalGrantColumn = (nation, updatedValues, requestedAmount, index) => {
    let results = getResults()
    if (Object.keys(results).length > 0) {
      let type = "quota"
      if (license > 0 && quota === 0 || index === 3) {
        type = "license"
      }
      if (type in results) {
        let originalGrants = results[`${type}_response`][`granted_${type}`]
        let grantTotal = 0
        for (const key in originalGrants) {
          if (key !== nation) {
            if (key in updatedValues && type in updatedValues[key]) {
              grantTotal = grantTotal + updatedValues[key][`${type}`]
            } else {
              grantTotal = grantTotal + originalGrants[key]
            }
          }
        }
        console.log(grantTotal)
        return Math.min(algorithmResults[`${type}`] - grantTotal, requestedAmount)
      }
    }
    return requestedAmount
  }

  const onInputChange = (e, name=null) => {
    const changedRow = !name ? e.target.name : name;
    const nationName = changedRow.split("-")[0]
    var updatedNationValues = updatedValues
    var val = !name ? e.target.value : e;
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
   
    forceUpdate()
  }

  const submitGrant = (e) => {
    setSubmit(true)
    setLoadingGrant(true)
    var finalizedQuota = 0;
    var finalizedLicense = 0;
    finalizedLicense = license === 0 ? 0 : getValue(nationSubmitted, (quota > 0 && license > 0) ? rows[nationSubmitted][3] : (license > 0) ? rows[nationSubmitted][1] : 0, 3)
    finalizedQuota = quota === 0 ? 0 : getValue(nationSubmitted, rows[nationSubmitted][1], 1)
    api.confirmGrant(
      nationSubmitted, 
      Number(year), 
      species,
      Number(license > 0 && quota > 0 ? rows[nationSubmitted][3] : license > 0 ? rows[nationSubmitted][0] : 0),
      Number(finalizedLicense),
      Number(quota > 0 ? rows[nationSubmitted][0] : 0),
      Number(finalizedQuota),
      Number(quotaCost),
      Number(licenseCost)
    ).then((response) => {
      if (response["statusCode"] === 200) {
        toast({
          title: 'Grant saved!',
          description: response["response"],
          status: 'success',
          isClosable: true,
        });
        const nationRecord = createdNationSubmittedRecord(nationSubmitted)
        if (localStorage.getItem("nationsSubmitted") || nationsSubmitted) {
          setNationsSubmitted([
            ...nationsSubmitted || localStorage.getItem("nationsSubmitted"),
            nationRecord
          ])
          localStorage.setItem("nationsSubmitted", JSON.stringify([
            ...nationsSubmitted || localStorage.getItem("nationsSubmitted"),
            nationRecord
          ]))
        } else {
          setNationsSubmitted([nationRecord])
          localStorage.setItem("nationSubmitted", JSON.stringify([nationRecord]))
        }
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
    setCheckingFunds(true);
    const nationSubmitted = e.target.id
    setNationSubmitted(nationSubmitted)
    
    const finalizedLicense = license !== 0 && Object.keys(rows).length > 0 && nationSubmitted ? getValue(nationSubmitted, (quota > 0 && license > 0) ? rows[nationSubmitted][3] : (license > 0) ? rows[nationSubmitted][1] : 0, 3) : 0
    const finalizedQuota = quota !== 0 && Object.keys(rows).length > 0 && nationSubmitted ? getValue(nationSubmitted, rows[nationSubmitted][1], 1) : 0
    const totalCost = finalizedQuota * quotaCost + finalizedLicense * licenseCost
    setInsufficientFunds(false)
    api.getFunds(nationSubmitted).then(response => {
      if (response["statusCode"] === 200) {
        if (Number(response["body"]["response"]) < totalCost) {
          setInsufficientFunds(true)
        }
      }
      setCheckingFunds(false)
    })
  }

  const nationStatus = (nationName) => {
    const savedNationsSubmitted = JSON.parse(localStorage.getItem("nationsSubmitted")) || nationsSubmitted
    if (savedNationsSubmitted) {
      return savedNationsSubmitted.some(obj => 
        obj.nationName === nationName && obj.year === year && obj.species === species && obj.license === license && obj.quota === quota
      )
    }
  }

  const getConfirmForType = (type, finalizedAmount, cost) => {
    return (<Box p={2}>
      <SimpleGrid columns={3}>
      <Heading as="h5" size="s">{`${type} Amount`}</Heading>
      <Divider orientation='vertical' />
      <Text>{finalizedAmount.toLocaleString()}</Text>
      </SimpleGrid>
      <SimpleGrid columns={3}>
      <Heading as="h5" size="s">Cost</Heading>
      <Divider orientation='vertical' />
      <Text>${(finalizedAmount * cost).toLocaleString()}</Text>
      </SimpleGrid>
    </Box>)
  }

  function Confirm () {
      const finalizedLicense = license !== 0 && Object.keys(rows).length > 0 && nationSubmitted ? getValue(nationSubmitted, (quota > 0 && license > 0) ? rows[nationSubmitted][3] : (license > 0) ? rows[nationSubmitted][1] : 0, 3) : 0
      const finalizedQuota = quota !== 0 && Object.keys(rows).length > 0 && nationSubmitted ? getValue(nationSubmitted, rows[nationSubmitted][1], 1) : 0
      const totalCost = finalizedQuota * quotaCost + finalizedLicense * licenseCost

      return (
        !insufficientFunds && !checkingFunds ? 
        <Box>
          {
            finalizedQuota !== 0 ? 
            getConfirmForType("Quota", finalizedQuota, quotaCost)
            : <></> }
          <Divider hidden={!finalizedLicense || !finalizedQuota}/>
          {
            finalizedLicense !== 0 ?
            getConfirmForType("License", finalizedLicense, licenseCost) : <></>
          }
          {
            finalizedLicense && finalizedQuota ? 
            <Box p={2}>
            <Divider/>
            <SimpleGrid columns={3}>
              <Heading as="h5" size="s">Total Amount</Heading>
              <Divider orientation='vertical' />
              <Text>${(totalCost).toLocaleString()}</Text>
            </SimpleGrid>
            </Box> : <></>
          }
        </Box> :
        checkingFunds ? 
        <Progress isIndeterminate size="xs" variant="basic"></Progress> :
        <Alert status="error"><AlertIcon/>Insufficient Funds!</Alert>
      )
  }

  const format = (val) => {
    var strVal = String(val)
    strVal.replace('/^0*(\S+)/', '')
    return strVal
  }

  const getValue = (key, item, index) => {
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

  const getAspectRatio = () => {
    if (quota > 0 && !quotaRequestsAllZero && license > 0 && !licenseRequestAllZero) { 
      return 3
    } else {
      return 6
    }
  }

  const submitButtonDisabled = (key, row) => {
    var result = []
    row.forEach(function(item, index) {
      if (index % 2 !== 0) {
        const value = getValue(key, item, index)
        if (value > row[index - 1]) {
          result.push(true)
        } else if (value === 0) {
          result.push(0)
        }
         else {
          result.push(false)
        }
      } 
    })
    return result.includes(true) || (result.length === 2 ? (result[0] === 0 && result[1] === 0) : result[0] === 0)
  }

  const transformObject = (inputObject, type) => {
    if (Object.keys(inputObject).length === 0) {
      inputObject = getResults()
    }
    const transformedObject = [];
    let granted_key = `granted_${type}`
    let requested_key = `requested_${type}`

    Object.keys(inputObject[`${type}_response`][granted_key]).forEach(key => {
        let data = {
          name: key,
        }
        if (inputObject[`${type}_response`][requested_key][key] !== 0) {
          if (!(key in updatedValues) || !JSON.stringify(updatedValues).includes(type)) {
            data[granted_key] = inputObject[`${type}_response`][granted_key][key]
            data[requested_key] = inputObject[`${type}_response`][requested_key][key]
          } else {
            data[granted_key] = updatedValues[key][type]
            data[requested_key] = inputObject[`${type}_response`][requested_key][key]
          }
          transformedObject.push(data)
        }
    });
    return transformedObject;
  }

  const getType = (index) => {
    if (quota > 0 && index === 1) {
      return "quota"
    } else {
      return "license"
    }
  }

  const getResults = () => {
    return JSON.parse(localStorage.getItem("results"))
  }

  return (
  <ChakraProvider theme={theme}>
    <Box>
    <Grid
      templateAreas={`"header"
                      "main"
                      "footer"`}
      gap='10'
      minHeight="100vh"
      maxH="100vh"
      width="100vw"
    >
      <GridItem area={"header"}>
        <WebsiteHeader/>
        <Divider/>
      </GridItem>
    <GridItem area={"main"}>
      {
      isLoading ? ((<Progress size="xs" isIndeterminate variant="basic"></Progress>)) :
        Object.keys(algorithmResults).length > 0  && !noResults ? 
      (
      <Grid templateRows={"repeat(2, 1fr)"} gap={5} alignItems={"center"}>
          <GridItem rowSpan={1}>
          <SimpleGrid columns={(Object.keys(getResults()).length === 2 && quota > 0 && !quotaRequestsAllZero && license > 0 && !licenseRequestAllZero) ? 2 : 1}>
            {
            Object.keys(response).length > 0 || Object.keys(getResults()).length > 0 ? 
              <>
              {
                quota > 0  && Object.keys(getResults()).includes("quota_response")
                && !quotaRequestsAllZero ?
                <RunAlgorithmChart header={"Quota Distribution"} barOneDataKey="requested_quota" barTwoDataKey="granted_quota" aspectRatio={getAspectRatio()} data={transformObject(response, "quota")}/>
                  : <></> 
              }
              {
                license > 0 
                && Object.keys(getResults()).includes("license_response")
                && !licenseRequestAllZero 
                ?
                <RunAlgorithmChart header={"License Distribution"} barOneDataKey="requested_license" barTwoDataKey="granted_license" aspectRatio={getAspectRatio()} data={transformObject(response, "license")}></RunAlgorithmChart>
                 : <></>
              }
              </>
            : <></>
          }
          </SimpleGrid>
        </GridItem>
        <GridItem rowSpan={1}>
      <TableContainer>
          <Table>
            <TableCaption>
              <Grid templateColumns={"repeat(6, 1fr)"}>
                <GridItem/>
              <GridItem colSpan={2}>
                  <Text>{`Total available ${species} quota: ${quota} license: ${license}`}</Text>
                </GridItem>
                <GridItem><Center><Divider orientation="vertical"/></Center></GridItem>
                <GridItem> <Form 
                buttonName="Rerun Algorithm" 
                link={true}
                speciesList={speciesList}
              ></Form></GridItem>
              <GridItem/>
              </Grid>
            
           </TableCaption>
            <Thead>
              <Tr>
                {
                  rowHeaders.map((header, index) => (
                    header === "Requested Quota" ? <Tooltip placement="top" label="Remaining unfufilled quota for year">
                      <Th isNumeric key={`header-${index}`}>{header}</Th>
                    </Tooltip> : <Th isNumeric={index !== 0} key={`header-${index}`}>{header}</Th>
                  ))
                }
              </Tr>
            </Thead>
            <Tbody>
            {
              Object.entries(rows).map(([key, value]) => (
                !value.every(element => element === 0) ? 
                <Tr key={key}>
                  <Td><ChakraLink 
                    to={`/profile/${key}`} 
                    as={ReactRouterLink} 
                    target="_blank" 
                    rel="noopener noreferrer">{key} <ExternalLinkIcon></ExternalLinkIcon>
                    </ChakraLink></Td>
                  {value.map((item, index) => (
                    <Td key={`${key}-${index}`} isNumeric={true}>
                      {(index % 2 !== 1) ? (
                        <Text>{item}</Text>
                      ) : (nationStatus(key)) ? 
                      (<Text>{getValue(key, item, index)}</Text>) :
                       (
                        <NumberInput
                          name={`${key}-${index}`}
                          min={0}
                          step={getType(index) === "quota" ? 500 : 1}
                          max={getTotalGrantColumn(key, updatedValues, Number(rows[key][index - 1]), index)}
                          keepWithinRange={true}
                          clampValueOnBlur={true}
                          value={Number(format(getValue(key, item, index)))}
                          onInput={onInputChange}
                          onChange={(e) => onInputChange(e, `${key}-${index}`)}
                        ><NumberInputField/>
                            <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                      </NumberInput>
                    // </FormControl>
                      )
                      }
                      
                    </Td>
                  ))}
                  <Td isNumeric>
                    {nationStatus(key) ? (
                      <CheckIcon />
                    ) : (
                      <Tooltip 
                        hidden={!submitButtonDisabled(key, value)} 
                        label={"Grant must be greater than 0 and less than or equal to requested value"}
                      >
                      <IconButton 
                        onClick={onSubmit} 
                        id={key} 
                        size="sm" 
                        icon={<IoIosSend name={key} id={key} />} 
                        isDisabled={submitButtonDisabled(key, value)}
                      />
                      </Tooltip>
                    )}
                  </Td>
                  <Td></Td>
                </Tr> : <></>
              ))
            }
            </Tbody>
          </Table>
        </TableContainer>
        </GridItem>
        </Grid>
      )
         : noResults ? 
      (<Alert status="warning"><AlertIcon/>{algorithmResults["response"]}</Alert>) 
      : error ? (<Alert status="error"><AlertIcon/>Error processing request - please try again!</Alert>) 
      : <></>
    }
    </GridItem>
    <GridItem p={3} area="footer" hidden={!noResults}>
            <Form 
              buttonName={"Rerun Algorithm"}
              speciesList={speciesList}
            > 
            </Form>
        </GridItem>
    </Grid>
    
    </Box>
    <AlertPopUp 
      isOpen={submit && nationSubmitted !== ""} 
      onCancel={(e) => {setSubmit(false);}} 
      onConfirm={submitGrant}
      confirmedButtonDisabled={checkingFunds || insufficientFunds}
      header={!checkingFunds ? "Confirm Grant Approval" : "Confirming sufficient funds..."}
      dialog={<Confirm/>}
      loading={loadingGrant}
    />
    </ChakraProvider>
  );
}

export default RunAlgorithm;
