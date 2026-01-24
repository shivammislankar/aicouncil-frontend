import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDerXbBWG_RAWo9bjpdvDMyGzUjHxwsM1c",
  authDomain: "ai-council-94c9c.firebaseapp.com",
  projectId: "ai-council-94c9c",
  appId: "1:2109666810:web:8059d92934661382956043",};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
