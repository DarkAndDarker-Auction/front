import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import './SearchBar.css'
import { Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchBar = () => {

    const [selectedItem, setSelectedItem] = useState(null);
    const searchKey = useSelector((state) => state.searchKey.searchKey);
    const searchKeyItemParts = searchKey.itemParts;


    const handleSelect = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="search-bar-container">
            <div className="search-key">
                < Dropdown >
                    <Dropdown.Toggle variant="success" id="dropdown-parts">
                        {selectedItem ? selectedItem.name : '부위'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {searchKeyItemParts?.map((item, index) => (
                            <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
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
