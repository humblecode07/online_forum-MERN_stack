const User = require('../models/users');
const Forum = require('../models/forums');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

/* Display all forums */
exports.forum_get = asyncHandler(async (req, res, next) => {
    const [forums, forumCount] = await Promise.all([
        Forum.find().exec(),
        Forum.countDocuments().exec()
    ]);

    return res.status(201).json({
        forumCount,
        forums
    });
});

/* Display a forum */
exports.forum_get_one = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;
    const forum = await Forum.find({_id: forumId}).exec();

    if (!forum) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
        forum: forum
    });
});

/* Create forum */
exports.forum_create = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userData.userId);

    const forum = new Forum({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        creator: user.first_name + " " + user.family_name,
        description: req.body.description,
        creationTime: req.body.creationTime,
    });

    await forum.save();

    return res.status(200).json({
        message: "Forum, " + req.body.name + ", has been created",
    })
});

/* Edit forum detail */
exports.forum_patch_info = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;

    const updatedForum = await Forum.findByIdAndUpdate({ _id: forumId }, {
        $set: req.body, editedAt: Date.now()
    }, { new: true });

    if (!updatedForum) {
        return res.status(404).json({ message: "Forum not found" });
    }

    return res.status(200).json({
        message: "Forum info has been updated.",
        user: updatedForum
    })
});

/* Delete forum */
exports.forum_delete = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;

    const forum = await Forum.findByIdAndDelete({ _id: forumId })

    // Implement storage for deleted forums.

    if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
    }

    return res.status(200).json({
        message: "Forum info has been deleted.",
        forum: forum
    })
});