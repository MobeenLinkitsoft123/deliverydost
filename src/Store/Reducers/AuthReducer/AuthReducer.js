import { createSlice } from '@reduxjs/toolkit';
import { encryptVal } from '../../../utils/Crypto';

const initialState = {
    LoginUser: false,
    UserDetail: [],
    TokenId: [],
    RemamberUser: [],
    isMediaPermissionAllowed: false
};

export const AuthReducer = createSlice({
    name: 'DMS_AUTH',
    initialState,
    reducers: {
        LoginUser: (state, action) => {
            state.LoginUser = action.payload;
        },
        UserDetail: (state, action) => {
            // state.UserDetail = encryptVal(JSON.stringify(action.payload));
            state.UserDetail = action.payload;
        },
        TokenId: (state, action) => {
            state.TokenId = action.payload;
        },
        LogOut: (state, action) => {
            (state.LoginUser = false), (state.UserDetail = []), (state.TokenId = []);
        },
        RemamberUser: (state, action) => {
            state.RemamberUser = action.payload;
        },
        SetisMediaPermissionAllowed: (state, action) => {
            state.isMediaPermissionAllowed = action.payload;
        },

    },
});

export const { LoginUser, UserDetail, TokenId, LogOut, RemamberUser, SetisMediaPermissionAllowed } = AuthReducer.actions;
export default AuthReducer.reducer;