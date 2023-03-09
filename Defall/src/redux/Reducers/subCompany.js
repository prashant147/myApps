import { RESET_SUBCOMPANY, ADD_SUBCOMPANY } from "../Actions";


const usersDefaultState = [];

export default function (state = usersDefaultState, { type, payload }) {

    switch (type) {

        case RESET_SUBCOMPANY:
            return usersDefaultState;

        case ADD_SUBCOMPANY:
            return payload;
        default:
            return state

    }
}