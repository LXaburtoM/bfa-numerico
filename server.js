/**
 * Servidor Node/Express — Módulo de Usuario Final
 * Proyecto: numerico (BFA) — UAM
 *
 * Este servidor es el ÚNICO que habla con PostgreSQL (bfanumericobd).
 * El HTML/JS del estudiante nunca consulta la base directamente,
 * y nunca recibe la respuesta correcta de ninguna pregunta:
 * la calificación se hace aquí, en el servidor.
 *
 * AJUSTA los datos de conexión abajo según tu pgAdmin local.
 */

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------- CONEXIÓN A POSTGRES ----------
// Ajusta usuario/contraseña/host si en tu máquina son distintos.
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "bfanumericobd",
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend-html")));

// ---------- LÓGICA DE CÁLCULO (replica lo que hace ResultadoNumerico.java) ----------
function calcularPuntajeDirecto(tipoTest, aciertos, errores) {
    if (tipoTest === "N1_OPERACIONES") return aciertos;
    return aciertos - errores * 0.25;
}

function calcularPercentil(edad, puntajeDirecto) {
    let percentil;
    if (edad <= 12) percentil = puntajeDirecto * 3.5;
    else if (edad <= 15) percentil = puntajeDirecto * 2.8;
    else percentil = puntajeDirecto * 2.1;

    percentil = Math.round(percentil);
    if (percentil > 99) percentil = 99;
    if (percentil < 1) percentil = 1;
    return percentil;
}

function generarUUID() {
    // Genera un UUID simple compatible con el formato que usa Hibernate (32 chars sin guiones)
    return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, () =>
        Math.floor(Math.random() * 16).toString(16)
    );
}

// ---------- API: listar subtests disponibles (N1 / N2) ----------
app.get("/api/subtests", async (req, res) => {
    try {
        const query = `
      SELECT
        idconfiguracion AS id,
        nombre,
        tipotest,
        tiempolimiteminutos AS tiempo,
        (CASE WHEN tipotest = 'N1_OPERACIONES'
              THEN (SELECT COUNT(*) FROM pregunta_operacion po WHERE po.subtest_id = cs.idconfiguracion)
              ELSE (SELECT COUNT(*) FROM pregunta_problema pp WHERE pp.subtest_id = cs.idconfiguracion)
         END) AS total
      FROM configuracion_subtest cs
      ORDER BY tipotest;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudieron cargar los subtests." });
    }
});

// ---------- API: obtener preguntas de un subtest (SIN respuesta correcta) ----------
app.get("/api/preguntas/:subtestId", async (req, res) => {
    const { subtestId } = req.params;
    const { tipo } = req.query; // N1_OPERACIONES o N2_PROBLEMAS

    try {
        const tabla = tipo === "N1_OPERACIONES" ? "pregunta_operacion" : "pregunta_problema";
        const query = `
      SELECT idpregunta AS id, orden, enunciado, opciona, opcionb, opcionc, opciond
      FROM ${tabla}
      WHERE subtest_id = $1
      ORDER BY orden;
    `;
        const result = await pool.query(query, [subtestId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudieron cargar las preguntas." });
    }
});

// ---------- API: registrar al estudiante evaluado ----------
app.post("/api/estudiante", async (req, res) => {
    const { identificacion, nombre, apellido, edad, correoElectronico, sexo } = req.body;

    if (!identificacion || !nombre || !apellido || !edad || !sexo) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
    if (edad < 18) {
        return res.status(400).json({ error: "El evaluado debe ser mayor de edad." });
    }

    try {
        const id = generarUUID();
        const fechaIngreso = new Date(); // siempre el día actual

        const query = `
      INSERT INTO estudiante_evaluado
        (idestudiante, identificacion, nombre, apellido, edad, fechaingreso, correoelectronico, sexo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING idestudiante;
    `;
        const values = [id, identificacion, nombre, apellido, edad, fechaIngreso, correoElectronico || null, sexo];
        const result = await pool.query(query, values);
        res.json({ idEstudiante: result.rows[0].idestudiante });
    } catch (err) {
        console.error(err);
        if (err.code === "23505") {
            return res.status(409).json({ error: "Esa identificación ya está registrada." });
        }
        res.status(500).json({ error: "No se pudo registrar al estudiante." });
    }
});

// ---------- API: calificar y guardar el resultado ----------
app.post("/api/resultado", async (req, res) => {
    const { idEstudiante, subtestId, tipoTest, respuestas } = req.body;
    // respuestas: [{ idPregunta, opcionElegida }]

    if (!idEstudiante || !subtestId || !tipoTest || !Array.isArray(respuestas)) {
        return res.status(400).json({ error: "Datos incompletos para calificar." });
    }

    try {
        const tabla = tipoTest === "N1_OPERACIONES" ? "pregunta_operacion" : "pregunta_problema";

        const idsPreguntas = respuestas.map((r) => r.idPregunta);
        const claveQuery = `SELECT idpregunta, respuestacorrecta FROM ${tabla} WHERE idpregunta = ANY($1);`;
        const claveResult = await pool.query(claveQuery, [idsPreguntas]);

        const clavePorId = {};
        claveResult.rows.forEach((row) => {
            clavePorId[row.idpregunta] = row.respuestacorrecta;
        });

        let aciertos = 0;
        let errores = 0;
        respuestas.forEach((r) => {
            if (!r.opcionElegida) return; // pregunta sin responder, no cuenta ni acierto ni error
            if (clavePorId[r.idPregunta] === r.opcionElegida) aciertos++;
            else errores++;
        });

        // Edad del estudiante, necesaria para el percentil
        const estudianteResult = await pool.query(
            "SELECT edad FROM estudiante_evaluado WHERE idestudiante = $1",
            [idEstudiante]
        );
        if (estudianteResult.rows.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }
        const edad = estudianteResult.rows[0].edad;

        const puntajeDirecto = calcularPuntajeDirecto(tipoTest, aciertos, errores);
        const percentil = calcularPercentil(edad, puntajeDirecto);

        const idResultado = generarUUID();
        const insertQuery = `
      INSERT INTO resultado_numerico
        (idresultado, evaluado_idestudiante, subtest_idconfiguracion, aciertos, errores, puntajedirecto, percentil)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
        await pool.query(insertQuery, [
            idResultado,
            idEstudiante,
            subtestId,
            aciertos,
            errores,
            puntajeDirecto,
            percentil,
        ]);

        res.json({ aciertos, errores, puntajeDirecto, percentil, totalPreguntas: respuestas.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudo calificar y guardar el resultado." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor numerico corriendo en http://localhost:${PORT}/test.html`);
});