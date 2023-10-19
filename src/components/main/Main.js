import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSearchKey } from '../../features/searchKey/searchKeySlice'
import SearchBar from '../searchBar/SearchBar'
import './Main.css'

const searchApi = async () => {

    try {
        const res = await axios.get('http://localhost:8080/auction/api/item-searchKeys', {
            withCredentials: false,
        });
        return res.data;

    } catch (error) {
        console.error(error.response.data.message);
        return false;
    }
}

const Main = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const data = await searchApi(dispatch);
            if (data) {
                dispatch(setSearchKey(data));
            }
        }

        fetchData();

    }, []);

    return (
        <div className="auction_container">
            <SearchBar />
            <div className="item-list"></div>
        </div>
    );

}

export default Main;