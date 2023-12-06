import { pool } from "../database/conexion.js";

// Función para insertar actividad con usuarios asociados
export const ActividadRegistrarUsuarios = async (req, res) => {

    try {

        const { rol } = req.user;

    } catch (error) {
        // Revertir la transacción en caso de error
        await pool.query('ROLLBACK');

        console.error('Error al insertar actividad con usuarios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};


export const actividadTerminada = async (req, res) => {

    try {

            let id = req.params.id

            let sql = `UPDATE actividades SET estado_actividad = 'terminada' WHERE id_actividad = ${id}`

            await pool.query(sql)

            res.status(200).json({ success: true, message: 'Estado Actualizado.' });

    } catch (error) {
        console.error("Error actualizar estado:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
}

export const actividadListar = async (req, res) => {

    try {
        const { rol } = req.user;

        if (rol === 'administrador') {

            let query = "SELECT * from actividades"

            let [result] = await pool.query(query)

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ 'message': 'No se encontraron registros de actividades' });
            }

        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

export const actividadListarId = async (req, res) => {
    try {
        const { rol } = req.user;

        if (rol === 'administrador') {

            const id = req.params.id
            const query = 'SELECT * from actividades WHERE id_actividad = ?'
            const [result] = await pool.query(query, [id])

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ 'message': `No se encontraron registros de actiividades con el id ${id}` });
            }

        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }

    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

export const actividadActualizar = async (req, res) => {
    try {
        const { rol } = req.user;

        if (rol === 'administrador') {

            let id = req.params.id
            let { nombre_actividad, estado_actividad, lugar_actividad, fecha_actividad } = req.body

            let sql = `UPDATE actividades SET nombre_actividad = '${nombre_actividad}', estado_actividad = '${estado_actividad}', lugar_actividad = '${lugar_actividad}', fecha_actividad = '${fecha_actividad}' WHERE id_actividad = ${id}`

            await pool.query(sql)

            res.status(200).json({ success: true, message: 'Actividada Actualizada.' });
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (error) {
        console.error("Error actualizar actividad:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
}
