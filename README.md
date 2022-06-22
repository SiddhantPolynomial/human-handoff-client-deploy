# Human handoff Agent

Agents can use this panel to takeover the chat from chatbot and chat with users directly.

## Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\

## Deployment


### `Branch`
Master branch has the latest code.

### `Config`

All configuration can be found in `src/config/index.js`
Configuration can also be passed from environment variables while deployment. 

## Basic info

There are two types of agents that can login

### `Agent manager`

Agent manager can accept chat requests from users as well as other agents. 

### `Agent`

Agents which do not have manager privilege can accept chat request from users but not from another agent.