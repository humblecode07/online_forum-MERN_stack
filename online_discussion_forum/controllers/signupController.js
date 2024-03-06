const User = require('../models/users')

const asyncHandler = require("express-async-handler");

exports.home_page = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'kim ambilibabol basketbol' });
});

/* Handle user signing up */
exports.sign_up = asyncHandler(async (req, res, next) => {
    User.find({
        email: req.body.email
      })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).render('') // putting an email exist into the signup
        }
      })
});