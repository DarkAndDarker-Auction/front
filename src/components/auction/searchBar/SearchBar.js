import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './SearchBar.module.css'

const SearchBar = () => {

    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [itemName, setItemName] = useState(null);
    const [option1, setOption1] = useState(null);
    const [option2, setOption2] = useState(null);
    const [option3, setOption3] = useState(null);


    const searchKeySlotTypes = useSelector((state) => state.searchKey.searchKey.slotTypes);
    console.log(searchKeySlotTypes);

    const handleItemType = (itemType) => {
        setItemType(itemType);
    }

    const handleItemName = (itemName) => {
        setItemName(itemName);
    }

    const handleOption1 = (item) => {
        setSelectedItem(item);
    };

    const handleOption2 = (option) => {
        setOption2(option);
    }

    const handleOption3 = (option) => {
        setOption3(option);
    }

    return (
        <div className={styles.searchbar_container}>
            <span className={styles.searchkey_label}>ITEM</span>

            <div className={styles.searchkey_wrapper}>
                <span>ITEM TYPE</span>
                < Dropdown className={styles.dropdown} align="end">
                    <Dropdown.Toggle variant="success" className={styles.dropdown_menu}>
                        {selectedItem ? selectedItem.name : 'Item Type'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.dropdown_list}>
                        {searchKeySlotTypes?.map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => handleItemType(item)}>
                                {item.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>ITEM NAME</span>
                <input type="text" className={styles.item_name} placeholder='ITEM NAME' onChange={handleItemName} />
            </div>

            <span className={styles.searchkey_label}>OPTIONS</span>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 1</span>
                < Dropdown className={styles.dropdown} align="end">
                    <Dropdown.Toggle variant="success" className={styles.dropdown_menu}>
                        {selectedItem ? selectedItem.name : 'OPTION 1'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.dropdown_list}>
                        {searchKeySlotTypes?.map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => handleOption1(item)}>
                                {item.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 2</span>
                < Dropdown className={styles.dropdown} align="end">
                    <Dropdown.Toggle variant="success" className={styles.dropdown_menu}>
                        {selectedItem ? selectedItem.name : 'OPTION 2'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.dropdown_list}>
                        {searchKeySlotTypes?.map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => handleOption2(item)}>
                                {item.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className={styles.searchkey_wrapper}>
                <span>OPTION 3</span>
                < Dropdown className={styles.dropdown} align="end">
                    <Dropdown.Toggle variant="success" className={styles.dropdown_menu}>
                        {selectedItem ? selectedItem.name : 'OPTION 3'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={styles.dropdown_list}>
                        {searchKeySlotTypes?.map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => handleOption3(item)}>
                                {item.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div >
    )
};

export default SearchBar;
