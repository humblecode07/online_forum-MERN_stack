const User = require('../models/users');
const Forum = require('../models/forums');
const Thread = require('../models/threads');
const Comment = require('../models/comments');
const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

/* Get all threads in all forums */
exports.thread_get_all_forum_all = asyncHandler(async (req, res, next) => {
    const threads = await Thread.find().exec();

    const threadCount = threads.length;

    return res.status(200).json({
        threads,
        threadCount
    });
});


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
                                .populate('forumPost')
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

    await User.findByIdAndUpdate(req.userId, 
        { $push: { threads: thread._id } }, 
        { new: true }
    )

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
        editedAt: Date.now(),
        edited: true,
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

    const usersWhoUpvoted = await User.find({ upvotedThreads: threadId });
    const usersWhoDownvoted = await User.find({ downvotedThreads: threadId });

    for (const user of usersWhoUpvoted) {
        await User.findByIdAndUpdate(user._id, 
            { $pull: { upvotedThreads: threadId } },
            { new: true }
        );
    }

    for (const user of usersWhoDownvoted) {
        await User.findByIdAndUpdate(user._id, 
            { $pull: { downvotedThreads: threadId } },
            { new: true }
        );
    }

    const thread = await Thread.findByIdAndDelete(threadId);

    await Comment.deleteMany({ threadPost: threadId });

    const forumId = req.forumId;
    await Forum.findByIdAndUpdate(forumId, 
        { $pull: { threads: threadId } },
        { new: true }
    );

    await User.findByIdAndUpdate(req.userId, 
        { $pull: { threads: thread._id } }, 
        { new: true }
    )


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
        if (alreadyUpvoted) {
            // User has already upvoted, remove the upvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { upvotes: -1 },
                $pull: { upvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $pull: { upvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread upvote removed successfully." });
        } else if (alreadyDownvoted) {
            // User has already downvoted, remove the downvote and add the upvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { downvotes: -1, upvotes: 1 },
                $pull: { downvotedBy: user._id },
                $addToSet: { upvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $pull: { downvotedThreads: thread._id },
                $addToSet: { upvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread upvoted successfully." });
        } else {
            // User hasn't upvoted yet, add the upvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { upvotes: 1 },
                $addToSet: { upvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $addToSet: { upvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread upvoted successfully." });
        }
    } else if (req.body.vote === 'downvote') {
        if (alreadyDownvoted) {
            // User has already downvoted, remove the downvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { downvotes: -1 },
                $pull: { downvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $pull: { downvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread downvote removed successfully." });
        } else if (alreadyUpvoted) {
            // User has already upvoted, remove the upvote and add the downvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { upvotes: -1, downvotes: 1 },
                $pull: { upvotedBy: user._id },
                $addToSet: { downvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $pull: { upvotedThreads: thread._id },
                $addToSet: { downvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread downvoted successfully." });
        } else {
            // User hasn't downvoted yet, add the downvote
            await Thread.findByIdAndUpdate(req.params.threadId, {
                $inc: { downvotes: 1 },
                $addToSet: { downvotedBy: user._id }
            });
            await User.findByIdAndUpdate(req.userId, {
                $addToSet: { downvotedThreads: thread._id }
            });
            res.status(200).json({ message: "Thread downvoted successfully." });
        }
    } else {
        res.status(400).json({ message: "Invalid vote type. Please provide 'upvote' or 'downvote'." });
    }
});

/* Get Top Ten Upvotes my dudes */
exports.thread_get_top_ten_threads = asyncHandler(async (req, res, next) => {
    try {
        const topThreads = await Thread.find().sort({ upvotes: -1 }).limit(10);
        res.json({ topThreads });
    } catch (error) {
        console.error('Error fetching top threads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
