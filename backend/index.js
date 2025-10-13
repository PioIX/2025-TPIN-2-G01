import express from 'express';
import bodyParser from 'body-parser';
import { realizarQuery } from './modulos/mysql.js';
import cors from 'cors';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import jwt from "jsonwebtoken"
import crearToken from './modulos/jwt.js';
var app = express();
var port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); 
app.use(logger('dev'));
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


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '../../../frontend/app/chat');
});



server.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});
