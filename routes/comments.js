const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleWare = require("../middleware/index.js");

console.log(middleWare.checkCampgroundOwnship);

//Comments New
router.get(
  "/campgrounds/:id/comments/new",
  middleWare.isLoggedIn,
  (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", { campground: campground });
      }
    });
  }
);

//Comments Create
router.post("/campgrounds/:id/comments", middleWare.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", err.message);
          console.log("err");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleWare.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      err
        ? res.redirect("back")
        : res.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment
          });
    });
  }
);
router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleWare.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, updatedComment) => {
        err
          ? res.redirect("back")
          : res.redirect("/campgrounds/" + req.params.id);
      }
    );
  }
);

router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleWare.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
      err ? res.redirect("back") : req.flash("success", " Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    });
  }
);

module.exports = router;
