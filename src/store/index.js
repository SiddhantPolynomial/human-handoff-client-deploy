import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import rootReducer from '../reducers';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer,
     storeEnhancers(
         applyMiddleware(
            thunk,
             loadingBarMiddleware({
            promiseTypeSuffixes: ['INIT', 'SUCCESS', 'ERROR'],
          }))
         )
     );

export default store;