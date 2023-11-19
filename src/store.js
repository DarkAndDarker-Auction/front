import { configureStore } from '@reduxjs/toolkit'
import searchKeyReducer from './features/searchKey/searchKeySlice'
import searchResultReducer from './features/searchKey/searchResultSlice'

const store = configureStore({
    reducer: {
        searchKey: searchKeyReducer,
        searchResult: searchResultReducer,
    }
});

export default store