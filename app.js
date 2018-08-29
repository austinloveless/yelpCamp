require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./models/user");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

// console.log(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost:/yelp_camp");
//connecting to mongolabs
mongoose.connect(
  process.env.MONGODB,
  { useNewUrlParser: true }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// seedDB();

//passport Configuration
app.use(
  require("express-session")({
    secret: "Tom Eldon Austin",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, () => {
  console.log("listening on port", port);
});
