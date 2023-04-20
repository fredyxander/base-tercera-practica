import { options } from "../config/options.js";

let productDao;
let cartDao;
let userDao;


switch (options.server.persistence) {
    case "mongo":
        ///solamente cuando se use mongo conectamos la base de datos
        await import("../config/dbConnection.js");
        //importamos dinámicamente los managers y modelos
        const {ProductManagerMongo} = await import("./managers/productManagerMongo.js");
        const {ProductModel} = await import("./models/product.model.js");
        const {CartManagerMongo} = await import("./managers/cartManagerMongo.js");
        const {CartModel} = await import("./models/cart.model.js");
        const {UserManagerMongo} = await import("./managers/userManagerMongo.js");
        const {UserModel} = await import("./models/user.model.js");
        productDao = new ProductManagerMongo(ProductModel);
        cartDao = new CartManagerMongo(CartModel);
        userDao = new UserManagerMongo(UserModel);
        break;
    case "fileSystem":
        const {ProductManagerFile} = await import("./managers/productManagerFile.js");
        const {CartManagerFile} = await import("./managers/cartManagerFile.js");
        productDao = new ProductManagerFile(options.fileSystem.productsFileName);
        cartDao = new CartManagerFile(options.fileSystem.cartsFileName);
        break;
}

export {productDao, cartDao, userDao};