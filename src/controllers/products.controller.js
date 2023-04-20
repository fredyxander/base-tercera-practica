//patrón repository
import {productService} from "../daos/repository/index.js";
import {PremiumRole,AdminRole} from "../constants/api.js";

class ProductController{

    static async getPaginateProductsController(req,res){
        try {
            const {limit = 10,page=1,category,stock,sort="asc"} = req.query;
            const stockValue = stock==0 ? undefined : parseInt(stock);
            if(!["asc","desc"].includes(sort)){
                return res.json({status:"error", mesage:"orden no valido"});
            };
            const sortValue= sort === "asc" ? 1 : -1;
            // console.log('limit: ', limit, "page: ", page,"category: ", category, "stockValue: ", stockValue, "sortValue: ", sortValue);
            let query={};
            if (category && stockValue) {
                query = { category: category, stock: {$gte:stockValue} };
            } else {
                if (category || stockValue) {
                    if (category) {
                      query = { category: category };
                    } else {
                      query = { stock: {$gte:stockValue} };
                    }
                }
            };
            // console.log("query: ", query);
            const result = await productService.getPaginateProducts(
                query,
                {
                    page,
                    limit,
                    sort:{price:sortValue},
                    lean:true,
                }
            );
            console.log("result: ", result);
            const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
            res.json({
                status:"success",
                payload: result.docs,
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
                nextLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null
            });
        } catch (error) {
            res.status(400).json({status:"error",message:error.message});
        }
    };

    static async getProductById(req,res){
        try {
            const {pid} = req.params;
            const product = await productService.getProductById(pid);
            // console.log("product: ", product);
            res.status(200).json({status:"success", result:product});
        } catch (error) {
            res.status(400).json({message:error.message});
        }
    };

    static async createProduct(req,res){
        try {
            const body = req.body;
            body.status = Boolean(body.status);
            body.price = Number(body.price);
            body.stock = Number(body.stock);
            body.owner = req.user._id;
            // console.log("body: ", body);
            const productAdded = await productService.addProduct(body);
            res.json({status:"success", result:productAdded, message:"product added"});
        } catch (error) {
            res.status(400).json({status:"error",message:error.message});
        }
    };

    static async updateProduct(req,res){
        try {
            const productId = req.params.pid;
            const body = req.body;
            body.status = Boolean(body.status);
            body.price = Number(body.price);
            body.stock = Number(body.stock);
            // console.log("body: ", body);
            //actualizamos el método, pasándole el id y el body
            const productUpdated = await productService.updateProduct(productId,body);
            res.json({status:"success", result:productUpdated, message:"product updated"});
        } catch (error) {
            res.status(400).json({message:error});
        }
    };

    static async deleteProduct(req,res){
        try {
            const productId = req.params.pid;
            //obtenemos el producto, para obtener el id del owner
            const product = await productService.getProductById(productId);
            // console.log(product)
            // console.log(req.user);
            //validamos si el usuario que está borrando el producto es premium, y si es el owner del producto que está borrando,
            //también validamos si el usuario que está borrando el producto es un administrador
            if((req.user.rol === PremiumRole && product.owner == req.user._id) || req.user.rol === AdminRole){
                // lo dejamos que borre el producto
                const productdeleted = await productService.deleteProduct(productId);
                res.json({status:"success", result:productdeleted.message});
            } else {
                res.json({status:"error", message:"No tienes permisos para borrar este producto"});
            }
        } catch (error) {
            res.status(400).json({message:error});
        }
    };
}

export {ProductController};