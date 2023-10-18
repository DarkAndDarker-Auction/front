import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    refreshToken: null,
    accessToken: null,
    userInfo: {},
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {

    },
});

export default authSlice.reducer;
