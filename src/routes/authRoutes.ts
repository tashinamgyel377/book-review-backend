import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateUser,
  deleteUser,
} from "../controllers/authControllers"
import { authenticate } from "../middleware/authMiddleware"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateUser);
router.delete("/profile", authenticate, deleteUser);

export default router
