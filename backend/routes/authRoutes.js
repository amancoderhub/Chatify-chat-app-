import { Router } from "express";
import AuthController from "../controllers/authController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", protectRoute, AuthController.me);
router.post("/logout", AuthController.logout);

export default router;
