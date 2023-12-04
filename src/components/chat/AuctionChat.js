import React, { useEffect, useState } from "react";
import styles from "./AuctionChat.module.css"
import Chat from "./Chat";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetter, formatTimeDifference } from "../common/utils/Utils";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ForumIcon from '@mui/icons-material/Forum';

const getChatRoom = async (setChatRooms) => {
    const url = `/chat/room/`;
    try {
        const { data } = await axios.get(url);
        const sortedData = data.sort((a, b) => {
            if (!a.latestChat && !b.latestChat) {
                // chatRoom.createdAt으로 내림차순 정렬
                const dateA = new Date(a.chatRoom.createdAt);
                const dateB = new Date(b.chatRoom.createdAt);
                return dateB - dateA;
            }
            if (!a.latestChat) {
                return -1; // a가 null이므로 a를 앞으로
            }
            if (!b.latestChat) {
                return 1;  // b가 null이므로 b를 앞으로
            }

            // 그 외 경우는 날짜를 기준으로 정렬
            const dateA = new Date(a.latestChat.createdAt);
            const dateB = new Date(b.latestChat.createdAt);

            return dateB - dateA;
        });
        console.log("chatRoom sorted : ", sortedData);
        setChatRooms(sortedData);
    } catch (error) {
        console.log(error);
    }
}


const AuctionChat = ({ cookies }) => {
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [chatRooms, setChatRooms] = useState(null);

    useEffect(() => {
        getChatRoom(setChatRooms);
    }, [])

    const handleEnterChatRoom = (trading) => {
        setSelectedChatRoom(trading);
    }

    return (
        <div className={styles.auction_chat_container}>
            <div className={styles.chat_room_container} style={{ borderRight: "1px solid #F6F6F6" }}>
                <div className={styles.chat_room_header}>
                    Chat Rooms
                </div>
                <div className={styles.chat_room_list}>
                    {chatRooms !== null ? chatRooms.map((trading) => (
                        <div className={styles.chat_room_wrapper} onClick={() => handleEnterChatRoom(trading)} key={trading.id}>
                            <div className={styles.chat_room_info}>
                                <div className={styles.item} style={{ color: `${trading.auctionItem.rarity.colorCode}` }}>
                                    {capitalizeFirstLetter(trading.auctionItem.item.name)}
                                    {trading.chatRoom.seller.id === jwtDecode(cookies.accessToken).memberId ?
                                        <span className={styles.trade_type} style={{ color: "#D32D71" }}>SELL</span>
                                        :
                                        <span className={styles.trade_type} style={{ color: "#1590C7" }}>BUY</span>}
                                </div>
                                <div className={styles.nickname}>
                                    {trading.chatRoom.seller.id === jwtDecode(cookies.accessToken).memberId ?
                                        <span>{trading.chatRoom.buyer.nickname}</span>
                                        :
                                        <span>{trading.chatRoom.seller.nickname}</span>}
                                </div>
                                {trading.latestChat ?
                                    <div className={styles.brief_content}>
                                        <div className={styles.brief_content__message}>{trading.latestChat.message}</div>
                                        <span> &nbsp;- {formatTimeDifference(trading.latestChat.createdAt)}</span>
                                    </div> :
                                    <div className={styles.brief_content}>
                                        <span>Start trading via chat</span>
                                    </div>}
                            </div>
                            {trading.auctionItem.auctionStatusType === "COMPLETED" ?
                                <div className={styles.chat_room_completed}>Completed</div> : null
                            }
                            <KeyboardArrowRightIcon className={styles.chat_room__arrow_icon} sx={{ display: "none" }} />
                        </div>
                    ))
                        :
                        <div>No ChatRooms</div>
                    }
                </div>
            </div>
            <div className={styles.auction_chat__chat}>
                {selectedChatRoom !== null ?
                    <Chat selectedChatRoom={selectedChatRoom} />
                    :
                    <div className={styles.no_selected_chat_room}>
                        <img src="https://talk.bunjang.co.kr/static/media/ic_state_empty_buntalk.13ced5e4.svg" alt="" />
                        <span>Select Chat Room</span>
                    </div>
                }
            </div>
        </div >
    );

}

export default AuctionChat;