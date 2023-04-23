const request = require("supertest");
const app = require("../app");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");

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

  describe("Testing product API's", () => {
    test("should create a new product", async () => {
      const newProduct = {
        name: "test product3",
        price: 12,
        description: "lol",
        category: "Electronics",
        stock: 10,
        images: {
          public_id: "sample images",
          url: "sampleURL",
        },
      };
      const response = await request(app)
        .post("/api/v1/products/new")
        .send(newProduct);
      // .expect(201);

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
        console.log("error", response.body.error);
      }

      // Clean up
      // await Product.deleteOne({ _id: response.body.product._id });
    });

    test("should return all products with status code 200", async () => {
      const resultPerPage = 5;
      const productCount = 10; // Set a product count for testing purposes
      jest.spyOn(Product, "countDocuments").mockResolvedValue(productCount);
      jest.spyOn(Product, "find").mockReturnValue(Product); // Mock the Product.find() method

      // Mock the ApiFeatures class methods
      const mockApiFeatures = jest
        .fn()
        .mockImplementation((query, queryString) => {
          return {
            search: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            pagination: jest.fn().mockReturnThis(),
            query,
          };
        });
      jest.mock("../utils/apiFeatures", () => mockApiFeatures);

      const response = await request(app).get("/api/v1/products");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        product: Product,
        productCount,
      });
      expect(Product.countDocuments).toHaveBeenCalledTimes(1);
      expect(Product.find).toHaveBeenCalledTimes(1);
      expect(mockApiFeatures).toHaveBeenCalledTimes(1);
      expect(mockApiFeatures).toHaveBeenCalledWith(Product, {});
    });
  });
});
