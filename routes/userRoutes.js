import express from 'express';
import { Login, Logout, register, updateProfile } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';


const router = express.Router();

router.post("/signup",register);
router.post("/login",Login);
router.post("/profile/update",isAuthenticated,updateProfile);
router.post("/logout", Logout);

export default router;