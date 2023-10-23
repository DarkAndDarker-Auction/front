import React, { useEffect, useState, useRef } from 'react'
import styles from './Result.module.css'
import { nonOptionProps, capitalizeFirstLetter } from '../../common/util';
import { useDispatch, useSelector } from 'react-redux';
import { setPageNumber } from '../../../features/searchKey/pageNumber';

const Result = () => {
    const dispatch = useDispatch();
    const isInitialMount = useRef(true);

    const [auctionItems, setAuctionItems] = useState(null);

    const pageNumber = useSelector((state) => state.pageNumber.pageNumber)
    const searchResult = useSelector((state) => state.searchResult.searchResult);

    useEffect(() => {
        if (!isInitialMount.current) {
            setAuctionItems(searchResult.auctionItems);
        }
        isInitialMount.current = false;
    }, [searchResult])

    const calculateReaminTime = (expirationTime) => {
        const currentTime = new Date();
        const expiration = new Date(expirationTime);

        const timeDifference = expiration - currentTime;

        if (timeDifference <= 0) {
            return "Auction Ended";
        }

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
    };

    const extractOptionFromAuctionItem = (auctionItem) => {
        const auctionItemOptions = { ...auctionItem };

        nonOptionProps.forEach(prop => delete auctionItemOptions[prop]);

        return Object.entries(auctionItemOptions).map(([key, value], index) => {
            const formattedKey = capitalizeFirstLetter(key.replace(/_/g, ' '));
            return (
                <div className={styles.info_option} key={`option_${index}`}>
                    <div className={styles.option_value}>+{value}</div>
                    <div className={styles.option_key}>{formattedKey}</div>
                </div>

            );
        })
    }

    const onMouseOver = (e) => {
        const info = document.getElementById(`info_${e.target.id}`);
        if (info) {
            info.style.display = "block";
            info.style.left = `${e.clientX + 170}px`; // 마우스의 X 위치에 툴팁 표시
            info.style.top = `${e.clientY - 20}px`; // 마우스의 Y 위치에 툴팁 표시
        }
    }

    const onMouseOut = (e) => {
        const info = document.getElementById(`info_${e.target.id}`);
        if (info) {
            info.style.display = "none";
        }
    }

    const handleNextPage = () => {
        if (searchResult.total !== undefined && pageNumber + 1 < Math.ceil(searchResult.total / 8)) {
            console.log(pageNumber);
            console.log(Math.ceil(searchResult.total / 8));
            dispatch(setPageNumber(pageNumber + 1));
        }
    }

    const handlePrevPage = () => {
        if (pageNumber > 0) {
            dispatch(setPageNumber(pageNumber - 1));
        }
    }

    return (
        < div className={styles.result_container} >
            <span className={styles.result_label}>RESULT</span>
            <div className={styles.result_list_container}>
                {auctionItems?.map((auctionItem) => (
                    <div div className={styles.result_item} id={`id_${auctionItem.id}`}>
                        <div className={styles.info} id={`info_item_id_${auctionItem.id}`} style={{ display: "none" }}>
                            <div className={styles.info_name}>
                                {capitalizeFirstLetter(auctionItem.item.name)}
                            </div>
                            {extractOptionFromAuctionItem(auctionItem)}
                        </div>
                        <div className={styles.remain_time}>
                            {calculateReaminTime(auctionItem.expirationTime)}
                        </div>
                        <div className={styles.item} id={`item_id_${auctionItem.id}`} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                            {capitalizeFirstLetter(auctionItem.item.name)}
                        </div>
                        <div className={styles.price}>
                            <div className={styles.priceItem}>GOLD {auctionItem.priceGold}</div>
                            <div className={styles.priceItem}>KEY {auctionItem.priceGoldenKey}</div>
                            <div className={styles.priceItem}>INGOT {auctionItem.priceGoldIngot}</div>
                            <div className={styles.priceItem}>EVENT {auctionItem.priceEventCurrency}</div>
                        </div>
                        <div className={styles.status}>
                            {auctionItem.auctionStatusType}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <div className={styles.pagination_prev} onClick={handlePrevPage}> &lt; </div>
                <div className={styles.pagination_current}>{pageNumber + 1}</div>
                /
                <div className={styles.pagination_all}>
                    {searchResult.total !== undefined ? Math.ceil(searchResult.total / 8) : 1}
                </div>
                <div className={styles.pagination_next} onClick={handleNextPage}>  &gt; </div>
            </div>
        </ div >
    )
};

export default Result;