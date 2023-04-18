import passport from "passport";

class AuthController{
    static signupLocal = passport.authenticate("signupStrategy",{
        failureRedirect:"/api/sessions/failure-signup"
    });

    static redirectProducts(req,res){
        res.redirect("/products");
    };
}

export {AuthController}