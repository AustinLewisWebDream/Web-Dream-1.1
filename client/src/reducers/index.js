import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

import { UPDATE_USER, SET_LOGIN_POPUP, SET_REGISTER_POPUP } from '../actions/types';

const user = (userHistory = [], action) => {
    if(action.type === UPDATE_USER) {
        return [...userHistory, action.payload]
    }
    return userHistory
}

const loginPopup = (state = false, action) => {
    if(action.type === SET_LOGIN_POPUP) {
        return action.payload;
    }
    return state;
}

const registerPopup = (state = false, action) => {
    if(action.type === SET_REGISTER_POPUP) {
        return action.payload;
    }
    return state;
}

export default combineReducers({
    user: user,
    errors: errorReducer,
    auth: authReducer,
    loginPopup,
    registerPopup
});