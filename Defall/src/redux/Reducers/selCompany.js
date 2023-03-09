import { RESET_SELECT_COMPANY,  SELECT_COMPANY } from "../Actions";


const INITIAL_STATE = {
    id:null,
    name:null,
    address:null,
    vendor_code:null,
    parent_id:null,
    is_home_company:0
}; 

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET_SELECT_COMPANY:
            return {
                ...INITIAL_STATE
            }
        case SELECT_COMPANY: 
            return { ...state, id: action.payload.id,
                name: action.payload.name,
                address: action.payload.address,
                vendor_code: action.payload.vendor_code,
                parent_id: action.payload.parent_id ,
                is_home_company:action.payload.is_home_company
            }
        default:
            return state
    }
}