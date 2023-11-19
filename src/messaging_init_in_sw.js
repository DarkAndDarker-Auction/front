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

console.log(messaging);

export const requestPermission = () => {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");

        } else {
            console.log("Do not have permission!");
        }
    });
}

            getToken(messaging, {
                vapidKey:
                    "BHWYeR5CjxADH-QQ-yFFgPM39Quz583R43AWZaZs6kYrnGhDe3qggi8y6qQiAhU4Psarnrp3-mZrvVmWrvU_cMA",
            }).then((currentToken) => {
                if (currentToken) {
                    console.log("currentToken: ", currentToken);
                } else {
                    console.log("Can not get token");
                }
            });

onMessage(messaging, (payload) => {
    console.log("message received", payload);
})

requestPermission();
