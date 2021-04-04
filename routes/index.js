const express=require('express')
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/register',(req,res)=>{
    res.render('register');
})
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','User logout successfully');
    res.redirect('/');
})

router.get('/contact',(req,res,next)=>{
    if(req.isAuthenticated()) next();
    req.flash('error','You must be logged in first')
    res.redirect('/register');
},(req,res)=>{
    res.render('contact');
})

module.exports=router;