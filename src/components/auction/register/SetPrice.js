import React, { useState } from "react";
import styles from "./SetPrice.module.css"
import AddPrice from "./AddPrice";
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const SetPrice = ({ getItemPrices, allowOffer, getAllowOffer, auctionPeriod, getAuctionPeriod }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [values, setValues] = useState([]);

    const handleAllowOffer = (event) => {
        getAllowOffer(event.target.checked);
    }

    const handleAuctionPeriod = (event) => {
        getAuctionPeriod(event.target.value);
    }

    const deliverItemPrices = (currencyTypes, values) => {
        closeModal();
        setCurrencyTypes(currencyTypes);
        setValues(values);

        const itemPrices = {};
        currencyTypes.forEach((currencyType, index) => {
            itemPrices[currencyType.key] = parseInt(values[index]);
        })

        getItemPrices(itemPrices);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleAddPrice = () => {
        setIsModalOpen(true);
    }

    return (
        <div className={styles.set_price_container}>
            <div className={styles.title}>Set Price</div>
            <div className={styles.set_price}>
                <div style={{ borderRight: "1px solid #B89971" }}>
                    {currencyTypes?.map((currencyType, index) => (
                        <div className={styles.price} key={index} >

                            <div className={styles.price_wrapper}>
                                <div className={styles.img_box}>
                                    <img src={currencyType.src} alt="" />
                                </div>
                                <div className={styles.price_info}>
                                    <div className={styles.price_value}>{values[index]}</div>
                                    <div className={styles.price_type}>{currencyType.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={styles.add_price} onClick={handleAddPrice}>
                        <span>Add Your Price</span>
                        <span>+</span>
                    </div>
                    <AddPrice isOpen={isModalOpen} onRequestClose={closeModal} deliverItemPrices={deliverItemPrices} />
                </div>
                <div>
                    <div className={styles.allow_offer}>
                        <span>Allow Offer</span>
                        <div style={{ width: "120px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Switch checked={allowOffer} onChange={handleAllowOffer} color="warning" />
                            {allowOffer ? <div className={styles.onoff} style={{ color: "green" }}>on</div> : <div className={styles.onoff} style={{ color: "red" }}>off</div>}
                        </div>
                    </div>
                    <div className={styles.auction_period}>
                        <span>Auction Period</span>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">auction period</InputLabel>
                            <Select
                                size="small"
                                sx={{ width: "120px" }}
                                defaultValue={auctionPeriod}
                                value={auctionPeriod}
                                label="Auction period"
                                onChange={handleAuctionPeriod}
                            >
                                <MenuItem value={3}>3 hour</MenuItem>
                                <MenuItem value={6}>6 hour</MenuItem>
                                <MenuItem value={12}>12 hour</MenuItem>
                                <MenuItem value={24}>24 hour</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SetPrice;
