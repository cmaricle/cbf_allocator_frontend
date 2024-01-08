import React, { Component } from "react";
import { ChakraProvider, Card, CardHeader, Heading, CardBody, CardFooter, Text, Button, Container } from '@chakra-ui/react'
import PropTypes from 'prop-types';
import Form from '../Form'
import NationVariableForm from '../NationVariableForm'

const theme = {
  fontSizes: {
    lg: '18px',
  },
  colors: {
    gray: {
      100: '#fafafa',
      200: '#f7f7f7',
    },
  },
}

class ControlCard extends Component {
  render() {
    return (
      <ChakraProvider>
       <Card>
        <CardHeader>
          <Heading size='md'>{this.props.header}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{this.props.body}</Text>
        </CardBody>
        <CardFooter>
          { this.props.cardType === "runAlgorithm" && <Form runAlgorithm={this.props.onRun}/> }
          { this.props.cardType === "update" && <NationVariableForm updateNation={this.props.onRun}/> }
        </CardFooter>
      </Card>
      </ChakraProvider>
    );
  }
}

Card.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.string.isRequired,
  onRun: PropTypes.func.isRequired,
}

export default ControlCard;
