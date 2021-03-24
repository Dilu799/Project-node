var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');


/* GET users listing. */
router.get('/', function(req, res, next) {
   
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products', {admin: true, products });
 
  })
});

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
    res.redirect('/admin/')
    
  })
  
})
<<<<<<< HEAD
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
=======

  router.get('/edit-product/:id',async(req,res)=>{
    let product = await productHelpers.getProductDetails(req.params.id)
    res.render('admin/edit-product',{product})
  })
router.post('/edit-product/:id', (req,res)=>{
  let id = req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin');
    if(req.files.Image){
      let image = req.files.Image
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})
<<<<<<< HEAD

=======
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9

module.exports = router;
