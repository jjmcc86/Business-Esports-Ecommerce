const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

// receive a post request to add item to cart
router.post("/cart/products", async (req, res) => {
  //figure out the cart
  let cart;
  if (!req.session.cartId) {
    // we don't have a cart; need to create one and store the cart id on req.session cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    //   we have a cart. Get it from repo
    console.log(req.session.cartId);
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  // either increment quantity or add new product
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  console.log(existingItem);
  if (existingItem) {
    // increment quantity
    existingItem.quantity++;
  } else {
    // add new productId
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect("/cart");
});

// receive a get request to show all items in cart
router.get("/cart", async (req, res) => {
  // if no cart
  if (!req.session.cartId) {
    return res.redirect("/");
  }
  // have cart
  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

// receive a post request to delete item from cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});

module.exports = router;
