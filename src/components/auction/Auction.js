import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSearchKey } from '../../features/searchKey/searchKeySlice'
import SearchBar from './searchBar/SearchBar'
import styles from './Auction.module.css'

const Auction = () => {

    const dispatch = useDispatch();
    console.log("Auction component rendered");

    const searchKeyApi = async () => {
        try {
            const res = await axios.get('http://localhost:8080/search-key-api/all', {
                withCredentials: false,
            });
            console.log(res.data);
            dispatch(setSearchKey(res.data));

        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    useEffect(() => {
        searchKeyApi();
    }, []);

    return (
        <div className={styles.auction_container}>
            <SearchBar />
            <div className="item-list"></div>
        </div>
    );
}

export default Auction;