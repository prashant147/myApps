import { ROOMTYPE } from "../Actions";

const INITIAL_STATE = {
    roomType: {},
  };
export default function roomType(state = INITIAL_STATE, action) {
    switch (action.type) {

        case ROOMTYPE:
            return { ...state, roomType:action.payload }
        default:
            return state;
    }
}