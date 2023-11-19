import React, { useEffect, useState, useRef } from 'react'
import styles from './Result.module.css'
import Alert from '../../common/Alert';
import { nonOptionProps, capitalizeFirstLetter, calculateReaminTime } from '../../common/Utils';
import { currencyTypeList } from '../../common/Utils';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

const Result = ({ pageNumber, getPageNumber, sort, getSort, searchResult, tab }) => {
    const movePage = useNavigate();

    const [auctionItems, setAuctionItems] = useState(null);
    const [wishListChanged, setWishListChanged] = useState({});
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [cookies, ,] = useCookies(["accessToken"]);

    const wishList = async () => {
        const wishListChangedArr = Object.entries(JSON.parse(sessionStorage.getItem("wishListChanged"))).map(([auctionItemId, inWishList]) => ({
            auctionItemId: parseInt(auctionItemId),
            inWishList: inWishList,
        }));
        if (wishListChangedArr.length === 0) {
            return;
        }

        const requestBody = {
            wishListChanged: wishListChangedArr
        }

        try {
            const res = await axios.post('http://localhost:8080/wishlist/batch-update',
                requestBody, {
                withCredentials: false,
            });
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    useEffect(() => {
        setAuctionItems(searchResult.auctionItems);
    }, [searchResult])

    useEffect(() => {
        return () => {
            wishList();
        }
    }, []);

    const extractOptionFromAuctionItem = (auctionItem) => {
        const auctionItemOptions = { ...auctionItem };

        nonOptionProps.forEach(prop => delete auctionItemOptions[prop]);

        return Object.entries(auctionItemOptions).map(([key, value], index) => {
            const formattedKey = capitalizeFirstLetter(key.replace(/_/g, ' '));
            return (
                <div className={styles.info_option} key={`option_${index}`}>
                    <div>-&nbsp;</div>
                    <div>
                        <div className={styles.option_value}>+{value}</div>
                        <div className={styles.option_key}>{formattedKey}</div>
                    </div>
                    <div>&nbsp;-</div>
                </div>
            );
        })
    }

    const handleSort = (event) => {
        getSort(event.target.value);
    }

    const handlePageChange = (_, value) => {
        window.scrollTo({ top: 200, behavior: 'smooth' });
        getPageNumber(value);
    }

    const handleAuctionItemDetail = (auctionItem) => {
        movePage(`../detail/${auctionItem.id}`, { state: auctionItem.id });
    }

    const handleWishList = (event, auctionItem, index) => {
        event.stopPropagation();
        const memberId = jwtDecode(cookies.accessToken).memberId;
        if (memberId === auctionItem.sellerId) {
            setIsAlertModalOpen(true);
            return;
        }

        const updatedAuctionItems = [...auctionItems];
        updatedAuctionItems[index] = {
            ...updatedAuctionItems[index],
            inWishList: !updatedAuctionItems[index].inWishList,
        };
        setAuctionItems(updatedAuctionItems);
        setWishListChanged(prev => {
            if (prev.hasOwnProperty(auctionItem.id)) {
                const { [auctionItem.id]: _, ...updatedWishList } = prev;
                return updatedWishList;
            } else {
                return { ...prev, [auctionItem.id]: !auctionItem.inWishList };
            }
        });
    }

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
    }

    useEffect(() => {
        sessionStorage.setItem("wishListChanged", JSON.stringify(wishListChanged));
    }, [wishListChanged])

    return (
        < div className={styles.result_container} >
            <div className={styles.result_header}>
                <div>
                    <span>
                        Item List&nbsp;|&nbsp;
                    </span>
                    <span className={styles.total_result}>
                        total {searchResult.total} results
                    </span>
                </div>
                <FormControl>
                    <InputLabel>sort</InputLabel>
                    <Select
                        size='small'
                        value={sort}
                        label="Age"
                        onChange={handleSort}
                        sx={{ paddingBottom: "3px", height: "32px", fontSize: "14px" }}
                    >
                        <MenuItem value={"createdAt"}>Latest</MenuItem>
                        <MenuItem value={"expirationTime"}>Expiration</MenuItem>
                        <MenuItem value={"rarity"}>Rarity</MenuItem>
                    </Select>
                </FormControl>

            </div>
            <div className={styles.result_list_container} >
                {auctionItems?.map((auctionItem, index) => (
                    <div className={`${styles.result_item} ${index % 2 === 0 ? styles.background_color1 : styles.background_color2}`} key={auctionItem.id}
                        onClick={() => handleAuctionItemDetail(auctionItem)}>
                        {tab === "search" ?
                            <div className={styles.wish_wrapper} onClick={(event) => handleWishList(event, auctionItem, index)}>
                                {auctionItem.inWishList ?
                                    <div>
                                        <FavoriteIcon sx={{ width: "15px", height: "15px", color: "#DD9A14" }} />
                                        <span>Delete Wish List</span>
                                    </div>
                                    :
                                    <div>
                                        <FavoriteBorder sx={{ width: "15px", height: "15px", color: "#DD9A14" }} />
                                        <span>Add Wish List</span>
                                    </div>
                                }
                            </div> : null}
                        <div className={styles.image_box} style={{ borderRight: "4px inset " + auctionItem.rarity.colorCode }}>
                            <img src={auctionItem.item.image} alt="" />
                        </div>
                        <div className={styles.item} id={`item_id_${auctionItem.id}`} style={{ color: auctionItem.rarity.colorCode }}>
                            <div className={styles.item_info}>
                                <div>{capitalizeFirstLetter(auctionItem.item.name)}</div>
                                {auctionItem.item.slotType ? <span>Slot Type - {auctionItem.item.slotType.name}</span> : null}
                                {auctionItem.item.handType ? <span>Hand Type - {auctionItem.item.handType.name}</span> : null}
                                {auctionItem.item.weaponType ? <span>Weapon Type - {auctionItem.item.weaponType.name}</span> : null}
                                {auctionItem.item.armorType ? <span>Armor Type - {auctionItem.item.armorType.name}</span> : null}
                            </div>
                        </div>
                        <div className={styles.option}>
                            {extractOptionFromAuctionItem(auctionItem)}
                        </div>
                        <div className={styles.detail_container}>
                            <div className={styles.detail_wrapper}>
                                <div className={styles.detail}>
                                    <div>
                                        <div className={styles.status_wrapper}>
                                            <div className={`${styles.status} ${styles.status_type}`}>
                                                {auctionItem.auctionStatusType}
                                            </div>
                                            {auctionItem.allowOffer ?
                                                <div className={`${styles.status} ${styles.allow_offer}`}>
                                                    Allow Offer
                                                </div> : null
                                            }

                                        </div>
                                        <div className={styles.price}>
                                            <span className={styles.price_title}>PRICE</span>
                                            {auctionItem.priceGold ? <div><div className={styles.price_image_box}><img src={currencyTypeList[0].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGold}</span>Gold</div></div> : null}
                                            {auctionItem.priceGoldenKey ? <div><div className={styles.price_image_box}><img src={currencyTypeList[1].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldenKey}</span>Key</div></div> : null}
                                            {auctionItem.priceGoldIngot ? <div><div className={styles.price_image_box}><img src={currencyTypeList[2].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldIngot}</span>Ingot</div></div> : null}
                                            {auctionItem.priceEventCurrency ? <div><div className={styles.price_image_box}><img src={currencyTypeList[3].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceEventCurrency}</span>Event</div></div> : null}
                                        </div>
                                    </div>
                                    <div className={styles.remain_time}>
                                        <div>Remain Time</div>
                                        <div>{calculateReaminTime(auctionItem.expirationTime)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination_wrapper}>
                <Pagination page={pageNumber + 1} count={parseInt(Math.ceil(searchResult.total / 8)) || 0} color='primary' onChange={handlePageChange} />
            </div>
            <Alert isOpen={isAlertModalOpen} onRequestClose={closeAlertModal} message={"This is not permitted for the item you registered."} />
        </ div >
    )
};

export default Result;