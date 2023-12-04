import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';
import { Toaster, toast } from 'react-hot-toast';
import { requestPermission, onMessageListener } from '../../features/firebase/Firebase';
import Drawer from '@mui/material/Drawer';
import { FormControl, FormControlLabel, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import axios from 'axios';
import { calculateReaminTime, capitalizeFirstLetter, formatTimeDifference } from '../common/utils/Utils';
import { useNavigate } from 'react-router-dom';

const updateMemberFCMToken = async (fcmToken) => {
    try {
        const requestBody = {
            token: fcmToken
        }
        await axios.post('/notification/token/update', requestBody);
    } catch (error) {
        console.log(error.message);
    }
}

const notificationChecked = async (notification) => {
    try {
        const requestBody = {
            notificationId: notification.id
        }
        await axios.post('notification/checked', requestBody);
    } catch (error) {
        console.log(error.message);
    }
}

const getNotifications = async (setNotification, showAll, filter) => {
    const url = `/notification/${showAll ? "all" : "unchecked"}?filter=${filter}`;
    try {
        const { data } = await axios.get(url);
        setNotification(data);
    } catch (error) {
        console.log(error.message);
    }
}

const deleteNotification = async (notification) => {
    const requestBody = {
        notificationId: notification.id
    }
    try {
        await axios.post('/notification/delete', requestBody);
    } catch (error) {
        console.log(error.message);
    }

}

const Notification = ({ cookies, setCookies }) => {
    const movePage = useNavigate();

    const [notificationToast, setNotificationToast] = useState({ title: '', body: '' });
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
    const [filter, setFilter] = useState("ALL");
    const [showAll, setShowAll] = useState(false);

    const getFCMWithPermissionToken = async () => {
        const fcmToken = await requestPermission();
        if (cookies.fcmToken !== fcmToken) {
            setCookies("fcmToken", fcmToken, { path: "/" });
            updateMemberFCMToken(fcmToken);
        }
    }

    useEffect(() => {
        getFCMWithPermissionToken();
        const unsubscribe = onMessageListener().then((payload) => {
            console.log("why not")
            setNotificationToast({
                title: payload?.notification?.title,
                body: payload?.notification?.body,
            });
            toast.success(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
                duration: 6000,
                position: 'bottom-right'
            });
        });
        return () => {
            unsubscribe.catch((err) => console.log('failed: ', err));
        };
    });

    useEffect(() => {
        if (isNotificationDrawerOpen) {
            getNotifications(setNotifications, showAll, filter);
        }
    }, [filter, showAll, isNotificationDrawerOpen])

    const closeNotificationDrawer = () => {
        setIsNotificationDrawerOpen(false);
    }

    const openNotificationDrawer = () => {
        setIsNotificationDrawerOpen(true);
    }

    const handleNotification = (notification) => {
        movePage(`auction/detail/${notification.auctionItemId}`);
        notificationChecked(notification);
        setIsNotificationDrawerOpen(false);
    }

    const handleDeleteNotification = (notification) => {
        deleteNotification(notification);
        setNotifications((prevNotifications) => prevNotifications.filter((n) => n !== notification));
    }

    return (
        <div className={styles.notification}>
            <Toaster />
            <Tooltip title="Notification" placement='left' >
                <Fab color="primary" aria-label="add" className={styles.noti_menu}
                    onClick={openNotificationDrawer}>
                    <span className={styles.notify_new}>N</span>
                    <NotificationsActiveIcon sx={{ height: "30px" }} />
                </Fab>
            </Tooltip>
            <Drawer
                anchor='right'
                open={isNotificationDrawerOpen}
                onClose={closeNotificationDrawer}>
                <div className={styles.drawer}>
                    <div className={styles.drawer__header}>
                        <div className={styles.drawer__header__title}>Notifications</div>
                        <div className={styles.drawer__header__close} onClick={closeNotificationDrawer}>
                            <ArrowForwardIcon />
                        </div>
                    </div>
                    <div className={styles.drawer__filter}>
                        <FormControlLabel control={<Checkbox size='small'
                            checked={showAll}
                            onChange={(event) => {
                                setShowAll(event.target.checked)
                            }}
                        />} label="Show All" className={styles.checkbox_label} />
                        <FormControl>
                            <InputLabel>filter</InputLabel>
                            <Select
                                size='small'
                                value={filter}
                                label="Filter"
                                onChange={(event) => {
                                    setFilter(event.target.value)
                                }}
                                sx={{ height: "32px", fontSize: "12px" }}
                            >
                                <MenuItem value={"ALL"}>All</MenuItem>
                                <MenuItem value={"OFFER_REQUESTED"}>Offer Requested</MenuItem>
                                <MenuItem value={"OFFER_CONFIRMED"}>Offer Confirmed</MenuItem>
                                <MenuItem value={"BUY_REQUESTED"}>Buy Requested</MenuItem>
                                <MenuItem value={"TRADE_COMPLETED"}>Trade Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.drawer__contents}>
                        {notifications.length !== 0 ?
                            notifications?.map((notification) => (
                                <div className={styles.drawer__contents_container} key={notification.id}>
                                    <div className={styles.drawer__contents_wrapper} onClick={() => handleNotification(notification)}
                                        style={notification.checked ? { opacity: "0.5" } : null}>
                                        <KeyboardArrowLeftIcon className={styles.content__arrow_icon} sx={{ display: "none" }} />
                                        {!notification.checked ?
                                            < FiberNewIcon color='error' className={styles.content__new_icon} fontSize='small' />
                                            : null}
                                        <div className={styles.content__header}>
                                            <div className={styles.content__header__title}>
                                                {notification.title}
                                            </div>
                                            <div className={styles.content__header__type}>
                                                {capitalizeFirstLetter(notification.notificationType)}
                                            </div>
                                        </div>
                                        <div className={styles.content__body}>
                                            {notification.body}
                                        </div>
                                        <div className={styles.content__footer}>
                                            {formatTimeDifference(notification.createdAt)}
                                        </div>
                                    </div>
                                    <div className={styles.drawer__contents_delete} onClick={() => handleDeleteNotification(notification)}>
                                        <DeleteIcon />
                                    </div>
                                </div>
                            )) : null}
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
export default Notification;