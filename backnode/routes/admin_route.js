import { Router } from "express";
import { adminController } from "../controllers/admin_controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js"; 

const router = Router()

router.post('admin/dashboard',verifyToken, adminController.dashboard);

export default router;