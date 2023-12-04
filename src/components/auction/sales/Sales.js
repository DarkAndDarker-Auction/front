import React, { useState, useEffect, useRef } from "react";
import styles from "./Sales.module.css"
import Result from "../result/Result"
import { Tabs, Tab } from '@mui/material'
import axios from "axios";

const Sales = () => {
    const URL_PREFIX = "sales/";
    const PAGE_SIZE = 8;
    const initialMount = useRef(true);

    const [tabValue, setTabValue] = useState("total");
    const [curElement, setCurElement] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [sort, setSort] = useState("createdAt");
    const [mySales, setMySales] = useState([]);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (initialMount.current) {
            let curTabValue = sessionStorage.getItem('salesTabValue');
            if (!curTabValue) {
                curTabValue = "total";
            }
            const curTab = document.getElementById("sales_tab_" + curTabValue);
            setTabValue(curTabValue);
            setCurElement(curTab);
            curTab.style.backgroundColor = "#20212A";
            setUrl(URL_PREFIX + curTabValue);
            initialMount.current = false;
        }
        getMySales();
    }, [pageNumber, sort, url]);

    const getMySales = async () => {
        if (!url) {
            return;
        }
        const destinationUrl = `${url}?page=${pageNumber}&size=${PAGE_SIZE}&sort=${sort}`;
        try {
            const res = await axios.get(destinationUrl);
            setMySales(res.data);
            return true;

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
        sessionStorage.setItem('salesTabValue', value);
    }

    const getPageNumber = (value) => {
        setPageNumber(value - 1);
    }

    const getSort = (value) => {
        setSort(value);
    }

    return (
        <div>
            <div className={styles.search_title}>Sales Status</div>
            <Tabs
                className={styles.auction_tab}
                value={tabValue} onChange={handleTabChange}
                TabIndicatorProps={{ style: { background: '#20212A', height: "60px", opacity: "0.5" } }}
                sx={{ height: "40px" }}
                aria-label="icon label tabs example"
            >
                <Tab className={styles.tab} id="sales_tab_total" label="Total" value="total" />
                <Tab className={styles.tab} id="sales_tab_on-sale" label="On Sale" value="on-sale" />
                <Tab className={styles.tab} id="sales_tab_trading" label="Trading" value="trading" />
                <Tab className={styles.tab} id="sales_tab_sold-out" label="Sold Out" value="sold-out" />
            </Tabs>

            <Result getPageNumber={getPageNumber} pageNumber={pageNumber} sort={sort} getSort={getSort} searchResult={mySales} />

        </div>
    );

}

export default Sales;