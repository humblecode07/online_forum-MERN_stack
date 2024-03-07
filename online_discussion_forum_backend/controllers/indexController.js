const User = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const asyncHandler = require("express-async-handler");

exports.home_page = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'kim ambilibabol basketbol' });
});


/* Handle user log in GET*/
exports.log_in_page = asyncHandler(async (req, res, next) => {
    
});

/* Handle user log in POST*/
exports.log_in = asyncHandler(async (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(404).render() //  RENDER LOG IN PAGE: AUTH FAILED 
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        //  RENDER LOG IN PAGE: AUTH FAILED
      }
      if (result) {
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        }, process.env.JWT_KEY, {
          expiresIn: "1hr"
        })
        return res.status(200).json({
          response: "Auth Successful.",
          token: token
        })
      }
      return res.status(401).render({
        //  RENDER LOG IN PAGE: AUTH FAILED
    }); 
    })
  })
});



/* 

*/