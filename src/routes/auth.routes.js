import {Router} from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller.js";
import { UserDTO } from "../daos/dtos/user.dto.js";

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

export { router as authRouter};