import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loaded: false,
    searchKey: {
        items: [],
        rarities: [],
        itemOptions: []
    },
}

const searchKeySlice = createSlice({
    name: 'searchKet',
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
