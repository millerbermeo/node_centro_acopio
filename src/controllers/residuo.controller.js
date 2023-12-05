import { pool } from "../database/conexion.js";

export const residuoRegistrar = async (req, res) => {
    try {
        const { nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm, fk_usuario, fk_elemento } = req.body;

        const sql1 = `INSERT INTO residuos (nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm) VALUES (?, ?, ?, ?, ?)`;
        const [rows1] = await pool.query(sql1, [nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm]);

        const id_residuo = rows1.insertId;

        const sql2 = `INSERT INTO movimientos (tipo_movimiento, cantidad, fecha, fk_residuo, fk_elemento, fk_usuario) VALUES ('entrada', ?, CURRENT_TIMESTAMP(), ?, ?)`;
        const [rows2] = await pool.query(sql2, [cantidad, id_residuo, fk_elemento, fk_usuario]);

        res.status(201).json({ success: true, message: "Residuo registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar residuo:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};


export const residuoListar = async (req, res) => {
    try {
        const query = 'SELECT r.id_residuo, r.nombre_residuo, r.tipo_residuo, r.cantidad, r.unidad_medida, r.fk_alm, a.nombre_alm AS nombre_almacenamiento FROM residuos r JOIN almacenamiento a ON r.fk_alm = a.id_almacenamiento ';
        const [result] = await pool.query(query);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ 'message': 'No se encontraron registros de residuos' });
        }

    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

export const residuoListarId = async (req, res) => {
    try {
        const id = req.params.id; 
        const query = 'SELECT r.id_residuo, r.nombre_residuo, r.tipo_residuo, r.cantidad, r.unidad_medida, r.fk_alm, a.nombre_alm AS nombre_almacenamiento FROM residuos r JOIN almacenamiento a ON r.fk_alm = a.id_almacenamiento WHERE r.id_residuo = ?';
        const [result] = await pool.query(query, [id]);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ 'message': `No se encontraron registros de residuos con id_residuo ${id}` });
        }

    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

export const residuoActualizar = async (req, res) => {
    try {
        let Id = req.params.id
        const { nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm } = req.body;

        let sql = `update residuos SET nombre_residuo = '${nombre_residuo}', tipo_residuo = '${tipo_residuo}', cantidad = '${cantidad}', unidad_medida = '${unidad_medida}', fk_alm = '${fk_alm}' WHERE id_residuo = ${Id}`

        let [rows] = await pool.query(sql)

        if (rows.affectedRows > 0) 
        return res.status(200).json({ "message": "actualizado correctamente" })

        else 
            return res.status(500).json({ "message": "no actualizado" })

    } catch (error) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const residuoRegistrarSalida = async (req, res) => {
    try {
      const { fk_residuo, cantidad, fk_usuario, fk_elemento } = req.body;
  
  
      const sql = `INSERT INTO movimientos (tipo_movimiento, cantidad, fecha, fk_residuo, fk_elemento, fk_usuario) VALUES ('salida', ?, CURRENT_TIMESTAMP(), ?, ?, ?)`;
      const [rows] = await pool.query(sql, [cantidad, fk_residuo, fk_elemento, fk_usuario]);
  
     
      const sql2 = `UPDATE residuos SET cantidad = cantidad - ? WHERE id_residuo = ?`;
      await pool.query(sql2, [cantidad, fk_residuo]);
  
      res.status(201).json({ success: true, message: "Registro de salida de residuo exitoso." });
    } catch (error) {
      console.error("Error al registrar salida de residuo:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
  };


export const residuoListarMovimientos = async (req, res) => {
    try {

        let query = 'SELECT m.id_movimiento, m.tipo_movimiento, m.cantidad, m.fecha, r.nombre_residuo, u.nombre FROM movimientos m JOIN residuos r ON m.fk_residuo = r.id_residuo JOIN usuarios u ON m.fk_usuario = u.id_usuario'
        const [result] = await pool.query(query);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ 'message': 'No se encontraron moviminentos' });
        }

    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}
