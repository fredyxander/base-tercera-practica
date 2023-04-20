import mongoose from "mongoose";
import {options} from "../src/config/options.js";
import { ProductModel } from "../src/daos/models/product.model.js";

await mongoose.connect(options.mongoDB.url);

const updateWithOwnerProducts = async()=>{
    const adminId ="643cc51b9c09d0b845e0272b";
    const result = await ProductModel.updateMany({},{$set:{owner:adminId}});
    console.log("result", result);
}
updateWithOwnerProducts();