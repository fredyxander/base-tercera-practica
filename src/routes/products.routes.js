import {Router} from "express";
import {ProductController} from "../controllers/products.controller.js";
import { checkValidProductFields } from "../middlewares/validations.js";
import { isAdminRole, checkRoles } from "../middlewares/auth.js";
import {AdminRole,PremiumRole} from "../constants/api.js";

const router = Router();

router.get("/", ProductController.getPaginateProductsController);

router.get("/:pid",ProductController.getProductById);

//ruta para agregar un producto
router.post("/", checkValidProductFields,checkRoles([AdminRole,PremiumRole]), ProductController.createProduct);

//ruta para actualizar un producto
router.put("/:pid",checkValidProductFields,ProductController.updateProduct);

//ruta para eliminar el producto
router.delete("/:pid",checkRoles([AdminRole,PremiumRole]),ProductController.deleteProduct);

export {router as productsRouter};