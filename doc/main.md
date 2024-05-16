# Files Structure
I divided the entire web app with files named as components with a *.jsx extention and other components that worked as pages with specific routes with *.js extention. The components are usually used more than one time (or could be) and the pages are route-specifical.

**Documentation for pages/ , components/ , api.js  are inside pages.md, components.md and api.md**

## List of content

- [index.js](#indexjs-father-of-react-web-app-containing-contexts)
- [index.css](#indexcss-stylesheet-documentation)
- [App.js](#appjs-principal-a4conf-component-with-routes)
- [App.css](#appcss-stylesheet-documentation)
- [context](#context-containing-all-the-react-simple-context)
- [redux](#redux-store-and-reducers)
- [api](#api)
- [titles](#titles)
- [utils](#utils)

# `Index.js` (father of React web-app containing Contexts)

The `index.js` file is the entry point of the React application. It sets up the application with various providers and renders the main `App` component.

## Imports

The file imports several modules and components essential for the setup of the application:

- **React**: The core library for building user interfaces.
- **ReactDOM**: The package that provides DOM-specific methods that can be used at the top level of a web app.
- **App**: The main application component.
- **store**: The Redux store for managing the application's state.
- **Provider**: The React Redux component to make the store available to all container components in the app.
- **ThemeProvider**: The MUI component for applying a custom theme across the application.
- **MUITheme**: The custom theme configuration for Material-UI.
- **SnackbarProvider**: Context provider for managing snackbars (notifications).
- **LoadingProvider**: Context provider for managing loading states.
- **SuperUserProvider**: Context provider for managing super user states.
- **TerafenceProvider**: Context provider for managing Terafence-specific states.

## Rendering the Application

The root of the application is created and the main `App` component is rendered within a hierarchy of providers. This setup ensures that the entire application has access to the Redux store, custom themes, and various context states.

### Code Breakdown

```javascript
const root = ReactDOM.createRoot(document.getElementById("root"));
```
# `App.js` (Principal a4CONF component with routes)

The `App.js` component is the central hub of the application, coordinating the routing and access control based on authentication state. It utilizes React Router for navigation and conditionally renders components based on the user's login status.

## Component Overview

`App.js` imports and utilizes several key libraries and components:
- **React Router**: Manages routing for the application.
- **useState** and **useEffect** from React: Manages state and lifecycle events in functional components.
- **PrivateRoute**: A custom component that wraps protected routes, ensuring that they can only be accessed by authenticated users.

## Key Variables

- `host`: Obtains the hostname of the current window location, checking if the app is running locally.
- `is_local`: Determines if the application is running on `localhost` or `127.0.0.1`.

## Authentication Logic

The component defines two pieces of state, `authenticated` and `firstUser`, initialized based on whether the application is running locally or if an authentication token is present.

- **Fetching credentials**: An effect hook is used to check for existing credentials when the component mounts. This sets the `firstUser` state, which controls initial routing to either a registration or login view.

## Routing

Routing in `App.js` is handled by `BrowserRouter` and `Routes` components from React Router. It provides a comprehensive set of routes for different parts of the application:

### Initial Setup Routes

- **/register**: Redirects new users to register if no credentials are found.

### Authentication Routes

- **/login**: Navigates to the login page if the user is not authenticated.

### Main Application Routes

Once authenticated, users can navigate to various parts of the application, structured as follows:

- **/dashboard**: The main dashboard view.
- **/data-collector**: A section for managing internal PC data collection, with nested routes for network settings and Kepware configuration.
- **/data-sender**: Manages external PC data sending functionalities, including routes for network settings, SiteManager, ThingWorx, OPCUA Server, and HTTP Server.
- **/fast-data**: For quick data operations with nested routes for FTP, HTTP, and Matrix configurations.
- **/back-channel**: Reserved for back-channel communications, restricted to super users.
- **/archive**: For archiving data, accessible only to super users.
- **/manage-users**: User management interface, restricted to super users.
- **/user-settings**: Allows users to change their settings.
- **/help**: Provides help and documentation.
- **/advanced**: Advanced settings, restricted to super users.

### Default Route

- **/* (NoPage)**: A catch-all route that displays a "Page Not Found" message if the URL doesn't match any defined routes.

## Usage Example

The `App.js` component should be used as the root component in your React application, typically rendered inside the `index.js` file.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

```
# `App.css` Stylesheet Documentation

The `App.css` file contains global CSS styles that are applied across the entire application. Below is a detailed breakdown of each CSS class and keyframe animation defined in this file.

## CSS Classes and Styles

### `.rotate-on-hover`

- **Hover State**: Adds a rotation animation to any Material-UI SVG icon nested inside elements with this class.
- **Active State**: Changes the color of the element to a shade of blue (`#0d6efd`) when clicked.

#### Animation: `rotation`

- **Duration**: 2 seconds
- **Iteration**: Infinite
- **Timing Function**: Linear
- **Keyframes**: Rotates from `0deg` to `-360deg`.

### `.internal-menu-cards`

- **Background Color**: Sets the background color to `#0D1626`, a dark blue shade.

### `.a4gate-hostname-form > div > input`

- **Text Alignment**: Centers the text inside input fields that are nested within the specified class structure.

### `.menu-cards`

- **Background**: Sets an important background color `#3E4756`, a grayish shade.
- **Hover State**: 
  - Changes the cursor to a pointer.
  - Transforms the card slightly up and scales up to give a lifted effect.
  - Adds a blue border (`#0d6efd`).

### `.menu-cards-disabled`

- **Background**: Similar to `.menu-cards`, sets an important background color `#3E4756`.

### `.MuiSpeedDial-fab`

- Customizes the Material-UI Speed Dial FAB button size and position:
  - **Width**: 35px
  - **Height**: 35px
  - **Left Position**: 25px

### `.divider:before, .divider:after`

- Creates horizontal dividers using pseudo-elements:
  - **Content**: Empty
  - **Flex Grow**: 1
  - **Height**: 1px
  - **Background Color**: `#eee`, a light grey color.

## Dark Styling for JSON Editor

- Applies dark theme styles to various parts of the JSON editor, enhancing readability and user experience in dark mode.
- Includes specific styles for read-only elements, separators, different data types (string, object, array, number, boolean, null, invalid), and focus/hover states.
- Colors are set to improve contrast and visibility for elements within the JSON editor.

### Specific JSON Editor Styles

- **Background Colors**: Varying shades of grey and dark blue for different elements to distinguish sections.
- **Text Colors**: Includes specific colors for different data types to make the JSON data easier to read and differentiate.
- **Highlight and Selection**: Adjusts the background colors for highlighted and selected rows or fields to enhance visibility.

## Usage

This stylesheet is intended to be used globally across all components in the React application. To apply these styles, ensure that `App.css` is imported at the top level of your application, typically in the `index.js` or `App.js` file:

```javascript
import './App.css';
```
# `index.css` Stylesheet Documentation

The `index.css` file includes global styles and configurations for the main behavior of the application. This document outlines the purpose of each style rule, providing clarity on how and where these styles are applied.

## Font Face

### `@font-face`

Defines the custom font "Montserrat" used throughout the application.

- **Font Family**: `'Montserrat'`
- **Source**: The font file located at `/public/font/Montserrat-Regular.ttf`
- **Font Weight**: Normal
- **Font Style**: Normal

## Global Styles

### `body`

- **Margin**: `0`
- **Font Family**: `'Montserrat', sans-serif` (with a fallback to sans-serif)
- **Font Smoothing**: 
  - Webkit: `antialiased`
  - Mozilla: `grayscale`

### `body .user-block`

- **Pointer Events**: Disabled (`none`) with `!important` to ensure no user interaction is possible with elements having this class.

### `code`

- **Font Family**: A combination of `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace` to ensure consistent appearance across different environments.

## Scrollbar Styling

### `::-webkit-scrollbar`

- **Width**: `10px` (vertical scrollbar)

### `::-webkit-scrollbar:horizontal`

- **Height**: `10px` (horizontal scrollbar)

### `::-webkit-scrollbar-thumb`

- **Background Color**: `#0d6efd` (blue shade)
- **Border Radius**:

# Context containing all the React simple context
## LoadingContext

### Description

The `LoadingContext` provides a way to manage a global loading state within the application. It includes a timeout to automatically reset the loading state after a specified period.

### `Loading.js`

```javascript
import { useState, createContext, useEffect } from "react";

export const LoadingContext = createContext(undefined);

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (loading) {
      // Imposta un timeout di 60 secondi
      timeoutId = setTimeout(() => {
        setLoading(false); // Reimposta loading a false dopo 60 secondi
      }, 60000);
    }

    return () => {
      // Cancella il timeout se il componente viene smontato prima che scada
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading]);

  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      {children}
    </LoadingContext.Provider>
  );
}
```

### Usage
To use the LoadingContext in a component, you can use the useContext hook:

```javascript
import React, { useContext } from 'react';
import { LoadingContext } from './path/to/Loading';

function MyComponent() {
  const [loading, setLoading] = useContext(LoadingContext);

  return (
    <div>
      {loading ? 'Loading...' : 'Content'}
      <button onClick={() => setLoading(true)}>Start Loading</button>
    </div>
  );
}

```
## Snackbarcontext
The SnackbarContext provides a global state for managing snackbar notifications within the application.

```javascript

import { useState, createContext } from "react";

export const SnackbarContext = createContext(undefined);

export default function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    severity: "error",
    message: "test",
  });
  return (
    <SnackbarContext.Provider value={[snackbar, setSnackbar]}>
      {children}
    </SnackbarContext.Provider>
  );
}

```

### Usage
To use this context you can follow these simple steps:

```javascript
import { SnackbarContext } from "../utils/context/SnackbarContext";
 const snackBarContext = useContext(SnackbarContext);

const handleRequestFeedback = (newState) => {
snackBarContext[1]({ ...newState, open: true });
};

handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Configuration correctly loaded from both PCs`,
      });

handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Error on loading configuration from both PCs`,
      });

```
## SuperUserContext
The SuperUserContext provides a state management solution for handling the superuser status within your React application.

```javascript
import { useState, createContext } from "react";

export const SuperUserContext = createContext(undefined);

export default function SuperUserProvider({ children }) {
  const [superUser, setSuperUser] = useState(false);
  return (
    <SuperUserContext.Provider value={[superUser, setSuperUser]}>
      {children}
    </SuperUserContext.Provider>
  );
}

```
### Usage
```javascript
// SomeComponent.js
import React, { useContext } from 'react';
import { SuperUserContext } from './utils/context/SuperUser';

function SomeComponent() {
  const [superUser, setSuperUser] = useContext(SuperUserContext);

  const toggleSuperUser = () => {
    setSuperUser(!superUser);
  };

  return (
    <div>
      <p>Super User Status: {superUser ? 'Enabled' : 'Disabled'}</p>
      <button onClick={toggleSuperUser}>Toggle Super User</button>
    </div>
  );
}

export default SomeComponent;

```
## TerafenceContext
The TerafenceContext provides a state management solution for handling the status of various Terafence services within your React application.

```javascript
import { useState, createContext } from "react";

export const TerafenceContext = createContext(undefined);

export default function TerafenceProvider({ children }) {
  const [terafenceServices, setTerafenceServices] = useState({
    tf_bchnld: false,
    tf_http_xfer: false,
    tf_cfgmng: false,
    mosquitto: false,
  });
  return (
    <TerafenceContext.Provider value={[terafenceServices, setTerafenceServices]}>
      {children}
    </TerafenceContext.Provider>
  );
}

```

### Usage
```javascript
// AnotherComponent.js
import React, { useContext } from 'react';
import { TerafenceContext } from './utils/context/Terafence';

function AnotherComponent() {
  const [terafenceServices, setTerafenceServices] = useContext(TerafenceContext);

  const toggleService = (service) => {
    setTerafenceServices({
      ...terafenceServices,
      [service]: !terafenceServices[service],
    });
  };

  return (
    <div>
      <p>TF BCHND: {terafenceServices.tf_bchnld ? 'Running' : 'Stopped'}</p>
      <button onClick={() => toggleService('tf_bchnld')}>Toggle TF BCHND</button>
    </div>
  );
}

export default AnotherComponent;

```






# Redux (store and reducers)

## Reducers

This documentation provides an overview of the Redux reducers defined in the reducers.js file. The reducers handle various actions related to the system and services configuration.

### Overview
The reducers.js file uses createSlice from Redux Toolkit to define a slice of the state called config. This slice includes an initial state and several reducers to manage the state.

### Initial State
The initial state is imported from a file named dummy_config and represents the default configuration of the system and services. **The initial state can be found inside dummy-conf.js**

```javascript

import { dummy_config } from "./dummy-conf";
const initialState = dummy_config;
```

### Slice Definition
The jsonSlice is created using createSlice, which includes the following properties:

- **name**: The name of the slice, which is config.
- **initialState**: The initial state of the slice.
- **reducers**: An object containing various reducer functions to handle state updates.



```javascript
const jsonSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    // Reducer functions
  },
});
```

### Reducers
#### updateAll
Updates the entire configuration based on the action type.

```javascript
updateAll(state, action) {
  const { payload } = action;
  const newConf = payload?.payload;
  const { meta } = payload || null;
  const { actionType } = meta || {};

  if (actionType === "fromA") {
    state.system = _.merge(state.system, newConf?.system);
    state.services = _.merge(state.services, newConf?.services);
  } else if (actionType === "fromB") {
    state.system = _.merge(state.system, newConf?.system);
    state.services = _.merge(state.services, newConf?.services);
  } else if (actionType === "fromBackup") {
    state = _.merge(state, newConf);
  }

  state.timestamp = newConf?.timestamp;
}
```
#### updateHostName
Updates the hostname in the system configuration


```javascript
updateHostName(state, action) {
  const { newHostName } = action.payload;
  state.system.hostname = {
    ...state.system.hostname,
    ...newHostName,
  };
}
```
#### updateInternalPC
Updates the internal PC configuration.
```javascript
updateInternalPC(state, action) {
  const { newInternalPC } = action.payload;
  state.system = {
    ...state.system,
    ...newInternalPC,
  };
}

```
#### updateIndustrialNetwork
Updates the industrial network configuration.
```javascript
updateIndustrialNetwork(state, action) {
  const { newIndustrial } = action.payload;
  state.system.network.industrial = {
    ...state.system.network.industrial,
    ...newIndustrial,
  };
}

```
#### updateKepware
Updates the Kepware service configuration.
```javascript
updateKepware(state, action) {
  const { newKepware } = action.payload;
  state.services.kepware = {
    ...state.services.kepware,
    ...newKepware,
  };
}

```
#### ... And others reducers defined inside the file...


## Store

### Store Configuration

The Redux store is configured with a single reducer, which is imported from the `reducers` module.

#### Importing Dependencies

The necessary functions and modules are imported at the beginning of the file.

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { config } from "./reducers";

```

### Creating the Store
The configureStore method is used to create the Redux store. The reducer property is set to the config reducer imported from the reducers module.

```javascript
const store = configureStore({
  reducer: config,
});
```

### Usage
To use this store in your application, you need to wrap your main application component with the Provider component from react-redux, and pass the configured store as a prop to the Provider.

Down below we have our index.js main file in which we wrapped the App component with the `<Provider store={store}/>`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./utils/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import MUITheme from "./MUITheme";
import SnackbarProvider from "./utils/context/SnackbarContext";
import LoadingProvider from "./utils/context/Loading";
import SuperUserProvider from "./utils/context/SuperUser";
import TerafenceProvider from "./utils/context/Terafence";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={MUITheme}>
    <Provider store={store}>
      <SuperUserProvider>
        <LoadingProvider>
          <SnackbarProvider>
            <TerafenceProvider>
              <div className="page-blocker" id="page-blocker" />
              <App />
            </TerafenceProvider>
          </SnackbarProvider>
        </LoadingProvider>
      </SuperUserProvider>
    </Provider>
  </ThemeProvider>
);
```
# Titles

This file has been used to store every description that we want to appeare in a React component as a title (user helper description)



# Utils
Here we have some helper function used inside multiple app component

## Table of Contents

- [Dependencies](#dependencies)
- [Constants](#constants)
- [Helper Functions](#helper-functions)
  - [getAuthToken](#getAuthToken)
  - [getArrayOfObjects](#getArrayOfObjects)
  - [getQueuePending](#getQueuePending)
  - [fetchData](#fetchData)
  - [confToHTML](#confToHTML)
  - [confToJSON](#confToJSON)
  - [confFromJSON](#confFromJSON)
  - [isNumeric](#isNumeric)
  - [clearEmpties](#clearEmpties)
  - [verifyIPCIDR](#verifyIPCIDR)
  - [verifyIP](#verifyIP)
  - [verifyIPnotbroadcast](#verifyIPnotbroadcast)
  - [octecttobits](#octecttobits)
  - [getIpRangeFromAddressAndNetmask](#getIpRangeFromAddressAndNetmask)
  - [isPortNumber](#isPortNumber)
  - [downloadafilewithIE](#downloadafilewithIE)
  - [removeDuplicates](#removeDuplicates)
  - [nonNullItemsCheck](#nonNullItemsCheck)
  - [deepMerge](#deepMerge)
  - [togglePageSleep](#togglePageSleep)

## Dependencies

The `utils.js` file relies on several external libraries:

```javascript
import axios from "axios";
import axiosRetry from "axios-retry";
import PQueue from "p-queue";
```

## Functions

### getAuthToken
Retrieves the JSON Web Token (JWT) from the browser's local storage.

**returns:** String: The JWT token stored in the local storage, or null if no token is found.
```javascript
export const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};
```

### getQueuePending
Gets the number of pending requests in the queue.

**returns:** Number: The number of pending requests in the PQueue.

```javascript
export const getQueuePending = () => {
  return queue?.pending;
};
```

### fetchData
Fetches data from a given URL with the specified HTTP method and optional body. Uses a queue to manage concurrent requests and retries requests on failure.

**params:**:
- url (String): The URL to fetch data from.
- method (String): The HTTP method to use (e.g., 'GET', 'POST').
- body (Object): The request payload for POST requests.
- noToken (Boolean): If true, the request is made without including the JWT token.
**returns:** Promise: Resolves with the response data or rejects with an error.

```javascript
export async function fetchData(url, method, body, noToken) {
  const axiosConfig = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    httpsAgent: {
      rejectUnauthorized: false,
    },
  };

  if (method === "POST") {
    axiosConfig.data = body;
  }

  const makeRequest = async () => {
    let response;
    try {
      const path = window.location.origin;
      const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
      const completePath = encodeURIComponent(pathWithoutPort + url);
      const compatibleEncodedUrl = decodeURIComponent(completePath);

      response = await axios(compatibleEncodedUrl, axiosConfig);

      const data = response.data;
      return data;
    } catch (error) {
      if (error?.response?.status === 403) {
        const message = error?.response?.data?.detail;
        alert(message);
        window.location.replace("/login");
      }

      throw new Error(response?.detail || error.message);
    }
  };

  if (noToken) {
    return queue.add(makeRequest);
  } else {
    const token = getAuthToken() || null;
    if (!token && !is_local) {
      console.error("User not authenticated");
      window.location.replace("/login");
    } else {
      const wrappedRequest = async () => {
        try {
          const path = window.location.origin;
          const pathWithoutPort = path.substring(0, path.indexOf(":", 6));
          const completePath = encodeURIComponent(pathWithoutPort + url);
          const compatibleEncodedUrl = decodeURIComponent(completePath);
          const response = await axios(compatibleEncodedUrl, {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          return data;
        } catch (error) {
          if (error?.message?.includes("401")) {
            localStorage.removeItem("jwtToken");
            window.location.replace("/login");
          }
          throw new Error(`Axios error: ${error.message}`);
        }
      };

      return queue.add(wrappedRequest);
    }
  }
}

```

### togglePageSleep
The togglePageSleep function controls the visibility of a page blocker element, effectively simulating a "page sleep" mode. This can be useful for preventing user interaction with the page during critical operations.

**params:**:
- action (String): The action to perform. Accepted values are 'block': Displays the page blocker element or 'release': Hides the page blocker element.

Ensure there is an HTML element with the ID page-blocker for the function to manipulate.
This function will not perform any action if the verbose variable is set to true.
Typically used to enhance user experience by blocking interactions during operations such as data loading or form submission.


```javascript
export const togglePageSleep = (action) => {
  if (!verbose) {
    const blocker = document.getElementById("page-blocker");
    if (action === "block") {
      blocker.style.display = "block";
    } else if (action === "release") {
      blocker.style.display = "none";
    }
  }
};
```

## Constants
Several constants are defined for configuration and validation purposes:

* **verbose**: Boolean indicating if the URL contains #verbose.
* **host**: Hostname of the current location.
* **is_local**: Boolean indicating if the host is local.
* **ipformat**: Regular expression for validating IPv4 addresses.
* **agents_vendor_list**: List of agent vendor names.
* **agent_vendor_device_type**: Mapping of agent vendors to their device types.




The other helper functions have been taken from older versions of a4conf before React