const request = require("supertest");
const app = require("../app");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");

//Dummy || Modify this accordingly
const newProduct = {
  name: "new one",
  price: 12,
  description: "lol",
  category: "Electronics",
  stock: 10,
  images: {
    public_id: "sample images",
    url: "sampleURL",
  },
};

//Setting product id for use
let product;

describe("Product API", () => {
  beforeAll(async () => {
    const testDBUrl = "mongodb://localhost:27017/test";
    await mongoose.connect(testDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the database after running tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/products/new", () => {
    test("should create a new product", async () => {
      const response = await request(app)
        .post("/api/v1/products/new")
        .send(newProduct);

      if (response.body.success) {
        // The product was successfully created
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.product.name).toBe(newProduct.name);
        expect(response.body.product.price).toBe(newProduct.price);
      } else {
        // The product could not be created because the name is not unique
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe(
          `Product validation failed: name: Error, name ${newProduct.name} already exists.`
        );
      }
      // Clean up
      // await Product.deleteOne({ _id: response.body.product._id });
    });
  });

  describe("GET /api/v1/products", () => {
    test("should get all products", async () => {
      const res = await request(app).get("/api/v1/products");
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.productCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(res.body.product)).toBeTruthy();
      expect(res.body.product.length).toBeGreaterThanOrEqual(0);
      product = res.body.product[0]._id;
    });

    test("should filter products by name", async () => {
      const productName = "new one";
      const res = await request(app).get(
        `/api/v1/products?keyword=${productName}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.product)).toBeTruthy();
      expect(res.body.product[0].name).toEqual(productName);
    });

    test("should filter products by price", async () => {
      const res = await request(app).get(
        "/api/v1/products?price[gte]=10&price[lte]=100"
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.productCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(res.body.product)).toBeTruthy();
      const filteredProducts = res.body.product.filter(
        (product) => product.price >= 10 && product.price <= 100
      );
      expect(filteredProducts.length).toBeGreaterThanOrEqual(0);
      expect(res.body.product.length).toEqual(filteredProducts.length);
    });

    test("should paginate products", async () => {
      const res = await request(app).get("/api/v1/products?page=1");
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.productCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(res.body.product)).toBeTruthy();
    });
  });

  // Test to delete a product
  // describe("DELETE /api/v1/products/:id", () => {
  //   test("should delete an existing product", async () => {
  //     const id = await product;
  //     console.log("waiting for id", id);
  //     const res = await request(app).delete(`/api/v1/products/${product}`);
  //     if (product) {
  //       console.log("we have product", product);
  //       expect(res.statusCode).toEqual(200);
  //       expect(res.body.success).toEqual(true);
  //       expect(res.body.message).toEqual("Product Deleted Successfully");
  //     } else {
  //       console.log("no product", product);
  //       expect(res.statusCode).toBe(400);
  //       expect(res.body.success).toBe(false);
  //       expect(res.body.error).toBe("Resource not found, Invalid : _id");
  //     }
  //   });
  // });

  describe("GET /api/v1/products/:id", () => {
    test("should return a single product", async () => {
      // make a request to retrieve the newly created
      console.log("get single product", product);

      const res = await request(app).get(`/api/v1/products/${product}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.product._id).toEqual(product.toString());
    });

    test("should return a 404 error if the product does not exist", async () => {
      // make a request with a non-existing product ID
      const res = await request(app).get(
        "/api/v1/products/616348a6c39c8f2a0b3e7d41"
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body.error).toEqual("Product not found");
    });
  });

  describe("PUT /api/v1/products/:id", () => {
    test("should update a product by id", async () => {
      // Update the product
      const update = {
        name: "Product 2 but new",
        price: 200,
        description: "This is an updated product",
      };
      const res = await request(app)
        .put(`/api/v1/products/${product}`)
        .send(update);

      // Assertions
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.product.name).toEqual(update.name);
      expect(res.body.product.price).toEqual(update.price);
      expect(res.body.product.description).toEqual(update.description);

      // Clean up
      // await Product.findByIdAndDelete(product._id);
    });

    test("should return an error if product not found", async () => {
      const fakeId = "609f55b7f2521d8d29";
      const update = {
        name: "first 2",
        price: 200,
        description: "This is an updated product",
      };
      const res = await request(app)
        .put(`/api/v1/products/${fakeId}`)
        .send(update);

      // Assertions
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toEqual(false);
      expect(res.body.error).toEqual("Resource not found, Invalid : _id");
    });
  });

  // test("should return all products with status code 200", async () => {
  //   const resultPerPage = 5;
  //   const productCount = 10; // Set a product count for testing purposes
  //   jest.spyOn(Product, "countDocuments").mockResolvedValue(productCount);
  //   jest.spyOn(Product, "find").mockReturnValue(Product); // Mock the Product.find() method

  //   // Mock the ApiFeatures class methods
  //   const mockApiFeatures = jest
  //     .fn()
  //     .mockImplementation((query, queryString) => {
  //       return {
  //         search: jest.fn().mockReturnThis(),
  //         filter: jest.fn().mockReturnThis(),
  //         pagination: jest.fn().mockReturnThis(),
  //         query,
  //       };
  //     });
  //   jest.mock("../utils/apiFeatures", () => mockApiFeatures);

  //   const response = await request(app).get("/api/v1/products");

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual({
  //     success: true,
  //     product: Product,
  //     productCount,
  //   });
  //   expect(Product.countDocuments).toHaveBeenCalledTimes(1);
  //   expect(Product.find).toHaveBeenCalledTimes(1);
  //   expect(mockApiFeatures).toHaveBeenCalledTimes(1);
  //   expect(mockApiFeatures).toHaveBeenCalledWith(Product, {});
  // });
});
