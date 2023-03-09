import { ADD_SELECT,ADD_SELECT_RESIDENT, RESET_SELECT } from "../Actions";


const INITIAL_STATE = {
    Device: null,
    resident: null,
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {


        case RESET_SELECT:
            return {
                ...INITIAL_STATE
            }

        case ADD_SELECT:
            return {
                ...state,
                Device: action.payload
            }
        case ADD_SELECT_RESIDENT:
                return {
                    ...state,
                    resident: action.payload
                }
        default:
            return state

    }
}