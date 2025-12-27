import express from "express"
import { createJob, getAdminJobs, getjobbyId, getjobs } from "../controllers/jobController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/createJob",isAuthenticated, createJob);
router.get("/getAll",isAuthenticated,getjobs);
router.get("/get/:id",isAuthenticated,getjobbyId);
router.get("/getadminjobs",isAuthenticated,getAdminJobs);

export default router;