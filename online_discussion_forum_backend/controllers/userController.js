const User = require('../models/users');
const Forum = require('../models/forums');
const Thread = require('../models/threads');
const Comment = require('../models/comments');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const asyncHandler = require('express-async-handler');

/* Display all users */
exports.user_get = asyncHandler(async (req, res, next) => {
    const [users, userCount] = await Promise.all([
        User.find().exec(),
        User.countDocuments().exec()
    ]);

    return res.status(201).json({
        userCount,
        users
    });
});

/* Display specific user */
exports.user_get_one = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.find({ _id: userId })
        .populate({
            path: 'threads',
            populate: {
                path: 'comments',
            }
        })
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'forumPost',
                },
                {
                    path: 'threadPost'
                }
            ]
        })
        .populate('upvotedThreads')
        .populate('downvotedThreads')
        .exec();

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
        user: user
    });
});

/* Create user account*/
exports.user_post_create = asyncHandler(async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(409).json({
            message: 'E-mail already exists'
        });
    }

    try {
        const hash = await bcrypt.hash(req.body.pass, 10);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            school_id: req.body.school_id,
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            user_name: req.body.user_name,
            profile: req.file.path,
            email: req.body.email,
            pass: hash,
            bio: req.body.bio,
            date_of_birth: req.body.date_of_birth,
            sex: req.body.sex,
            department: req.body.department,
            year_level: req.body.year_level,
            officer: req.body.officer,
            role: req.body.role instanceof Array ? req.body.role : [req.body.role]
        });

        const savedUser = await user.save();
        console.log(savedUser);
        return res.status(201).json({
            message: "User created"
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

/* Change user password*/
exports.user_post_changepass = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.pass, salt)
    const updatedPass = await User.findByIdAndUpdate({ _id: userId }, { pass: hashPassword }, { new: true })

    if (!updatedPass) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "Password changed successfully"
    })
});

/* Update user's info*/
exports.user_patch_info = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    // Check if req.file exists and contains the path property
    const profileImage = req.file ? req.file.path : undefined;

    const userDataToUpdate = { ...req.body };
    delete userDataToUpdate.profileImage;

    // If profileImage is defined, update the profile field
    if (profileImage) {
        userDataToUpdate.profile = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: userDataToUpdate }, { new: true });

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "User info has been updated.",
        user: updatedUser
    });
});


/* Delete user account*/
exports.user_delete = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const forums = await Forum.find({ user: userId });
    for (const forum of forums) {
        await Thread.deleteMany({ forumPost: forum._id });
        await Forum.findByIdAndDelete(forum._id);
    }

    await Comment.deleteMany({ user: userId });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "User info and associated data have been deleted.",
        user: deletedUser
    });
})