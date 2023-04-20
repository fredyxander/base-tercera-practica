import { productDao, cartDao, userDao } from "../factory.js";
import { ProductRepository } from "./product.repository.js";
import { CartRepository } from "./cart.repository.js";
import { UserRepository} from "./user.repository.js";


export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);
export const userService = new UserRepository(userDao);