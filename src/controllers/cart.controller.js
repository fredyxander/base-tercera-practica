//patrón repository
import { cartService , productService } from "../daos/repository/index.js";


class CartController{
    static async createCart(req,res){
        try {
            const cartAdded = await artService.createCart();
            res.json({status:"success", result:cartAdded, message:"cart added"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async getCartProducts(req,res){
        try {
            const cartId = req.params.cid;
            //obtenemos el carrito
            const cart = await cartService.getCartById(cartId);
            res.json({status:"success", result:cart});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async addProductToCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart = await cartService.getCartById(cartId);
            // console.log("cart: ", cart);
            const product = await productService.getProductById(productId);
            // console.log("product: ", product);
            const cartUpdated = await cartService.addProductToCart(cartId, productId);
            res.json({status:"success", result:cartUpdated, message:"product added"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async deleteCartProduct(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart = await cartService.getCartById(cartId);
            // console.log("cart: ", cart);
            const product = await productService.getProductById(productId);
            // // console.log("product: ", product);
            const response = await cartService.deleteCartProduct(cartId, productId);
            res.json({status:"success", result:response, message:"product deleted"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async updateCart(req,res){
        try {
            const cartId = req.params.cid;
            const products = req.body.products;
            const cart = await cartService.getCartById(cartId);
            cart.products = [...products];
            const response = await cartService.updateCart(cartId, cart);
            res.json({status:"success", result:response, message:"cart updated"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async updateQuantityCartProduct(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            const cart = await cartService.getCartById(cartId);
            await ProductService.getProductById(productId);
            const response = await cartService.updateQuantityInCart(cartId, productId, quantity);
            res.json({status:"success", result:response, message:"cart updated"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };

    static async deleteAllCartProducts(req,res){
        try {
            const cartId = req.params.cid;
            const cart = await cartService.getCartById(cartId);
            cart.products=[];
            const response = await cartService.updateCart(cartId, cart);
            res.json({status:"success", result: response, message:"productos eliminados"});
        } catch (error) {
            res.status(400).json({status:"error", error:error.message});
        }
    };
}

export {CartController};