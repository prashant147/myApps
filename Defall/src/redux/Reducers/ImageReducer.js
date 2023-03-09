import { GET_ROOM_INFO } from "../Actions";


const initialState = {
  roomInfo: {},
};

const ImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROOM_INFO: {
      return {
        ...state,
        roomInfo: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default ImageReducer;
