const API_BASE = "http://localhost:3000/api";

let estado = {
    idEstudiante: null,
    nombre: "",
    subtestSeleccionado: null,
    preguntas: [],
    indiceActual: 0,
    respuestas: {}, // { idPregunta: "A"|"B"|"C"|"D" }
    timerInterval: null,
    segundosRestantes: 0,
};

// ---------- NAVEGACIÓN ENTRE PASOS ----------
function mostrarPaso(idPaso) {
    document.querySelectorAll(".step-section").forEach((s) => s.classList.remove("active"));
    document.getElementById(idPaso).classList.add("active");
}

document.getElementById("btn-empezar").addEventListener("click", () => {
    const hoy = new Date();
    document.getElementById("fechaIngreso").value = hoy.toLocaleDateString("es-NI", {
        year: "numeric", month: "long", day: "numeric"
    });
    mostrarPaso("step-datos");
});

document.getElementById("btn-volver-1").addEventListener("click", () => {
    mostrarPaso("step-welcome");
});

document.getElementById("btn-reiniciar").addEventListener("click", () => {
    location.reload();
});

// ---------- PASO 2: REGISTRO DEL ESTUDIANTE ----------
document.getElementById("form-datos").addEventListener("submit", async (e) => {
    e.preventDefault();

    const identificacion = document.getElementById("identificacion").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const edad = parseInt(document.getElementById("edad").value, 10);
    const correo = document.getElementById("correo").value.trim();
    const sexo = document.getElementById("sexo").value;

    if (!identificacion || !nombre || !apellido || !edad || !sexo) {
        Swal.fire({
            icon: "warning",
            title: "Faltan datos",
            text: "Por favor completa todos los campos obligatorios.",
            confirmButtonColor: "#0a0a0a",
        });
        return;
    }

    if (edad < 18) {
        Swal.fire({
            icon: "error",
            title: "Edad no permitida",
            text: "Debes ser mayor de edad para realizar esta evaluación.",
            confirmButtonColor: "#0a0a0a",
        });
        return;
    }

    if (correo && !correo.includes("@")) {
        Swal.fire({
            icon: "warning",
            title: "Correo inválido",
            text: "El correo electrónico debe contener un \"@\" válido.",
            confirmButtonColor: "#0a0a0a",
        });
        return;
    }

    Swal.fire({
        title: "Registrando...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
    });

    try {
        const resp = await fetch(`${API_BASE}/estudiante`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identificacion, nombre, apellido, edad,
                correoElectronico: correo || null, sexo,
            }),
        });

        const data = await resp.json();
        Swal.close();

        if (!resp.ok) {
            Swal.fire({ icon: "error", title: "No se pudo registrar", text: data.error, confirmButtonColor: "#0a0a0a" });
            return;
        }

        estado.idEstudiante = data.idEstudiante;
        estado.nombre = nombre;
        document.getElementById("nombre-bienvenida").textContent = `${nombre} ${apellido}`;

        await cargarSubtests();
        mostrarPaso("step-seleccion");
    } catch (err) {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Sin conexión",
            text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
            confirmButtonColor: "#0a0a0a",
        });
    }
});

// ---------- PASO 3: CARGAR Y MOSTRAR SUBTESTS ----------
async function cargarSubtests() {
    const contenedor = document.getElementById("contenedor-subtests");
    contenedor.innerHTML = "";

    const resp = await fetch(`${API_BASE}/subtests`);
    const subtests = await resp.json();

    subtests.forEach((st) => {
        const icono = st.tipotest === "N1_OPERACIONES" ? "🔢" : "🧩";
        const col = document.createElement("div");
        col.className = "col-md-5";
        col.innerHTML = `
      <div class="subtest-card" data-id="${st.id}" data-tipo="${st.tipotest}" data-nombre="${st.nombre}" data-tiempo="${st.tiempo}">
        <div class="icono">${icono}</div>
        <h3>${st.nombre}</h3>
        <p class="info-test">${st.total} preguntas &middot; ${st.tiempo} minutos</p>
      </div>
    `;
        contenedor.appendChild(col);
    });

    document.querySelectorAll(".subtest-card").forEach((card) => {
        card.addEventListener("click", () => iniciarTest(card.dataset));
    });
}

// ---------- PASO 4: INICIAR Y RENDERIZAR EL TEST ----------
async function iniciarTest(dataset) {
    estado.subtestSeleccionado = dataset;
    estado.respuestas = {};
    estado.indiceActual = 0;

    Swal.fire({ title: "Cargando preguntas...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    const resp = await fetch(`${API_BASE}/preguntas/${dataset.id}?tipo=${dataset.tipo}`);
    const preguntas = await resp.json();
    Swal.close();

    if (!preguntas.length) {
        Swal.fire({ icon: "info", title: "Sin preguntas", text: "Este test todavía no tiene preguntas cargadas.", confirmButtonColor: "#0a0a0a" });
        return;
    }

    estado.preguntas = preguntas;
    document.getElementById("titulo-test").textContent = dataset.nombre;
    document.getElementById("pregunta-total").textContent = preguntas.length;

    iniciarTemporizador(parseInt(dataset.tiempo, 10) * 60);
    renderizarPregunta();
    mostrarPaso("step-test");
}

function renderizarPregunta() {
    const p = estado.preguntas[estado.indiceActual];
    document.getElementById("pregunta-actual").textContent = estado.indiceActual + 1;
    document.getElementById("texto-enunciado").textContent = p.enunciado;

    const porcentaje = ((estado.indiceActual + 1) / estado.preguntas.length) * 100;
    document.getElementById("barra-progreso").style.width = `${porcentaje}%`;

    const opciones = [
        { letra: "A", texto: p.opciona },
        { letra: "B", texto: p.opcionb },
        { letra: "C", texto: p.opcionc },
        { letra: "D", texto: p.opciond },
    ];

    const contenedor = document.getElementById("contenedor-opciones");
    contenedor.innerHTML = "";

    opciones.forEach((op) => {
        const seleccionada = estado.respuestas[p.id] === op.letra;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `opcion-btn ${seleccionada ? "seleccionada" : ""}`;
        btn.innerHTML = `<span class="opcion-letra">${op.letra}</span><span>${op.texto}</span>`;
        btn.addEventListener("click", () => {
            estado.respuestas[p.id] = op.letra;
            renderizarPregunta();
        });
        contenedor.appendChild(btn);
    });

    document.getElementById("btn-anterior").disabled = estado.indiceActual === 0;
    document.getElementById("btn-siguiente").textContent =
        estado.indiceActual === estado.preguntas.length - 1 ? "Finalizar" : "Siguiente";
}

document.getElementById("btn-anterior").addEventListener("click", () => {
    if (estado.indiceActual > 0) {
        estado.indiceActual--;
        renderizarPregunta();
    }
});

document.getElementById("btn-siguiente").addEventListener("click", () => {
    if (estado.indiceActual < estado.preguntas.length - 1) {
        estado.indiceActual++;
        renderizarPregunta();
    } else {
        finalizarTest();
    }
});

// ---------- TEMPORIZADOR ----------
function iniciarTemporizador(segundosTotales) {
    estado.segundosRestantes = segundosTotales;
    actualizarTimerUI();

    clearInterval(estado.timerInterval);
    estado.timerInterval = setInterval(() => {
        estado.segundosRestantes--;
        actualizarTimerUI();

        if (estado.segundosRestantes <= 0) {
            clearInterval(estado.timerInterval);
            Swal.fire({
                icon: "info",
                title: "Tiempo agotado",
                text: "Se acabó el tiempo. Tu test se enviará con las respuestas marcadas hasta ahora.",
                confirmButtonColor: "#0a0a0a",
            }).then(() => finalizarTest());
        }
    }, 1000);
}

function actualizarTimerUI() {
    const min = Math.floor(estado.segundosRestantes / 60).toString().padStart(2, "0");
    const seg = (estado.segundosRestantes % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${min}:${seg}`;
}

// ---------- PASO 5: ENVIAR Y MOSTRAR RESULTADO ----------
async function finalizarTest() {
    clearInterval(estado.timerInterval);

    const respuestas = estado.preguntas.map((p) => ({
        idPregunta: p.id,
        opcionElegida: estado.respuestas[p.id] || null,
    }));

    Swal.fire({ title: "Calificando...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    try {
        const resp = await fetch(`${API_BASE}/resultado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idEstudiante: estado.idEstudiante,
                subtestId: estado.subtestSeleccionado.id,
                tipoTest: estado.subtestSeleccionado.tipo,
                respuestas,
            }),
        });

        const data = await resp.json();
        Swal.close();

        if (!resp.ok) {
            Swal.fire({ icon: "error", title: "Error al calificar", text: data.error, confirmButtonColor: "#0a0a0a" });
            return;
        }

        document.getElementById("res-aciertos").textContent = data.aciertos;
        document.getElementById("res-errores").textContent = data.errores;
        document.getElementById("res-puntaje").textContent = data.puntajeDirecto;
        document.getElementById("res-percentil").textContent = data.percentil;

        mostrarPaso("step-resultado");
    } catch (err) {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Sin conexión",
            text: "No se pudo enviar el resultado al servidor.",
            confirmButtonColor: "#0a0a0a",
        });
    }
}