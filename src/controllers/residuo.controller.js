import { pool } from "../database/conexion.js";

export const residuoRegistrar = async (req, res) => {
    try {
        const { rol } = req.user;

        if (rol === 'administrador') {
            const { nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm, fk_elemento, fk_actividad } = req.body;

            // Verificar si el residuo ya existe
            const checkResiduoSql = 'SELECT id_residuo, cantidad FROM residuos WHERE nombre_residuo = ?';
            const [rows] = await pool.query(checkResiduoSql, [nombre_residuo]);

            if (rows.length > 0) {
                // El residuo ya existe, actualiza la cantidad
                const id_residuo_existente = rows[0].id_residuo;
                const cantidad_existente = parseFloat(rows[0].cantidad) + parseFloat(cantidad);

                const updateResiduoSql = 'UPDATE residuos SET cantidad = ? WHERE id_residuo = ?';
                await pool.query(updateResiduoSql, [cantidad_existente, id_residuo_existente]);
            } else {
                // El residuo no existe, agrégalo a la tabla residuos
                const insertResiduoSql = 'INSERT INTO residuos (nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm) VALUES (?, ?, ?, ?, ?)';
                const [rows1] = await pool.query(insertResiduoSql, [nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm]);

                const id_residuo = rows1.insertId;

                // Agrega el movimiento a la tabla movimientos
                const insertMovimientoSql = 'INSERT INTO movimientos (tipo_movimiento, cantidad, fecha, fk_residuo, fk_elemento, fk_actividad) VALUES (?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)';
                await pool.query(insertMovimientoSql, ['entrada', cantidad, id_residuo, fk_elemento, fk_actividad]);
            }

            res.status(201).json({ success: true, message: "Residuo registrado con éxito." });
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (error) {
        console.error("Error al registrar residuo:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};




export const residuoListar = async (req, res) => {
    try {

//         SELECT 
//         r.nombre_residuo,
//         t.tipo_residuo,
//         SUM(r.cantidad) as cantidad_total,
//         r.unidad_medida,
//         a.nombre_alm AS nombre_almacenamiento
//     FROM 
//         residuos r 
//         JOIN almacenamiento a ON r.fk_alm = a.id_almacenamiento 
//         JOIN tipos t ON r.tipo_residuo = t.id_tipo
//     GROUP BY 
//         r.nombre_residuo;
// `;

        const query = 'SELECT r.id_residuo, r.nombre_residuo, t.tipo_residuo, r.cantidad, r.unidad_medida, r.fk_alm, a.nombre_alm AS nombre_almacenamiento FROM residuos r JOIN almacenamiento a ON r.fk_alm = a.id_almacenamiento JOIN tipos t ON r.tipo_residuo = t.id_tipo';
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

        
        const { rol } = req.user;

        if (rol === 'administrador') {


        const id = req.params.id;
        const query = 'SELECT r.id_residuo, r.nombre_residuo, t.tipo_residuo, r.cantidad, r.unidad_medida, r.fk_alm, a.nombre_alm AS nombre_almacenamiento FROM residuos r JOIN almacenamiento a ON r.fk_alm = a.id_almacenamiento JOIN tipos t ON r.tipo_residuo = t.id_tipo  WHERE r.id_residuo = ?';
        const [result] = await pool.query(query, [id]);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ 'message': `No se encontraron registros de residuos con id_residuo ${id}` });
        }
    } else {
        return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
    }

    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

export const residuoActualizar = async (req, res) => {
    try {

        const { rol } = req.user;

        if (rol === 'administrador') {

            let Id = req.params.id
            const { nombre_residuo, tipo_residuo, cantidad, unidad_medida, fk_alm } = req.body;

            let sql = `update residuos SET nombre_residuo = '${nombre_residuo}', tipo_residuo = '${tipo_residuo}', cantidad = '${cantidad}', unidad_medida = '${unidad_medida}', fk_alm = '${fk_alm}' WHERE id_residuo = ${Id}`

            let [rows] = await pool.query(sql)

            if (rows.affectedRows > 0)
                return res.status(200).json({ "message": "actualizado correctamente" })

            else
                return res.status(500).json({ "message": "no actualizado" })
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }

    } catch (error) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const residuoRegistrarSalida = async (req, res) => {
    try {
        const { rol } = req.user;

        if (rol === 'administrador') {
            let id = req.params.id
            const { cantidad } = req.body;


            const sql = `INSERT INTO movimientos (tipo_movimiento, cantidad, fecha, fk_residuo) VALUES ('salida', ?, CURRENT_TIMESTAMP(), ?)`;
            const [rows] = await pool.query(sql, [cantidad, id]);


            const sql2 = `UPDATE residuos SET cantidad = cantidad - ? WHERE id_residuo = ?`;
            await pool.query(sql2, [cantidad, id]);

            res.status(201).json({ success: true, message: "Registro de salida de residuo exitoso." });
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }


    } catch (error) {
        console.error("Error al registrar salida de residuo:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};


export const residuoListarMovimientos = async (req, res) => {
    try {
        const { rol } = req.user;

        if (rol === 'administrador') {
            let query = `
                SELECT m.id_movimiento, m.tipo_movimiento, m.cantidad, m.fecha, r.nombre_residuo, u.nombre_actividad
                FROM movimientos m
                JOIN residuos r ON m.fk_residuo = r.id_residuo
                LEFT JOIN actividades u ON m.fk_actividad = u.id_actividad
            `;
            const [result] = await pool.query(query);

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ 'message': 'No se encontraron movimientos' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
};
