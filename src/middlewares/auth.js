export const isAdminRole = (req,res,next)=>{
    console.log("isAdmin", req.user)
    if(req.user.rol ==="admin"){
        next();
    } else {
        res.send("no tienes permisos")
    }
}