import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loaded: false,
    pageNumber: 0,
}

const pageNumberSlice = createSlice({
    name: 'pagination',
    initialState: initialState,
    reducers: {
        setPageNumber: (state, action) => {
            return {
                loaded: true,
                pageNumber: action.payload,
            }
        },
    },
});

export const { setPageNumber } = pageNumberSlice.actions;

export default pageNumberSlice.reducer;
