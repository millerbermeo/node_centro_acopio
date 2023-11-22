import express from 'express';
import body_parse from "body-parser"

const servidor = express();

servidor.use(body_parse.json());
// servidor.use(body_parse.urlencoded({ extended: true }));

servidor.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

servidor.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000');
});
