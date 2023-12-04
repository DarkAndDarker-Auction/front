import Modal from "react-modal";
import React from "react";
import styles from "./Alert.module.css"
import CloseIcon from '@mui/icons-material/Close';

const Alert = ({ isOpen, onRequestClose, message }) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            className={styles.modal}>
            <div className={styles.alert_container}>
                <div className={styles.alert_header}>
                    <span>Alert</span>
                    <CloseIcon onClick={onRequestClose} sx={{ cursor: "pointer" }} />
                </div>
                <div className={styles.alert_body}>
                    {message}
                </div>
                <div className={styles.exit_btn} onClick={onRequestClose}>OK</div>
            </div>
        </Modal>
    )
}

export default Alert;