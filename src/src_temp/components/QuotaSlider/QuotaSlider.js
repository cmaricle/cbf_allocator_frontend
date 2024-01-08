import React from "react";
import PropTypes from 'prop-types';

import theme from "../../theme";

import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  ChakraProvider,
} from '@chakra-ui/react'

function QuotaSlider({ onSelect, maxValue, step }) {
  const [value, setValue] = React.useState(0)
  const handleChange = (value) => {
    setValue(value)
    onSelect(value)
  }

  return (
    <ChakraProvider theme={theme}>
    <Flex>
      <NumberInput maxW='100px' mr='2rem' value={value} onChange={handleChange}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        defaultValue={0}
        min={0}
        max={maxValue}
        step={step}
        flex='1'
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
        variant="basic"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize='sm' boxSize='32px' />
      </Slider>
    </Flex>
    </ChakraProvider>
  )
}

QuotaSlider.propTypes = {
  value: PropTypes.number
}

export default QuotaSlider;
