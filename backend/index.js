import express from "express";
import bodyParser from "body-parser";
import { realizarQuery } from "./modulos/mysql.js";
import cors from "cors";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import crearToken from "./modulos/jwt.js";
import fs from "fs";
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
try {
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
} catch (error) {
    res.send({message: `tuviste un error ${error}`})
}
})

app.get('/cursos', async function (req,res) {
 try {
   const cursos = await realizarQuery (
   `SELECT DISTINCT Cursos.id_curso, Cursos.año, Cursos.division, Cursos.carrera FROM Profesores
   inner join ProfesoresPorMateria on Profesores.id_profesor = ProfesoresPorMateria.id_profesor
   inner join Materias on Materias.id_materias = ProfesoresPorMateria.id_materias
   inner join MateriasPorCurso on Materias.id_materias = MateriasPorCurso.id_materia
   inner join Cursos on Cursos.id_curso = MateriasPorCurso.id_curso
   where Profesores.id_profesor = "${req.query.id_profesor}"`)
   res.send(cursos)
 } catch (error) {
    res.send({message: `tuviste un error ${error}`})
 }
})

app.get('/alumnos',async function (req,res) {
try {
    const alumnos = await realizarQuery (`
      SELECT distinct Alumnos.apellido, Alumnos.Nombre from Alumnos
      inner join Cursos on Alumnos.id_curso = Cursos.id_curso where Cursos.id_curso ="${req.query.id_curso}";`)
    res.send({message:alumnos})
} catch (error) {
    res.send({message: `tuviste un error ${error}`})
}
})

app.post('/lista', async function (req,res) {
try {
    let año = new Date().getFullYear()
    let mes = new Date().getMonth()+1
    if (mes < 10) {
      mes = "0" + mes
    }
    let date = new Date().getDate()
    if (date < 10) {
      date = "0" + date
    }
  
    let hour = new Date().getHours()
    if (hour < 10) {
      hour = "0" + hour
    }
    let minutes = new Date().getMinutes()
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    let seconds = new Date().getSeconds()
    if (seconds < 10) {
      seconds = "0" + seconds
    }
  
    let fecha = `${año}-${mes}-${date}`
    let fechaCompleta = `${año}-${mes}-${date} ${hour}:${minutes}:${seconds}`
    console.log(fecha)
    console.log(fechaCompleta)
    req.body.map(async (elemento)=>{
      const falta_estudiante = await realizarQuery(`SELECT date(horario_de_entrada) FROM Asistencia WHERE date(horario_de_entrada)=${fecha}`)
      if(!falta_estudiante && elemento.ausente == true){
        await realizarQuery(`INSERT INTO Asistencia horario_de_entrada, id_alumno, falta, esta_justificada
        VALUES (${fechaCompleta}, ${elemento.id}, 1, FALSE)`)
      }
      if(falta_estudiante && elemento.ausente == true){
        console.log("ya esta ausente el estudiante")
      } 
    })
    res.send({message: "asistencia computada"})
} catch (error) {
  res.send({message: `tuviste un error ${error}`})
}
})

// POST PARA ASISTENCIA PRECEPTORES 
app.post('/asistencia', async function (req,res) {
  try {
    const año = new Date().getFullYear()
    const mes = new Date().getMonth()
    const date = new Date().getDate()
    const hour = new Date().getHours()
    const minute = new Date().getMinutes()
    const seconds = new Date().getSeconds()
  
    let rawdata = fs.readFileSync('./asistencia.json');
    let horario = JSON.parse(rawdata);
    horario = new Date(horario.horario_llegada)
    console.log(horario);
    const fecha = `${año}-${mes}-${date} ${hour}:${minute}:${seconds}`
    let horas = new Date(fecha).getHours()
    let minutos = new Date(fecha).getMinutes()
    
  
    req.body.map(async (elemento)=>{
      console.log(elemento)
      if (elemento.ausente) {
        console.log({alumnos: `estoy ausente ${elemento.nombre}`})
        const falta = await realizarQuery(`SELECT * FROM Asistencias WHERE id_alumno = ${elemento.id} && horario_de_entrada = "${fecha}"`)
        if(!falta){
          if (horas > horario.getHours()) {
            await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
            VALUES (${fecha}, ${elemento.id}, 1, FALSE)`)
          } else {
            if (horas == horario.getHours() && minutos > horario.getMinutes()) {
              const cantidad_minutos = minutos-horario.getMinutes()
              if(cantidad_minutos>=15 && cantidad_minutos<30){
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 0.25, FALSE)`)
              }
              if(cantidad_minutos>=30 && cantidad_minutos<45){
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 0.50, FALSE)`)
              }
              if(cantidad_minutos>=45){
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 1, FALSE)`)
              }
            }
          }
        }
      }
    })
    res.send({message:"asistencia recibida con exito"})
  } catch (error) {
    res.send({message: `tuviste un error ${error}`})
  }
})

app.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});
