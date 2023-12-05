import express from 'express';
import body_parse from "body-parser"
import {pool} from "./src/database/conexion.js"
import residuo from "./src/routers/residuo.router.js"
import validator from './src/routers/validator.router.js';

const servidor = express();

servidor.use(body_parse.json());
// servidor.use(body_parse.urlencoded({ extended: true }));

(async () => {
  try {
      await pool.query("SELECT 1");
      console.log("conexión establecida");
  } catch (error) {
      console.error("error de conexión: ", error);
  }
})();

servidor.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});


servidor.use('/residuo', residuo)
servidor.use('/usuario',validator);

servidor.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000');
});
