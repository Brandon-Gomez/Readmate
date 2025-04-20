import { Router } from "express";
import { likeController } from "../controllers/like_controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post('/like', verifyToken, likeController.newLike);
router.delete('/like/:postId', verifyToken, likeController.deleteLike);
router.get('/like/count/:postId', likeController.countLikes);
router.get('/like/check/:postId', verifyToken, likeController.checkIfLiked);

export default router;