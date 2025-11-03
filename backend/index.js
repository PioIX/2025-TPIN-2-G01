import express from "express";
import bodyParser from "body-parser";
import { realizarQuery } from "./modulos/mysql.js";
import cors from "cors";
import logger, { compile } from "morgan";
import jwt from "jsonwebtoken";
import crearToken from "./modulos/jwt.js";
import fs from "fs";
import session from 'express-session';
import { Server } from 'socket.io';  
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

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false
});
app.use(sessionMiddleware)  ;
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

const server = app.listen(port, () => {
	console.log(`Servidor  corriendo en http://localhost:${port}/`);
});;

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST", "PUT", "DELETE"],  	
        credentials: true                           	
    }
});



io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});
io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined && req.session.room.length > 0)
			socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('sendMessage', data => {
		io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
	});
  socket.on('saludar', data=> {
    console.log("hola celu")
    console.log(data)
    io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data.msg });
  })
  socket.on('unirme', data => { 
    socket.join(data.value)
    console.log(data)
    io.emit("mensajitoSala", {message: "hola"})
  })

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});

app.get("/", function (req, res) {
  res.send("sever running port 4000");
});

app.get("/getAllAlumnos", async function (req, res) {
  const result = await realizarQuery(`SELECT * FROM Alumnos`);
  res.send(result);
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
        rango: "alumno",
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
          rango: "profesor",
        });
      } else {
        let administrador = await realizarQuery(
          `SELECT * FROM Administradores WHERE correo_electronico = '${req.query.correo_electronico}' AND contraseña = '${req.query.contraseña}' `
        );
        console.log(administrador);
        if (administrador.length != 0) {
          const token = crearToken(administrador[0]);
          if (administrador[0].rango == "P") {
            res.send({
              mensaje: "acceso otorgado",
              key: token,
              rango: "preceptor",
            });
          } else {
            res.send({
              mensaje: "acceso otorgado",
              key: token,
              rango: "owner",
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

app.post("/usuarioLog", verificarJWT, async function (req, res) {
  try {
    const searchParam = req.header("Persona");

    if (searchParam == "admin" || searchParam == "preceptor") {
      const user = await realizarQuery(
        `SELECT * FROM Administradores WHERE correo_electronico = "${req.user}"`
      );
      console.log(user[0]);
      res.send({ message: user[0] });
    } else if (searchParam == "profesor") {
      const user = await realizarQuery(
        `SELECT * FROM Profesores WHERE correo_electronico = "${req.user}"`
      );
      res.send({ message: user[0] });
    } else if (searchParam == "alumno") {
      const user = await realizarQuery(
        `SELECT * FROM Alumnos WHERE correo_electronico = "${req.user}"`
      );
      res.send({ message: user[0] });
    }
  } catch (error) {
    res.send({ message: `tuviste un error ${error}` });
  }
});

app.get("/cursos", async function (req, res) {
  try {
    const cursos = await realizarQuery(
      `SELECT DISTINCT Cursos.id_curso, Cursos.año, Cursos.division, Cursos.carrera FROM Profesores
   inner join ProfesoresPorMateria on Profesores.id_profesor = ProfesoresPorMateria.id_profesor
   inner join Materias on Materias.id_materias = ProfesoresPorMateria.id_materias
   inner join MateriasPorCurso on Materias.id_materias = MateriasPorCurso.id_materia
   inner join Cursos on Cursos.id_curso = MateriasPorCurso.id_curso
   where Profesores.id_profesor = "${req.query.id_profesor}"`
    );
    res.send(cursos);
  } catch (error) {
    res.send({ message: `tuviste un error ${error}` });
  }
});

app.get("/alumnos", async function (req, res) {
  try {
    const alumnos = await realizarQuery(`
      SELECT distinct Alumnos.apellido, Alumnos.Nombre from Alumnos
      inner join Cursos on Alumnos.id_curso = Cursos.id_curso where Cursos.id_curso ="${req.query.id_curso}";`);
    res.send({ message: alumnos });
  } catch (error) {
    res.send({ message: `tuviste un error ${error}` });
  }
});

app.post("/lista", async function (req, res) {
  try {
    const fecha = new Date().toISOString().slice(0, 10);
    const fechaCompleta = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    console.log(fecha);
    console.log(fechaCompleta);

    for (let x = 0; x < req.body.length; x++) {
      const alumno = req.body[x];
      if (alumno.ausente) {
        const [nombre, apellido] = [alumno.nombre,alumno.apellido]
        console.log(nombre, apellido);

        const falta_estudiante = await realizarQuery(`
          SELECT Asistencias.falta
          FROM Asistencias
          INNER JOIN Alumnos ON Asistencias.id_alumno = Alumnos.id_alumno
          WHERE Alumnos.nombre = "${nombre}"
            AND Alumnos.apellido = "${apellido}"
            AND DATE(Asistencias.horario_de_entrada) = "${fecha}"
        `);

        if (falta_estudiante.length === 0) {
          const id_alumno = await realizarQuery(`
            SELECT id_alumno FROM Alumnos
            WHERE nombre = "${nombre}" AND apellido = "${apellido}"
          `);

          await realizarQuery(`
            INSERT INTO Asistencias (horario_de_entrada, id_alumno, falta, esta_justificada)
            VALUES ("${fechaCompleta}", ${id_alumno[0].id_alumno}, 1, FALSE)
          `);

          console.log("Falta registrada para:", nombre, apellido);
        } else {
          console.log(
            `El estudiante ${nombre} ${apellido} ya tiene una falta registrada hoy.`
          );
        }
      }
    }

    res.send({ message: "Asistencia computada correctamente" });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: `Error al registrar asistencia: ${error}` });
  }
});

// POST PARA ASISTENCIA PRECEPTORES
app.post("/asistencia", async function (req, res) {
  try {
    const rawdata = fs.readFileSync("./asistencia.json");
    const { horario_llegada } = JSON.parse(rawdata);
    const horario = new Date(horario_llegada);
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 19).replace('T', ' ');
    const horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    req.body.map(async (elemento) => {
      console.log(elemento);
      if (elemento.ausente) {
        console.log({ alumnos: `estoy ausente ${elemento.nombre}` });
        const falta = await realizarQuery(
          `SELECT * FROM Asistencias WHERE id_alumno = ${elemento.id} && horario_de_entrada = "${fecha}"`
        );
        if (!falta) {
          if (horas > horario.getHours()) {
            await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
            VALUES (${fecha}, ${elemento.id}, 1, FALSE)`);
          } else {
            if (horas == horario.getHours() && minutos > horario.getMinutes()) {
              const cantidad_minutos = minutos - horario.getMinutes();
              if (cantidad_minutos >= 15 && cantidad_minutos < 30) {
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 0.25, FALSE)`);
              }
              if (cantidad_minutos >= 30 && cantidad_minutos < 45) {
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 0.50, FALSE)`);
              }
              if (cantidad_minutos >= 45) {
                await realizarQuery(`INSERT into Asistencias horario_de_entrada, id_alumno, falta, esta_justificada
                VALUES (${fecha}, ${elemento.id}, 1, FALSE)`);
              }
            }
          }
        }
      }
    });
    res.send({ message: "asistencia recibida con exito" });
  } catch (error) {
    res.send({ message: `tuviste un error ${error}` });
  }
});

app.post("/getUsuarios",verificarJWT, async (req,res)=>{
  try{
    res.send(await realizarQuery("select * from Alumnos"))
  }catch{

  }
})

