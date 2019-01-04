import { UPDATE_USER, SET_LOGIN_POPUP, SET_REGISTER_POPUP} from "./types";

export const updateUser = (user) => dispatch => {
    dispatch ({
        type: UPDATE_USER,
        payload: user
    })
};

export const setRegisterWindow = (openWindow) => dispatch => {
    dispatch ({
        type: SET_REGISTER_POPUP,
        payload: openWindow
    })
}

export const setLoginWindow = (openWindow) => dispatch => {
    dispatch(
        {
            type: SET_LOGIN_POPUP,
            payload: openWindow
        }
    ) 
}