const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const Listing = require("../models/listing.js");

const { storage } = require("../cloudConfig.js");
const multer = require("multer");

const upload = multer({ storage }); // now this is REAL Cloudinary storage
const { findById } = require("../models/review.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controllers/listings.js");

//Index Route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// Create New route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Show Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditform));


module.exports = router;
