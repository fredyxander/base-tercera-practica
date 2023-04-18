import {Router} from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller.js";
import { UserDTO } from "../daos/dtos/user.dto.js";
//envio correos
import { generateEmailToken, verifyEmailToken, isValidPassword, createHash } from "../utils.js";
import { sendRecoveryEmail } from "../config/messages/gmail.js";
//remplazar con repository, controller y factory
import { UserManagerMongo } from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
const userService = new UserManagerMongo(UserModel);

const router = Router();

router.post("/signup", AuthController.signupLocal , AuthController.redirectProducts);

router.get("/failure-signup",(req,res)=>{
    res.send(`<div>Error al registrar al usuario, <a href="/signup">Intente de nuevo</a></div>`);
});

router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/failure-login"
}), (req,res)=>{
    req.session.user=req.user;
    res.redirect("/products");
});

router.get("/failure-login",(req,res)=>{
    res.send(`<div>Error al loguear al usuario, <a href="/login">Intente de nuevo</a></div>`);
});

//rutas estrategia github
router.get("/github",passport.authenticate("githubSignup"));

//Esta ruta DEBE COINCIDIR con la configurada como callback en la app de github, que ya github redirigirá a esta ruta con la información del usuario.
router.get("/github-callback",passport.authenticate("githubSignup",{
    failureRedirect:"/login"
}),
(req,res)=>{
    req.session.user=req.user;
    res.redirect("/products");
});

router.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({status:"error", message:"no se pudo cerrar la sesión"});
        res.json({status:"success", message:"sesion finalizada"});
    });
});

router.get("/current",(req,res)=>{
    console.log("current",req.user)
    if(req.user){
        const resultDto = new UserDTO(req.user);
        res.send(resultDto);
    } else {
        res.send({status:"error", error:"User no loggued"});
    }
});

//ruta para enviar el correo de recupercion de contrasena
router.post("/forgot-password",async(req,res)=>{
    try {
        const {email} = req.body;
        const user = await userService.getUserByEmail(email);
        if(!user){
            return res.send(`<p>el usuario no existe, <a href="/signup">Crea una cuenta</a></p>`)
        }
        const token = generateEmailToken(user.email,60);//tiempo de 3min
        await sendRecoveryEmail(email,token);
        res.send("<p>Fue enviado el correo con las instrucciones para restablecer la contraseña</p>")
    } catch (error) {
        res.send({status:"error", error: error.message});
    }
});

//ruta para restablecer la contraseña
router.post("/reset-password",async(req,res)=>{
    try {
        const token = req.query.token;
        const {email, newPassword} = req.body;
        //validar que el token sea valido.
        const validEmail = verifyEmailToken(token);
        if(!validEmail){
            return res.send(`El enlace caduco o no es valido, <a href="/forgot-password">intentar de nuevo</a>`)
        }
        //validamos que el usuario exista en la db
        const user = await userService.getUserByEmail(email);
        if(!user){
            return res.send(`<p>el usuario no existe, <a href="/signup">Crea una cuenta</a></p>`)
        }
        if(isValidPassword(user,newPassword)){
            //si las contrasenas son iguales
            return res.render("resetPassword",{error:"no puedes usar la misma contraseña",token})
        }
        //procedemos a actualizar la contrasena del usuario en la db
        const newUser = {
            ...user,
            password: createHash(newPassword)
        }
        await userService.updateUser(user._id,newUser);
        res.redirect("/login");
    } catch (error) {
        res.send({status:"error", error: error.message});
    }
})

export { router as authRouter};