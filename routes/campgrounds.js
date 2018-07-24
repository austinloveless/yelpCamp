const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware/index");
//index route
router.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

//create route
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// new route
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//show route
router.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//edit route
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

//update route
router.put(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCanpground) => {
        if (err) {
          res.redirect("/campgrounds");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

//destroy route
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
