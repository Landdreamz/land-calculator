import { createTheme } from '@mui/material/styles';

const tealGradient = 'linear-gradient(90.5deg, rgba(112,181,176,1) 1.9%, rgba(220,244,241,1) 87.7%)';

// Extract main colors from the gradient for use in the theme
const themeColors = {
  primary: '#70B5B0', // First color from gradient
  secondary: '#DCF4F1', // Second color from gradient
  success: '#8CCCC7', // Mid-tone between the two
  background: '#FFFFFF',
  text: '#2D3748',
};

const theme = createTheme({
  palette: {
    primary: {
      main: themeColors.primary,
      light: themeColors.secondary,
      dark: '#5A9994',
    },
    secondary: {
      main: themeColors.secondary,
      light: '#EAFAF8',
      dark: '#C5E0DD',
    },
    success: {
      main: themeColors.success,
      light: '#A3D8D4',
      dark: '#75B5B0',
    },
    background: {
      default: themeColors.background,
      paper: '#FFFFFF',
    },
    text: {
      primary: themeColors.text,
      secondary: '#4A5568',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: tealGradient,
          color: themeColors.text,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: tealGradient,
          '&:hover': {
            background: tealGradient,
            filter: 'brightness(0.95)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            background: tealGradient,
            color: themeColors.text,
            '&:hover': {
              background: tealGradient,
              filter: 'brightness(0.95)',
            },
            '& .MuiListItemIcon-root': {
              color: themeColors.text,
            },
          },
        },
      },
    },
  },
});

export default theme; 