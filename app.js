if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");


const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const { Http2ServerRequest } = require("http2");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connected to Db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter : 24*60*60,
});
store.on("error",() => {
    console.log("ERROR IN MONGO SESSION HERE!", err);
});

const sessionOptions ={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser  = req.user;
    next();
});

// app.get("/demoUser", async(req,res) => {
//     let fakeUser = new user ({
//         email : "student@gmail.com",
//         username : "delta-student"
//     });

//     let registeredUser = await user.register(fakeUser, "helloworld");
//     res.send(registeredUser);

// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);



// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page not found!"));
// });

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;

    res.status(statusCode); // ✅ THIS WAS MISSING

    if(req.headers.accept.includes("application/json")){
        return res.json({ error: message }); // for Hoppscotch
    }

    res.render("error.ejs",{message});
});

app.listen(8080, ()=>{
    console.log("server is listening to port");
});