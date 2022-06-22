import React from 'react'
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import 'react-notifications/lib/notifications.css';
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import store from './store';
import interceptor from './interceptor';
import Loader from './loader';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
interceptor.setup(history);
ReactDOM.render(
  <Provider store={store}>
    <Loader></Loader>
    <Routes />
  </Provider>, document.getElementById('root'));



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.unregister();