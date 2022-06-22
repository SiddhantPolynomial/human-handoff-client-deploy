import {
    LOADING_INIT,
    LOADING_SUCCESS
} from "./action-types"


export function startLoading() {
    return async (dispatch) => {
        dispatch({ type: LOADING_INIT });
}
}

export function endLoading() {
    return async (dispatch) => {
        dispatch({ type: LOADING_SUCCESS });
}
}




