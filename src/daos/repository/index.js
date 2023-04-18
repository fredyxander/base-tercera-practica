import { productDao, cartDao } from "../factory.js";
import { ProductRepository } from "./product.repository.js";
import { CartRepository } from "./cart.repository.js";

export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);