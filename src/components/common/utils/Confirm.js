import Modal from "react-modal";
import React from "react";
import styles from "./Confirm.module.css"
import CloseIcon from '@mui/icons-material/Close';

const Confirm = ({ isOpen, onRequestClose, message, confirm }) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
            className={styles.modal}>
            <div className={styles.confirm_container}>
                <div className={styles.confirm_header}>
                    <span>confirm</span>
                    <CloseIcon onClick={onRequestClose} sx={{ cursor: "pointer" }} />
                </div>
                <div className={styles.confirm_body}>
                    {message}
                </div>
                <div className={styles.btn_wrapper}>
                    <div className={styles.no_btn} onClick={onRequestClose}>No</div>
                    <div className={styles.yes_btn} onClick={confirm}>Yes</div>
                </div>
            </div>
        </Modal>
    )
}

export default Confirm;