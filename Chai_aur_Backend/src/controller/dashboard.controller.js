import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// --- 1. Get Channel Stats (Views, Subs, Likes, Videos) ---
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // 1. Total Video Views & Total Videos Count
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }, // Saari videos ke views jodo
                totalVideos: { $sum: 1 }        // Saari videos gino
            }
        }
    ]);

    // 2. Total Subscribers Count
    const subscribersStats = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalSubscribers"
        }
    ]);

    // 3. Total Likes on your Videos
    const likesStats = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "tweet",
                foreignField: "_id",
                as: "tweetInfo"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "commentInfo"
            }
        },
        {
            $match: {
                $or: [
                    { "videoInfo.owner": new mongoose.Types.ObjectId(userId) },
                    { "tweetInfo.owner": new mongoose.Types.ObjectId(userId) },
                    { "commentInfo.owner": new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    // Default values agar data nahi hai (0 return karega)
    const stats = {
        totalViews: videoStats[0]?.totalViews || 0,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalSubscribers: subscribersStats[0]?.totalSubscribers || 0,
        totalLikes: likesStats[0]?.totalLikes || 0
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
})

// --- 2. Get All Videos Uploaded by User (For Table) ---
const getChannelVideos = asyncHandler(async (req, res) => {
    // Sirf wahi videos lao jo logged-in user ne upload ki hain
    const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 }); // Newest first

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
})

export {
    getChannelStats,
    getChannelVideos
}