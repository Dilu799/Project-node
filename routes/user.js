var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
<<<<<<< HEAD

router.get('/', async function(req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if(req.session.user){
   cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
=======
/* GET home page. */
router.get('/',async function(req, res, next) {
  let user = req.session.user;
  let cartCount = null
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', {products,user,cartCount});
 
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr = false;
  }
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
   userHelpers.doSignup(req.body).then((response)=>{
<<<<<<< HEAD
     req.session.loggedIn = true
     req.session.user = response
     res.redirect('/')
=======
     req.session.loggedIn = true;
     req.session.user = response;
     res.redirect('/');
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
   })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    }else{
      req.session.loginErr = "Invalid username/password";
      res.redirect('/login');
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
router.get('/cart',verifyLogin,async(req,res)=>{
<<<<<<< HEAD
  let products =await userHelpers.getCartProducts(req.session.user._id)
  res.render('user/cart',{products,user:req.session.user});
})
router.get('/add-to-cart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{
    res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(()=>{
    res.json({response:true})
     
  })
})
=======
  let products = await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user});
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{ 
  userHelpers.addToCart(req.params._id, req.session.user._id).then(()=>{
   res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(()=>{
    
  })
})
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9

module.exports = router;
