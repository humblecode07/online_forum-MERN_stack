const User = require('../models/users');
const Forum = require('../models/forums');
const Thread = require('../models/threads');
const Comment = require('../models/comments');
const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

/* Get all threads in a certain forum */
exports.thread_get_all_forum = asyncHandler(async (req, res, next) => {
    const [thread, threadCount] = await Promise.all([
        Thread.find({ forumPost: req.forumId }).exec(),
        Thread.countDocuments({ forumPost: req.forumId }).exec()
    ]);

    return res.status(201).json({
        threadCount,
        thread
    });
});

/* Get a thread in a certain forum */
exports.thread_get_one_forum = asyncHandler(async (req, res, next) => {
    const thread = await Thread.findById(req.params.threadId)
                                .populate('comments')
                                .exec();

    return res.status(200).json({
        thread
    });
});

/* Create a thread */
exports.thread_create = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userId);
    let images = [];

    if (req.files && req.files.length > 0) images = req.files.map(file => file.path);

    const thread = new Thread({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        username: user.user_name,
        forumPost: req.forumId,
        title: req.body.title,
        content: req.body.content,
        image: images
    });

    await thread.save();

    await Forum.findByIdAndUpdate(req.forumId, 
        { $push: { threads: thread._id } }, 
        { new: true }
    );

    return res.status(200).json({
        message: "Thread, " + req.body.title + ", has been created",
    })
});

/* Update a thread */
exports.thread_update = asyncHandler(async (req, res, next) => {
    const threadId = req.params.threadId;

    if (req.files && req.files.length > 0) {
        const images = req.files.map(file => file.path);

        req.body.image = images;
    }

    const updatedThread = await Thread.findByIdAndUpdate(threadId, {
        $set: req.body, 
        editedAt: Date.now() 
    }, { new: true });

    if (!updatedThread) {
        return res.status(404).json({ message: "Thread not found" });
    }

    return res.status(200).json({
        message: "Thread info has been updated.",
        thread: updatedThread
    });
});

/* Delete a thread */
exports.thread_delete = asyncHandler(async (req, res, next) => {
    const threadId = req.params.threadId;
    
    await Comment.deleteMany({ threadPost: threadId });

    const thread = await Thread.findByIdAndDelete(threadId);

    const forumId = req.forumId;
    await Forum.findByIdAndUpdate(forumId, 
        { $pull: { threads: threadId } },
        { new: true }
    );


    if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
    }

    return res.status(200).json({
        message: "Thread info has been deleted.",
        thread: thread
    })
});

/* Upvote or Downvote a Thread */
exports.thread_vote = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userId);

    console.log('userid:', user._id)

    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
        return res.status(404).json({ message: "Thread not found." });
    }

    const alreadyUpvoted = thread.upvotedBy.includes(user._id);
    const alreadyDownvoted = thread.downvotedBy.includes(user._id);

    if (req.body.vote === 'upvote') {
        if (alreadyDownvoted) {
            // User has already downvoted, remove the downvote and add the upvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { downvotes: -1, upvotes: 1 },
                $pull: { downvotedBy: user._id },
                $addToSet: { upvotedBy: user._id }
            });
            res.status(200).json({ message: "Thread upvoted successfully." });
        } else if (!alreadyUpvoted) {
            // User hasn't upvoted yet, add the upvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { upvotes: 1 },
                $addToSet: { upvotedBy: user._id }
            });
            res.status(200).json({ message: "Thread upvoted successfully." });
        } else {
            // User has already upvoted
            res.status(400).json({ message: "You have already upvoted this thread." });
        }
    } else if (req.body.vote === 'downvote') {
        if (alreadyUpvoted) {
            // User has already upvoted, remove the upvote and add the downvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { upvotes: -1, downvotes: 1 },
                $pull: { upvotedBy: user._id },
                $addToSet: { downvotedBy: user._id }
            });
            res.status(200).json({ message: "Thread downvoted successfully." });
        } else if (!alreadyDownvoted) {
            // User hasn't downvoted yet, add the downvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { downvotes: 1 },
                $addToSet: { downvotedBy: user._id }
            });
            res.status(200).json({ message: "Thread downvoted successfully." });
        } else {
            // User has already downvoted
            res.status(400).json({ message: "You have already downvoted this thread." });
        }
    } else {
        res.status(400).json({ message: "Invalid vote type. Please provide 'upvote' or 'downvote'." });
    }
});
