importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAcziwgDyx2SxCSeuGbgFDr9_94R2tpDfk",
    authDomain: "coolie-9cc38.firebaseapp.com",
    projectId: "coolie-9cc38",
    storageBucket: "coolie-9cc38.appspot.com",
    messagingSenderId: "425618348845",
    appId: "1:425618348845:android:57a161642424e088f611a4",
    measurementId: "G-X6752VX6L5"
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'assets/logo/logo png1.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
