import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBH-VuvbpTnysAmXM-nNlhc6omvMaOMkug",
    authDomain: "auctionnotification-47f61.firebaseapp.com",
    projectId: "auctionnotification-47f61",
    storageBucket: "auctionnotification-47f61.appspot.com",
    messagingSenderId: "210811415060",
    appId: "1:210811415060:web:bd0b8db7e42b805db11501",
    measurementId: "G-T8HC8SSD3G"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const currentToken = await getToken(messaging, {
                vapidKey: `BHWYeR5CjxADH-QQ-yFFgPM39Quz583R43AWZaZs6kYrnGhDe3qggi8y6qQiAhU4Psarnrp3-mZrvVmWrvU_cMA`
            });

            if (currentToken) {
                return currentToken;
            } else {
                console.log('Failed to generate the registration token.');
            }
        } else {
            console.log("User Permission Denied.");
        }
    } catch (error) {
        console.log('An error occurred when requesting to receive the token.', error);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });