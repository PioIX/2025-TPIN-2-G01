import jwt from "jsonwebtoken";

function crearToken(usuario) {
  const { correo_electronico, ...usuarioDestructurado } = usuario; 
  const payload = { usuario: correo_electronico };       
  
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return token;
}

export default crearToken;
