const express = require("express");
const router = express.Router();
const Campground = require("../models/campground.js");
const middleWare = require("../middleware/index.js");

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
//CREATE - add new campground to DB
router.post("/campgrounds", middleWare.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

router.get("/campgrounds/new", middleWare.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

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
//Edit Campground

router.get(
  "/campgrounds/:id/edit",
  middleWare.checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit", {
        campground: foundCampground
      });
    });
  }
);

//update route
router.put(
  "/campgrounds/:id",
  middleWare.checkCampgroundOwnership,
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
//Destroy Campground

router.delete(
  "/campgrounds/:id",
  middleWare.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
      err ? res.redirect("/campgrounds") : res.redirect("/campgrounds");
    });
  }
);

module.exports = router;
