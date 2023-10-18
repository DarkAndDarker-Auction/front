import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import searchKeyReducer from './features/searchKey/searchKeySlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        searchKey: searchKeyReducer,
    }
})
export default store