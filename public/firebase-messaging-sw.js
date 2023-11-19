importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBH-VuvbpTnysAmXM-nNlhc6omvMaOMkug",
    authDomain: "auctionnotification-47f61.firebaseapp.com",
    projectId: "auctionnotification-47f61",
    storageBucket: "auctionnotification-47f61.appspot.com",
    messagingSenderId: "210811415060",
    appId: "1:210811415060:web:bd0b8db7e42b805db11501",
    measurementId: "G-T8HC8SSD3G"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// self.addEventListener("push", receivePushNotification);
//
// function receivePushNotification(event) {
//     // This prints "Test push message from DevTools."
//     console.log("[Service Worker] Push Received.", event.data.text());
//
//     var options = {
//         body: "This notification was generated from a push!"
//     };
//
//     event.waitUntil(self.registration.showNotification("Hello world!", options));
// }

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
