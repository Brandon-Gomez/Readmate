import { Router } from "express";
import { followController } from "../controllers/follow_controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/follow", verifyToken, followController.followUser);
router.delete("/follow/:userId", verifyToken, followController.unfollowUser);
router.get("/follow/followers/:userId", verifyToken, followController.getFollowers);
router.get("/follow/following/:userId", verifyToken, followController.getFollowing);
// Obtener la cantidad de seguidores de un usuario
router.get("/follow/followers/count/:userId", verifyToken, followController.getFollowerCount);

// Obtener la cantidad de seguidos de un usuario
router.get("/follow/following/count/:userId", verifyToken, followController.getFollowingCount);

// Nueva ruta para verificar si el usuario sigue a otro
router.get("/follow/check/:userId", verifyToken, followController.checkIfFollowing);

export default router;
