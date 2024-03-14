import React, { Component } from "react";

import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react'

import { useHistory } from 'react-router-dom';
import ApiSelect from "../Select/Select";


function ProfilePageModal({nationList}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory()

  return (
    <>
      <Button onClick={onOpen}>Select Nation</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Nation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ApiSelect list={nationList} listType="nation" onSelect={(e) => history.push(`/profile/${e.target.value}`)}></ApiSelect>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfilePageModal;
