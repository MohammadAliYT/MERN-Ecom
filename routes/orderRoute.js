const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrders,
  deleteOrders,
} = require("../controller/orderController");

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router
  .route("/admin/orders/")
  .get(isAuthenticatedUser, authorizedRole("admin"), allOrders);
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateOrders)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteOrders);

module.exports = router;
