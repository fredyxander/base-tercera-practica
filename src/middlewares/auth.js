export const isAdminRole = (req,res,next)=>{
    console.log("isAdmin", req.user)
    if(req.user.rol ==="admin"){
        next();
    } else {
        res.send("no tienes permisos")
    }
};

export const checkRoles = (roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({status:"error",message:"Debes estar autenticado"})
        }
        //obtener el rol del usuario
        const userRole = req.user.rol;
        if(!roles.includes(userRole)){
            return res.status(403).json({status:"error",message:"No tienes permisos para esta accion"})
        }
        next();
    }
}