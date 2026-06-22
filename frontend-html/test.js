// ══════════════════════════════════════════════════════════
// TEST DEL EVALUADO - ARCHIVO SEPARADO
// ══════════════════════════════════════════════════════════

let preguntaActualEvaluado = 0;
let respuestasEvaluado = [];

const preguntasEvaluado = [
    {
        texto: "Complete la serie: 2, 4, 6, 8, ¿cuál es el siguiente número?",
        respuestaCorrecta: "10",
        dificultad: "Fácil"
    },
    {
        texto: "Resuelva la operación: 15 + 7 - 3",
        respuestaCorrecta: "19",
        dificultad: "Medio"
    },
    {
        texto: "Si una persona compra 3 cuadernos de C$20 cada uno, ¿cuánto paga en total?",
        respuestaCorrecta: "60",
        dificultad: "Fácil"
    }
];

function normalizarRespuestaEvaluado(valor) {
    return String(valor).trim().toLowerCase();
}

function guardarRespuestaEvaluado() {
    const inputRespuesta = document.getElementById("test-answer-evaluado");

    if (inputRespuesta) {
        respuestasEvaluado[preguntaActualEvaluado] = inputRespuesta.value;
    }
}

function mostrarPreguntaEvaluado() {
    const pregunta = preguntasEvaluado[preguntaActualEvaluado];

    const progreso = document.getElementById("test-progress-evaluado");
    const label = document.getElementById("test-question-label-evaluado");
    const dificultad = document.getElementById("test-dificultad-evaluado");
    const texto = document.getElementById("test-question-text-evaluado");
    const respuesta = document.getElementById("test-answer-evaluado");
    const btnAnterior = document.getElementById("btn-prev-evaluado");
    const btnSiguiente = document.getElementById("btn-next-evaluado");
    const btnFinalizar = document.getElementById("btn-finish-evaluado");

    if (!progreso || !label || !dificultad || !texto || !respuesta) return;

    const esUltimaPregunta = preguntaActualEvaluado === preguntasEvaluado.length - 1;

    progreso.textContent = esUltimaPregunta
        ? `Última pregunta (${preguntaActualEvaluado + 1} de ${preguntasEvaluado.length})`
        : `Pregunta ${preguntaActualEvaluado + 1} de ${preguntasEvaluado.length}`;

    label.textContent = `Pregunta ${preguntaActualEvaluado + 1}`;
    dificultad.textContent = `Dificultad: ${pregunta.dificultad}`;
    texto.textContent = pregunta.texto;
    respuesta.value = respuestasEvaluado[preguntaActualEvaluado] || "";

    if (btnAnterior) {
        btnAnterior.disabled = preguntaActualEvaluado === 0;
    }

    if (btnSiguiente) {
        btnSiguiente.classList.toggle("d-none", esUltimaPregunta);
    }

    if (btnFinalizar) {
        btnFinalizar.classList.toggle("d-none", !esUltimaPregunta);
    }
}

function finalizarTestEvaluado() {
    guardarRespuestaEvaluado();

    let aciertos = 0;
    let errores = 0;

    let resumenHtml = `
        <div style="text-align:left;">
            <p>La evaluación fue completada correctamente.</p>
            <hr>
    `;

    preguntasEvaluado.forEach((pregunta, index) => {
        const respuestaOriginal = respuestasEvaluado[index] || "";
        const respuestaEvaluado = normalizarRespuestaEvaluado(respuestaOriginal);
        const respuestaCorrecta = normalizarRespuestaEvaluado(pregunta.respuestaCorrecta);

        const esCorrecta = respuestaEvaluado === respuestaCorrecta;

        if (esCorrecta) {
            aciertos++;
        } else {
            errores++;
        }

        resumenHtml += `
            <div style="margin-bottom:14px;">
                <strong>Pregunta ${index + 1}</strong><br>
                <span>${pregunta.texto}</span><br>
                <span><strong>Tu respuesta:</strong> ${respuestaOriginal || "Sin responder"}</span><br>
                <span><strong>Respuesta correcta:</strong> ${pregunta.respuestaCorrecta}</span><br>
                <span style="font-weight:600; color:${esCorrecta ? "#2e7d32" : "#8f1d1d"};">
                    ${esCorrecta ? "Correcta" : "Incorrecta"}
                </span>
            </div>
        `;
    });

    const puntajeDirecto = aciertos;

    resumenHtml += `
            <hr>
            <strong>Resultado final:</strong><br>
            Aciertos: ${aciertos}<br>
            Errores: ${errores}<br>
            Puntaje directo: ${puntajeDirecto}
        </div>
    `;

    Swal.fire({
        icon: "success",
        title: "Test finalizado",
        html: resumenHtml,
        width: 700,
        confirmButtonText: "Cerrar"
    });
}

const btnStartEvaluado = document.getElementById("btn-start-evaluado");

if (btnStartEvaluado) {
    btnStartEvaluado.addEventListener("click", function () {
        const pantallaInicio = document.getElementById("test-start-card");
        const pantallaTest = document.getElementById("test-runner-evaluado");

        preguntaActualEvaluado = 0;
        respuestasEvaluado = [];

        pantallaInicio.classList.add("d-none");
        pantallaTest.classList.remove("d-none");

        mostrarPreguntaEvaluado();

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {
                console.log("El navegador no activó pantalla completa.");
            });
        }
    });
}

const btnNextEvaluado = document.getElementById("btn-next-evaluado");

if (btnNextEvaluado) {
    btnNextEvaluado.addEventListener("click", function () {
        guardarRespuestaEvaluado();

        if (preguntaActualEvaluado < preguntasEvaluado.length - 1) {
            preguntaActualEvaluado++;
            mostrarPreguntaEvaluado();
        }
    });
}

const btnPrevEvaluado = document.getElementById("btn-prev-evaluado");

if (btnPrevEvaluado) {
    btnPrevEvaluado.addEventListener("click", function () {
        guardarRespuestaEvaluado();

        if (preguntaActualEvaluado > 0) {
            preguntaActualEvaluado--;
            mostrarPreguntaEvaluado();
        }
    });
}

const btnFinishEvaluado = document.getElementById("btn-finish-evaluado");

if (btnFinishEvaluado) {
    btnFinishEvaluado.addEventListener("click", finalizarTestEvaluado);
}