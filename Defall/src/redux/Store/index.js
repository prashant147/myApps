import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import authReducer from '../Reducers/auth';
import selDevice from '../Reducers/selDevice';
import resident from '../Reducers/resident';
import ImageReducer from '../Reducers/ImageReducer';
import thunk from 'redux-thunk';
import roomType from '../Reducers/roomType';
import reduxReset from 'redux-reset';
import company from '../Reducers/company';
import selCompany from '../Reducers/selCompany';
import subCompany from '../Reducers/subCompany';
import selSubCompany from '../Reducers/selSubCompany';

const reducers = combineReducers({
  company:company,
  subCompany:subCompany,
  selSubCompany:selSubCompany,
  selCompany:selCompany,
  roomTypeData:roomType,
  auth: authReducer,
  selDevice: selDevice,
  resident: resident,
  roomImage: ImageReducer,
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk), reduxReset())
);

export { store };

