import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const SECRET_SESSION=process.env.SECRET_SESSION;
const MONGO_USER=process.env.MONGO_USER;
const MONGO_PASS=process.env.MONGO_PASS;
const MONGO_DB_NAME=process.env.MONGO_DB_NAME;
const GITHUB_APP_ID=process.env.GITHUB_APP_ID;
const GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET=process.env.GITHUB_CLIENT_SECRET;
const PERSISTENCE = process.env.PERSISTENCE;

export const options = {
    fileSystem:{
        usersFileName: 'users.json',
        productsFileName: 'products.json',
        cartsFileName: 'carts.json',
    },
    mongoDB:{
        url:`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@coderbackend.d0kaklh.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
    },
    github:{
        githubAppId:GITHUB_APP_ID,
        githubclientId:GITHUB_CLIENT_ID,
        githubClientSecret:GITHUB_CLIENT_SECRET
    },
    server:{
        port:PORT,
        secretSession:SECRET_SESSION,
        persistence: PERSISTENCE
    }
};