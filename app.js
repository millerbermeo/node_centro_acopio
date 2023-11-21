const express = require('express');
const bodyParser = require('body-parser');

const servidor = express();

servidor.use(bodyParser.json());
servidor.use(bodyParser.urlencoded({ extended: true }));

servidor.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

servidor.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000');
});
