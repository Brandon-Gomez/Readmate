import { userModel } from "../models/user_model.js";
import multer from "multer";
import { uploadProfileToFirebase, uploadBookToFirebase } from "./firebaseupload_controller.js";

// Filtra los archivos de perfil
const profileFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG, y GIF."), false);
  }
};

// Filtra los archivos de libro (PDF)
const bookFileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo PDF."), false);
  }
};

// Configuración de multer para almacenar en memoria
const storage = multer.memoryStorage();
export const profileUpload = multer({ storage, fileFilter: profileFileFilter });
export const bookUpload = multer({ storage, fileFilter: bookFileFilter });

/**
 * Controlador para subir la foto de perfil a Firebase
 */
const uploadProfile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No se proporcionó una foto." });
    }

    // Actualiza el modelo del usuario
    const user = await userModel.findUserByEmail(req.email);
    userModel.updatePhotoByUsername(user.username, "")

    // Sube el archivo a Firebase
    const url = await uploadProfileToFirebase(file);

    await userModel.updatePhotoByUsername(user.username, url);

    res.status(200).json({
      message: "Foto de perfil subida correctamente",
      photoUrl: url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir la foto de perfil" });
  }
};

/**
 * Controlador para subir archivos de libro a Firebase
 */
const uploadBooks = async (req, res) => {
  try {
    const images = req.files["images"];
    const pdf = req.files["pdf"];

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No se subieron imágenes." });
    }

    if (!pdf || pdf.length === 0) {
      return res.status(400).json({ message: "No se subió ningún PDF." });
    }

    // Subir la imagen y el PDF a Firebase
    const imageUrls = await Promise.all(images.map((img) => uploadBookToFirebase(img)));
    const pdfUrl = await uploadBookToFirebase(pdf[0]);

    res.status(200).json({
      message: "Archivos subidos correctamente",
      images: imageUrls,
      pdf: pdfUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir archivos de libro" });
  }
};

export const uploadController = { uploadProfile, uploadBooks };
