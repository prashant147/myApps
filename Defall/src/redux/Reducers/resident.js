import { ACCOUNT_INFO, RESIDENT_INFO, RESIDENT_ID, CLEAR_RESIDENT, WIFI_INFO, ADD_ROOM, ROOM_ID, CLEAR_OTHER_RESIDENT } from "../Actions";

const INITIAL_STATE = {
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    Country: null,
    firstName: null,
    lastName: null,
    DOB: null,
    email: null,
    phoneNo: null,
    gender: null,
    wifi_SSid: null,
    wifi_Pass: null,
    name: null,
    room_id: null,
    apartment_id: null,
    subroom_id: null,
    apartment_name: null,
    patient_id: null,
    wings:null
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {

        case WIFI_INFO:
            return {
                ...state,
                wifi_SSid: action.payload.wifi_SSid,
                wifi_Pass: action.payload.wifi_Pass,
            }
        case ACCOUNT_INFO:
            return {
                ...state,
                address1: action.payload.address1,
                address2: action.payload.address2,
                city: action.payload.city,
                state: action.payload.state,
                zip: action.payload.zip,
                Country: action.payload.Country
            }
        case RESIDENT_INFO:
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                DOB: action.payload.DOB,
                email: action.payload.email,
                phoneNo: action.payload.phoneNo,
                gender: action.payload.gender,
                patient_id:action.payload.id,
                apartment_id: action.payload.apartment_id,
                wings:action.payload.wings
            }
        case RESIDENT_ID:
            return {
                ...state,
                patient_id: action.payload,
            }
        case ADD_ROOM:
            return {
                ...state,
                name: action.payload.name,
                room_id: action.payload.room_id,
                apartment_id: action.payload.apartment_id,
                subroom_id: action.payload.subroom_id,
                apartment_name: action.payload.apartment_name,
            }
        case ROOM_ID:
            return {
                ...state,
                id: action.payload,
            }
        case CLEAR_RESIDENT:
            return {
                ...INITIAL_STATE
            }
        case CLEAR_OTHER_RESIDENT:
            return {
                ...state,
                firstName: null,
                lastName: null,
                DOB: null,
                email: null,
                phoneNo: null,
                gender: null,
                patient_id: null,
                wifi_SSid: null,
                wifi_Pass: null,
                name: null,
                room_id: null,
                apartment_id: null,
                subroom_id: null,
                apartment_name: null,
                id: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null,
                Country: null,
            }
        default:
            return state

    }
}