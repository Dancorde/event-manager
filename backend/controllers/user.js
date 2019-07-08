const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.postSignup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user && user.length >= 1) {
        return res.status(409).json({
          message: 'E-mail already exists'
        });
      } else {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                return res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
                console.log(err);
              });
          }
        });
      }
    });
};

exports.postLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      const token = jwt.sign(
        {email: user.email, userId: user._id},
        'secret_this_should_be_longer',
        {expiresIn: "1h"}
      );
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication failed",
        error: err
      });
    });
};
