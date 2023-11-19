import React from "react";
import styles from "./AuctionChat.module.css"
import Chat from "./Chat";

const AuctionChat = () => {

    return (
        <div className={styles.auction_chat_container}>
            <div className={styles.chat_room_container} style={{ borderRight: "1px solid #F6F6F6" }}>
                <div className={styles.chat_room_header}>
                    Chat Rooms
                </div>
                <div className={styles.chat_room_list}>
                    <div className={styles.chat_room_wrapper}>
                        <div className={styles.chat_room_info}>
                            <div className={styles.nickname}>EnvyW6567</div>
                            <div className={styles.breif_content}>hello where are you right now? <span> - 11 / 9</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.auction_chat__chat}>
                <Chat />
            </div>
        </div>
    );

}

export default AuctionChat;