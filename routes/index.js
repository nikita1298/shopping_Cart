var express = require('express');
var router = express.Router();
var Cart = require('../model/cart')
var Order = require('../model/order');
var Product = require('../model/product');

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));

    }
    res.render('shop/index', { title: 'shopping cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });

  });

});
router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart)
    res.redirect('/');
  });
});
router.get('/reduce/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
})

router.get('/remove/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeitem(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
})
router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null })
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout',isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg });


});
router.post('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("sk_test_hn1I0JD9pvuz8WFK3D3jHUnL");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "inr",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }

    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
      orderdate:new Date(Date.now()).toLocaleString()
    });
    order.save(function (err, result) {
      
      req.flash('success', 'payment done sucessfully ');
      req.session.cart = null;
      res.redirect('/');

    });
  });
});


module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldurl=req.url;
  res.redirect('/user/signin');
}
