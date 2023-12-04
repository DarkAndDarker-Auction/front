import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Detail.module.css'
import stylesItem from '../result/Result.module.css'
import { calculateReaminTime, capitalizeFirstLetter, currencyTypeList, formatLocalTime, nonOptionProps } from '../../common/utils/Utils';
import axios from 'axios';
import { formatTimeDifference } from '../../common/utils/Utils';
import { useCookies } from 'react-cookie'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Alert from '../../common/utils/Alert';
import Confirm from '../../common//utils/Confirm';
import AddPrice from '../register/AddPrice';
import { jwtDecode } from 'jwt-decode';
import { NEW_OFFER_NOTIFICATION_BODY, NEW_OFFER_NOTIFICATION_TITLE, OFFER_CONFIRMED_NOTIFICATION_BODY, OFFER_CONFIRMED_NOTIFICATION_TITLE, SOLD_OUT_NOTIFICATION, SOLD_OUT_NOTIFICATION_BODY, SOLD_OUT_NOTIFICATION_TITLE, sendNotification } from '../../../features/notification/SendNotification';

const Detail = () => {
    const lodash = require('lodash');
    const movePage = useNavigate();

    const [isBuyNowConfirmModalOpen, setIsBuyNowConfirmModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferConfirmModalOpen, setIsOfferConfirmModalOpen] = useState(false);
    const [isConfirmOfferConfirmModalOpen, setIsConfirmOfferConfirmModalOpen] = useState(false);
    const [isDeleteOfferConfirmModalOpen, setIsDeleteOfferConfirmModalOpen] = useState(false);

    const [itemPriceSet, setItemPriceSet] = useState({});
    const [offerState, setOfferState] = useState(null);
    const [auctionItem, setAuctionItem] = useState(null);
    const [sellerNickname, setSellerNickname] = useState("");

    const [cookies, ,] = useCookies(["accessToken"]);
    const { auctionItemId } = useParams();

    const extractOptionFromAuctionItem = (auctionItem) => {
        const auctionItemOptions = { ...auctionItem };

        nonOptionProps.forEach(prop => delete auctionItemOptions[prop]);

        return Object.entries(auctionItemOptions).map(([key, value], index) => {
            const optionName = capitalizeFirstLetter(key.replace(/_/g, ' '));
            return (
                <div className={styles.info_option} key={`option_${index}`}>
                    <div>-&nbsp;</div>
                    <div>
                        <div className={stylesItem.option_value}>+{value}</div>
                        <div className={stylesItem.option_key}>{optionName}</div>
                    </div>
                    <div>&nbsp;-</div>
                </div>
            );
        })
    }

    useEffect(() => {
        getAuctionItem(auctionItemId);
        return (() => {
            if (sessionStorage.getItem("wishList") !== sessionStorage.getItem("auctionItem").inWishList) {
                wishList();
            }
        })
    }, [auctionItemId])

    const getAuctionItem = async (auctionItemId) => {
        try {
            const res = await axios.get('http://localhost:8080/auction/detail/?auctionItemId=' + auctionItemId, {
                withCredentials: false,
            });
            console.log(res.data);
            setAuctionItem(res.data.auctionItem);
            setSellerNickname(res.data.sellerNickname);
            sessionStorage.setItem("wishList", res.data.auctionItem.inWishList);
            console.log(sessionStorage.getItem("wishList"));
            sessionStorage.setItem("auctionItem", JSON.stringify(res.data.auctionItem));

        } catch (error) {
            console.log(error.message);
        }
    }

    const buyNow = async () => {
        setIsBuyNowConfirmModalOpen(false);
        const url = '/auction/buy';
        const requestBody = {
            auctionItemId: auctionItem.id,
            itemPriceSet: {
                priceGold: auctionItem.priceGold,
                priceGoldenKey: auctionItem.priceGoldenKey,
                priceGoldIngot: auctionItem.priceGoldIngot,
                priceEventCurrency: auctionItem.priceEventCurrency
            }
        }
        try {
            const res = await axios.post(url, requestBody);
            await sendNotification(auctionItem.sellerId, SOLD_OUT_NOTIFICATION_TITLE, SOLD_OUT_NOTIFICATION_BODY,
                auctionItem.id, "BUY_REQUESTED", null);
        } catch (error) {
            closeBuyNowConfirmModal();
            setIsAlertModalOpen(true);
            console.log(error.message);
        }
    }

    const offer = async () => {
        setIsOfferModalOpen(false);
        setIsOfferConfirmModalOpen(false);
        const url = 'auction/offer';
        const requestBody = {
            itemPriceSet: itemPriceSet,
            auctionItemId: auctionItem.id
        }
        try {
            await axios.post(url, requestBody);
            await sendNotification(auctionItem.sellerId, NEW_OFFER_NOTIFICATION_TITLE, NEW_OFFER_NOTIFICATION_BODY,
                auctionItem.id, "OFFER_REQUESTED", null);
            window.location.reload();

        } catch (error) {
            closeOfferConfirmModal();
            setIsAlertModalOpen(true);
            console.log(error.message);
        }
    }

    const wishList = async () => {
        const url = `wishlist/${sessionStorage.getItem("wishList") === "true" ? 'add' : 'delete'}`;

        const requestBody = {
            auctionItemId: JSON.parse(sessionStorage.getItem("auctionItem")).id
        }
        try {
            await axios.post(url, requestBody);
        } catch (error) {
            console.log(error.message);
        }
    }

    const confirmOffer = async () => {
        setIsConfirmOfferConfirmModalOpen(false);
        const url = 'auction/offer/confirm';
        const requestBody = { offerId: offerState.id }
        try {
            await axios.post(url, requestBody);
            await sendNotification(offerState.memberId, OFFER_CONFIRMED_NOTIFICATION_TITLE, OFFER_CONFIRMED_NOTIFICATION_BODY,
                auctionItemId, "OFFER_CONFIRMED", null);
        } catch (error) {
            console.log(error.message);
        }
    }

    const deleteAuctionItem = async () => {
        const url = 'auction/delete';
        const requestBody = { auctionItemId: auctionItem.id }
        try {
            await axios.post(url, requestBody);
            movePage(-1);
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteOffer = async () => {
        const url = 'auction/offer/delete';
        const requestBody = { offerId: offerState.id }
        try {
            await axios.post(url, requestBody);
            window.location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleWishList = () => {
        const memberId = jwtDecode(cookies.accessToken).memberId;
        if (memberId === auctionItem.sellerId) {
            setIsAlertModalOpen(true);
            return;
        }
        const updatedAuctionItem = lodash.clone(auctionItem);
        updatedAuctionItem.inWishList = !auctionItem.inWishList;
        setAuctionItem(updatedAuctionItem);
        sessionStorage.setItem("wishList", updatedAuctionItem.inWishList);
        console.log(updatedAuctionItem.inWishList);
    }

    const deliverItemPrices = (currencyTypes, values) => {
        const itemPrices = {};
        currencyTypes.forEach((currencyType, index) => {
            itemPrices[currencyType.key] = parseInt(values[index]);
        })
        setItemPriceSet(itemPrices);
        setIsOfferConfirmModalOpen(true);
    }

    const handleConfirmOffer = (offer) => {
        setOfferState(offer);
        setIsConfirmOfferConfirmModalOpen(true);
    }

    const handleDeleteOffer = (offer) => {
        setOfferState(offer);
        setIsDeleteOfferConfirmModalOpen(true);
    }

    const closeOfferConfirmModal = () => {
        setIsOfferConfirmModalOpen(false);
    }

    const closeBuyNowConfirmModal = () => {
        setIsBuyNowConfirmModalOpen(false);
    }

    const closeConfirmOfferConfirmModal = () => {
        setIsConfirmOfferConfirmModalOpen(false);
    }

    const closeDeleteOfferConfirmModal = () => {
        setIsDeleteOfferConfirmModalOpen(false);
    }

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
    }

    return (
        <>
            {auctionItem !== null ?
                <div className={styles.detail_container}>
                    <div className={styles.header}>
                        <div className={styles.item_name} style={{ color: auctionItem.rarity.colorCode }}>
                            {capitalizeFirstLetter(auctionItem.item.name)}
                            &nbsp; | &nbsp;
                            <div className={styles.rarity}>{auctionItem.rarity.name}</div>
                        </div>
                        <div>
                            {auctionItem.inWishList ?
                                <Tooltip title="Remove Wish List" placement='top'>
                                    <div className={`${styles.header__btn} ${styles.wish_list}`} onClick={handleWishList}>
                                        <FavoriteIcon sx={{ color: "#DD9A14" }} />
                                    </div>
                                </Tooltip>
                                :
                                <Tooltip title='Add Wish List' placement='top'>
                                    <div className={`${styles.header__btn} ${styles.wish_list}`} onClick={handleWishList}>
                                        <FavoriteBorderIcon sx={{ color: "#DD9A14" }} />
                                    </div>
                                </Tooltip>
                            }
                            {auctionItem.sellerId === jwtDecode(cookies.accessToken).memberId ?
                                <div>
                                    <Tooltip title='Delete Auction Item' placement='top'>
                                        <div className={`${styles.header__btn} ${styles.delete}`} onClick={deleteAuctionItem}>
                                            <CloseIcon sx={{ color: "red" }} />
                                        </div>
                                    </Tooltip>
                                </div> : null
                            }
                        </div>
                    </div>
                    <div className={styles.details_wrapper}>
                        <div className={styles.details}>
                            <div className={styles.auction_details}>
                                <div className={styles.time_wrapper}>
                                    <span>Registered At</span>
                                    <span>Remain Time</span>
                                </div>
                                <div className={styles.time_wrapper}>
                                    <span>{formatLocalTime(auctionItem.createdAt)}</span>
                                    <span>{calculateReaminTime(auctionItem.expirationTime)}</span>
                                </div>
                            </div>
                            <div className={styles.item_details}>
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
                            </div>

                            <span className={styles.offers_title}>OFFERS</span>
                            <div className={styles.offers_container}>
                                <div className={styles.offers_wrapper}>
                                    {auctionItem.offers !== null && auctionItem.offers.length !== 0 ? auctionItem?.offers.map((offer) => (
                                        <div className={styles.offer} key={offer.id}>
                                            <div className={styles.offer_time}>
                                                ·&nbsp;&nbsp;{formatTimeDifference(offer.offeredAt)}
                                            </div>
                                            {offer.memberId === jwtDecode(cookies.accessToken).memberId ?
                                                <div className={styles.my_offer}>
                                                    My Offer
                                                </div> : null
                                            }
                                            <div className={styles.offer_price}>
                                                {offer.priceGold ? <div><span>{offer.priceGold}</span> Gold</div> : null}
                                                {offer.priceGoldenKey ? <div><span>{offer.priceGoldenKey}</span> Golden Key</div> : null}
                                                {offer.priceGoldIngot ? <div><span>{offer.priceGoldIngot}</span> Gold Ingot</div> : null}
                                                {offer.priceEventCurrency ? <div><span>{offer.priceEventCurrency}</span> Event Currency</div> : null}
                                                {auctionItem.sellerId === jwtDecode(cookies.accessToken).memberId ?
                                                    <div className={`${styles.offer_price__btn} ${styles.btn__confirm_offer}`} onClick={() => handleConfirmOffer(offer)}>
                                                        Confirm
                                                    </div> : null
                                                }
                                                {offer.memberId === jwtDecode(cookies.accessToken).memberId ?
                                                    <div className={`${styles.offer_price__btn} ${styles.btn__delete_offer}`} onClick={() => handleDeleteOffer(offer)}>
                                                        Cancel
                                                    </div> : null
                                                }
                                            </div>
                                        </div>
                                    )) :
                                        <div className={styles.no_offers}>
                                            {auctionItem.allowOffer ?
                                                <span>No Offers</span>
                                                :
                                                <span>Not Allowed</span>
                                            }
                                        </div>}
                                </div>
                            </div>
                        </div>
                        <div className={styles.details_side_container}>
                            <div className={styles.seller_profile}>
                                <span>Seller</span>
                                <span>{sellerNickname}</span>
                            </div>
                            <div className={styles.item_price}>
                                <div className={styles.item_price_title}>Price</div>
                                {auctionItem.priceGold ? <div><div className={styles.price_image_box}><img src={currencyTypeList[0].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGold}</span>Gold</div></div> : null}
                                {auctionItem.priceGoldenKey ? <div><div className={styles.price_image_box}><img src={currencyTypeList[1].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldenKey}</span>Key</div></div> : null}
                                {auctionItem.priceGoldIngot ? <div><div className={styles.price_image_box}><img src={currencyTypeList[2].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldIngot}</span>Ingot</div></div> : null}
                                {auctionItem.priceEventCurrency ? <div><div className={styles.price_image_box}><img src={currencyTypeList[3].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceEventCurrency}</span>Event</div></div> : null}
                            </div>
                            {auctionItem.auctionStatusType !== "COMPLETED" ?
                                <>
                                    {auctionItem.auctionStatusType !== "TRADING" ?
                                        <>
                                            <div className={styles.buy_btn} onClick={() => setIsBuyNowConfirmModalOpen(true)}>BUY NOW</div>
                                            {auctionItem.allowOffer ?
                                                <div className={styles.offer_btn} onClick={() => setIsOfferModalOpen(true)}> OFFER</div>
                                                : null}
                                        </>
                                        : <div className={styles.chat_btn} onClick={() => movePage('/auction-chat')}>
                                            Chat
                                        </div>}
                                </>
                                : <div className={styles.completed}>
                                    Completed
                                </div>
                            }


                        </div>
                    </div>
                    <AddPrice isOpen={isOfferModalOpen} onRequestClose={() => setIsOfferModalOpen(false)} deliverItemPrices={deliverItemPrices} />
                    <Confirm isOpen={isBuyNowConfirmModalOpen} onRequestClose={closeBuyNowConfirmModal} confirm={buyNow} message={"Are you sure you want to buy it?"} />
                    <Confirm isOpen={isOfferConfirmModalOpen} onRequestClose={closeOfferConfirmModal} confirm={offer} message={"Are you sure you want to offer it?"} />
                    <Confirm isOpen={isConfirmOfferConfirmModalOpen} onRequestClose={closeConfirmOfferConfirmModal} confirm={confirmOffer} message={"Are you sure you want to confirm offer?"} />
                    <Confirm isOpen={isDeleteOfferConfirmModalOpen} onRequestClose={closeDeleteOfferConfirmModal} confirm={deleteOffer} message={"Are you sure you want to delete offer?"} />
                    <Alert isOpen={isAlertModalOpen} onRequestClose={closeAlertModal} message={"This is not permitted for the item you registered."} />
                </div >
                : null
            }
        </>
    );

};

export default Detail;
