import { Router, Response, Request } from "express";
import Product from "../controllers/productController/productControllers";
import validateRequest from "../middleware/validator";
import { body, query, param } from "express-validator";

const productRouter = Router();

const productController = new Product();

productRouter.post(
  "/product/addproduct",
  [
    body("userID").isInt().withMessage("UserID must be an Integer"),
    body("categoryID").isInt().withMessage("CategoryID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("desc").notEmpty().withMessage("Description is an required"),
    body("price").isDecimal().withMessage("Price must be a decimal number"),
    body("stockQuantity").notEmpty().withMessage("Stock Qunatity is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => productController.addProduct(req, res)
);

productRouter.get("/getallproducts", (req: Request, res: Response) =>
  productController.getAllProducts(req, res)
);

productRouter.get(
  "/product/:productID",
  param("productID").isInt().withMessage("Param ProductID must be Integer"),
  validateRequest,
  (req: Request, res: Response) =>
    productController.getProductByIDParam(req, res)
);

productRouter.get(
  "/products",
  [query("itemName").isString().withMessage("Product Name must be a String")],
  validateRequest,
  (req: Request, res: Response) => productController.getProductsByName(req, res)
);

productRouter.patch(
  "/product/:productID",
  [
    param("productID").isInt().withMessage("Param ProductID must be Integer"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("Price must be decimal number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be text"),
    body("stockQuantity")
      .optional()
      .isInt()
      .withMessage("Stock Qunatity must be Integer"),
    body("name").optional().isString().withMessage("Name must be text"),
    body("category")
      .optional()
      .isInt()
      .withMessage("Category ID is required not Category Name"),
  ],
  validateRequest,
  (req: Request, res: Response) => productController.updateProduct(req, res)
);

productRouter.delete(
  "/product/remove",
  [body("productID").notEmpty().withMessage("ProductID is required")],
  validateRequest,
  (req: Request, res: Response) => productController.removeProduct(req, res)
);

export default productRouter;
