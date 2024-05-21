import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCzPzuFj6CnkkEDHLBilCApvNV6MRipSVg",
    authDomain: "carbon-calculator-423702.firebaseapp.com",
    projectId: "carbon-calculator-423702",
    storageBucket: "carbon-calculator-423702.appspot.com",
    messagingSenderId: "618947967273",
    appId: "1:618947967273:web:d4477f1f7143a60919df38",
    measurementId: "G-QZ0M5XDRTE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
