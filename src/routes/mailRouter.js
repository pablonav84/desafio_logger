import { Router } from "express";
import { enviarMail } from "../mails.js";
import { upload } from "../utils.js";
import fs from "fs";

export const router = Router();

router.post("/mail", upload.array("imagenes"), async (req, res) => {
  let { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.redirect("/vistaMail?mensaje=Complete los datos...!!!");
  }
  console.log(req.files);
  let attachments = [];
  req.files.forEach((archivo) => {
    attachments.push({
      path: archivo.path,
      filename: archivo.originalname,
    });
  });
  try {
    let resultado = await enviarMail(to, subject, message, attachments);
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    if (resultado.accepted.length > 0) {
      return res.redirect("/vistaMail?mensaje=Envío correcto...!!!");
    } else {
      return res.redirect("/vistaMail?mensaje=Error al enviar mail... :(");
    }
  } catch (error) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    return res.redirect("/vistaMail?mensaje=Error al enviar mail: " + error.message);
  }
});