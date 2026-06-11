const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to Db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, Owner: "6a11d63a6892226315b3acbb"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
