Proyecto interdisciplinario
Primer cuatrimestre
Título de la propuesta: Advanced Pío IX Assisted Registration Control System (APARCS)                                   Grupo: 1 División: A

Integrantes:
Facundo Montivero
Tomas Nisenbom
Bautista Cogorno
Ivan Nieloud
Tomas Clur




Descripción de la propuesta

La idea sería digitalizar todo el sistema de tomar lista y asistencia en el colegio. Buscamos realizar una aplicación en la cual los alumnos sean escaneados para registrar su asistencia al colegio, para ello a cada estudiante se le proporcionará un código de identificación único para poder verificarlo. Deberá haber alguien verificando al momento de la entrada para evitar inconvenientes como que un alumno registre a dos personas al ingresar. Según su horario de asistencia se le asignará  presente, tarde (con sus respectivos casos ej: media falta, cuarto de falta o completa) y ausente. Además se consideran los casos especiales como las visitas al médico que en caso de presentar un certificado será justificada la falta y se le generaría un papel por asistencia tardía.
Una vez realizada la asistencia se almacenarán los datos, que antes de ser cargados el docente o preceptor de la primera hora tomará asistencia y se realizará una comparación con los datos previos. Un vez realizada la comparación y el formateo de datos se insertará a la base de datos, y se genera un grafico dinamico con los datos(considerando las actualizaciones por llegada tarde), además se generará un archivo csv o del formato que fígaro acepte para cargar la asistencia.


Bocetos de la interfaz de la aplicación
Link al Canva
Alcance
diseño responsivo a distintos celulares
sistema de manejo de asistencia 
sistema de manejo de entradas 
Preguntas y respuestas, jugadores y sus puntajes en base de datos
Ranking de jugadores
Agregado y modificación de preguntas desde la app

Tareas
Hay que hacer un login
Hay que hacer un registro
Hay que hacer página de alumno en la que pueda generar un QR para entrar al colegio, pueda ver sus faltas, pueda ver el horario de entrada
Hay que hacer página de admins para el celu en la que puedan escanear el QR del alumno y permitir que entren o no y justificar la entrada tardía 
Hay que hacer pagina de admin para la compu en la que puedan subir los partes diarios a la app que los profes puedan chequear
Hay que hacer página de profe para dar el presente en sus diferentes cursos 
Hay que hacer página de owner que maneja a los admins, a los profes y a los alumnos (borrarlos o añadirlos)
Falta justificable con la app
Cambiar el horario de entrada dependiendo de a qué hora entre
Notificar cuando no se corre la falta (día de paro o por ahí)
Diseño de BdD
UX, UI


Para las siguientes fechas tiene que estar hecho lo siguiente:
13/10 La base de datos (DER y tablas)
14/10 Login y registro
18/10 Formulario tomar lista por curso para profe
21/10 Generar QR y leerlo
24/10 Manejo de asistencias de admin
26/10 Operaciones CRUD a admin
30/10 Probar todo y arreglar errores
14/10 Extras (Pasar a WSS, JWT OutJS/Clerk, censurar la pantalla después del print screen)

Diagrama Gantt


DER: Nieloud, Cogorno, Montivero
Login y Registro: Nieloud, Nisenbom y Cogorno, Clur, Montivero 
Parte Diario: Cogorno, Clur, Nieloud
Generador/lector QR: Nisenbom, Montivero
Manejo de Asistencia: Clur, Nieloud, Cogono
CRUD en Admin: Nieloud, Nisenbom
Debugging: todos
Estilos: Clur