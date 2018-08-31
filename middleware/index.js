//all middle ware
const Campground = require("../models/campground");
const Comment = require("../models/comment");

var middleWareObj = {};

middleWareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
};

middleWareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
        if (!foundCampground) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }
        // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application

        if (
          foundCampground.author.id.equals(req.user._id) ||
          req.user.isAdmin
        ) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middleWareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("success", "Success!");
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
};

module.exports = middleWareObj;
