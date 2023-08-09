import { createTheme } from "@mui/material/styles";

const MUITheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0d6efd",
      contrastText: "#FFFFFF",
      dark: "#A4BBE8",
    },
    secondary: {
      main: "#0d6efd",
      contrastText: "#2C3D7A",
      dark: "#A4BBE8",
    },
    info: {
      main: "#7F899E",
      light: "#A4BBE8",
      dark: "#3E4756",
      contrastText: "#E2ECFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#b3b1b1",
      disabled: "#BBBBBB",
    },
    background: {
      default: "#1F293F",
      paper: "#0D1626",
    },
  },
  typography: {
    fontFamily: "Montserrat",
    button: {
      textTransform: "none",
    },
  },
  components: {
    // Name of the component
    MuiDrawer: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: "30px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(90deg, rgba(13,22,38,1) 0%, rgba(3,48,111,1) 69%, rgba(3,69,144,1) 100%)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 15,
          marginBottom: 15,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 15,
          marginBottom: 15,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 10,
          marginBottom: 10,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 5,
          marginBottom: 5,
        },
      },
    },
    MuiRadioGroup: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 15,
          marginBottom: 15,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 15,
          marginBottom: 15,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          marginTop: 15,
          marginBottom: 15,
        },
      },
    },
  },
});

export default MUITheme;
