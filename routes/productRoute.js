const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizedRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/products/new")
  .post(isAuthenticatedUser, authorizedRole("admin"), createProduct);
router
  .route("/products/:id")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
