import React, { useEffect, useState } from 'react'
import styles from './Result.module.css'
import { nonOptionProps, capitalizeFirstLetter } from '../../common/util';
import { useSelector } from 'react-redux';

const Result = () => {
    const [auctionItems, setAuctionItems] = useState(null);

    const searchResult = useSelector((state) => state.searchResult.searchResult);
    useEffect(() => {
        setAuctionItems(searchResult.auctionItems);
        console.log(searchResult.auctionItems);
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
        console.log(auctionItemOptions)
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
            info.style.left = `${e.clientX + 150}px`; // 마우스의 X 위치에 툴팁 표시
            info.style.top = `${e.clientY}px`; // 마우스의 Y 위치에 툴팁 표시
        }
    }

    const onMouseOut = (e) => {
        const info = document.getElementById(`info_${e.target.id}`);
        if (info) {
            info.style.display = "none";
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
                            {console.log(auctionItem)}
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
        </ div >
    )
};

export default Result;