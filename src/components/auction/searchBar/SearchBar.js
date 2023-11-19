import React, { useState, useEffect, useRef } from 'react'
import Result from "../result/Result"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './SearchBar.module.css'
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { capitalizeFirstLetter } from '../../common/Utils';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const SearchBar = ({ slotTypes, options, rarities, items }) => {
    const PAGE_SIZE = 8;
    const location = useLocation();
    const movePage = useNavigate();
    const urlSearchParams = new URLSearchParams(location.search);

    const [itemType, setItemType] = useState(null);
    const [itemSlotType, setItemSlotType] = useState(null);
    const [itemName, setItemName] = useState(urlSearchParams.get('itemName'));
    const [itemOptions, setItemOptions] = useState(urlSearchParams.getAll('itemOptions'));
    const [itemRarity, setItemRarity] = useState(null);

    const [pageNumber, setPageNumber] = useState(0);
    const [sort, setSort] = useState("createdAt");
    const [searchResult, setSearchResult] = useState([]);

    const search = async () => {
        const nameSearchKey = itemName !== 'null' ? itemName : null;

        const requestBody = {
            optionSearchKeys: [],
            pageSize: PAGE_SIZE,
            pageNumber: pageNumber,
            nameSearchKey: nameSearchKey,
        };
        itemOptions.forEach((option) => {
            if (option !== null) {
                requestBody.optionSearchKeys.push({
                    optionName: option,
                    optionValue: 0
                });
            }
        });
        try {
            const { data } = await axios.post(`/search/auction-item?page=${pageNumber}&size=${PAGE_SIZE}&sort=${sort}`, requestBody);
            setSearchResult(data);
            console.log(data);

            const queryString = `?itemName=${itemName}${itemOptions.map((option) => `&itemOptions=${option}`).join('')}`;
            movePage(`${location.pathname}${queryString} `);

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    useEffect(() => {
        search();
    }, [pageNumber, sort]);

    const getPageNumber = (value) => {
        setPageNumber(value - 1);
    }

    const getSort = (value) => {
        setSort(value);
    }

    const handleOptions = (_, value) => {
        const optionArr = [];
        value.map(v => optionArr.push(v.name));
        setItemOptions(optionArr);
    }

    const handleItemName = (_, value) => {
        setItemName(value === null ? null : value.name);
    }

    const handleItemRarity = (_, value) => {
        const element = document.querySelector(`.${styles.searchkey_rarity} input`);
        element.style.setProperty('color', value.colorCode, 'important');
        setItemRarity(value);
    }

    const handleSearch = () => {
        search(itemName, itemOptions);
        setPageNumber(0);
    }

    const handleReset = () => {
        setItemName(null);
        setItemRarity(null);
        setItemSlotType(null)
        setItemType(null);
        setItemOptions([]);
    }

    return (
        <>
            {slotTypes && options && rarities && items ?
                <div className={styles.searchbar_container}>
                    <div className={styles.search_title}>Search Items</div>
                    <div className={styles.searchbar_wrapper}>
                        <div className={styles.filter_container}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                    <li className={`${styles.searchkey_wrapper} ${styles.searchkey_name} `}>
                                        <Autocomplete
                                            size='small'
                                            value={items.find(item => item.name === itemName) || null}
                                            options={items}
                                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                                            onChange={handleItemName}
                                            sx={{ width: "100%" }}
                                            renderInput={(params) => <TextField {...params} label="ITEM NAME"
                                                InputProps={{ ...params.InputProps }} sx={{ color: "#B89971" }} />}
                                        />
                                    </li>

                                    <li className={`${styles.searchkey_wrapper} ${styles.searchkey_rarity} `}>
                                        <Autocomplete
                                            size='small'
                                            value={itemRarity ? rarities.find(rarity => rarity.name === itemRarity.name) || null : null}
                                            options={!rarities ? [{ label: "loading...", id: 0 }] : rarities}
                                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                                            onChange={handleItemRarity}
                                            sx={{ width: "100%" }}
                                            renderInput={(params) =>
                                                <TextField {...params} label="RARITIES"
                                                    InputProps={{ ...params.InputProps }} />
                                            }
                                            renderOption={(props, option) => {
                                                const { name, colorCode } = option;
                                                return (
                                                    <div {...props} style={{ color: colorCode }}>
                                                        {capitalizeFirstLetter(name)}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </li>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                    <li className={`${styles.searchkey_wrapper} ${styles.searchkey_type} `}>
                                        <Autocomplete
                                            size='small'
                                            value={itemSlotType ? slotTypes.find(slotType => slotType.name === itemSlotType.name) || null : null}
                                            options={slotTypes}
                                            onChange={(_, value) => setItemSlotType(value)}
                                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                                            sx={{ width: "100%" }}
                                            renderInput={(params) =>
                                                <TextField {...params} label="SLOT TYPE" />
                                            }
                                        />
                                    </li>
                                    <li className={`${styles.searchkey_wrapper} ${styles.searchkey_type} `}>
                                        <Autocomplete
                                            size='small'
                                            value={itemType ? slotTypes.find(slotType => slotType.name === itemType.name) || null : null}
                                            options={slotTypes}
                                            onChange={(_, value) => setItemType(value)}
                                            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                                            sx={{ width: "100%" }}
                                            renderInput={(params) =>
                                                <TextField {...params} label="ITEM TYPE" />
                                            }
                                        />
                                    </li>
                                </div>
                            </div>

                            <li className={`${styles.searchkey_wrapper} ${styles.searchkey_option} `}>
                                <Autocomplete
                                    multiple
                                    size='small'
                                    disableCloseOnSelect
                                    fullWidth
                                    options={options}
                                    value={!itemOptions ? [] : itemOptions.map((itemOption) => options.find(option => option.name === itemOption))}
                                    getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
                                    onChange={(e, value) => handleOptions(e, value)}
                                    renderInput={(params) => <TextField {...params} label="OPTIONS"
                                        InputProps={{ ...params.InputProps, style: { fontSize: "14px" } }} />}
                                />
                            </li>
                        </div>
                        <div className={styles.btn_wrapper}>
                            <button type='submit' onClick={handleSearch} className={styles.search_btn}><SearchIcon />&nbsp;SEARCH</button>
                            <button type='submit' onClick={handleReset} className={styles.reset_btn}><RefreshIcon />&nbsp;RESET</button>
                        </div>
                    </div >
                    <Result getPageNumber={getPageNumber} pageNumber={pageNumber} sort={sort} getSort={getSort} searchResult={searchResult} tab={"search"} />
                </div>
                : null}
        </>
    )
};

export default SearchBar;
