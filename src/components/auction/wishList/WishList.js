import React, { useEffect, useState } from "react";
import styles from "./WishList.module.css"
import axios from "axios";
import Result from "../result/Result";

const WishList = () => {
    const PAGE_SIZE = 8;

    const [pageNumber, setPageNumber] = useState(0);
    const [sort, setSort] = useState("createdAt");
    const [myWishList, setMyWishList] = useState([]);
    const [url, setUrl] = useState("/wishlist");

    useEffect(() => {
        getMyWishList();
    }, [sort]);

    useEffect(() => {
        console.log(myWishList);
    }, [myWishList])

    const getMyWishList = async () => {
        const destinationUrl = `${url}?page=${pageNumber}&size=${PAGE_SIZE}&sort=${sort}`;
        try {
            const { data } = await axios.get(destinationUrl);
            setMyWishList(data);

        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    const getPageNumber = (value) => {
        setPageNumber(value - 1);
    }

    const getSort = (sortValue) => {
        setSort(sortValue);
    }

    return (
        <div className={styles.wishlist_container}>
            <div className={styles.search_title}>Wish List</div>
            <Result getPageNumber={getPageNumber} pageNumber={pageNumber} sort={sort} getSort={getSort} searchResult={myWishList} />
        </div>
    )


}

export default WishList;