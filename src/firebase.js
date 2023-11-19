// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// const firebaseConfig = {
//     apiKey: "AIzaSyBV7MSD4oHT9_QwOqtoykk0ntskvhka7Bc",
//     authDomain: "dad-auction-notification.firebaseapp.com",
//     projectId: "dad-auction-notification",
//     storageBucket: "dad-auction-notification.appspot.com",
//     messagingSenderId: "129807865719",
//     appId: "1:129807865719:web:1338a20f85b4c5160eb372",
//     measurementId: "G-MZGJEWHZHS"
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// function requestPermission() {
//     console.log('Requesting permission...');
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//             getToken(messaging, { vapidKey: 'BDrbv7RjSbBtYvhJ8ThkAi2v5rMh4NDX4Bw3g0RqaAB_K-0G7fvxOiZ8vnCkyXJckhvXOjWaRuCpPG64rbU8OMM' }).then((currentToken) => {
//                 if (currentToken) {
//                     console.log("current Token : " + currentToken);
//                 } else {
//                     console.log('No registration token available. Request permission to generate one.');
//                 }
//             }).catch((err) => {
//                 console.log('An error occurred while retrieving token. ', err);
//             });

//         }
//         else {
//             console.log('Do not have poermission.');
//         }
//     });
// }

// requestPermission();