import axios from 'axios';
// import * as dotenv from 'dotenv';

const apiClient = axios.create ({
    baseURL: 'http://localhost:4000/api',
    timeout: 5000,
})

export default apiClient;

// dotenv.config();

// export default {
//     firebaseConfig: {
//         apiKey: process.env.API_KEY,
//         authDomain: process.env.AUTH_DOMAIN,
//         projectId: process.env.PROJECT_ID,
//         databaseURL: process.env.FIRESTORE_DB_URL,
//         storageBucket: process.env.STORAGE_BUCKET,
//         messagingSenderId: process.env.MESSAGING_SENDER_ID,
//         appId: process.env.APP_ID,
//         measurementId: process.env.MEASUREMENT_ID,
//     },
// };