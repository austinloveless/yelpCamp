const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Route Route
router.get("/", (req, res) => {
  res.render("landing");
});
router.get("/register", (req, res) => {
  res.render("register");
});

//sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "secretcode123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", (req, res) => {
  res.render("login");
});

//post route for login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {
    req.flash("success", "Welcome to YelpCamp!");
  }
);

//logout route logic
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

//Middle-Ware

module.exports = router;
