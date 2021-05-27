import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import store from './store';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Dashboard from "./components/Dashboard";

import './components/Styles.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#991b1e",
    },
    secondary: {
      main: "#fccd09",
      
    },
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
    <Dashboard />
    </ThemeProvider>
    
  </Provider>,
  document.getElementById("root")
);
module.hot.accept();