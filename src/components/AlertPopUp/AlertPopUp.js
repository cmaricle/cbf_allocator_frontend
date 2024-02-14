import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  ButtonGroup,
  Button,
} 
from '@chakra-ui/react'

class AlertPopUp extends Component {
  render() {
    return (
      <AlertDialog isOpen={this.props.isOpen}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="large" fontWeight="bold">
            {this.props.header}
          </AlertDialogHeader>
          <AlertDialogBody>
            {this.props.dialog}
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup spacing={3}>
              { 
                this.props.onCancel ? 
                  <Button onClick={this.props.onCancel} variant="cancel">Cancel</Button> : <></>
              }
              {
                this.props.onConfirm ? 
                  <Button onClick={this.props.onConfirm} variant="solid" isLoading={this.props.loading} isDisabled={this.props.confirmedButtonDisabled}>
                    Confirm
                  </Button> : <></>
              }
              { 
                this.props.onClose ? 
                  <Button onClick={this.props.onClose}>Close</Button> : <></>
              }
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
      </AlertDialog>
    );
  }
}


AlertPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  header: PropTypes.string.isRequired,
  confirmedButtonDisabled: PropTypes.bool = false,
  loading: PropTypes.bool = false
}

export default AlertPopUp;
