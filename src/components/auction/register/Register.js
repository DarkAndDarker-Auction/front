import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import styles from './Register.module.css'
import stylesItem from '../result/Result.module.css'
import { Autocomplete, TextField } from '@mui/material';
import { capitalizeFirstLetter } from '../../common/utils/Utils';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import AddOption from './AddOption';
import SetPrice from './SetPrice';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const movePage = useNavigate();

    const searchKeyItems = useSelector((state) => state.searchKey.searchKey.items);
    const searchKeyRarities = useSelector((state) => state.searchKey.searchKey.rarities);
    const searchKeyItemOptions = useSelector((state) => state.searchKey.searchKey.itemOptions);

    const [item, setItem] = useState(null);
    const [itemRarity, setItemRarity] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemOptions, setItemOptions] = useState([]);
    const [itemPrices, setItemPrices] = useState([]);
    const [allowOffer, setAllowOffer] = useState(true);
    const [auctionPeriod, setAuctionPeriod] = useState(12);


    const [priceStep, setPriceStep] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);


    const register = async () => {

        const requestBody = {
            itemId: item.id,
            rarityId: itemRarity.id,
            itemOptions: itemOptions,
            itemPriceSet: itemPrices,
            auctionPeriod: auctionPeriod,
            allowOffer: allowOffer
        };

        try {
            const res = await axios.post('http://localhost:8080/auction/register',
                requestBody, {
                withCredentials: false,
            });
            const auctionItem = res.data.auctionItem;
            movePage("/auction/detail/" + auctionItem.id, { state: auctionItem });

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const handleAddOption = () => {
        setIsModalOpen(true);
    }

    const handleItemRarity = (_, value) => {
        const element = document.querySelector(`.${styles.item_rarity} input`);
        element.style.setProperty('color', value.colorCode, 'important');
        setItemRarity(value);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getItemOptions = (options) => {
        setItemOptions(options);
    }

    const getItemPrices = (prices) => {
        setItemPrices(prices);
    }

    const getAllowOffer = (value) => {
        console.log(value);
        setAllowOffer(value);
    }

    const getAuctionPeriod = (value) => {
        setAuctionPeriod(value);
    }

    return (
        <div className={styles.register_container}>
            <div className={styles.register_title}>Register Item</div>
            <div className={styles.item_wrapper}>
                <div className={styles.item_name_wrapper}>
                    <div className={styles.item_name}>
                        <div className={styles.title}>Item Name</div>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={searchKeyItems}
                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                            onChange={(_, value) => setItem(value)}
                            sx={{ width: "100%" }}
                            renderInput={(params) => <TextField {...params} label="Item Name" />}
                        />
                    </div>
                </div >
                <div className={styles.item_rarity_wrapper}>
                    <div className={styles.item_rarity}>
                        <div className={styles.title}>Rarity</div>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={searchKeyRarities}
                            value={itemRarity ? searchKeyRarities.find(rarity => rarity.name === itemRarity.name) || null : null}
                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                            onChange={handleItemRarity}
                            sx={{ width: "100%" }}
                            renderInput={(params) => <TextField {...params} label="Item Rarity" />}
                            renderOption={(props, option) => {
                                const { name, colorCode } = option;
                                return (
                                    <div {...props} style={{ color: colorCode }}>
                                        {capitalizeFirstLetter(name)}
                                    </div>
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
            {itemRarity == null || item == null ?
                <div className={styles.fill_above_wrapper} >
                    <div className={styles.fill_above}>Fill Above</div>
                    <KeyboardDoubleArrowDownIcon />
                </div>
                : null}
            {itemRarity !== null && item !== null ?
                <div className={styles.item_details_wrapper}>
                    <div className={styles.title}>Item Details</div>
                    <div className={styles.details_header}>
                        <span>Fill Item Details</span>
                        <div>Previous Step &nbsp;<KeyboardDoubleArrowUpIcon /></div>
                    </div>
                    <div className={styles.item_details}>
                        <div className={styles.item_image}>
                            <img src={item.image} alt="" />
                        </div>
                        <div className={styles.item_info}>
                            <div>{capitalizeFirstLetter(item.name)}&nbsp;|&nbsp;
                                <span style={{ color: itemRarity.colorCode }}>{itemRarity !== null ? capitalizeFirstLetter(itemRarity.name) : null}</span></div>
                            <div className={styles.info_type_wrapper}>
                                {item.slotType ? <span><span className={styles.info_type}>{capitalizeFirstLetter(item.slotType.name)}</span></span> : null}
                                {item.handType ? <span><span className={styles.info_type}>{capitalizeFirstLetter(item.handType.name)}</span></span> : null}
                                {item.weaponType ? <span><span className={styles.info_type}>{capitalizeFirstLetter(item.weaponType.name)}</span></span> : null}
                                {item.armorType ? <span><span className={styles.info_type}>{capitalizeFirstLetter(item.armorType.name)}</span></span> : null}
                            </div>
                        </div>
                        <div className={styles.item_options}>
                            <div className={styles.options}>
                                {Object.entries(itemOptions).map(([key, value], index) => (
                                    <div className={styles.option_wrapper} key={`option_${index}`}>
                                        <div>-&nbsp;</div>
                                        <div>
                                            <div className={stylesItem.option_value}>+{value}</div>
                                            <div className={stylesItem.option_key}>{capitalizeFirstLetter(key)}</div>
                                        </div>
                                        <div>&nbsp;-</div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.add_option} onClick={handleAddOption}><span> Add New Option</span><span>+</span></div>
                            <AddOption searchKeyItemOptions={searchKeyItemOptions} isOpen={isModalOpen} onRequestClose={closeModal} getItemOptions={getItemOptions} />
                        </div>
                    </div>
                    <div className={styles.price_step_btn} onClick={() => setPriceStep(true)}> <KeyboardDoubleArrowDownIcon sx={{ height: "20px" }} />Set Your Price</div>
                </div>
                : null}
            {priceStep ?
                <div>
                    <SetPrice getItemPrices={getItemPrices} allowOffer={allowOffer} getAllowOffer={getAllowOffer} auctionPeriod={auctionPeriod} getAuctionPeriod={getAuctionPeriod} />
                    <div className={styles.terms}>
                        <span>* When registering an item for sale, you must register the item you own, and if there is a buyer, you must hand it over.</span>
                        <span>* If you cannot contact the buyer for a long time or refuse to hand over the item, you may be subject to sanctions for using the site.</span>
                        <span>* If you register an item that cannot exist or a false item, you may be subject to sanctions from using the site.</span>
                        <FormControlLabel required control={
                            <Checkbox checked={termsChecked} onChange={(event) => setTermsChecked(event.target.checked)} />
                        } label={(
                            <div>
                                <span style={{ color: "red", fontSize: "18px", paddingRight: "10px" }}>REQUIRED</span>
                                <span>I have read and understand the above instructions and agree to how to proceed</span>
                            </div>
                        )} color='error' sx={{ color: "red", marginTop: "10px" }} />
                    </div>
                    <button className={styles.register_btn} onClick={register} disabled={!termsChecked}>
                        REGISTER
                    </button>
                </div>
                : null}
        </div>
    );
};

export default Register;
