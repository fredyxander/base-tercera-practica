import {userService} from "../daos/repository/index.js";
import {UsuarioRole, PremiumRole} from "../constants/api.js";

class UserController{
    static async modifyUser(req,res){
        try {
            const userId = req.params.uid;
            //Verificamos si el usuario existe en la db
            const user = await userService.getUserById(userId);
            //obtenemos el actual rol del usuario
            const userRole = user.rol;
            //validamos el rol actual y cambiamos el rol del usuario
            if(userRole === UsuarioRole){
                user.rol = PremiumRole;
            } else if(userRole === PremiumRole) {
                user.rol = UsuarioRole;
            } else {
                return res.json({status:"error", message:"No es posible cambiar el rol de un administrador"});
            }
            await userService.updateUser(userId,user);
            res.json({status:"success", message:`nuevo rol del usuario: ${user.rol}`});
        } catch (error) {
            res.status(400).json({status:"error",message:error.message});
        }
    };
}

export {UserController}