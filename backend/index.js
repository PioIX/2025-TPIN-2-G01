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

app.get("/login", async function (req, res) {
  try {
    console.log({ usuario: req.query });
    console.log(req.query.contraseña);
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let usuario = await realizarQuery(
      `SELECT * FROM Alumnos WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.contraseña}' `
    );
    if (usuario.length != 0) {
      const token = crearToken(usuario[0]);
      res.send({
        mensaje: "acceso otorgado",
        key: token,
        rango: "alumno"
      });
    } else {
      let profesor = await realizarQuery(
        `SELECT * FROM Profesores WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.contraseña}' `
      );
      if (profesor.length != 0) {
        const token = crearToken(profesor[0]);
        res.send({
          mensaje: "acceso otorgado",
          key: token,
          rango: "profesor"
        });
      } else {
        let administrador = await realizarQuery(
          `SELECT * FROM Administradores WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.contraseña}' `
        );
        console.log(administrador)
        if (administrador.length != 0) {
          const token = crearToken(administrador[0]);
          if(administrador[0].rango=="P"){
            res.send({
              mensaje: "acceso otorgado",
              key: token,
              rango: "preceptor"
            });
          } else {
              res.send({
              mensaje: "acceso otorgado",
              key: token,
              rango: "owner"
            });
          }
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

app.post("/usuarioLog",verificarJWT,async function(req,res) {
  const searchParam = req.header("Persona")
  
  if(searchParam == "admin" || searchParam == "preceptor"){
    const user = await realizarQuery (`SELECT * FROM Administradores WHERE correo_electronico = "${req.user}"`)
    console.log(user[0])
    res.send({message:user[0]})
  }
  else if(searchParam == "profesor"){
    const user = await realizarQuery (`SELECT * FROM Profesores WHERE correo_electronico = "${req.user}"`)
    res.send({message:user[0]})
  }
  else if(searchParam == "alumno"){
    const user = await realizarQuery (`SELECT * FROM Alumnos WHERE correo_electronico = "${req.user}"`)
    res.send({message:user[0]})
  }
})

app.get('/cursos', async function (req,res) {
  const cursos = await realizarQuery (
  `SELECT DISTINCT Cursos.id_curso, Cursos.año, Cursos.division, Cursos.carrera FROM Profesores
  inner join ProfesoresPorMateria on Profesores.id_profesor = ProfesoresPorMateria.id_profesor
  inner join Materias on Materias.id_materias = ProfesoresPorMateria.id_materias
  inner join MateriasPorCurso on Materias.id_materias = MateriasPorCurso.id_materia
  inner join Cursos on Cursos.id_curso = MateriasPorCurso.id_curso
  where Profesores.id_profesor = "${req.query.id_profesor}"`)
  res.send(cursos)
})

app.get('/alumnos',async function (req,res) {
  const alumnos = await realizarQuery (`
    SELECT distinct Alumnos.apellido, Alumnos.Nombre from Alumnos
    inner join Cursos on Alumnos.id_curso = Cursos.id_curso where Cursos.id_curso ="${req.query.id_curso}";`)
  res.send({message:alumnos})
  })
app.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});
