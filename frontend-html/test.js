/* ═══════════════════════════════════════════════════════════════
   BFA Numérico — test.js
   Pantalla del evaluado · Completamente independiente del admin
   ═══════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ════════════════════════════════════════════════════════════════
     DATOS DE PREGUNTAS
     Luego este arreglo se reemplaza por fetch() al API.
     ════════════════════════════════════════════════════════════════ */
  const TEST_PREGUNTAS = [
    {
      texto: 'Complete la serie: 2, 4, 6, 8, ¿cuál es el siguiente número?',
      respuestaCorrecta: '10',
      dificultad: 'Fácil',
    },
    {
      texto: 'Resuelva la operación: 15 + 7 - 3',
      respuestaCorrecta: '19',
      dificultad: 'Medio',
    },
    {
      texto: 'Si una persona compra 3 cuadernos de C$20 cada uno, ¿cuánto paga en total?',
      respuestaCorrecta: '60',
      dificultad: 'Fácil',
    },
  ];

  const testState = {
    indiceActual: 0,
    respuestas: Array(TEST_PREGUNTAS.length).fill(''),
    iniciado: false,
    finalizado: false,
  };

  const dom = {
    startCard: document.getElementById('test-start-card'),
    runner: document.getElementById('test-runner-evaluado'),
    btnStart: document.getElementById('btn-start-evaluado'),
    progressTexto: document.getElementById('test-progress-evaluado'),
    progressBar: document.getElementById('test-progress-bar-fill'),
    preguntaLabel: document.getElementById('test-question-label-evaluado'),
    dificultad: document.getElementById('test-dificultad-evaluado'),
    enunciado: document.getElementById('test-question-text-evaluado'),
    respuestaInput: document.getElementById('test-answer-evaluado'),
    btnPrev: document.getElementById('btn-prev-evaluado'),
    btnNext: document.getElementById('btn-next-evaluado'),
    btnFinish: document.getElementById('btn-finish-evaluado'),
  };

  const elementosRequeridos = Object.values(dom);
  if (elementosRequeridos.some((el) => !el)) {
    console.error('BFA Numérico: faltan elementos del test en test.html.');
    return;
  }

  dom.btnStart.addEventListener('click', iniciarTest);
  dom.btnPrev.addEventListener('click', irPreguntaAnterior);
  dom.btnNext.addEventListener('click', irPreguntaSiguiente);
  dom.btnFinish.addEventListener('click', finalizarTest);

  function iniciarTest() {
    testState.indiceActual = 0;
    testState.respuestas = Array(TEST_PREGUNTAS.length).fill('');
    testState.iniciado = true;
    testState.finalizado = false;

    dom.startCard.classList.add('d-none');
    dom.runner.classList.remove('d-none');

    renderPregunta();

    try {
      const page = document.documentElement;
      if (page.requestFullscreen) page.requestFullscreen();
      else if (page.webkitRequestFullscreen) page.webkitRequestFullscreen();
      else if (page.mozRequestFullScreen) page.mozRequestFullScreen();
      else if (page.msRequestFullscreen) page.msRequestFullscreen();
    } catch (error) {
      console.log('Pantalla completa no disponible.');
    }
  }

  function renderPregunta() {
    const total = TEST_PREGUNTAS.length;
    const index = testState.indiceActual;
    const pregunta = TEST_PREGUNTAS[index];
    const esUltima = index === total - 1;
    const porcentaje = Math.round(((index + 1) / total) * 100);

    dom.progressTexto.textContent = esUltima
      ? `Última pregunta (${index + 1} de ${total})`
      : `Pregunta ${index + 1} de ${total}`;

    dom.progressBar.style.width = `${porcentaje}%`;
    dom.progressBar.setAttribute('aria-valuenow', String(porcentaje));

    dom.preguntaLabel.textContent = `Pregunta ${index + 1}`;
    dom.enunciado.textContent = pregunta.texto;

    dom.dificultad.textContent = pregunta.dificultad;
    dom.dificultad.className = 'badge test-badge-dificultad';

    const claseDificultad = {
      'Fácil': 'badge-facil',
      'Medio': 'badge-medio',
      'Difícil': 'badge-dificil',
    }[pregunta.dificultad];

    if (claseDificultad) {
      dom.dificultad.classList.add(claseDificultad);
    }

    dom.respuestaInput.value = testState.respuestas[index] || '';
    dom.respuestaInput.focus();

    dom.btnPrev.disabled = index === 0;
    dom.btnNext.classList.toggle('d-none', esUltima);
    dom.btnFinish.classList.toggle('d-none', !esUltima);
  }

  function guardarRespuestaActual() {
    testState.respuestas[testState.indiceActual] = dom.respuestaInput.value;
  }

  function irPreguntaAnterior() {
    if (testState.indiceActual === 0) return;

    guardarRespuestaActual();
    testState.indiceActual -= 1;
    renderPregunta();
  }

  function irPreguntaSiguiente() {
    if (testState.indiceActual >= TEST_PREGUNTAS.length - 1) return;

    guardarRespuestaActual();
    testState.indiceActual += 1;
    renderPregunta();
  }

  function finalizarTest() {
    guardarRespuestaActual();
    testState.finalizado = true;
    mostrarResumen();
  }

  function mostrarResumen() {
    const total = TEST_PREGUNTAS.length;
    let aciertos = 0;
    let errores = 0;

    const filas = TEST_PREGUNTAS.map((pregunta, index) => {
      const respuestaOriginal = testState.respuestas[index] || '';
      const respuestaEvaluado = normalizarRespuesta(respuestaOriginal);
      const respuestaCorrecta = normalizarRespuesta(pregunta.respuestaCorrecta);

      const sinResponder = respuestaEvaluado === '';
      const esCorrecta = !sinResponder && respuestaEvaluado === respuestaCorrecta;

      if (esCorrecta) aciertos += 1;
      else errores += 1;

      const respuestaMostrada = sinResponder
        ? '<em class="result-vacia">Sin responder</em>'
        : escapeHtml(respuestaOriginal.trim());

      const estadoMostrado = esCorrecta
        ? '<span class="result-ok">✓ Correcta</span>'
        : '<span class="result-err">✗ Incorrecta</span>';

      return `
        <tr>
          <td style="font-weight:500;color:#8f8b85;width:32px">${index + 1}</td>
          <td style="max-width:220px">${escapeHtml(pregunta.texto)}</td>
          <td>${respuestaMostrada}</td>
          <td style="color:#5a5751">${escapeHtml(pregunta.respuestaCorrecta)}</td>
          <td>${estadoMostrado}</td>
        </tr>
      `;
    }).join('');

    const puntajeDirecto = aciertos;

    const html = `
      <div style="font-family:'Inter',sans-serif;">
        <div class="result-table-wrap">
          <table class="result-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pregunta</th>
                <th>Tu respuesta</th>
                <th>Correcta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>

        <div class="result-score-bar">
          <div class="result-score-num">
            ${puntajeDirecto}<span style="font-size:1rem;color:#8f8b85"> / ${total}</span>
          </div>
          <div class="result-score-detail">
            <strong style="color:#3a7a4c">${aciertos} acierto${aciertos !== 1 ? 's' : ''}</strong>
            &nbsp;·&nbsp;
            <strong style="color:#9a3535">${errores} error${errores !== 1 ? 'es' : ''}</strong><br>
            Puntaje directo: <strong>${puntajeDirecto}</strong>
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Resultados del test',
      html,
      icon: aciertos === total ? 'success' : aciertos > 0 ? 'info' : 'warning',
      confirmButtonText: 'Cerrar',
      width: 760,
      didOpen: salirPantallaCompleta,
    });
  }

  function normalizarRespuesta(valor) {
    return String(valor).trim().toLowerCase();
  }

  function salirPantallaCompleta() {
    try {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozFullScreenElement && document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msFullscreenElement && document.msExitFullscreen) document.msExitFullscreen();
    } catch (error) {
      console.log('No se pudo salir de pantalla completa.');
    }
  }

  function escapeHtml(valor) {
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
