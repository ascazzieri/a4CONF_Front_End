# a4conf Project

This documentation covers the essential parts of the `package.json` file for the `a4conf` project, with a special focus on the scripts used for development and production purposes.

## Project Setup

This project uses various dependencies including React, Redux, Material-UI, and several others aimed at enhancing UI development and state management.

## Available Scripts

In the project directory, you can run several commands defined in the `scripts` section of the `package.json`:

### `npm start`

Runs the app in the development mode using `react-scripts start` and simultaneously runs a Python dummy server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

Command breakdown:
- `concurrently`: This utility runs multiple commands concurrently. We use it here to run the React development server and a Python dummy server at the same time.
- `react-scripts start`: Starts the development server for the React application.
- `python dummy_server/server.py`: Starts a Python server located in the `dummy_server` directory.

### `npm run build`

Builds the app for production to the `build` folder using `react-scripts build`. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start_https`

Runs the app in the development mode over HTTPS. This is particularly useful if you need to test functionalities that require a secure context.

Command breakdown:
- `set HTTPS=true`: Sets the environment variable `HTTPS` to `true`, which is read by `react-scripts` to decide whether to serve the app over HTTP or HTTPS.
- `react-scripts start`: Starts the development server with the HTTPS configuration.

## Dependencies

Here's a brief overview of some key dependencies:

- `@mui/material`, `@emotion/react`, `@emotion/styled`: For styling components in Material-UI.
- `react-redux`, `@reduxjs/toolkit`: For state management in React applications.
- `react-router-dom`: For routing capabilities in React.
- `axios`, `axios-retry`: For making and managing HTTP requests.

## Development Dependencies

- `concurrently`: Used to run multiple commands concurrently. Essential for running our React development server alongside the Python dummy server.
- `redux-devtools-extension`: Integrates Redux DevTools for debugging application's state changes.

## Running the Project

Ensure you have `node` and `npm` installed. Clone the repository and run the following commands:

```bash
npm install   # Install dependencies
npm start     # Start the development server