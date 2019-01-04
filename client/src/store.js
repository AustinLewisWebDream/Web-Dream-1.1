import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// Development
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'remote-redux-devtools';

const inititalState = {};

const logger = createLogger({
        collapsed: true,
        diff: true
})

const store = createStore(
        rootReducer, 
        inititalState, 
        composeWithDevTools(applyMiddleware(thunk, logger))
);

export default store;