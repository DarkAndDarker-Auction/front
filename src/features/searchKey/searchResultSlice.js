import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loaded: false,
    searchResult: [],
}

const searchResultSlice = createSlice({
    name: 'searchResult',
    initialState: initialState,
    reducers: {
        setSearchResult: (state, action) => {
            return {
                loaded: true,
                searchResult: action.payload,
            }
        },
    },
});

export const { setSearchResult } = searchResultSlice.actions;

export default searchResultSlice.reducer;
