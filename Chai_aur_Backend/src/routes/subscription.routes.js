import { Router } from 'express';
// 👇 Dhyan dein: Ye 'controller' hona chahiye (Singular), 'controllers' nahi.
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controller/subscription.controller.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router
    .route("/u/:subscriberId")
    .get(getSubscribedChannels);

export default router;