import { combineReducers } from '@reduxjs/toolkit';

import AuthReducer from './AuthReducer/AuthReducer';
import AppReducer from './AppReducer/AppReducer';
import BidReducer from './AppReducer/BidReducer';


const Reducer = combineReducers({ AuthReducer, AppReducer, BidReducer });

export default Reducer;