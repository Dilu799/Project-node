var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { route } = require('./admin');
const verifyLogin = (req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', async function(req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if(req.session.user){
   cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', {products,user,cartCount});
 
  })
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr = false;
  }
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
   userHelpers.doSignup(req.body).then((response)=>{
    req.session.user = response 
    req.session.user.loggedIn = true
     res.redirect('/')
   })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      res.redirect('/');
    }else{
      req.session.userLoginErr = "Invalid username/password";
      res.redirect('/login');
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user = null;
  res.redirect('/');
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  if(products.length > 0){
    let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/cart',{products,user:req.session.user, totalValue,cart:true});
  }else{
    res.redirect('/');
  }

})
router.get('/add-to-cart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{
    res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotalAmount(req.session.user._id)
    res.json(response)
  })
})

router.post('/remove-product',(req,res,next)=>{
  userHelpers.removeProduct(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/place-order',verifyLogin,async(req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let cartCount = null;
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
   }
  if(products.length > 0){
    let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user,cartCount})
  }else{
    res.redirect('/')
  }
  
})

router.post('/place-order',async(req,res)=>{
  let products = await userHelpers.getProductList(req.body.userid);
  let totalPrice = await userHelpers.getTotalAmount(req.body.userid);
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method'] === 'COD'){
    res.json({paySuccess:true})
    }else{
      userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
        res.json({response,razorpay:true})

      })
    }
  })
})
router.get('/order-success',verifyLogin,(req,res)=>{
    res.render('user/order-success',{user:req.session.user})
})

router.get('/orders',verifyLogin,async(req,res)=>{
  let orders = await userHelpers.getUserOrders(req.session.user._id);
  let cartCount = null;
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
   }
  res.render('user/orders',{user:req.session.user,orders,cartCount})
})
router.get('/view-order-products/:id',async(req,res)=>{
  let products = await userHelpers.getOrderProducts(req.params.id)
  let cartCount = null;
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
   }
  res.render('user/view-order-products',{user:req.session.user,products,cartCount})
})
router.post('/verify-payment',(req,res)=>{
  userHelpers.verifyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("payment success");
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status:false})
  })
})

router.get('*',(req,res)=>{
  res.send('404 not found')
})

module.exports = router;
