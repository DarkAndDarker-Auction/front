import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import stylesItem from '../auction/result/Result.module.css'
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { formatLocalTimeForMessage, formatLocalDate, capitalizeFirstLetter, currencyTypeList, nonOptionProps } from "../common/utils/Utils";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { sendNotification } from "../../features/notification/SendNotification";
import Confirm from "../common/utils/Confirm";

const getMessages = async (chatRoomId, setChatMessages) => {
    const url = `/chat?chatRoomId=${chatRoomId}`;
    try {
        const { data } = await axios.get(url);
        setChatMessages(data.chatMessages);
    } catch (error) {
        console.log(error.message);
    }
}

const completeTrade = async (auctionItem, setIsCompleted, setIsCompleteConfirmModalOpen) => {
    setIsCompleteConfirmModalOpen(false);
    try {
        const requestBody = {
            auctionItemId: auctionItem.id
        }
        console.log(requestBody)
        await axios.post('/auction/complete', requestBody);
        setIsCompleted(true);
    } catch (error) {
        console.log(error.message);
    }
}

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

const Chat = ({ selectedChatRoom }) => {
    const chatContentsRef = useRef(null);
    const chatTextareaRef = useRef(null);
    const itemDetails = useRef(null);
    const movePage = useNavigate();
    const [cookies, ,] = useCookies(["accessToken", "refreshToken"]);

    const [stompClient, setStompClient] = useState(null);
    const [auctionItem, setAuctionItem] = useState(selectedChatRoom.auctionItem);
    const [chatRoom, setChatRoom] = useState(selectedChatRoom.chatRoom);
    const [isCompleted, setIsCompleted] = useState(false);
    const [receiver, setReceiver] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [itemDetailsVisible, setItemDetailsVisible] = useState(false);
    const [isCompleteConfirmModalOpen, setIsCompleteConfirmModalOpen] = useState(false);

    const adjustTextareaHeight = () => {
        if (chatTextareaRef.current) {
            chatTextareaRef.current.style.height = "30px";
            chatTextareaRef.current.style.height = `${chatTextareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputMessage])

    const handleAddPhoto = () => {
        console.log("addPhoto");
    };

    useEffect(() => {
        setAuctionItem(selectedChatRoom.auctionItem);
        setChatRoom(selectedChatRoom.chatRoom);
        if (selectedChatRoom.chatRoom.seller.id !== jwtDecode(cookies.accessToken)) {
            setReceiver(selectedChatRoom.chatRoom.seller);
        }
        setReceiver(selectedChatRoom.chatRoom.buyer);
        setIsCompleted(selectedChatRoom.auctionItem.auctionStatusType === "COMPLETED" ? true : false);
        console.log(selectedChatRoom.auctionItem.auctionStatusType);
    });

    useEffect(() => {
        // WebSocket 연결 설정
        const socket = new SockJS('http://localhost:8080/ws'); // WebSocket 서버 엔드포인트
        const stomp = Stomp.over(socket);
        const subEndPoint = `/sub/chat/${chatRoom.id}`;

        getMessages(chatRoom.id, setChatMessages);

        stomp.connect({}, (frame) => {
            setStompClient(stomp);

            stomp.subscribe(subEndPoint, (message) => {
                console.log("subscribed message received");
                const receivedMessage = JSON.parse(message.body);
                setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
            });
        });

        // 컴포넌트 언마운트 시 WebSocket 연결 해제 
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [chatRoom]);

    useEffect(() => {
        chatContentsRef.current.scrollTop = chatContentsRef.current.scrollHeight;
    }, [chatMessages]);

    const sendMessage = async (message) => {
        const sendMessage = {
            chatRoomId: chatRoom.id,
            senderId: jwtDecode(cookies.accessToken).memberId,
            message: message
        }
        if (stompClient && message.trim() !== '') {
            const pubEndPoint = `/pub/send`;
            stompClient.send(pubEndPoint, {}, JSON.stringify(sendMessage));
            await sendNotification(receiver.id, receiver.nickname, message, auctionItem.id, "NEW_MESSAGE", chatRoom.id)
        }
    };

    const handleMessageDate = (time, index) => {
        const date = formatLocalDate(new Date(time));
        if (index === 0) {
            return (
                <div className={styles.date_divider}>
                    {date}
                </div>
            )
        }

        const prevDate = formatLocalDate(new Date(chatMessages[index - 1].createdAt));
        if (prevDate !== date) {
            return (
                <div className={styles.date_divider}>
                    {date}
                </div>
            )
        }
        return null;
    }

    const handleMessageTime = (time, index) => {
        if (index === chatMessages.length - 1) {
            return formatLocalTimeForMessage(time);
        }
        if (chatMessages[index].senderId !== chatMessages[index + 1].senderId) {
            return formatLocalTimeForMessage(time);
        }
        if (formatLocalTimeForMessage(chatMessages[index].createdAt) !== formatLocalTimeForMessage(chatMessages[index + 1].createdAt)) {
            return formatLocalTimeForMessage(time)
        }
        return null;
    }

    const handleItemDetails = (event) => {
        setItemDetailsVisible(true);
        const rect = event.currentTarget.getBoundingClientRect();
        itemDetails.current.style.left = `${event.clientX - rect.left + 20}px`;
        itemDetails.current.style.top = `${event.clientY - rect.top + 20}px`;
    }

    const handleCompleteTrade = async () => {
        setIsCompleteConfirmModalOpen(true);
    }

    const isEnter = (event) => {
        if (event.nativeEvent.isComposing) {
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            console.log(event.target.value);
            if (event.target.value === "") {
                return;
            }
            sendMessage(event.target.value);
            event.target.value = null;
            adjustTextareaHeight();
        }
    }

    const closeCompleteConfirmModal = () => {
        setIsCompleteConfirmModalOpen(false);
    }
    return (
        <>
            {chatRoom !== null && chatRoom !== null ?
                <div className={styles.chat}>
                    <div className={styles.chat__header}>
                        <div className={styles.chat__header__item_info}
                            onMouseEnter={handleItemDetails}
                            onMouseLeave={() => setItemDetailsVisible(false)}
                            onClick={() => movePage(`/auction/detail/${auctionItem.id}`)}
                        >
                            <div className={styles.item_info__image} style={{ borderRight: `4px solid ${auctionItem.rarity.colorCode}` }}>
                                <img src={`${auctionItem.item.image}`} alt="" />
                            </div>
                            <div className={styles.item_info_wrapper}>
                                <div className={styles.item_info__item_name} style={{ color: `${auctionItem.rarity.colorCode}` }}>
                                    <div className={styles.item_price}>
                                        {auctionItem.priceGold ? <div><div className={styles.price_image_box}><img src={currencyTypeList[0].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGold}</span>Gold</div></div> : null}
                                        {auctionItem.priceGoldenKey ? <div><div className={styles.price_image_box}><img src={currencyTypeList[1].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldenKey}</span>Key</div></div> : null}
                                        {auctionItem.priceGoldIngot ? <div><div className={styles.price_image_box}><img src={currencyTypeList[2].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceGoldIngot}</span>Ingot</div></div> : null}
                                        {auctionItem.priceEventCurrency ? <div><div className={styles.price_image_box}><img src={currencyTypeList[3].src} alt="" /></div><div className={styles.item_price_wrapper}><span>{auctionItem.priceEventCurrency}</span>Event</div></div> : null}
                                    </div>
                                    {capitalizeFirstLetter(auctionItem.item.name)}
                                </div>
                            </div>
                        </div>
                        {jwtDecode(cookies.accessToken).memberId !== auctionItem.seller ?
                            <>
                                {!isCompleted ?
                                    <>
                                        {
                                            jwtDecode(cookies.accessToken).memberId === chatRoom.buyer.id ?
                                                <div className={styles.chat__header__btn_wrapper}>
                                                    <Tooltip title="Be sure to click when the transaction is complete." placement='top' className={styles.btn__tooltip}>
                                                        <div className={`${styles.btn} ${styles.complete_trade_btn}`} onClick={handleCompleteTrade}>
                                                            <CheckIcon fontSize="small" /> <span style={{ marginLeft: "10px" }}>Complete Trade</span>
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip title="You may incur a penalty if you cancel a transaction." placement='bottom' className={styles.btn__tooltip}>
                                                        <div className={`${styles.btn} ${styles.cancel_trade_btn}`}>
                                                            <CloseIcon fontSize="small" /> <span>Cancel Trade</span>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                : null
                                        }
                                    </>
                                    :
                                    <div className={styles.chat__header__trade_completed}>Trade Completed</div>
                                }
                            </> : null
                        }


                        <div className={styles.item_details} style={{ display: itemDetailsVisible ? 'block' : 'none' }} ref={itemDetails}>
                            <div className={styles.item_details__name}
                                style={{
                                    color: `${auctionItem.rarity.colorCode}`,
                                    background: `linear-gradient(to bottom, ${auctionItem.rarity.colorCode}, #FAFAFA)`
                                }}>
                                {capitalizeFirstLetter(auctionItem.item.name)}
                            </div>
                            <div className={styles.item_details__option_wrapper}>
                                {extractOptionFromAuctionItem(auctionItem)}
                            </div>
                        </div>
                    </div>
                    <div className={styles.chat__contents} ref={chatContentsRef} >
                        {chatMessages.length !== 0 ? chatMessages?.map((chatMessage, index) => (
                            <div key={chatMessage.id} >
                                {handleMessageDate(chatMessage.createdAt, index)}
                                {chatMessage.senderId === jwtDecode(cookies.accessToken).memberId ?
                                    <div className={`${styles.chat_message_wrapper} ${styles.right}`} >
                                        <div className={styles.time}>{handleMessageTime(chatMessage.createdAt, index)}</div>
                                        <div className={styles.message}>{chatMessage.message}</div>
                                    </div>
                                    :
                                    <div className={`${styles.chat_message_wrapper} ${styles.left}`} >
                                        <div className={styles.message}>{chatMessage.message}</div>
                                        <div className={styles.time}>{handleMessageTime(chatMessage.createdAt, index)}</div>
                                    </div>}

                            </div>
                        )) :
                            <div className={styles.no_chat}>
                                <span>Start Trading Via Chat</span>
                                <span><ArrowDownwardIcon /></span>
                            </div>}
                    </div>
                    <div className={styles.chat__input}>
                        <AddCircleOutlineIcon fontSize="large" onClick={handleAddPhoto} style={{ cursor: "pointer" }} />
                        <div className={styles.chat__input_wrapper}>
                            <textarea ref={chatTextareaRef} type="text" placeholder="Enter message..."
                                onKeyDown={(event) => isEnter(event)}
                                onChange={(event) => setInputMessage(event.target.value)} />
                            <SendIcon fontSize="small" style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                </div >
                : null
            }
            <Confirm isOpen={isCompleteConfirmModalOpen}
                onRequestClose={closeCompleteConfirmModal}
                confirm={() => completeTrade(auctionItem, setIsCompleted, setIsCompleteConfirmModalOpen)}
                message={"Are you sure you complete the trade?"} />
        </>
    )
}

export default Chat;