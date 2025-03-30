import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import 'dotenv/config';

// Lee y convierte el archivo JSON manualmente
const serviceAccount = JSON.parse(
  readFileSync(new URL('./firebase_config.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

export { admin, bucket };
