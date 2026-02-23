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
export async function realizarQuery(query, params) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB
    });

    const [results] = await connection.execute(query, params);
    await connection.end();
    return results;

  } catch (error) {
    console.log('⚠️ MySQL no disponible, usando datos locales');

    if (query.includes('asistencia')) return asistenciaData;
    if (query.includes('cursos')) return cursosData;

    return [];
  }
}