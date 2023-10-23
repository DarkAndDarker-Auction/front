import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import searchKeyReducer from './features/searchKey/searchKeySlice'
import searchResultReducer from './features/searchKey/searchResultSlice'
import pageNumberReducer from './features/searchKey/pageNumber'

const store = configureStore({
    reducer: {
        auth: authReducer,
        searchKey: searchKeyReducer,
        searchResult: searchResultReducer,
        pageNumber: pageNumberReducer,
    }
})
export default store