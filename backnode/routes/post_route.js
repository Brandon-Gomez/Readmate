import { Router } from "express";
import { postController } from "../controllers/post_controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/posts", verifyToken, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'pdf', maxCount: 1 }]), postController.createPost);
router.get("/posts", verifyToken, postController.getAllPosts);
router.get("/posts/user/:userId", verifyToken, postController.getPostsByUser);
router.get("/posts/:id", postController.getPostById);
router.put("/posts/:id", verifyToken, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'pdf', maxCount: 1 }]), postController.editPost);
router.delete("/posts/:id", verifyToken, postController.deletePost);
router.post("/posts/:id/like", verifyToken, postController.likePost);
router.post("/posts/:id/comment", verifyToken, postController.commentOnPost);
router.get('/posts/count/:userId', postController.getPostCountByUser);

export default router;
