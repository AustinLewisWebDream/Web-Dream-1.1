import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from '../setAuthToken';
import { REGISTER_USER } from '../routes';
import jwt_decode from 'jwt-decode';
import { setRegisterWindow, setLoginWindow } from './index';

export const registerUser = (user) => dispatch => {
    const response = fetch(REGISTER_USER, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: user.password,
            email: user.email
        })
        }).then(response => {
            response.json().then(error => {
                if(error.data) {
                    console.log(error);
                    dispatch({
                        type: GET_ERRORS,
                        payload: error.data
                    })
                }
                else {
                    dispatch(loginUser(user))
                }
            })
        }).catch(err => {
            console.log(err)
        })
}

export const loginUser = (user) => dispatch => {
    axios.post('/api/users/login', user)
            .then(res => {
                console.log(res)
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch({
                    type: GET_ERRORS,
                    payload: []
                })
                dispatch(setCurrentUser(decoded))
                dispatch(setLoginWindow(false));
                dispatch(setRegisterWindow(false));
            })
            .catch(err => {
                console.log(err.response.data)
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data.data
                });
            });
}

export const updateCurrentUser = (user) => dispatch => {
    dispatch(setCurrentUser(user))
}

export const setCurrentUser = decoded => dispatch => {
    dispatch(
        {
            type: SET_CURRENT_USER,
            payload: decoded
        }
    ) 
}

export const resetServerErrors = () => dispatch => {
    dispatch(
        {
            type: GET_ERRORS,
            payload: []
        }
    ) 
}

export const logoutUser = (history = []) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/');
}