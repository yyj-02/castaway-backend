// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getMessaging, getToken,onMessage } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA47YskilV86y_hHH2bIJpPBJYbTyRcsk8",
  authDomain: "castaway-819d7.firebaseapp.com",
  projectId: "castaway-819d7",
  storageBucket: "castaway-819d7.appspot.com",
  messagingSenderId: "442203592329",
  appId: "1:442203592329:web:b46f2376f09817c4ccd858",
  measurementId: "G-K05SMF9704",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Messaging
const messaging = getMessaging(app);

const idToken = document.getElementById("idToken");
const obtainToken = document.getElementById("generateToken");

obtainToken.onclick = async () => {
  // console.log(idToken.innerHTML);
  try {
    const token = await getToken(messaging, { vapidKey: "BKJQoJxKgPSCCw_h_aIj-q0M2QNftW_yAFwajXfxNFJgOYh3CihrPgotMhQNZOv95ab6DWM-AGRe7kschUhccVk" });
    
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });

    if (token) {
      // console.log(token);
      let messagingTokenData = {
        idToken: idToken.innerHTML,
        messagingToken: token,
      }
      url = "https://us-central1-castaway-819d7.cloudfunctions.net/app/api/users/messagingToken"
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagingTokenData),
      });
  
      const resData = await res.json();
      console.log({...resData});
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.log({err});
  }
}

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
});