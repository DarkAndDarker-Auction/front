import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { requestPermission, onMessageListener } from '../../messaging_init_in_sw';

function Notification() {
    const [notification, setNotification] = useState({ title: '', body: '' });

    useEffect(() => {
        // requestPermission();
        // const unsubscribe = onMessageListener().then((payload) => {
        //     console.log("notification loaded");
        //     setNotification({
        //         title: payload?.notification?.title,
        //         body: payload?.notification?.body,
        //     });
        //     toast.success(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
        //         duration: 60000,
        //         position: 'top-right'
        //     });
        // });
        // return () => {
        //     unsubscribe.catch((err) => console.log('failed: ', err));
        // };
    }, []);
    return (
        <div>
            <Toaster />
        </div>
    );
}
export default Notification;