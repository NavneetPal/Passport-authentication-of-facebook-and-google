const express=require('express')
const router=express.Router();
const passport=require('passport');

router.get('/',(req,res)=>{
    res.send('hello');
})


//we are using passport.authenticate(),specifying the 'google' strategy, to authenticate requests
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/register' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success','Logged in SuccessFully')
    res.redirect('/');
  });

router.get('/facebook',passport.authenticate('facebook'))

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/register' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success','Logged in SuccessFully')
    res.redirect('/');
  });

module.exports=router;