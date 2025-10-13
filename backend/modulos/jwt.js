import jwt from "jsonwebtoken";

function crearToken(usuario) {
  const { contraseña, ...usuarioSinPass } = usuario; 
  const payload = { usuario: usuarioSinPass };       
  
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return token;
}

export default crearToken;
