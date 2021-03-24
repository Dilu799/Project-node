var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
var objectId = require('mongodb').ObjectID;
const { RequestHeaderFieldsTooLarge } = require('http-errors');
const { response, disable } = require('../app');
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            });
        });
    },
        doLogin:(userData)=>{
           return new Promise(async(resolve, reject)=>{
               let loginStatus = false
               let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password, user.Password).then((status)=>{
                    if(status){
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }else{
                        resolve({status:false})
                    }
                })

                }else{
                    resolve({status:false}) 
                }

           })
        },
        addToCart:(proId,userId)=>{
<<<<<<< HEAD
            let proObj = {
                item:objectId(proId),
                quantity:1 
=======
            let prObj = {
                item:objectId(proId),
                quantity:1
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
            }
            return new Promise(async(resolve,reject)=>{
                let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                if(userCart){
<<<<<<< HEAD
                    var proExist = userCart.products.findIndex(product => product.item == proId)
                    if(proExist != -1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId),'products.item':objectId(proId)},
                        {
                            $inc:{'products.$.quantity':1}
                        }
                        ).then(()=>{
                            resolve()
=======
                    let proExist = userCart.products.findIndex(product=> product.item == proId)
                    if(proExist != -1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId),'products.item':objectId(proId)},
                        
                        {
                            $inc:{'products.$.quantity':1}
                        }).then(()=>{
                            resolve
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
                        })
                    }else{
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                    {
<<<<<<< HEAD
                        $push:{products:proObj}
                    }).then((response)=>{
                        resolve()
                    })
                }
                }else{
                    let cartObj ={
                        user:objectId(userId),
                        products:[proObj]
=======
                        $push:{products:prObj}
                    }
                    ).then((response)=>{
                        resolve()
                    })}
                }else{
                    let cartObj = {
                        user:objectId(userId),
                        products:[prObj]
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })
                }
            })
<<<<<<< HEAD
        },
        getCartProducts:(userId)=>{
            return new Promise(async(resolve,reject)=>{
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            }
                ]).toArray()
                resolve(cartItems)
            })
        },
        getCartCount:(userId)=>{
            return new Promise(async(resolve,reject)=>{
                let count = 0
                let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
               
=======
        }
        ,
        getCartProducts:(userId)=>{
            return new Promise(async(resolve,reject)=>{
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match:{user:objectId(userId)}
                    },
                    {
                        $unwind:'$products'
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                        }
                    },
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'product'
                        }
                    },
                {
                    $project:{
                        item:1,quantity:1,products:{$arrayElement:['$products',0]}
                    }
                }
                    
                ]).toArray()
                console.log(cartItems);
                resolve(cartItems[0].cartItems)
            })
        },
        getCartCount:(userId)=>{
            return new Promise(async(resolve, reject) => {
                let count = 0
                let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
                if(cart){
                    count = cart.products.length
                }
                resolve(count)
<<<<<<< HEAD
            })
        },
        changeProductQuantity:(details)=>{
            details.count = parseInt(details.count)
            return new Promise((resolve,reject)=>{
                    db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }
                    ).then(()=>{
                        resolve()
                    })
        })
    }
=======
            });
        },
        changeProductQuantity:({details})=>{
            count = parseInt(count)
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                        
                {
                    $inc:{'products.$.quantity':details.count}
                }).then(()=>{
                    resolve
                })
            })
        }
>>>>>>> 28abe3c7411c945fe10eb7bbf6f58a328d3935d9
}