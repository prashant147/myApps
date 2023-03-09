import { RESET_COMPANY, ADD_COMPANY } from "../Actions";


const usersDefaultState = [];

export default function (state = usersDefaultState, { type, payload }) {

    switch (type) {

        case RESET_COMPANY:
            return usersDefaultState;

        case ADD_COMPANY:
            return payload;
        default:
            return state

    }
}