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
  await mongoose.connect('mongodb+srv://vikashkushwah6260510031_db_user:IupqhSJg020074gm@cluster0.yvvv52o.mongodb.net/?appName=Cluster0');

};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, Owner: "6a11d63a6892226315b3acbb"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
