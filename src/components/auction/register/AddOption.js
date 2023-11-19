import React, { useEffect, useState } from "react";
import styles from "./AddOption.module.css"
import Modal from 'react-modal';
import { Autocomplete, TextField } from "@mui/material";
import { capitalizeFirstLetter } from "../../common/Utils";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import Alert from "../../common/Alert";

const AddOption = ({ searchKeyItemOptions, isOpen, onRequestClose, getItemOptions }) => {

    const [options, setOptions] = useState([]);
    const [values, setValues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialMount, setInitialMount] = useState(true);

    useEffect(() => {
        if (initialMount) {
            setInitialMount(false);
            return;
        }
        if (options.length === 0 || values.length === 0) {
            setIsModalOpen(true);
            return;
        }

        const itemOptions = {};
        options.forEach((option, index) => {
            itemOptions[option.name] = parseInt(values[index]);
        })
        getItemOptions(itemOptions);
        handleExit();
    }, [values])

    const handleItemOptions = (_, value) => {
        if (value === null) return;
        const optionArr = [...options, value];
        setOptions(optionArr);
    }

    const handleRemoveOptions = (option) => {
        console.log(option);
        const updatedOptions = options.filter(opt => opt !== option);
        if (updatedOptions === null) {
            setOptions([]);
        }
        setOptions(updatedOptions);
    }

    const handleAddAll = () => {
        const optionValues = document.querySelectorAll(`.${styles.option_value}`);
        let valueValidation = true;
        optionValues.forEach((optionValue) => {
            if (optionValue.value === '') {
                setIsModalOpen(true);
                valueValidation = false;
            }
        });
        if (valueValidation) {
            setValues(Array.from(optionValues).map(option => option.value));
        }
    }

    const handleExit = () => {
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
            className={styles.modal}
            shouldCloseOnOverlayClick={false}
        >
            <div className={styles.header}>
                Add Options
            </div>
            <Autocomplete
                id="combo-box-demo"
                options={searchKeyItemOptions}
                getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                getOptionDisabled={(option) => options.includes(option)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleItemOptions}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Item Option" placeholder="Select Options" />}
            />
            <div className={styles.option_container}>
                <div className={styles.option_wrapper_wrapper_wrapper}>
                    {options.length === 0 ? <div className={styles.empty_options}>
                        <ArrowUpwardIcon sx={{ height: "18px" }} />Please select an option from above
                    </div> : null}
                    {options?.map((option, index) => (
                        <div className={styles.option_wrapper_wrapper} key={option.id}>
                            <span>-</span>
                            <div className={styles.option_wrapper}>
                                <span>{capitalizeFirstLetter(option.name)}</span>
                                <input type="text" placeholder="value" className={styles.option_value} defaultValue={values[index]} />
                            </div>
                            <span>-</span>
                            <span className={styles.remove_btn} onClick={() => { handleRemoveOptions(option) }}><CloseIcon color="error" /></span>
                        </div>
                    ))}
                </div>
                <div className={styles.btn_wrapper}>
                    <button className={styles.add_btn} onClick={handleAddAll} >CONFIRM</button>
                    <button className={styles.exit_btn} onClick={handleExit}>CANCEL</button>
                </div>
            </div >
            <Alert isOpen={isModalOpen} onRequestClose={closeModal} message={"Select option and fill the value first"} />
        </Modal >
    );
}

export default AddOption;