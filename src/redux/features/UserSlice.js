import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        email: null,
        tokenType: null,
        accessToken: null,
        isLoggedIn: false,
    },
    reducers: {
        logon: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.tokenType = action.payload.tokenType;
            state.accessToken = action.payload.accessToken;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.id = null;
            state.email = null;
            state.tokenType = null;
            state.accessToken = null;
            state.isLoggedIn = false;
        },
    },
})

// Action creators are generated for each case reducer function
export const { logon, logout } = userSlice.actions

export default userSlice.reducer