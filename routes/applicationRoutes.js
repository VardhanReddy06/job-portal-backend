import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { applyJob, getApplicants, getApplied, updateStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/applyjob/:id",isAuthenticated,applyJob);
router.get("/get",isAuthenticated,getApplied);
router.get("/:id/applicants",isAuthenticated,getApplicants);
router.put("/status/update/:id",isAuthenticated,updateStatus);

export default router;