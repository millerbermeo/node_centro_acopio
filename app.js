import express from 'express';
import body_parse from "body-parser"
import usuario from "./src/routers/usuario.router.js"

const servidor = express();

servidor.use(body_parse.json());
// servidor.use(body_parse.urlencoded({ extended: true }));

servidor.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

servidor.use('/usuario',validator);
servidor.use('/usuario', usuario);

servidor.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000');
});
