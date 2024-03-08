const User = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');

/* Display all users */
exports.user_get = asyncHandler(async (req, res, next) => {
    const [users, userCount] = await Promise.all([
        User.find().exec(),
        User.countDocuments().exec()
    ]);

    return res.status(201).json({
        users,
        userCount
    });
});

/* Create user account*/
exports.user_post_create = asyncHandler(async (req, res, next) => {
    User.find({
        email: req.body.email
      })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'E-mail exist'
          }) // putting an email exist into the signup
        }
        else {
            bcrypt.hash(req.body.pass, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        school_id: req.body.school_id,
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        user_name: req.body.user_name,
                        email: req.body.email,
                        pass: hash,
                        bio: req.body.bio,
                        date_of_birth: req.body.date_of_birth,
                        sex: req.body.sex,
                        department: req.body.department,
                        year_level: req.body.year_level,
                        officer: req.body.officer ,
                        role: req.body.role
                    });
                    
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        })
                    })
                }
            })
        }
    }) 
});

/* Change user password*/
exports.user_post_changepass = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { pass: hashPassword }, { new: true })

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "Password changed successfully"
    })
})