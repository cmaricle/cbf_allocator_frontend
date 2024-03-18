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
    let strVal = String(value)
    if (value !== NaN && !strVal.includes("-") && !strVal.includes(".") && !strVal.includes("+")) {
      setValue(value)
      onSelect(value)
    }
  }

  const roundValue = () => {
    if (value % step !== 0) {
      setValue(Math.round(value/step) * step)
    }
  }

  return (
    <ChakraProvider theme={theme}>
    <Flex>
      <NumberInput 
        maxW='100px' 
        mr='2rem' 
        value={value} 
        onChange={handleChange}
        onBlur={roundValue}
        step={step}
        min={0}
        >
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
  value: PropTypes.number,
  step: PropTypes.number
}

export default QuotaSlider;
