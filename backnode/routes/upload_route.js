import { Router } from "express";
import { uploadController,profileUpload,bookUpload } from "../controllers/upload_controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/upload/profile', verifyToken, profileUpload.single('photo'), uploadController.uploadProfile);
router.post('/upload/book', verifyToken, bookUpload.fields([ { name: 'images', maxCount: 1 }, { name: 'pdf', maxCount: 1 } ]), uploadController.uploadBooks);

export default router;