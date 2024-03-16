import React, { useEffect, useState } from 'react';
import {
  Box,
  Collapse,
  ChakraProvider,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  TableContainer,
  Table,
  Th,
  Tr,
  Td,
  TableCaption,
  Tooltip,
  Thead,
  Tbody,
  Card,
  Divider,
  UnorderedList,
  ListItem,
  ListIcon,
  Link,
  List,
  Image,
  Alert,
  AlertIcon,
  Spacer,
} from '@chakra-ui/react';
import { TbSum } from "react-icons/tb";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";


import theme from "../../theme";
import { useAuth } from "../../AuthContext"
import WebsiteHeader from '../../components/WebsiteHeader/WebsiteHeader';
import RunAlgorithmChart from '../../components/BarChart/BarChart';
import * as api from '../../modules/api'


const TableOfContents = ({ items }) => {
  const { logout } = useAuth()
  const [activeItemIndex, setActiveItemIndex] = React.useState(true);

  const handleClick = (index) => {
    setActiveItemIndex(activeItemIndex === index ? null : index);
  };

  useEffect (() => {
    api.getHealthWithAuth().then(response => { 
      if (response.statusCode !== 200) {
        logout()
      }
    })
  }, {})

  return (
    <Box as="nav">
      <List>
        {items.map((item, index) => (
          <ListItem key={item.title}>
            <ListIcon
              as={index === activeItemIndex ? FiChevronDown : FiChevronRight}
              onClick={() => handleClick(index)}
            />
            <Link href={`#${item.title}`}>{item.title}</Link>
            {item.subItems && (
              <Collapse in={activeItemIndex || index === activeItemIndex} animateOpacity>
                <List pl={4}>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.title}>
                      <ListIcon as={FiChevronRight} />
                      <Link href={`#${subItem.href}`}>{subItem.title}</Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};



const About = () => {
  const [isPrechecksVisisble, setIsPreChecksVisible] = useState(false);
  const tocItems = [
    { title: "Goal"}, 
    {title: "Considerations"}, 
    {
      title: "Example",
      subItems: [
        {title: "Nation Data", href: "nation-data"},
        {title: "Prechecks", href: "prechecks"},
        {title: "Probability Score Calculation", href: "prob-score-calculation"},
        {title: "Priority Value Calculation", href: "priority-val-calculation"},
        {title: "Distribute Quota", href: "distribute-quota"},
        {title: "Update Dynamic Variables", href: "update-dynamic-variables"}
      ]
    
    }, 
    {title: "Decision Tree" },
  
  ];

  const fundsData = {
    "nationA": 15000,
    "nationB": 10000,
    "nationC": 5000,
    "nationD": 5000,
  }

  function isElementInViewport() {
    const el = document.getElementById("prechecks")
    if (el) {
      var rect = el.getBoundingClientRect();
      const isVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );
      return setIsPreChecksVisible(isVisible)
    }
    return setIsPreChecksVisible(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", isElementInViewport)
    return () => {
      window.removeEventListener("scroll", isElementInViewport)
    }
  }, [])


  return (
    <ChakraProvider theme={theme}>
      <Grid  
      gap={3} 
      alignItems={"end"} p={3}>
      <GridItem>
          <WebsiteHeader homePage={false}></WebsiteHeader>
        </GridItem>
        <GridItem rowSpan={4}><Box flex="1"></Box></GridItem>
        <GridItem>
          <Box p={3}>
            <Heading size="md">Contents</Heading>
            <Divider/>
            <TableOfContents items={tocItems}></TableOfContents>
          </Box>
        </GridItem>
        <GridItem rowSpan={1} p={3}>
          <Box>
            <Heading size="md" id="goal">Goal</Heading>
            <Divider/>
            <Text>We aim to solve the complicated distribution problem of sharing limited resources.
            Our goal is to distribute quota and license purchases using a methodology in a manner that is both transparent and fair.
            Read on for an overview of our process.</Text>
          </Box>
        </GridItem>
        <GridItem rowSpan={1} p={3}>
          <Box>
          <Heading size="md" id="considerations">Considerations</Heading>
            <Divider/>
            <Text>Because quota and licenses can be purchased at any time, we must have an on-demand method to distribute resources.
            To do this, we've developed a formula (explained further below) that uses multiple
            considerations when making decisions. The two main considerations used are nations' <b>yearly requests</b>, and <b>variables</b>.
            </Text>
            <Center>
            <UnorderedList p={3}>
              <ListItem>
              Yearly requests are submitted by each nation: for each year, the list should include one or more request for a number of license and/or quota of a species
              </ListItem>
              <ListItem>
              Variables consist of several data points for each nation, including: relative percentage of funds and historical catch rate per species
              </ListItem>
            </UnorderedList>
            </Center>
          </Box>
        </GridItem>
        <GridItem p={3}>
          <Box>
            <Heading size="md" id="example">Example</Heading>
            <Divider/>
            <Text>Given the above overview, lets walk through an example of how the calculation works.</Text>
            <Alert status="info" p={3} >
            <AlertIcon />
              Let's say we have obtained 10,000 pounds of halibut quota at $120.00/lb and we have four nations requesting various amounts of halibut for this year. 
            </Alert>
          </Box>
          </GridItem>
          <GridItem rowSpan={2}>
          <Box p={3}>
          <Heading size="sm" id="nation-data">Nation Data</Heading>
            <Text>The below tables show the requests and variables for the requesting nations'. Hover over the table headers to read more info for each variable.</Text>
            <Center p={3}>
              <Card p={3}>
              <TableContainer display={"inline-flex"} >
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Nation</Th>
                      <Th>Halibut quota requested (lbs)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr><Td>Nation A</Td><Td isNumeric>15,000</Td></Tr>
                    <Tr><Td>Nation B</Td><Td isNumeric>10,000</Td></Tr>
                    <Tr><Td>Nation C</Td><Td isNumeric>5,000</Td></Tr>
                    <Tr><Td><Text as={isPrechecksVisisble ? "s" : ""}>Nation D</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>5,000</Text></Td></Tr>
                  </Tbody>
                  <TableCaption>Year Requests</TableCaption>
                </Table>
              </TableContainer>
              </Card>
              <Card p={3}>
              <TableContainer display={"inline-flex"}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                    <Th>Nation</Th>
                    <Tooltip label="Share of total allocated funds" placement="top">
                      <Th isNumeric>Percentage of funds</Th>
                    </Tooltip>
                    <Tooltip label="Relative funds share between requesting nation" placement="top">
                      <Th isNumeric>Normalized Funds</Th>
                    </Tooltip>
                    <Tooltip label="Has species been historical catched in nation" placement="top">
                      <Th>Halibut Available (Y/n)</Th>
                    </Tooltip>
                    <Tooltip label="Requested amount divided by available amount" placement="top">
                      <Th isNumeric>Request proportion (%)</Th>
                    </Tooltip>
                    <Tooltip label="Increases by 10 for each species nation has no historical catch data" placement="top">
                      <Th isNumeric>Limited range of species</Th>
                    </Tooltip>
                  </Tr>
                  </Thead>
                  <Tbody>
                  <Tr><Td>Nation A</Td><Td isNumeric>10</Td><Td isNumeric>28.6</Td><Td isNumeric>Y</Td><Td isNumeric>{15000/10000*100}</Td><Td isNumeric>0</Td></Tr>
                  <Tr><Td>Nation B</Td><Td isNumeric>5</Td><Td isNumeric>14.3</Td><Td isNumeric>Y</Td><Td isNumeric>{10000/10000*100}</Td><Td isNumeric>0</Td></Tr>
                  <Tr><Td>Nation C</Td><Td isNumeric>20</Td><Td isNumeric>57.1</Td><Td isNumeric>Y</Td><Td isNumeric>{5000/10000*100}</Td><Td isNumeric>10</Td></Tr>
                  <Tr><Td><Text as={isPrechecksVisisble ? "s" : ""}>Nation D</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>15</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>30</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>N</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>{5000/10000*100}</Text></Td><Td isNumeric><Text as={isPrechecksVisisble ? "s" : ""}>0</Text></Td></Tr>
                  </Tbody>
                <TableCaption>Nation variables</TableCaption>
                </Table>
              </TableContainer>
              </Card>
            </Center>
          </Box>
        </GridItem>
        <GridItem rowSpan={1}>
          <Box p={3}>
            <Heading id='prechecks' size="sm">Prechecks</Heading>
            <Text>
              Before performing the calculation, we need to ensure that no variables are zero for the each nation. In this example, each nation has funds,
              however Nation D does not have availability to halibut. We'll remove them from consideration.</Text> 
          </Box>
          </GridItem>
        <GridItem>
          <Box p={3}>
          <Heading size="sm" id="prob-score-calculation">Probability Score Calculation</Heading>
            <Text>Next, we calculate a "probability score" for each nation.
              This is a simple calculation that takes into account the variables noted above, as well as some dynamic variables.
            </Text>
          <Center p={3}>
          <Card p={3} display={"-webkit-box"}>
            <Text as="i" display="flex" alignItems={"center"}><TbSum/> Normalized Funds + Request proportion + Limited range of species + <Tooltip label={"Value is zero initally, but is a rolling value of allocated amount / requested amount"}>Allocation fufillment ratio</Tooltip> + <Tooltip label={"Value is zero initially, but will increase by one if a nation recieved zero allocations from a resulting calculation."}>Previous grant denial</Tooltip></Text>
          </Card>
          </Center>
          </Box>
        </GridItem>
        <GridItem rowSpan={2}>
          <Box p={3}>
            <Text>Using the values in the table above, let's calculate this for Nation A:</Text>
           </Box> 
            <Center>
            <Card p={3} display={"-webkit-box"}>
              <Text as="i" display="flex" alignItems={"center"}><TbSum display="inline-block"/> 28.6 + 150  + 0 + 0 + 0 = 178.6</Text>
            </Card>
            </Center>
            <Box p={3}>
            <Text>See the below calculations for all nations:</Text>
            </Box>
            <Center>
              <Card>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                      <Th>Nation</Th>
                      <Th isNumeric>Probability score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Nation A</Td><Td isNumeric>178.6</Td>
                        </Tr>
                        <Tr>
                        <Td>Nation B</Td><Td isNumeric>119.3</Td>
                      </Tr>
                      <Tr><Td>Nation C</Td><Td isNumeric>137.1</Td></Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            </Center>
        </GridItem>
        <GridItem>
          <Box p={3}>
            <Heading size="sm" id="priority-val-calculation">Priority Value Calculation</Heading>
            <Text>We then normalize these values to get a priority value for percentage share of the total allocation. This is a similar process to how we normalized the funds above, however the list is now sorted from largest to smalled priority value.</Text>
          </Box>
          <Center>
              <Card>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                      <Th>Nation</Th>
                      <Th isNumeric>Priority value (%)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Nation A</Td><Td isNumeric>41.0</Td>
                        </Tr>
                        <Tr><Td>Nation C</Td><Td isNumeric>31.5</Td></Tr>
                        <Tr>
                        <Td>Nation B</Td><Td isNumeric>27.4</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            </Center>
        </GridItem>
        <GridItem >
          <Box p={3}>
            <Heading size="sm" id="distribute-quota">Distribute Quota</Heading>
            <Text>
              Now that we have these values, we can start dividing up the quota. Starting from the largest priority value, we
              multiply the value by the total quota available (10,000 lbs), round to the nearest 500lbs, and cycle through the list until all the quota has been distributed
              or all the nations' requests have been granted in full. Before allocating the quota to a nation on each iteration, we'll ensure 
              the nation has sufficient funds for the purchase and the granted amount does not exceed the requested amount. 
            </Text>
          </Box>
          <Center>
              <Card>
                <TableContainer display={"inline-table"} >
                  <Table>
                    <Thead>
                      <Tr>
                      <Th>Nation</Th>
                      <Th isNumeric>Amount (lbs)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Nation A</Td><Td isNumeric>4000</Td>
                        </Tr>
                        <Tr><Td>Nation C</Td><Td isNumeric>3000</Td></Tr>
                        <Tr>
                        <Td>Nation B</Td><Td isNumeric>2500</Td>
                      </Tr>
                    </Tbody>
                    <TableCaption>Round 1</TableCaption>
                  </Table>
                </TableContainer>
              <RunAlgorithmChart 
                aspectRatio={1}
                barOneDataKey="requested_amount"
                barTwoDataKey="allocated_amount"
                data={[
                  {"name": "Nation A", "requested_amount": 15000, "allocated_amount": 4000},
                  {"name": "Nation B", "requested_amount": 10000, "allocated_amount": 3000},
                  {"name": "Nation C", "requested_amount": 5000, "allocated_amount": 2500}
                ]}
              >
                </RunAlgorithmChart>
              </Card>
              <Card>
                <TableContainer display={"inline-table"} >
                  <Table>
                    <Thead>
                      <Tr>
                      <Th>Nation</Th>
                      <Th isNumeric>Amount (lbs)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Nation A</Td><Td isNumeric>4500</Td>
                        </Tr>
                        <Tr><Td>Nation C</Td><Td isNumeric>3000</Td></Tr>
                        <Tr>
                        <Td>Nation B</Td><Td isNumeric>2500</Td>
                      </Tr>
                    </Tbody>
                    <TableCaption>Round 2</TableCaption>
                  </Table>
                </TableContainer>
              <RunAlgorithmChart 
                aspectRatio={1}
                barOneDataKey="requested_amount"
                barTwoDataKey="allocated_amount"
                data={[
                  {"name": "Nation A", "requested_amount": 15000, "allocated_amount": 4500},
                  {"name": "Nation B", "requested_amount": 10000, "allocated_amount": 3000},
                  {"name": "Nation C", "requested_amount": 5000, "allocated_amount": 2500}
                ]}
              >
                </RunAlgorithmChart>
              </Card>
            </Center>
            <Box p={3}>
              <Text>After round 1, we have 500 lbs left. The process repeats, using the same priority values since no nations' requested amount has been fufilled. 
                Because the minimum quota is 500 lbs, the last chunk is granted in full to Nation A, bringing their total to 4500 lbs.
              </Text></Box>
        </GridItem>
        <GridItem>
          <Box p={3}>
            <Heading size="sm" heading="update-dynamic-variables">Update Dynamic Variables</Heading>
            <Text>Now that we have the results, we can update the dynamic variables mentioned earlier. These will be used in future calculations.</Text>
            <Center p={3}>
            <Card>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr><Th>Nation</Th><Th>Allocation fufillment ratio (%)</Th><Th>Previous Grant Denial</Th></Tr>
                </Thead>
                <Tbody>
                  <Tr><Td>Nation A</Td><Td isNumeric>33</Td><Td isNumeric>0</Td></Tr>
                  <Tr><Td>Nation B</Td><Td isNumeric>33</Td><Td isNumeric>0</Td></Tr>
                  <Tr><Td>Nation C</Td><Td isNumeric>50</Td><Td isNumeric>0</Td></Tr>
                </Tbody>
              </Table>
            </TableContainer>
            </Card>
            </Center>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={3}>
            <Heading size="md" id="Decision Tree">Decision Tree</Heading>
            <Divider/>
            <Text>
              For more info on this process, please refer to the below decision tree.
            </Text>
            <Center p={3}>
              <Image src="cbf_descision_tree.drawio.svg"></Image>
            </Center>
          </Box>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
};

export default About;
