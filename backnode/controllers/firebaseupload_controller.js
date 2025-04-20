import { bucket } from '../database/firebase.js'
import { v4 as uuidv4 } from 'uuid';

const uploadProfileToFirebase = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No se proporcionó ningún archivo.");
    }

    const fileName = `profile/${uuidv4()}_${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

const uploadBookToFirebase = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No se proporcionó ningún archivo.");
    }

    const fileName = `book/${uuidv4()}_${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

export { uploadProfileToFirebase, uploadBookToFirebase };
