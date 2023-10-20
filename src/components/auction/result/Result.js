import React, { useState } from 'react'
import styles from './Result.module.css'

const Result = () => {

    return (
        <div className={styles.result_container}>
            <span className={styles.result_label}>RESULT</span>
            <div className={styles.result_list_container}>
                <div className={styles.result_item}>
                    <div className={styles.remain_time}></div>
                    <div className={styles.info}></div>
                    <div className={styles.price}></div>
                    <div className={styles.status}></div>
                </div>
            </div>
        </div>
    )
};

export default Result;