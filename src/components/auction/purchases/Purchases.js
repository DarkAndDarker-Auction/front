import React, { useState, useEffect } from "react";
import styles from "./Purchases.module.css"
import Result from "../result/Result"
import { Tabs, Tab } from '@mui/material'
import axios from "axios";

const Purchases = () => {
    const URL_PREFIX = "purchases/";
    const PAGE_SIZE = 8;

    const [tabValue, setTabValue] = useState("total");
    const [curElement, setCurElement] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [sort, setSort] = useState("createdAt");
    const [myPurchases, setMyPurchases] = useState([]);
    const [url, setUrl] = useState("");

    useEffect(() => {
        let curTabValue = sessionStorage.getItem('purchasesTabValue');
        if (!curTabValue) {
            curTabValue = "total";
        }
        const curTab = document.getElementById("purchases_tab_" + curTabValue);
        setTabValue(curTabValue);
        setCurElement(curTab);
        curTab.style.backgroundColor = "#20212A";
        setUrl(URL_PREFIX + curTabValue);
    }, []);

    useEffect(() => {
        if (url === "") return;
        getMyPurchases();
    }, [pageNumber, url]);

    const getMyPurchases = async () => {
        const destinationUrl = `${url}?page=${pageNumber}&size=${PAGE_SIZE}&sort=${sort}`;
        console.log(destinationUrl);
        try {
            const { data } = await axios.get(destinationUrl);
            console.log(data);
            setMyPurchases(data);

        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    const handleTabChange = (event, value) => {
        if (curElement) {
            curElement.style.backgroundColor = "#847253";
        }
        event.target.style.backgroundColor = "#20212A";
        setCurElement(event.target);
        setTabValue(value);
        setUrl(URL_PREFIX + value);
        sessionStorage.setItem('purchasesTabValue', value);
    }

    const getPageNumber = (value) => {
        setPageNumber(value - 1);
    }

    const getSort = (value) => {
        setSort(value);
    }

    useEffect(() => {
        getMyPurchases();
    }, [sort]);

    return (
        <div>
            <div className={styles.search_title}>Purchases Status</div>
            <Tabs
                className={styles.auction_tab}
                value={tabValue} onChange={handleTabChange}
                TabIndicatorProps={{ style: { background: '#20212A', height: "60px", opacity: "0.5" } }}
                sx={{ height: "40px" }}
                aria-label="icon label tabs example"
            >
                <Tab className={styles.tab} id="purchases_tab_total" label="Total" value="total" />
                <Tab className={styles.tab} id="purchases_tab_trading" label="Trading" value="trading" />
                <Tab className={styles.tab} id="purchases_tab_offered" label="Your Offer" value="offered" />
                <Tab className={styles.tab} id="purchases_tab_completed" label="Completed" value="completed" />
            </Tabs>

            <Result getPageNumber={getPageNumber} pageNumber={pageNumber} sort={sort} getSort={getSort} searchResult={myPurchases} />

        </div>
    );

}

export default Purchases;