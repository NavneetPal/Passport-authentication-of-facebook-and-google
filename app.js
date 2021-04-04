require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const connectDb=require('./config/db');
const path=require('path');
const morgan=require('morgan');
const session=require('express-session');
const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User=require('./model/user');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');

//require Routes
const indexRoutes=require('./routes/index')
const authRoutes=require('./routes/auth')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, done) {
     console.log(profile)
      const newUser={
          username:profile.displayName,
          email:profile.emails[0].value,
          googleId:profile.id,
      }
      try {
        let user=await User.findOne({ googleId: profile.id });
        if(!user){
            //craete the  user
            user=await User.create(newUser);
            done(null,user);
        }
        done(null,user)
      } catch (error) {
           done(err);
      }
      
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
async function(accessToken, refreshToken, profile, done) {
 /*  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  }); */
  const newUser=new User({
    username:profile.displayName,
    facebookId:profile.id
  });
  try {
    const currentUser=await User.findOne({facebookId:profile.id});
    if(!currentUser){
     const user=await newUser.save({validateBeforeSave:false});
      done(null,user);
    }else{
      done(null,currentUser);
    }
  } catch (error) {
    done(error)
  }
  console.log(profile);
}
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

//Database connection
connectDb();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(morgan('dev'));

const secret=process.env.SECRET || "fullstackdevelopmentisdope";
const store=MongoStore.create({
  mongoUrl:'mongodb://localhost:27017/google-auth',
  touchAfter: 24 * 3600 
})
app.use(session({
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname,'public')));




app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})






//Routing
app.use('/',indexRoutes);
app.use('/auth',authRoutes);


app.use((err,req,res,next)=>{
    console.log(err.message);
})

process.on('uncaughtException', function(err) {
    console.log(err)
})

//server
const port=3000;
app.listen(port,()=>{console.log(`Server listening on port ${port}`);})

