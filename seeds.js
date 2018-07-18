const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
  {
    name: "Clouds Rest",
    image:
      "https://images.unsplash.com/photo-1413752567787-baa02dde3c65?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=00dab0342c1b6498228d16e4a7d82ad3&auto=format&fit=crop&w=800&q=60",
    description: "Blah blah blah"
  },
  {
    name: "Desert Mesa",
    image:
      "https://images.unsplash.com/photo-1413752567787-baa02dde3c65?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=00dab0342c1b6498228d16e4a7d82ad3&auto=format&fit=crop&w=800&q=60",
    description: "Blah blah blah"
  },
  {
    name: "Canyon Floor",
    image:
      "https://images.unsplash.com/photo-1413752567787-baa02dde3c65?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=00dab0342c1b6498228d16e4a7d82ad3&auto=format&fit=crop&w=800&q=60",
    description: "Blah blah blah"
  }
];

function seedDB() {
  //removes all campgrounds
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds");
  });
  //add a few campgrounds
  data.forEach(seed => {
    Campground.create(seed, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        console.log("added campground");
        //add a few comments
        Comment.create(
          { text: "This place is great", author: "Homer" },
          (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("created new comment");
            }
          }
        );
      }
    });
  });
}

module.exports = seedDB;
