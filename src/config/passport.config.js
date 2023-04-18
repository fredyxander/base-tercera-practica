import passport from "passport";
import LocalStrategy from "passport-local";
import { UserModel } from "../daos/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GithubStrategy from "passport-github2";
import { options } from "./options.js";

const initializePassport = ()=>{

    //Estrategia de registro con passport-local
    passport.use("signupStrategy",new LocalStrategy(
        {
            passReqToCallback:true,
            usernameField:"email"//ahora username tendrá el valor del campo email
        },
        async (req,username,password,done)=>{
            const {first_name,last_name,email,age}=req.body;
            try {
                const user = await UserModel.findOne({email:username});
                if(user){
                    //aquí si bien no hay errores, nuestro proceso de registro no puede continuar porque el usuario ya existe, por lo tanto devolvemos user=false
                    return done(null, false);
                }
                //creamos el usuario
                let rol='usuario';
                if (email.endsWith("@coder.com")) {
                    rol = "admin";
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    rol
                };
                const userCreated = await UserModel.create(newUser);
                //si todo salio bien, ahora si proseguimos y en done retornamos error=null, y user igual al usuario creado
                return done(null, userCreated);
            } catch (error) {
                //si hay un error, ejecutamos done con el error como único argumento
                return done(error);
            }
        }
    ));

    //estrategía de login con passport-local
    passport.use("loginStrategy", new LocalStrategy(
        {
            usernameField:"email"
        },
        async (username, password, done)=>{
            try {
                const user = await UserModel.findOne({email:username});
                if(!user){
                    return done(null, false);
                }
                //usuario existe, validar contraseña
                if(!isValidPassword(user, password)) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //estrategía de login con github
    passport.use("githubSignup", new GithubStrategy(
        {
            clientID:options.github.githubclientId,
            clientSecret:options.github.githubClientSecret,
            callbackUrl:"http://localhost:8080/api/sessions/github-callback"
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {
                // console.log(profile);//vemos toda la información del perfil de github del usuario.
                const user = await UserModel.findOne({email:`${profile.username}@github.com`});
                //si el usuario no existe en nuestra DB, lo creamos en base a la información recibida de github.
                if(!user){
                    //No siempre tendremos toda la información disponible. En este caso no tenemos edad.
                    //tampoco almacenamos la contraseña, ya que la autenticación se hace con github.
                    const newUser={
                        first_name:profile.displayName || profile.username,
                        email:`${profile.username}@github.com`,
                        //si tenemos la contraseña como requerida podemos hashear algún id del usuario.
                        password:createHash(profile.id)
                    };
                    const userCreated = await UserModel.create(newUser);
                    //devolvemos el usuario creado
                    return done(null, userCreated);
                } else {
                    //si el usuario ya existe, devolvemos el usuario encontrado
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    //serialización y deserialización
    passport.serializeUser((user,done)=>{
        done(null, user.id);
    });

    passport.deserializeUser(async(id,done)=>{
        const user = await UserModel.findById(id);
        done(null, user);
    });
}

export {initializePassport};