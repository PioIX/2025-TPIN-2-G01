import express from "express";
import bodyParser from "body-parser";
import { realizarQuery } from "./modulos/mysql.js";
import cors from "cors";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import crearToken from "./modulos/jwt.js";
var app = express();
var port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function verificarJWT(req, res, next) {
  let token = req.header(process.env.TOKEN_HEADER_KEY);
  if (!token) {
    return res.status(403).send("Acceso denegado: no se envió token");
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified.usuario;
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).send("Token inválido");
  }
}

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "../../../frontend/app/chat");
});

app.get("/usuarios", async function (req, res) {
  try {
    console.log({usuario: req.query});
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let usuario = await realizarQuery(
      `SELECT * FROM Alumnos WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.Contraseña}' `
    );
    if (usuario.length != 0) {
      const token = crearToken(usuario[0]);
      res.send({ mensaje: "acceso otorgado", token });
    } else {
      let profesor = await realizarQuery(
        `SELECT * FROM Alumnos WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.Contraseña}' `
      );
      if (profesor.length != 0) {
        const token = crearToken(profesor[0]);
        res.send({ mensaje: "acceso otorgado", token });
      } else {
        let administrador = await realizarQuery(
          `SELECT * FROM Alumnos WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.Contraseña}' `
        );
        if (administrador.length != 0) {
          const token = crearToken(administrador[0]);
          res.send({ mensaje: "acceso otorgado", token });
        } else {
          console.log("no hubo ninguna coincidencia durante el login");
          res.send({ mensaje: "inicio de sesion incorrecto " });
        }
      }
    }
  } catch (error) {
    console.log({ "error durante el login": error });
    res.send({ mensaje: error });
  }
});

app.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});
