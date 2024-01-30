import { extendTheme } from '@chakra-ui/react'

const colors = {
  main: "green.800"
}

export const theme = extendTheme({
  components: {
    Box: {
      color:"red"
    },
    Heading: {
      variants: {
        solid: {
          color: colors.main,
          as: "h2",
          size: "xl", 
          mb: "4"
        }
      }
    },
    Button: {
      variants: {
        cancel: {
          bg: '#edf2f7',
          color: 'green.800',
          _hover: {
            bg: '#e2e8f0',
          },
          size: "lg"
        },
        solid: {
          bg: colors.main,
          color: "white",
          _hover: {
            bg: '#448b6a',
          },
        },
        size: "lg"
      }

    },
    Select: {
      variants: {
        basic: {
          field: {
            // background: colors.main,
            border: "1px",
            borderColor: colors.main,
          },
          icon: {
            color: 'green.800',
          },
        }
      }
    },
    Slider: { 
      variants: {
        basic: {
          filledTrack: {
            bg: 'green.800', // change the background of the filled track to blue.600
          },
        }
      }
    },
    Progress: {
      variants: {
        basic: {
          filledTrack: {
            bg: colors.main
          },
          size: "xs"
        }
      }
    },
    NumberInput: {
      variants: {
        basic:  {
          field: {
            _focus:{
              ring: "1px",
              ringColor: colors.main,
              // ringOffset: "2px",
              // ringOffsetColor: "purple.200"
            } 
        }
        }
      }
    }
  }
});

export default theme
