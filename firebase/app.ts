import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, enableIndexedDbPersistence,  } from "firebase/firestore";
import { Auth, getAuth } from 'firebase/auth'

const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINF_SENDER_ID,
   appId: process.env.NEXT_PUBLIC_APP_ID,
   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
let analytics: Analytics, db: Firestore, auth: Auth
if (typeof window !== 'undefined') {
   analytics = getAnalytics(app);
   auth = getAuth(app)
   db = getFirestore(app)
   // enableIndexedDbPersistence(db)
}

export { analytics, db }
