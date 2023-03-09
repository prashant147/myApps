import { GET_ROOM_INFO } from '.';
import axios from 'axios';
import { BASE_URL } from '../../config/configuration';


export const getRoomDetails = (roomId,token) => {

  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}/mobile/room_details/${roomId}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
    axios.get(url, {
      headers: headers
    }).then(async (response) => {
      try {
        data = response.data;
        resolve(data);
       
      } catch (e) { reject(e) }
    }).catch((err) => {
      reject(err)
    });
  });
};
