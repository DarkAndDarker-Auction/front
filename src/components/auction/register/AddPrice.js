import React, { useEffect, useState } from "react";
import styles from "./AddPrice.module.css"
import { Autocomplete, TextField } from "@mui/material";
import Modal from 'react-modal';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import { currencyTypeList } from "../../common/utils/Utils";
import Alert from "../../common/utils/Alert";

const AddPrice = ({ isOpen, onRequestClose, deliverItemPrices }) => {

    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [values, setValues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialMount, setInitialMount] = useState(true);

    useEffect(() => {
        if (initialMount) {
            setInitialMount(false);
            return;
        }
        if (currencyTypes.length === 0 || values.length === 0) {
            setIsModalOpen(true);
            return;
        }
        deliverItemPrices(currencyTypes, values);
    }, [values])

    const handleCurrencyType = (_, value) => {
        if (value === null) return;
        const currencyTypeArr = [...currencyTypes, value];
        setCurrencyTypes(currencyTypeArr);
    }

    const handleRemoveCurrencyType = (currencyType) => {
        const updatedCurrencyTypes = currencyTypes.filter(type => type !== currencyType);
        if (updatedCurrencyTypes === null) {
            setCurrencyTypes([]);
        }
        setCurrencyTypes(updatedCurrencyTypes);
    }

    const handleAddPrice = () => {
        const priceValues = document.querySelectorAll(`.${styles.price_value}`);
        let valueValidation = true;
        priceValues.forEach((optionValue) => {
            if (optionValue.value === '') {
                setIsModalOpen(true);
                valueValidation = false;
            }
        })
        if (valueValidation) {
            setValues(Array.from(priceValues).map(option => option.value));
        }
    }

    const handleCancel = () => {
        onRequestClose();
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
            className={styles.modal}>
            <div className={styles.header}>
                Add Prices
            </div>
            <Autocomplete
                id="combo-box-demo"
                options={currencyTypeList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionDisabled={(option) => currencyTypes.includes(option)}
                onChange={handleCurrencyType}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Currency Type" placeholder="Select Currency Type" />}
            />
            <div className={styles.item_price_container}>
                {currencyTypes.length === 0 ? <div className={styles.empty_options}>
                    <ArrowUpwardIcon sx={{ height: "18px" }} />Please select an option from above
                </div> : null}
                {currencyTypes.length !== 0 ? currencyTypes?.map((currencyType, index) => (
                    <div className={styles.price_wrapper} key={currencyType.key}>
                        <div className={styles.price_input_wrapper_wrapper}>
                            <div className={styles.price_input_wrapper}>
                                <div className={styles.img_box}>
                                    <img src={currencyType.src} alt="" />
                                </div>
                                <input className={styles.price_value} type="text" defaultValue={values[index]} placeholder="Price" />
                                <span>{currencyType.name}</span>
                            </div>
                            <span onClick={() => handleRemoveCurrencyType(currencyType)}><CloseIcon color="error" /></span>
                        </div>
                    </div>
                )) : null}
                <div className={styles.btn_wrapper}>
                    <button className={styles.add_btn} onClick={handleAddPrice}>CONFIRM</button>
                    <button className={styles.exit_btn} onClick={handleCancel}>CANCEL</button>
                </div>
            </div>
            <Alert isOpen={isModalOpen} onRequestClose={closeModal} message={"Select option and fill the value first"} />
        </Modal >
    )
}

export default AddPrice;