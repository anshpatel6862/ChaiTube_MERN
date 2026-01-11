import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js" 
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// ---------------------------------------------------
// Get All Videos with Pagination, Sorting, Filtering
// ---------------------------------------------------
const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const filter = {}

    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid User ID")
        }
        filter.owner = userId
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("owner", "username avatar")

    const totalVideos = await Video.countDocuments(filter)

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            currentPage: page,
            totalPages: Math.ceil(totalVideos / limit),
            totalVideos
        }, "Videos fetched successfully")
    )
})

// ---------------------------------------------------
// Publish / Upload a Video
// ---------------------------------------------------
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const videoFile = req.files?.videoFile?.[0]
    const thumbnailFile = req.files?.thumbnail?.[0]

    if (!title || !description) {
        throw new ApiError(400, "Title & Description required")
    }

    if (!videoFile) {
        throw new ApiError(400, "Video file is required")
    }

    // Upload video to Cloudinary
    const videoUpload = await uploadOnCloudinary(videoFile.path, "video")
    if (!videoUpload?.url) throw new ApiError(500, "Video upload failed")

    let thumbnailUpload = null
    if (thumbnailFile) {
        thumbnailUpload = await uploadOnCloudinary(thumbnailFile.path)
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload?.url || "",
        duration: videoUpload.duration || 0,
        views: 0, // Explicitly setting views to 0
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video uploaded successfully")
    )
})

// ---------------------------------------------------
// Get a Single Video by ID (FIXED: Likes + History + Views)
// ---------------------------------------------------
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    // 1. Views Increment karo (Direct DB update)
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });

    // 2. User ID setup (Aggregation ke liye)
    let userId = null;
    if (req.user?._id) {
        userId = new mongoose.Types.ObjectId(req.user._id);

        // History Update Logic
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { watchHistory: videoId }
            },
            { new: true }
        );
    }

    // 3. Fetch Video Data + Likes Count + isLiked status using Aggregation
    const videoAggregate = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        // Lookup Likes Collection
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        // Lookup Owner Details
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                likesCount: { $size: "$likes" }, // Total Likes Calculate karo
                isLiked: {
                    $cond: {
                        if: { $in: [userId, "$likes.likedBy"] }, // Check karo current user ne like kiya hai ya nahi
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                "likes": 0 // Heavy array response se hata do
            }
        }
    ]);

    if (!videoAggregate?.length) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, videoAggregate[0], "Video fetched successfully")
    )
})

// ---------------------------------------------------
// Update video details
// ---------------------------------------------------
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const { title, description } = req.body
    const thumbnail = req.file

    const updateData = {}

    if (title) updateData.title = title
    if (description) updateData.description = description

    if (thumbnail) {
        const upload = await uploadOnCloudinary(thumbnail.path)
        updateData.thumbnail = upload?.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true })

    if (!updatedVideo) throw new ApiError(404, "Video not found")

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

// ---------------------------------------------------
// Delete a video
// ---------------------------------------------------
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    // Check ownership
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

// ---------------------------------------------------
// Toggle Publish / Unpublish
// ---------------------------------------------------
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video status changed")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}