import express from "express";
import {deleteJob, getAllJobs, getmyJobs, postJob, updateJob,getSingleJob} from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthorized , postJob);
router.get("/getmyjobs", isAuthorized , getmyJobs);
router.put("/update/:id", isAuthorized , updateJob);
router.delete("/deletejob/:id",isAuthorized,deleteJob);
router.get("/:id", isAuthorized , getSingleJob);

export default router;