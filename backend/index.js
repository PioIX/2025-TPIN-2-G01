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
app.use(sessionMiddleware);
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
  // socket.on('saludar', data=> {
  //   console.log("hola celu")
  //   console.log(data)
  //   io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data.msg });
  // })
  socket.on('unirme', data => {
    const room = data.value;
    console.log(data)
    socket.join(room)
    io.to(room).emit("mensajitoSala", { message: "Conectado a sala" })
  });

  socket.on('MandarAsistencia', async data => {
    const email = data.value;
    console.log("asistencia de", email);

    const room = email;
    const fecha = new Date().toISOString().slice(0, 10);

    const [asistencia] = await realizarQuery(
      `SELECT falta, esta_justificada FROM Asistencias 
     WHERE date(horario_de_entrada) = "${fecha}" 
     AND id_alumno = (SELECT id_alumno FROM Alumnos WHERE correo_electronico = "${email}")`
    );

    if (!asistencia) return;

    let mensaje;
    if (asistencia.esta_justificada) {
      mensaje = "Tu falta fue justificada";
    } else {
      switch (asistencia.falta) {
        case 0: mensaje = "Llegaste bien"; break;
        case 0.25: mensaje = "Llegaste con 15 minutos de demora"; break;
        case 0.5: mensaje = "Llegaste con media falta"; break;
        case 1: mensaje = "Tenés una falta entera"; break;
        default: mensaje = "Error al calcular asistencia"; break;
      }
    }

    io.to(room).emit("NotificacionAlumno", { message: mensaje });
  });
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
app.get("/preceptoresCursos", async function (req, res) {
  try {
    const cursos = await realizarQuery(
      `SELECT Cursos.id_curso, Cursos.año, Cursos.division, Cursos.carrera FROM AdministradoresPorCurso
      inner join Cursos on AdministradoresPorCurso.id_curso = Cursos.id_curso 
      where id_administrador = "${req.query.id_administrador}";`
    );
    console.log("cursos", cursos)
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
app.get("/faltasAlumnos", async function (req, res) {
  try {
    console.log(req.query)
    const alumnos = await realizarQuery(`
      select Alumnos.id_alumno, Alumnos.nombre, Alumnos.apellido, Asistencias.falta, Asistencias.esta_justificada
      from Asistencias
      inner join Alumnos on Asistencias.id_alumno = Alumnos.id_alumno
      inner join Cursos on Alumnos.id_curso = Cursos.id_curso
      where Cursos.id_curso = ${req.query.id_curso} and date(Asistencias.horario_de_entrada) = "${new Date().toISOString().slice(0, 10)}" and Asistencias.falta > 0;`);
    console.log(alumnos)
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
        const [nombre, apellido] = [alumno.nombre, alumno.apellido]
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
    console.log("hola soy un endpoint")
    let justificativo
    if (req.header("justificacion") == true) {
      justificativo = true
    } else {
      justificativo = false
    }
    const estudianteScanneado = await realizarQuery(`SELECT * FROM Alumnos WHERE correo_electronico = "${req.body.email}"`)
    const [curso] = await realizarQuery(`Select * FROM Cursos where id_curso = ${estudianteScanneado[0].id_curso}`)
    const rawdata = fs.readFileSync("./asistencia.json");
    const horarios_cursos = JSON.parse(rawdata);
    console.log(estudianteScanneado)
    for (let x = 0; x < horarios_cursos.length; x++) {
      if (curso.año && curso.carrera && curso.division &&
        curso.año == horarios_cursos[x].año &&
        curso.carrera == horarios_cursos[x].carrera &&
        curso.division == horarios_cursos[x].division) {
          console.log("anda por favor")
        const horario_de_entrada = horarios_cursos[x].horario_de_entrada
        const horario = new Date(horario_de_entrada);
        const ahora = new Date();
        const fecha = ahora.toISOString().slice(0, 19).replace('T', ' ');
        const horas = ahora.getHours();
        const minutos = ahora.getMinutes();
        //-----------------------------------------------------------//
        const diferenciaMin = (ahora - horario) / 60000;
        let falta = 0;
        if (diferenciaMin >= 45) falta = 1;
        else if (diferenciaMin >= 30) falta = 0.5;
        else if (diferenciaMin >= 15) falta = 0.25;

        await realizarQuery(`
          INSERT INTO Asistencias (horario_de_entrada, id_alumno, falta, esta_justificada)
          VALUES ("${fecha}", ${estudianteScanneado[0].id_alumno}, ${falta}, ${justificativo})
        `);
        break;
      }
    }
    res.send({ message: "asistencia registrada con exito" });
  } catch (error) {
    console.log("entro al catch", error.message)
    res.send({ message: `tuviste un error ${error}` });
  }
});

app.post("/agregarUsuarios", async function (req, res) {
  try {
    switch (req.body.rango) {
      case "Alumno":
        await realizarQuery(`INSERT into Alumnos (id_curso, nombre, apellido, img_alumno, correo_electronico, contraseña)
        VALUES (${req.body.id_curso}, '${req.body.nombre}', '${req.body.apellido}', '${req.body.img_alumno}', '${req.body.correo_electronico}', '${req.body.contraseña}')`)
        res.send({ message: "Alumno agregado" })
        break
      case "Profesor":
        await realizarQuery(`INSERT into Profesores (nombre, apellido, correo_electronico, contraseña)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.correo_electronico}', '${req.body.contraseña}')`)
        res.send({ message: "Profesor agregado" })
        break
      case "Preceptor":
        await realizarQuery(`INSERT into Administradores (nombre, apellido, rango, correo_electronico, contraseña)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', 'P', '${req.body.correo_electronico}', '${req.body.contraseña}')`)
        res.send({ message: "Preceptor agregado" })
        break
      case "Owner":
        await realizarQuery(`INSERT into Administradores (nombre, apellido, rango, correo_electronico, contraseña)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', 'O', '${req.body.correo_electronico}', '${req.body.contraseña}')`)
        res.send({ message: "Owner agregado" })
        break
      default:
        res.send({ message: "Rango no encontrado" })
        break
    }
  } catch (error) {
    res.send(error)
    console.log("error al agregar usuario")
  }
})

app.post("/actualizarUsuarios", async function (req, res) {
  try {
    switch (req.body.rango) {
      case "Alumno":
        await realizarQuery(`UPDATE Alumnos SET(id_curso='${req.body.id_curso}', nombre='${req.body.nombre}', apellido='${req.body.apellido}', img_alumno='${req.body.img_alumno}', correo_electronico='${req.body.correo_electronico}', contraseña='${req.body.contraseña}') where (id_alumno = ${req.body.id})`)
        res.send({ message: "Alumno actualizado" })
        break
      case "Profesor":
        await realizarQuery(`UPDATE Profesores SET(nombre='${req.body.nombre}', apellido='${req.body.apellido}', correo_electronico='${req.body.correo_electronico}', contraseña='${req.body.contraseña}') where (id_profesor = ${req.body.id})`)
        res.send({ message: "Profesor actualizado" })
        break
      case ("Preceptor" || "Owner"):
        await realizarQuery(`UPDATE Administradores SET(nombre='${req.body.nombre}', apellido='${req.body.apellido}' rango='${req.body.rango}', correo_electronico='${req.body.correo_electronico}', contraseña='${req.body.contraseña}') where (id_adminstrador = ${req.body.id})`)
        res.send({ message: "Administrador actualizado" })
        break
      default:
        res.send({ message: "Usuario no encontrado" })
        break
    }
  } catch (error) {
    res.send(error)
    console.log("error al actualizar usuario")
  }
})

app.delete("/borrarUsuarios", async function (req, res) {
  try {
    switch (req.body.rango) {
      case "Alumno":
        await realizarQuery(`DELETE from Alumnos where (id_alumno = ${req.body.id})`)
        res.send({ message: "Alumno borrado" })
        break
      case "Profesor":
        await realizarQuery(`DELETE from Profesores where (id_profesor = ${req.body.id})`)
        res.send({ message: "Profesor borrado" })
        break
      case ("Preceptor" || "Owner"):
        await realizarQuery(`DELETE from Administradores where (id_adminsitrador = ${req.body.id})`)
        res.send({ message: "Administrador borrado" })
        break
      default:
        res.send({ message: "Usuario no encontrado" })
        break
    }
  } catch (error) {
    res.send(error)
    console.log("error al borrar usuario")
  }

})

app.get("/traerAsistencias", async function (req, res) {
  try {

    const result = await realizarQuery(`SELECT horario_de_entrada, falta, esta_justificada FROM Asistencias
    INNER JOIN Alumnos ON Asistencias.id_alumno = Alumnos.id_alumno
    WHERE Alumnos.correo_electronico = "${req.query.correo_electronico}" and Asistencias.falta > 0;`)

    res.send({ message: result })
  } catch (error) {
    res.send(error)
    console.log("Error al conseguir las faltas")
  }
})

app.get("/getAlumnos", async function (req, res) {
  try {
    const result = await realizarQuery('SELECT * from Alumnos')
    res.send({ message: result })
  } catch (error) {
    res.send(error)
    console.log("Error al traer alumnos")
  }

})

app.get("/getCursoAlumno", async function (req, res) {
  try {
    const result = await realizarQuery(`SELECT año, division, carrera FROM Cursos
    INNER JOIN Alumnos ON Cursos.id_curso = Alumnos.id_curso
    WHERE Alumnos.correo_electronico = "${req.query.correo_electronico}";`)
    res.send({ message: result })
  } catch (error) {
    res.send(error)
    console.log("Error al traer el curso del alumno")
  }
})

app.get("/getHorarioEntrada", (req, res) => {
  const { carrera, año, division } = req.query;

  try {
    const data = JSON.parse(fs.readFileSync("./asistencia.json", "utf8"));
    const curso = data.find(
      (c) => {
        switch (c.carrera) {
          case "informatica":
             c.carrera = "INF"
            break
          case "comunicacion":
            c.carrera = "COM" 
            break
          case "renovables":
            c.carrera = "REN" 
            break
          case "industrial":
             c.carrera = "IND" 
            break
        }
        return c.carrera === carrera &&
          c.año === Number(año) &&
          c.division === division
      }
    );


    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json({ horario_entrada: curso.horario_de_entrada });
  } catch (error) {
    console.error("Error leyendo JSON:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// app.listen(port, function () {
//   console.log(`Server running in http://localhost:${port}`);
// });

