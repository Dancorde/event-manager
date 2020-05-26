const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./users.model");

exports.postSignup = async (req, res, next) => {
  await User.find({ email: req.body.email }).then((user) => {
    if (user && user.length >= 1) {
      return res.status(409).json({
        message: "E-mail already exists!",
      });
    } else {
      bcrypt.hash(req.body.password, 12, (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: "Invalid password!",
            error: err,
          });
        } else {
          const user = new User({
            email: req.body.email,
            password: hash,
          });
          user.save().then((result) => {
            return res.status(201).json({
              message: "User created",
              result,
            });
          });
        }
      });
    }
  });
};

exports.postLogin = async (req, res, next) => {
  let fetchedUser;
  console.log(req.body.password, req.body.email);
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed!",
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed!",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return err;
    });
};
