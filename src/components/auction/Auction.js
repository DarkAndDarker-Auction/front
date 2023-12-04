import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSearchKey } from '../../features/searchKey/searchKeySlice'
import SearchBar from './searchBar/SearchBar'
import Detail from './detail/Detail';
import Sales from './sales/Sales'
import Purchases from './purchases/Purchases';
import styles from './Auction.module.css'
import SearchIcon from '@mui/icons-material/Search';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Cookies } from 'react-cookie';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Register from './register/Register';
import WishList from './wishList/WishList';

const Auction = () => {
    const dispatch = useDispatch();
    const movePage = useNavigate();
    const location = useLocation();
    const initialMount = useRef(true);

    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");

    const [slotTypes, setSlotTypes] = useState(null);
    const [options, setOptions] = useState(null);
    const [rarities, setRarities] = useState(null);
    const [items, setItems] = useState(null);
    const [curElement, setCurElement] = useState(null);

    const searchKeyApi = async () => {
        try {
            const res = await axios.get('http://localhost:8080/search-key-api/all');
            dispatch(setSearchKey(res.data))

            setSlotTypes(res.data.slotTypes);
            setRarities(res.data.rarities);
            setOptions(res.data.itemOptions);
            setItems(res.data.items);

        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (initialMount.current) {
            searchKeyApi();
            let curTabValue = sessionStorage.getItem('tabValue');
            if (!curTabValue) {
                curTabValue = "search";
            }
            const curTab = document.getElementById(curTabValue);
            setCurElement(curTab);
            curTab.style.borderBottom = "none";
            curTab.style.opacity = "1.0";
            initialMount.current = false;
        }

        const curPath = location.pathname.substring("/auction/".length);
        const element = document.getElementById(curPath);
        if (!element) {
            return;
        }
        handleTabChange(element);
    }, [location])

    const handleTabChange = (element) => {
        if (curElement) {
            curElement.style.borderBottom = "2px solid #B89971";
            curElement.style.opacity = "0.3";
        }
        element.style.borderBottom = "none";
        element.style.opacity = "1.0";
        setCurElement(element);
        sessionStorage.setItem('tabValue', element.id);
    }

    const handleSearchItems = () => {
        movePage("/auction/search");
    }

    const handleSales = () => {
        movePage("/auction/sales");
    }

    const handlePurchases = () => {
        movePage("/auction/purchases");
    }

    const handleWishList = () => {
        movePage("/auction/wishlist");
    }

    const handleRegister = () => {
        if (!accessToken) {
            movePage("/user/sign-in");
        }
        movePage("/auction/register");
    }

    return (
        <div className={styles.auction_wrapper}>
            <div className={styles.auction_tab} >
                <div className={styles.tab} id="search" onClick={handleSearchItems} label="Search Items" ><SearchIcon />&nbsp;Search Items</div>
                <div className={styles.tab} id="sales" onClick={handleSales} label="Sales Status" ><FeaturedPlayListIcon />&nbsp;&nbsp;Sales Status</div>
                <div className={styles.tab} id="purchases" onClick={handlePurchases} label="Purchases Status" ><ReceiptLongIcon />&nbsp;Purchases Status</div>
                <div className={styles.tab} id="wishlist" onClick={handleWishList} label="Wish List" ><FavoriteBorderIcon />&nbsp;Wish List</div>
                <div className={styles.tab} id="register" onClick={handleRegister} label="Register Item" ><LibraryAddIcon />&nbsp;Register Item</div>
            </div>
            <Routes>
                <Route path={"/search"} element={
                    <SearchBar slotTypes={slotTypes} options={options} rarities={rarities} items={items} />}>
                </Route>
                <Route path={"/detail/:auctionItemId"} element={<Detail />}></Route>
                <Route path={"/sales"} element={<Sales />}></Route>
                <Route path={"/purchases"} element={<Purchases />}></Route>
                <Route path={"/wishlist"} element={<WishList />}></Route>
                <Route path={"/register"} element={<Register items={items} />}></Route>
            </Routes>
        </div >
    );
}

export default Auction;