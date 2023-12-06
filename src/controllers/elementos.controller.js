import { pool } from "../database/conexion.js";

export const elementoRegistrar = async (req, res) => {
    try {
        const { nombre_elm, tipo_elm, cantidad } = req.body;
        const sql = `INSERT INTO elementos (nombre_elm, tipo_elm, cantidad) VALUES (?,?,?)`;
        await pool.query(sql, [nombre_elm, tipo_elm, cantidad]);
        res.status(201).json({ success: true, message: "Residuo registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar elemento:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const elementoListar = async (req, res) => {
    try {
        let query = "SELECT * from elementos";
        let [result] = await pool.query(query);
        result.length > 0 ?
            res.status(200).json(result) :
            res.status(404).json({ 'message': 'No se encontraron elementos' });
    } catch (error) {
        console.error("Error al listar elementos:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const elementoListarId = async (req, res) => {
    try {
        const id = req.params.id;
        const query = 'SELECT * from elementos WHERE id_elemento = ?';
        const [result] = await pool.query(query, [id]);
        result.length > 0 ?
            res.status(200).json(result) :
            res.status(404).json({ 'message': `No se encontraron registros del elementos con el id ${id}` });
    } catch (error) {
        console.error("Error al buscar elemento:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const elementoActualizar = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre_elm, tipo_elm, cantidad } = req.body;
        let sql = `UPDATE elementos SET nombre_elm = '${nombre_elm}', tipo_elm = '${tipo_elm}', cantidad = '${cantidad}' WHERE id_elemento = ${id}`;
        let [rows] = await pool.query(sql);
        rows.affectedRows > 0 ?
            res.status(200).json({ "message": "actualizado correctamente" }) :
            res.status(500).json({ "message": "no actualizado" });
    } catch (error) {
        console.error("Error al actualizar elemento:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};

export const elementoEliminar = async (req, res) => {
    try {
        const id = req.params.id;
        const query = `DELETE from elementos WHERE id_elemento = ${id}`;
        await pool.query(query);
        res.status(200).json({ "message": "eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar elemento:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};
