const User = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');

/* POST request of user*/
exports.user_create_post = asyncHandler((req, res, next) => {
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
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            })
        }
    }) 
});