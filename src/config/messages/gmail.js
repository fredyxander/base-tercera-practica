import {options} from "../options.js";
import nodemailer from "nodemailer";

//crear un transportador.
const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:options.gmail.adminGmail,
        pass:options.gmail.adminGmailPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

export const sendRecoveryEmail = async(email,token)=>{
    const link = `http://localhost:8080/restart-password?token=${token}`;//enlace con token

    await transporter.sendMail({
        from:"ecommerce pepito",
        to:email,
        subject:"email de recuperacion de contraseña",
        html:`
            <h3>Hola,</h3>
            <p>recibimos tu solicitud para recuperar la constraseña, da clic en el siguiente botón</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
        `
    });
}