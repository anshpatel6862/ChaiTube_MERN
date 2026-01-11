import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controller/dashboard.controller.js"; // 👈 Ye path check karein
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;