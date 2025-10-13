//Sección MySQL del código
import mysql from 'mysql2/promise';

/**
 * Objeto con la configuración de la base de datos MySQL a utilizar.
 */
const SQL_CONFIGURATION_DATA =
{
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD, 
	database: process.env.MYSQL_DB,	
	port: 3306,
	charset: 'UTF8_GENERAL_CI'
}

/**
 * Realiza una query a la base de datos MySQL indicada en el archivo "mysql.js".
 * @param {String} queryString Query que se desea realizar. Textual como se utilizaría en el MySQL Workbench.
 * @returns Respuesta de la base de datos. Suele ser un vector de objetos.
 */
export async function realizarQuery(queryString) {
  let connection;
  try {
    connection = await mysql.createConnection(SQL_CONFIGURATION_DATA);
    const [rows] = await connection.execute(queryString);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;  
  } finally {
    if (connection && connection.end) await connection.end();
  }
}