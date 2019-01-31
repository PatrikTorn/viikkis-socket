import { combineReducers } from 'redux';
import appReducer from './appReducer';
import io from 'socket.io-client';
import {SOCKET_ENDPOINT} from '../tools/actionTools'
import configReducer from './configReducer';
const socketReducer = io(SOCKET_ENDPOINT);

// Combine all the reducers
const rootReducer = combineReducers({
    app: appReducer,
    config: configReducer,
    socket: () => socketReducer
})

export default rootReducer;
