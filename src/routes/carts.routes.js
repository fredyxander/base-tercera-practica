import {Router} from "express";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();

//agregar carrito
router.post("/",CartController.createCart);

//ruta para listar todos los productos de un carrito
router.get("/:cid",CartController.getCartProducts);

//ruta para agregar un producto al carrito
router.post("/:cid/product/:pid",CartController.addProductToCart);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid",CartController.deleteCartProduct);

//ruta para actualizar todos los productos de un carrito.
router.put("/:cid",CartController.updateCart);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid",CartController.updateQuantityCartProduct);

//ruta para eliminar todos los productos del carrito
router.delete("/:cid",CartController.deleteAllCartProducts);

export {router as cartsRouter};