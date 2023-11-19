import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css"
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Chat = () => {
    const [chatValue, setChatValue] = useState('');
    const chatTextareaRef = useRef(null);

    const adjustTextareaHeight = () => {
        if (chatTextareaRef.current) {
            chatTextareaRef.current.style.height = "30px";
            chatTextareaRef.current.style.height = `${chatTextareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [chatValue])

    const handleAddPhoto = () => {
        console.log("addPhoto");
    };

    return (
        <div className={styles.chat}>
            <div className={styles.chat__header}>
                <div></div>
            </div>
            <div className={styles.chat__contents}>

            </div>
            <div className={styles.chat__input}>
                <AddCircleOutlineIcon fontSize="large" onClick={handleAddPhoto} style={{ cursor: "pointer" }} />
                <div className={styles.chat__input_wrapper}>
                    <textarea ref={chatTextareaRef} onChange={(event) => setChatValue(event.target.value)} type="text" placeholder="Enter message..." />
                    <SendIcon fontSize="small" style={{ cursor: "pointer" }} />
                </div>
            </div>
        </div>
    )
}

export default Chat;