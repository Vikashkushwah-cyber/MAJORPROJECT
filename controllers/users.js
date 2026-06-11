const user = require("../models/user.js");  

module.exports.renderSignupForm =  (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup = async(req,res)=>{
   try{
     let {email, username, password} = req.body;
    let User = new user({email, username});
    let registeredUser = await user.register(User, password);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    })
   
   } catch(e){
    req.flash("error", e.message);
    res.redirect("/users/signup");
   }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("error", "You have been logged out!");
    res.redirect("/listings");
    });
    
};
