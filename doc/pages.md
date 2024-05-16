# Pages documentation

## List of content
- [Advanced](#advanced)
- [Archive](#archive)
- [Back Channel](#back-channel)
- [Dashboard](#dashboard)
- [Help](#help)
- [User settings](#user-settings)
- [Manage Users](#manage-users)
- [Layout.jsx](#layout)
- [Login.jsx](#login)
- [NoPage](#nopage)
- [InternalPC](#internal-pc)
- [ExternalPC](#external-pc)
- [FastData](#fast-data)


# Advanced 
This page is visible only for admin users.

The `Advanced` component in a React application provides a comprehensive interface for managing complex configurations and service commands. It incorporates various React hooks and Redux for state management, allowing dynamic interaction with system settings.

## Overview

- **Contexts Used**: `LoadingContext` for managing loading states and `SnackbarContext` for user notifications.
- **Redux Integration**: Utilizes `useSelector` to access Redux store state and `useDispatch` to dispatch actions.
- **State Management**: Manages local component state using `useState` for various configurations and commands.
- **Service Interaction**: Provides interfaces to send commands to services and display responses dynamically.

## Functionality

### State Initialization

- **jsonData**: Initialized with the current Redux store configuration.
- **currentTab**: Manages the currently active tab in the UI.
- **dangerousMode**: Toggles between safe and dangerous modes for editing configurations.

### Service Commands

Handles service commands for:
- a4MONITOR
- Back channel
- Data transfer
- Configuration
- Broker

Each service command state is managed individually and can trigger corresponding service management functions.

### Hooks Used

- **useEffect**: Syncs `jsonData` with the Redux store whenever the store's state changes.
- **useState**: Manages states for UI controls and service commands.

## Interactions

### Managing Services

- **manageService**: Sends asynchronous commands to services. Utilizes `loaderContext` to show loading states and displays results using `handleRequestFeedback`.
- **handleChange[Service]**: Each service command input field has a corresponding handler to update state and manage the service.

### Recovery IP Management

- **handleAddRecoveryIP**: Adds a recovery IP address for the data collector.
- **handleRemoveRecoveryIP**: Removes the recovery IP address.

### System Commands

- **handleRebootPCA**: Triggers a system reboot for the data collector.

## Components

### Tabs

Uses a secondary navigation bar (`SecondaryNavbar`) to toggle between different sections:
1. Configuration
2. Services
3. Recovery IP
4. More

### Dynamic Forms and Inputs

- **JsonEditorComponent**: Allows JSON configurations to be edited directly in dangerous mode.
- **RadioGroups**: For sending start, stop, and restart commands to services.

## User Feedback

Utilizes `SnackbarContext` to provide feedback for operations such as:
- Success or error after service commands.
- Adding or removing recovery IPs.
- System reboot commands.

## Usage Example

```jsx
<Advanced />
```

This component should be used within a provider that supplies the necessary contexts (LoadingContext and SnackbarContext).

## Security
Dangerous Mode: Allows direct editing of configuration data which should be handled cautiously.
Input validations and error handling are crucial to prevent incorrect command executions and system states.

# Archive
This page is visible only for admin users.

The main functionality of this page is to store some information with a timestamp regarding possibile issues or informations specifically related to a particular device or client line.

## State Variables
* archive: Stores the current state of the archive.
* title: Stores the title of the archive item being added or modified.
* oldTitle: Stores the previous title when modifying an archive item.
* content: Stores the content of the archive item.
* mod: Boolean state to manage the modify dialog visibility.
* open: Boolean state to manage the add dialog visibility.
## Context
* **SnackbarContext:** Used to show feedback messages.
* **LoadingContext:**    Used to show or hide a loading spinner.
* 

## Lifecycle and Side Effects

- The component fetches the initial archive data from the backend server using the `useEffect` hook when it mounts.
- It also provides a function to reload the archive data upon user request.

## API Integration

- The component interacts with backend API functions (`send_archive`, `get_archive`, `delete_archive_note`) to manage the archive data.
- It handles the asynchronous nature of these operations using async/await syntax and provides appropriate feedback based on the API responses.

# Back Channel

## Description
The `BackChannel` component is a React component responsible for managing and displaying the back channel configuration, including topics and file names white-list.

## Functionalities
- Displays topics and file names white-list.
- Allows editing of the white-lists.
- Supports saving changes made to the white-lists.

## Internal functions:

- `getTableArray(data, type)`: Converts the received data into an array format suitable for table rendering.
- `handleRequestFeedback(newState)`: Updates the snack bar context with a new state.
- `handleBackChannelChange(event)`: Handles the form submission for saving changes made to the back channel configuration.

# Dashboard

## Description
The `Dashboard` component is a React component designed to provide a comprehensive overview of various system statuses, including a4GATE status, plugin statuses, connected devices, and more.

## Functionalities
- Displays a4GATE status, including data sender readiness, network connectivity, bidirectionality, and version information.
- Provides information on plugin statuses such as Sitemanager, Thingworx, OPCUA Server, HTTP Server, and Fast Data.
- Lists connected devices and their statuses.
- Allows users to update the a4GATE hostname and view relevant feedback.

## Component Structure
The `Dashboard` component comprises the following main sections:
1. Hostname Management
    - Allows users to input and save the a4GATE hostname.
2. a4GATE Status
    - Displays various aspects of the a4GATE system status, including data sender readiness, network connectivity, bidirectionality, and version information.
3. Plugins
    - Provides an overview of plugin statuses such as Sitemanager, Thingworx, OPCUA Server, HTTP Server, and Fast Data.
4. Connected Devices
    - Lists connected devices and their statuses.

## Dependencies
- React
- Redux (useSelector, useDispatch)
- Material-UI (Container, Card, CardContent, Grid, Stack, FormControl, TextField, Button, Popover, Typography, Divider, Table, TableContainer, TableRow, TableCell)
- ErrorCacher

## Notes
- The `Dashboard` component serves as a centralized hub for monitoring and managing various system statuses and configurations.
- Users can interact with the component to update the a4GATE hostname and receive feedback on their actions.

## Internal Functions
- `hostValid(host)`: Checks if the provided hostname contains special characters.
- `handleHostNameChange()`: Handles the process of updating the a4GATE hostname based on user input, providing feedback accordingly.
- `goodStatus()`, `badStatus()`, `unknownStatus()`: Helper functions to display status indicators based on the state of the system.
- Event handlers for opening and closing popovers related to plugin statuses.





# Help

The Help component provides a user interface for accessing various guides and documentation related to system functionalities and administration tasks.

- Displays a list of available help topics categorized into "a4gateHelp" and "adminHelp".
- Allows users to navigate between different help topics using tabs.
- Renders each help topic within an iframe for easy viewing.
- Superusers have access to an additional "Admin section" containing advanced guides and management features

# User Settings
The ChangePassword component provides a user interface for users to change their passwords. It includes input fields for entering the username, old password, new password, and confirmation of the new password. Users can toggle password visibility for each input field. The component also validates the input data and communicates feedback messages to the user accordingly.

## States
* currentTab: Tracks the current tab index.
* username: Stores the entered username.
* oldPassword: Stores the entered old password.
* newPassword: Stores the entered new password.
* newPasswordConfirm: Stores the entered confirmation of the new password.
* showOldPassword, showNewPassword, showNewPasswordConfirm: Boolean states to toggle password visibility for respective input fields.
## Helper functions

* userIsValid(user): Validates the format of the entered username.
* checkPasswordStrength(password): Evaluates the strength of the entered password based on criteria such as length, uppercase, lowercase, digits, and special characters



# Manage Users
The ManageUsers component provides functionality to manage user accounts. It allows users to view existing users, add new users, and delete existing users. The component interacts with the backend to retrieve user data, create new users, and delete existing users. Users can also clear input fields and toggle password visibility for added security.

## States
* userList: Stores the list of existing users.
* username: Stores the entered username when adding a new user.
* password: Stores the entered password when adding a new user.
* confirmPassword: Stores the entered confirmation of the password when adding a new user.
* showPassword, showPasswordConfirm: Boolean states to toggle password visibility for respective input fields.
* open: Manages the visibility of the dialog for adding new users.
* visibleUsers: Stores the list of users whose details are currently visible.

## Helper functions
* userIsValid(user): Validates the format of the entered username.
* checkPasswordStrength(password): Evaluates the strength of the entered password based on criteria such as length, uppercase, lowercase, digits, and special characters.
* getUserNamefromEmail(email): Extracts the username from the email addres



# Layout
The Layout component serves as the main layout for the application. It incorporates essential components such as MiniDrawer, ErrorCacher, Loader, and Snackbar. Additionally, it handles window resizing and displays a message if the viewport size is insufficient for the application.

## State
**mobileViewport**: Boolean state indicating whether the viewport size is suitable for mobile devices.


# Login
This component provides a login form for users to authenticate. It interacts with the server to verify user credentials and manage authentication states.

## Props
- `authenticated`: A boolean value indicating whether the user is authenticated.
- `setAuthenticated`: A function to set the authentication status.

## Usage
```jsx
<Login authenticated={authenticated} setAuthenticated={setAuthenticated} />
```


## States
* username: Holds the value of the username entered by the user.
* password: Holds the value of the password entered by the user.
* showPassword: Controls the visibility of the password input field.

## Functions
* handleClickShowPassword: Toggles the visibility of the password input field.
* handleUsernameChange: Updates the username state when the input value changes.
* handlePasswordChange: Updates the password state when the input value changes.
* getAllConfig: Fetches configuration data from the server.
* handleLogin: Handles the login process, validates user credentials, and sets the authentication status.


# NoPage

Displays a page not found message with a button to navigate to the dashboard.
This component renders a card with an image and a button. It is typically used to inform users that the requested page is not found and provide them with an option to navigate back to the dashboard.

`handleClick`: Navigates to the dashboard page when the button is clicked.






# Register
Allows users to register with a username and password.

This component provides a form for users to register with a username and password. It includes input fields for username, password, and confirm password. Upon successful registration, the user is authenticated and redirected to the home page.

## Props
* setAuthenticated: Function to set the authentication status.
* firstUser: Boolean indicating whether it's the first user.
* setFirstUser: Function to set the status of the first user.

## Functions

* handleUsernameChange: Updates the state with the username input value.
* handlePasswordChange: Updates the state with the password input value.
* handleConfirmPasswordChange: Updates the state with the confirm password input value.
* handleRequestFeedback: Displays feedback messages using the SnackbarContext.
* handleRegister: Handles the registration process, including form validation and API requests.
* userIsValid: Validates the format of the username.
* checkPasswordStrength: Checks the strength of the password based on certain criteria.


# Internal PC

Displays data collector components and functionalities.
This component renders different internal PC functionalities based on the current URL. It includes options like network setup and machine communication setup. Clicking on each option navigates the user to the corresponding page for configuration.


## List of content
- [Network (Data Collector)](#network-data-collector)
- [Kepware](#kepware)

`<Outlet/>`: Component from react-router-dom to render nested routes.

## Network (Data Collector)
Displays and manages network configuration settings for the internal PC.

This component provides a user interface to configure network settings such as IP address, routes, NTP synchronization settings, and scan exceptions for the internal PC. It allows users to switch between different tabs to configure various aspects of the network.

### Functions
* handleRequestFeedback: Updates the snack bar context with feedback messages.
* handleConnectionChange: Handles the change in connection type (static or DHCP).
* handleIPAddressChange: Handles the change in IP address.
* handleAddScanException: Adds a new scan exception to the list.
* handleDeleteScanException: Deletes a scan exception from the list.
* handleUpdateNTPFromBChange: Handles the change in NTP synchronization settings.
* handleCustomNTPAddressChange: Handles the change in custom NTP server addresses.
* handleResync: Initiates the NTP synchronization process.
* handleStart: Initiates the NTP synchronization process using Data Sender.
* handleIndustrialChange: Handles the change in industrial network settings and dispatches the update action.
* verifyIPCIDR, verifyIPnotbroadcast, verifyIP: Utility functions for IP address validation.

`<JSONTree/>`: Custom component for displaying JSON data available only for admin

### State
- `currentTab`: Indicates the index of the current tab being displayed.
- `navbarItems`: Array of strings representing the names of navigation tabs.
- `connection`: String indicating the type of network connection (static or DHCP).
- `ipAddress`: Array of strings representing the IP addresses.
- `routeTableData`: Array of objects representing route table data.
- `scanException`: Array of strings representing scan exception IP addresses.
- `currentScanException`: String representing the current scan exception being added.
- `updateNTPfromB`: Boolean indicating whether to use custom NTP server settings.
- `customNTPAddress`: Array of strings representing custom NTP server IP addresses.

## Kepware

### Kepware (Main Table)

#### States
- `currentTab`: Indicates the index of the current tab being displayed.
- `navbarItems`: Array of strings representing the names of navigation tabs.
- `machineSerial`: String representing the machine serial number.
- `thingNames`: Array of strings representing the list of thing names.
- `channelRows`: Array of objects representing channel rows.
- `kepwareMode`: Boolean indicating the Kepware mode (license mode or trial mode).
- `open`: Boolean indicating whether the snackbar is open.
- `vertical`: String representing the vertical position of the snackbar.
- `horizontal`: String representing the horizontal position of the snackbar.
- `severity`: String representing the severity level of the snackbar message.
- `message`: String representing the message content of the snackbar.
- `kepwareDefaultProjectDialogOpen`: Boolean indicating whether the Kepware default project dialog is open.
- `kepwareDefaultProjectResponse`: Array representing the response from loading the Kepware default project.
- `expandedListChannels`: Array of strings representing expanded list of channels.
- `expandedListDevices`: Array of strings representing expanded list of devices.
- `channelList`: Array of strings representing the list of channels.
- `device_connected`: Object representing connected devices.
- `kepware`: Redux state representing the Kepware configuration.
- `thing_names`: Redux state representing the list of machine IDs.
- `superUser`: Boolean indicating whether the current user has superuser privileges.
- `snackBarContext`: Context for managing snackbar notifications.
- `loadingContext`: Context for managing loading states.
- `snackBar`: State variable for managing snackbar notifications.

#### Main functions
- handleRequestFeedback(newState: Object): Updates the snackbar context state with new feedback.
- handleKepwareModeChange(event: Event): Handles changes to the Kepware mode (license mode or trial mode).
- handleKepwareChange(event: Event): Handles changes to the Kepware configuration and dispatches actions accordingly.
- handleChannelRefresh(): Refreshes the list of Kepware channels and displays appropriate feedback.
- handleUploadKepwareProject(event: Event): Handles the upload of a Kepware project file and displays appropriate feedback.
- handleDownloadKepwareProject(): Initiates the download of the current Kepware project and displays appropriate feedback.
- handleDownloadKepwareDefaultProject(): Initiates the download of the default Kepware project and displays appropriate feedback.
- handleReloadKepwareRuntime(): Reloads the Kepware runtime and displays appropriate feedback.
- handleAddThingName(event: Event): Handles the addition of a new machine serial number to the list of thing names.
- handleThingNameDelete(value: string): Handles the deletion of a machine serial number from the list of thing names.
- handleExpandableListChannels(event: Event, name: string): Handles the expansion/collapse of channel lists.
- handleExpandableListDevices(event: Event, channel: string, device: string): Handles the expansion/collapse of device lists within channels.
- groupByChannel(data: Array): Groups data by channel and returns an array containing the list of channels and grouped data.




### Rows
This component renders a table row with expandable content. It displays information about a specific device and provides options for configuring IoT gateway settings and managing device properties.

#### Props
- tagsSelectionDialog: Boolean flag indicating whether the tags selection dialog should be displayed.
- setTagsSelectionDialog: Function to set the state of tagsSelectionDialog.
- rowData: Object containing data about the device to be displayed in the table row.

#### Functionalities
1. Expand/Collapse Row:

    - Clicking on the expand/collapse button toggles the visibility of additional information about the device.

2. IoT Gateway Type Selection:

    - Allows users to select the type of IoT gateway (Thingworx, OPCUA Server, HTTP Server, or Matrix) for device communication.
  
3. Device Configuration:

    - Provides input fields and options for configuring device-specific settings based on the selected IoT gateway type.
    - Options include setting local thing names, enabling custom endpoints, choosing tags, and initiating device creation.

#### Subcomponents
`TagsSelectionDialog`: A dialog component for selecting tags associated with the device.







# External PC
This section includes anything related to the page belonging with data sender PC

## List of content:

- [Thingworx](#thingworx)
- [Sitemanager](#sitemanager)
- [OPCUAServer](#opcua-server)
- [Network](#network-data-sender)
- [HTTPServer](#http-server)
## Thingworx

### Functions
#### `handleRequestFeedback(newState)`
- **Description:** Updates the state of the snackbar context to display feedback messages.
- **Parameters:**
  - `newState`: Object containing new state values for the snackbar.
- **Returns:** Void

#### `handleExpandableList(event, name)`
- **Description:** Toggles the expansion state of an item in a list.
- **Parameters:**
  - `event`: Event object triggered by the user action.
  - `name`: Name of the item in the list.
- **Returns:** Void

#### `handleReloadEnabledIotGateway()`
- **Description:** Reloads the enabled IoT gateways.
- **Functionality:**
  - Makes an API call to fetch the enabled IoT gateways.
  - Updates the state with the response.
  - Displays success or error message based on the result.
- **Returns:** Promise<void>

#### `handleIotGatewaysReloadChange()`
- **Description:** Reloads both enabled and disabled IoT gateways.
- **Functionality:**
  - Makes API calls to fetch both enabled and disabled IoT gateways.
  - Updates the state with the responses.
  - Displays success or error message based on the results.
- **Returns:** Void

#### `handleTestConnection()`
- **Description:** Tests the connection to Thingworx.
- **Functionality:**
  - Makes an API call to perform a diagnostic check on the Thingworx agent connection.
  - Updates the state with the diagnostic results.
  - Displays success or error message based on the result.
- **Returns:** Void

#### `handleEnableIotGateway(name)`
- **Description:** Enables the specified IoT gateway.
- **Parameters:**
  - `name`: Name of the IoT gateway to enable.
- **Functionality:**
  - Makes an API call to enable the specified IoT gateway.
  - Updates the state with the result.
  - Displays success or error message based on the result.
- **Returns:** Void

#### `handleDisableIotGateway(name)`
- **Description:** Disables the specified IoT gateway.
- **Parameters:**
  - `name`: Name of the IoT gateway to disable.
- **Functionality:**
  - Makes an API call to disable the specified IoT gateway.
  - Updates the state with the result.
  - Displays success or error message based on the result.
- **Returns:** Void

#### `handleThingworxChange(event)`
- **Description:** Handles changes in Thingworx configuration.
- **Parameters:**
  - `event`: Event object triggered by the user action.
- **Functionality:**
  - Updates Thingworx configuration based on user input.
  - Dispatches an action to update Thingworx configuration.
  - Displays success message upon successful configuration update.
- **Returns:** Void

#### `extractThingName(inputString)`
- **Description:** Extracts the value of the "thingName" parameter from the given input string.
- **Parameters:**
  - `inputString`: Input string containing the "thingName" parameter.
- **Returns:** The extracted "thingName" value, or an empty string if "thingName=" is not present.

#### `handleAddRemoteThing()`
- **Description:** Adds a remote thing to the table.
- **Functionality:**
  - Extracts the thing name from the selected IoT gateway.
  - Adds the thing to the table if it does not already exist.
  - Displays an error message if the thing already exists in the table.
- **Returns:** Void
### Component structure

1. `<Container>`: The main container for rendering child components and structuring the layout.

    - `<BackButton>`: Renders a back button with a customizable page title.
    
    - `<SecondaryNavbar>`: Displays a secondary navigation bar with tabs based on the current state and user permissions.
    
    - `<JSONTree>` (conditional rendering): Displays a JSON tree representation of the `thingworx` data if the current tab is 5 and the user is a super user.

    - `<form>`: Handles form submission for updating Thingworx configuration based on the current tab.

        - Conditional rendering based on the current tab:
            - Tab 0: Renders form elements for updating server and appkey settings.
            - Tab 1: Renders IoT gateways management controls and a list of enabled/disabled IoT gateways.
            - Tab 2: Renders form elements for adding remote things and configuring remote things settings.
            - Tab 3: Renders diagnostic information and logs related to Thingworx agents.
            - Tab 4: Renders form elements for configuring proxy server settings.

            - `<FormControl>`: Wrapper for form control elements.
            - `<FormLabel>`: Labels for form input fields.
            - `<TextField>`: Text input fields for server, appkey, proxy server host, and username.
            - `<InputLabel>`: Labels for password input fields.
            - `<OutlinedInput>`: Password input fields.
            - `<FormHelperText>`: Helper text for form fields.
            - `<Autocomplete>`: Auto-completion input field for selecting IoT gateways.
            - `<Switch>`: Toggle switch for enabling/disabling IoT gateways and proxy server.
            - `<Button>`: Buttons for actions like refreshing, adding remote things, and testing connection.
            - `<IconButton>`: Icon buttons for actions like toggling password visibility and reloading data.
            - `<CustomTable>`: Custom table for displaying remote things data.
            - `<AppBar>`, `<Toolbar>`, `<Typography>`, `<List>`, `<ListItemButton>`, `<ListItemIcon>`, `<ListItemText>`, `<Collapse>`: UI components for displaying diagnostic information and logs.

        - `<SaveButton>`: Renders a save button for saving Thingworx configuration.
## Sitemanager
### Functions

#### useSelector:
- Description: Selects a slice of the Redux state and subscribes to updates to that slice, ensuring that the component re-renders when the selected state changes.
- Parameters: 
    - `(state) => state.services?.sitemanager`: Selector function that extracts the `sitemanager` slice from the Redux state.
- Returns: The selected `sitemanager` slice from the Redux state.

#### useDispatch:
- Description: Returns a reference to the Redux store's `dispatch` function, which is used to dispatch actions to the store.
- Parameters: None
- Returns: The `dispatch` function.

#### useState:
- Description: A React hook used to manage state within functional components.
- Parameters:
    - Initial state values for `currentTab`, `smeDomain`, `smeServer`, `onlybidir`, `nameashostname`, `smeName`, `currentAgentVendor`, `currentAgentType`, and `agentsTableData`.
- Returns: Stateful values and functions to update them.

#### useEffect:
- Description: A React hook that runs side effects after the component has rendered.
- Parameters: 
    - Callback function.
    - Dependency array (`[sitemanager]`) specifying when the effect should run.
- Returns: None.

#### useContext:
- Description: A React hook that provides access to the context value passed to the `useContext` hook.
- Parameters: Context object.
- Returns: Context value.

#### handleDomainChange:
- Description: Updates the state with the new SME domain value.
- Parameters: Event object.
- Returns: None.

#### handleServerChange:
- Description: Updates the state with the new SME server value.
- Parameters: Event object.
- Returns: None.

#### handleOnlyBidirChange:
- Description: Updates the state with the new only bidirectional value.
- Parameters: Event object.
- Returns: None.

#### handleNameAsHostNameChange:
- Description: Updates the state with the new name as hostname value.
- Parameters: Event object.
- Returns: None.

#### handleSMENameChange:
- Description: Updates the state with the new SME name value.
- Parameters: Event object.
- Returns: None.

#### handleRequestFeedback:
- Description: Sends feedback to the user using the Snackbar component.
- Parameters: New state object.
- Returns: None.

#### handleAddAgent:
- Description: Adds a new agent to the agents table data.
- Parameters: None.
- Returns: None.

#### handleSitemanagerSubmit:
- Description: Handles the submission of the sitemanager configuration form.
- Parameters: Event object.
- Returns: None.

#### getArrayFromAgentsObject:
- Description: Converts an object of agents to an array of agent objects.
- Parameters: Agents object.
- Returns: Array of agent objects.

#### agentsColumnData:
- Description: Configuration data for the columns of the agents table.
- Returns: Array of objects specifying column properties.

#### agentValidation:
- Description: Validation rules for agent table data.
- Returns: Object defining validation rules for agent properties.
### Component structure
This component encapsulates a form for configuring Sitemanager settings. It provides various tabs for managing different aspects of the Sitemanager configuration.

- **ErrorCacher** (Outer container for error caching)
  - **Container** (Main container for the Sitemanager configuration form)
    - **BackButton** (Navigational button to go back)
      - Props:
        - `pageTitle`: Title of the page (in this case, "Sitemanager")
    - **SecondaryNavbar** (Secondary navigation bar for switching between tabs)
      - Props:
        - `currentTab`: Currently active tab index
        - `setCurrentTab`: Function to update the currently active tab index
        - `navbarItems`: Array of tab titles
    - **Conditional Rendering**:
      - **JSONTree**: Component to display Sitemanager data in JSON format (conditionally rendered based on current tab and user permissions)
        - Props:
          - `data`: Sitemanager data
    - **Form** (Form for configuring Sitemanager settings)
      - **Tab 0**:
        - Form controls for Gatemanager domain path and server address
          - Input fields for domain and server address
          - Handlers for updating domain and server address
      - **Tab 1**:
        - Form controls for Sitemanager connection and device name
          - Switches for enabling bidirectional mode and custom device name
          - Input field for custom device name (conditionally rendered based on device name mode)
          - Handlers for updating bidirectional mode and device name
      - **Tab 2**:
        - Form controls for managing agents
          - Autocomplete inputs for selecting agent vendor and type
          - Button to add a new agent
          - Table for displaying and editing agent data
      - **SaveButton**: Button to submit the form and save Sitemanager configuration (conditionally rendered based on current tab)
      - 
## OPCUA-Server

### Functions
* `handleRefreshAllIotGateways`: Handles refreshing all IoT gateways.
* `handleEnableIotGateway`: Handles enabling an IoT gateway.
* `handleDisableIotGateway`: Handles disabling an IoT gateway.
* `handleAddIotGatewayFrom`: Handles adding an IoT gateway to the 'from' list.
* `handleAddIotGatewayTo`: Handles adding an IoT gateway to the 'to' list.
* `handleOPCUAServerChange`: Handles changes in OPCUA server configuration.

### Component Structure
This component encapsulates a form for configuring OPCUA Server settings. It provides various tabs for managing different aspects of the OPCUA Server configuration.
- **ErrorCacher** (Outer container for error caching)
  - **Container** (Main container for the OPCUA Server configuration form)
    - **BackButton** (Navigational button to go back)
      - Props:
        - `pageTitle`: Title of the page (in this case, "OPCUA Server")
    - **SecondaryNavbar** (Secondary navigation bar for switching between tabs)
      - Props:
        - `currentTab`: Currently active tab index
        - `setCurrentTab`: Function to update the currently active tab index
        - `navbarItems`: Array of tab titles
    - **Conditional Rendering**:
      - **JSONTree**: Component to display OPCUA Server data in JSON format (conditionally rendered based on current tab and user permissions)
        - Props:
          - `data`: OPCUA Server data
    - **Form** (Form for configuring OPCUA Server settings)
      - **Tab 0**:
        - Form controls for managing Kepware IoT Gateways with read-only and read-write permissions
          - Button to refresh IoT Gateways list
          - Grids for enabling/disabling IoT Gateways with switches
      - **Tab 1**:
        - Form controls for exposing IoT Gateways with read-only and read-write permissions
          - Autocomplete inputs for selecting IoT Gateways
          - Buttons to add IoT Gateways
          - Custom table for displaying and editing IoT Gateways data
      - **Tab 2**:
        - Form controls for shifting OPCUA nodes between Kepware Iot Gateways
          - Input fields for shifting nodes from and to Kepware
      - **Tab 3**:
        - Form controls for selecting OPCUA host address binding
          - Autocomplete input for selecting host address
      - **Tab 4**:
        - Form controls for configuring OPCUA Server port
          - Switch for toggling between default and custom port
          - Input field for custom port
      - **Tab 5**:
        - Form controls for enabling/disabling Transport Layer Security (TLS) and OPCUA Server authentication
          - Switches for enabling/disabling TLS and server authentication
          - Custom table for managing users (conditionally rendered based on server authentication)
      - **SaveButton**: Button to submit the form and save OPCUA Server configuration (conditionally rendered based on current tab)
    - Conditional Rendering:
## Network (Data Sender)

### Functions
* `handleConnectionChange`: Handles changes in the connection type.
* `handleIPAddressChange`: Handles changes in the IP address.
* `handleDefaultGatewayChange`: Handles changes in the default gateway.
* `handleDNSServerChange`: Handles changes in the DNS server.
* `handleConnectionTypeChange`: Handles changes in the connection type.
* `handleWifiChange`: Handles changes in the WiFi settings.
* `handleNTPChange`: Handles changes in NTP settings.
* `handleCustomNTPChange`: Handles changes in custom NTP settings.
* `handleNATChange`: Handles changes in NAT settings.
* `handleMTIChange`: Handles changes in machine-to-internet settings.
* `handleExpandableListHosts`: Handles expansion of host lists.
* `handleExpandableListPingNumber`: Handles expansion of ping numbers.
* `handleTestConnection`: Handles testing network connections.
* `handleAddHostList`: Handles adding hosts to the list.
* `handleHostListDelete`: Handles deleting hosts from the list.
* `handleCustomerChange`: Handles changes in customer network configuration.
### Additional Functions
These functions perform additional operations related to network configuration.

* `goodStatus`: Returns a green checkmark icon.
* `badStatus`: Returns a red warning icon.
* `handleRequestFeedback`: Handles feedback requests.
* `getArrayOfObjects`: Generates an array of objects.
### Component Structure
1. Page Title and Navigation
- `<BackButton>`: Displays the page title "Network".
- `<SecondaryNavbar>`: Provides navigation between different tabs.

2. Data Display
- `<JSONTree>`: Displays JSON data from `customerNetwork` if `currentTab` equals 8 and the user is a super user.

3. Form Handling
- `<form>`: Handled by `handleCustomerChange` onSubmit.

4. Network Configuration Sections
- **Tab 0**:
  - Connection type (static or DHCP), IP address, default gateway, DNS server, and connection type (Ethernet or Wireless) configuration.
- **Tab 1**:
  - Add addresses for ping tests and specify the number of pings.
  - Display a list of addresses for ping tests and the result of each ping.
- **Tab 2**:
  - Configure static routes.
- **Tab 3**:
  - Configure the NTP server, either using NTP from Gatemanager or a custom NTP server.
- **Tab 4**:
  - Configure NAT features, including enabling/disabling NAT and machine to internet connections.
- **Tab 5**:
  - Configure aliases.
- **Tab 6**:
  - Set TCP ports rules in input WAN.
- **Tab 7**:
  - Configure forwarded TCP ports if NAT is enabled.

5. Save Button
- Displayed at the end of each section (tab) to save the configuration changes.
## HTTP-Server

### Functions
* `handleHTTPServerChange`: Handles form submission.
* `handleRefreshAllIotGateways`: Handles refreshing IoT gateways list.
* `handleDisableIotGateway`: Handles disabling IoT gateways.
* `handleEnableIotGateway`: Handles enabling IoT gateways.
* `handleAddIotGatewayFrom`: Handles adding IoT gateways for HTTP server read-only list.
* `handleAddIotGatewayTo`: Handles adding IoT gateways for HTTP server read and write list.
* `handleIotGatewaysReloadChange`: Handles reloading IoT gateways list.
* `handleCustomPortEnableChange`: Handles enabling/disabling custom port for HTTP server.
* `handleCustomPortChange`: Handles changing the custom port value.
* `handleEnableTLSChange`: Handles enabling/disabling Transport Layer Security.
* `handleServerAuthChange`: Handles enabling/disabling HTTP server authentication.
* `setServerUsername`: Handles setting HTTP server username.
* `setServerPassword`: Handles setting HTTP server password.

### Component Structure
The component structure is almost the same as [OPCUAServer](#opcua-server)
# Fast Data

The FastData component is a React functional component responsible for managing and displaying configuration settings related to fast data exchange methods such as FTP, HTTP, and Matrix. It provides an interface for users to enable/disable these methods and configure Blob storage URL and SAS (Shared Access Signature) key for Azure Blob Storage.

## List of content
- [FTP](#ftp)
- [HTTP (Fast Data)](#http)
- [Matrix](#matrix)

## State
* `ftpEnabled`: Boolean state variable indicating whether the FTP method is enabled or not.
* `httpEnabled`: Boolean state variable indicating whether the HTTP method is enabled or not.
* `matrixEnabled`: Boolean state variable indicating whether the Matrix method is enabled or not.
* `blobConnectionUrl`: String state variable holding the Blob storage URL.
* `blobConnectionSas`: String state variable holding the SAS key for Azure Blob Storage.
* `showSaskey`: Boolean state variable indicating whether the SAS key input field is visible or not.

## Functions

* `handleBlobConnectionUrlChange`: Function to handle changes in the Blob storage URL input field.
* `handleBlobConnectionSasChange`: Function to handle changes in the SAS key input field.
* `handleBlobConnectionChange`: Function to handle the submission of Blob connection configuration changes.
* `handleClick`: Function to handle clicks on menu items corresponding to different fast data exchange methods.
* `handleClickShowSas`: Function to toggle visibility of the SAS key input field.
* `handleRequestFeedback`: Function to handle feedback messages for user actions.


## FTP
The FTP component is a React functional component responsible for managing and configuring FTP server settings, including server configuration, user management, blob settings, and file timestamp settings. It provides an interface for users to customize various parameters related to FTP server operation.

### States
* ftp: Redux state object containing FTP server configuration data.
* superUser: Boolean state variable indicating whether the current user is a superuser.
* currentTab: Integer state variable representing the index of the currently selected tab in the secondary navigation.
* Various state variables for managing FTP server configuration settings, user data, blob settings, and file timestamp settings.


## HTTP
The HTTP component is a React functional component responsible for managing and configuring HTTP server settings, including server configuration, file suffix settings, and blob settings. It provides an interface for users to customize various parameters related to HTTP server operation.

### States
* http: Redux state object containing HTTP server configuration data.
* superUser: Boolean state variable indicating whether the current user is a superuser.
* currentTab: Integer state variable representing the index of the currently selected tab in the secondary navigation.
* Various state variables for managing HTTP server configuration settings, file suffix settings, and blob settings.

## Matrix

The Matrix component is a React functional component responsible for managing matrix data and IoT gateway configurations in the Fast Data application. It provides an interface for users to view, edit, and configure matrix data elements and IoT gateway settings.

### States
* customer: Redux state object containing customer data, including matrix data management.
* superUser: Boolean state variable indicating whether the current user is a superuser.
* currentTab: Integer state variable representing the index of the currently selected tab in the secondary navigation.
* matrixDataManagement: State variable storing matrix data management information.
* matrixIoTGatewaysEnabledList: State variable storing the list of enabled IoT gateways.
* matrixIoTGatewaysDisabledList: State variable storing the list of disabled IoT gateways.
* currentMatrixId: State variable storing the ID of the currently selected matrix item.