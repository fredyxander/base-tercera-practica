import path from "path";
import {fileURLToPath} from 'url';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {options} from "./config/options.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword=(user, password)=>{
    return bcrypt.compareSync(password, user.password);
};

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email}, options.server.tokenKey, {expiresIn:expireTime});
    return token;
};

export const verifyEmailToken=(token)=>{
    try {
        const info = jwt.verify(token, options.server.tokenKey);
        return info.email;
    } catch (error) {
        return null;
    }
};