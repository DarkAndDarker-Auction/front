import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loaded: false,
    searchKey: [],
}

const searchKeySlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setSearchKey: (state, action) => {
            return {
                loaded: true,
                searchKey: action.payload,
            }
        },
    },
});

export const { setSearchKey } = searchKeySlice.actions;

export default searchKeySlice.reducer;
