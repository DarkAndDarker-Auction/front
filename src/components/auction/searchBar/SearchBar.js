import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './SearchBar.module.css'
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

const search = async (itemName, option1, option2, option3) => {

    const requestBody = {
        optionSearchKeys: [],
        nameSearchKey: itemName.name
    };

    const options = [option1, option2, option3];

    options.forEach((option) => {
        if (option && option.name !== null) {
            requestBody.optionSearchKeys.push({
                optionName: option.name,
                optionValue: 0
            });
        }
    });

    try {
        const res = await axios.post('http://localhost:8080/search/auction-item',
            requestBody, {
            withCredentials: false,
        });
        console.log(res);
    } catch (error) {
        console.log(error);
        return false;
    }
}

const SearchBar = () => {

    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [itemName, setItemName] = useState(null);
    const [option1, setOption1] = useState(null);
    const [option2, setOption2] = useState(null);
    const [option3, setOption3] = useState(null);


    const searchKeySlotTypes = useSelector((state) => state.searchKey.searchKey.slotTypes);
    const searchKeyItemOptions = useSelector((state) => state.searchKey.searchKey.itemOptions);
    const searchKeyItems = useSelector((state) => state.searchKey.searchKey.items);

    const handleItemType = (event, value) => {
        setItemType(value);
    }

    const handleItemName = (event, value) => {
        setItemName(value);
    }

    const handleOption1 = (event, value) => {
        setOption1(value);
    }

    const handleOption2 = (event, value) => {
        setOption2(value);
    }

    const handleOption3 = (event, value) => {
        setOption3(value);
    }

    const handleSearch = (event) => {
        event.preventDefault();
        const res = search(itemName, option1, option2, option3);
    }

    return (
        <div className={styles.searchbar_container}>
            <span className={styles.searchkey_label}>ITEM</span>

            <div className={styles.searchkey_wrapper}>
                <span>ITEM TYPE</span>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchKeySlotTypes}
                    getOptionLabel={(option) => option.name}
                    onChange={handleItemType}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} label="ItemType" />}
                    vluae
                />
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>ITEM NAME</span>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchKeyItems}
                    getOptionLabel={(option) => option.name}
                    onChange={handleItemName}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} label="Item" />}
                    vluae
                />
            </div>

            <span className={styles.searchkey_label}>OPTIONS</span>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 1</span>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchKeyItemOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={handleOption1}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} label="Item Option" />}
                    vluae
                />
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 2</span>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchKeyItemOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={handleOption2}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} label="Item Option" />}
                    vluae
                />
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 3</span>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchKeyItemOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={handleOption3}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} label="Item Option" />}
                    vluae
                />
            </div>
            <button type='submit' onClick={handleSearch}>SEARCH</button>

        </div >
    )
};

export default SearchBar;
