import { LOGGING_IN, SAVEROOM_ID, DEVICE_IN, LOGOUT, COMPANY_ID, PARENT_COMPANY_ID, LOGIN_APP, REMEMBER_ME, REMEMBER_ME_CLEAR, DEVICE_TYPE } from "../Actions";


const INITIAL_STATE = {
    user: null,
    refresh_token: null,
    token: null,
    loggingIn: false,
    new_user: false,
    errorMessage: null,
    deviceInfo: null,
    company_id: null,
    parent_company_id: null,
    mongoDBId: null,
    UserName: null,
    Password: null,
    deviceType:0
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {

        case PARENT_COMPANY_ID:
            return {
                ...state,
                
            }
        case LOGOUT:
            return {
                ...state,
                user: null,
                refresh_token: null,
                token: null,
                loggingIn: false,
                new_user: false,
                errorMessage: null,
                deviceInfo: null,
                company_id: null,
                parent_company_id: null,
                mongoDBId: null
            }

        case LOGGING_IN:
            return {
                ...state,
                user: action.payload.user,
                refresh_token: action.payload.refresh_token,
                token: action.payload.token,
                new_user: action.payload.new_user,
                errorMessage: null,
                parent_company_id: action.payload.CompanyId,
                company_id:action.payload.CompanyId
            }
        case DEVICE_IN:
            return {
                ...state,
                deviceInfo: action.payload
            }
        case DEVICE_TYPE:
            return {
                ...state,
                deviceType: action.payload
            }
            
        case COMPANY_ID:
            return {
                ...state,
                company_id: action.payload,
            }
        case SAVEROOM_ID:
            return {
                ...state,
                mongoDBId: action.payload,
            }
        case LOGIN_APP:
            return {
                ...state,
                loggingIn: true,
            }
        case REMEMBER_ME:
            return {
                ...state,
                UserName: action.payload.UserId,
                Password: action.payload.Password
            }
        case REMEMBER_ME_CLEAR:
            return {
                ...state,
                UserName: null,
                Password: null
            }
        default:
            return state

    }
}