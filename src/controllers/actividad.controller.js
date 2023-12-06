import { pool } from "../database/conexion.js";

// Función para insertar actividad con usuarios asociados
export const ActividadRegistrarUsuarios = async (req, res) => {
  try {
    const { nombre_actividad, estado_actividad, lugar_actividad, fecha_actividad, usuarios } = req.body;

    // Iniciar la transacción
    await pool.query('START TRANSACTION');

    // Insertar la actividad
    const [actividadResult] = await pool.query(
        'INSERT INTO actividades (nombre_actividad, estado_actividad, lugar_actividad, fecha_actividad) VALUES (?, ?, ?, ?)',
        [nombre_actividad, estado_actividad, lugar_actividad, fecha_actividad]
      );
      
      const id_actividad = actividadResult.insertId;
      
      // Confirmar la transacción para la actividad
      
      // Iniciar una nueva transacción para usuarios
      await pool.query('START TRANSACTION');
      
      // Insertar usuarios asociados
      const usuariosInsertPromises = usuarios.map(async (id_usuario) => {
        await pool.query('INSERT INTO usuarios_actividades (fk_usuario, fk_actividad) VALUES (?, ?)', [id_usuario, id_actividad]);
      });
      
      await Promise.all(usuariosInsertPromises);
      
      // Confirmar la transacción para usuarios
      await pool.query('COMMIT');

    res.status(201).json({ success: true, message: 'Actividad con usuarios registrada con éxito.' });
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query('ROLLBACK');

    console.error('Error al insertar actividad con usuarios:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};
