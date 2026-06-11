const Listing = require('../models/listing.js');

module.exports.index = async(req,res)=>{
   const { searchQuery } = req.query;

if (searchQuery) {
  const allListings = await Listing.find({
    country: { $regex: searchQuery, $options: "i" }
  });
  if(allListings.length === 0){
    req.flash("error", "No listings found for the specified country.");
    return res.redirect("/listings");
  }
  return res.render("listings/index.ejs", { allListings });
} else {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}
};

module.exports.renderNewForm=  (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("Owner");
    
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs",{ listing  });
};

module.exports.createListing = async (req,res,next)=>{
    // let { title, description, image, price, location, country } = req.body
        let url = req.file.path;
        let filename = req.file.filename;
        console.log("URL:", url);
        console.log("FILENAME:", filename);
        
        const newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.Owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};

module.exports.renderEditform = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", '/upload/w_250'); // Example transformation to resize the image 
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing },);
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};


