var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const verifyLogin = (req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin-login')
  }
}

router.get('/admin',async(req,res)=>{
  if(req.session.admin){
 await productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products', {admin: true, products });
  })
}else{
  res.redirect('/admin-login')
}
})

router.get('/admin-login',async(req,res)=>{
  if(req.session.admin){
    await productHelpers.getAllProducts().then((products)=>{
      res.render('admin/view-products', {admin: true, products });
  })
}else{
  res.render('admin/admin-login')
}
})

router.post('/admin-login',(req,res)=>{
  userHelpers.adminLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = response.admin;
      req.session.admin.loggedIn = true;
      res.redirect('/admin');
    }else{
      res.render('admin/admin-login',{"loginErr":req.session.userLoginErr})
      req.session.userLoginErr = false; 
    }
  }).catch(()=>{
    console.log("Invalid user")
  })
})
router.get('/admin-logout',(req,res)=>{
  req.session.admin = null;
  res.redirect('/admin-login');
})
router.get('/add-product', function(req,res){
  res.render('admin/add-product');
});
router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body, (id)=>{
    let image = req.files.Image;
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.redirect("/admin/add-product")
      }else{
        console.log(err);
      }
    });
  });
})
  
router.get('/delete-product/:id',(req,res,)=>{
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
  
})
router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id', (req,res)=>{
  let id = req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image = req.files.image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

router.get('/allorders',async(req,res)=>{
  let orders = await userHelpers.getAllOrders();
  res.render('admin/admin-allorders',{orders})
})

router.get('allusers',async(req,res)=>{
  let users = await userHelpers.getAllUsers();
  res.render('admin/admin-allusers',{users})
})
module.exports = router;