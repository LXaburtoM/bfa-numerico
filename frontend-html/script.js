/* ═══════════════════════════════════════════════════════════════
   BFA Numérico — script.js
   Navegación, login, tablas, modales, validaciones, SweetAlert2
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE API
   Reemplazar BASE_URL con la URL real del backend cuando esté listo
   ──────────────────────────────────────────────────────────────── */
const API = {
  BASE: '/numerico/api',
  USUARIOS:              '/numerico/api/usuarios',
  ESTUDIANTES:           '/numerico/api/estudiantes',
  PREGUNTAS_OPERACION:   '/numerico/api/preguntas-operacion',
  PREGUNTAS_PROBLEMA:    '/numerico/api/preguntas-problema',
  CONFIGURACION_SUBTEST: '/numerico/api/configuracion-subtest',
  RESULTADOS:            '/numerico/api/resultados',
};

/* ────────────────────────────────────────────────────────────────
   DATOS DE EJEMPLO (temporales — reemplazar con fetch() al API)
   ──────────────────────────────────────────────────────────────── */
const mockData = {
  usuarios: [
    { id: 1, username: 'admin',    nombreCompleto: 'Administrador Principal' },
    { id: 2, username: 'evaluador1', nombreCompleto: 'María López Ruiz' },
    { id: 3, username: 'psico01',  nombreCompleto: 'Carlos Mendoza Ríos' },
  ],
  estudiantes: [
    { id: 1, codigo: 'EST-001', nombre: 'Ana Sofía Pérez',   grado: '5to Primaria', edad: 11, genero: 'F' },
    { id: 2, codigo: 'EST-002', nombre: 'Luis Alberto Gómez', grado: '6to Primaria', edad: 12, genero: 'M' },
    { id: 3, codigo: 'EST-003', nombre: 'Valeria Torres Paz', grado: '5to Primaria', edad: 10, genero: 'F' },
  ],
  preguntasOperacion: [
    { id: 1, orden: 1, dificultad: 'Fácil',   enunciado: '12 + 7 = ?',     respuestaCorrecta: '19' },
    { id: 2, orden: 2, dificultad: 'Medio',   enunciado: '48 ÷ 6 = ?',     respuestaCorrecta: '8'  },
    { id: 3, orden: 3, dificultad: 'Difícil', enunciado: '125 × 8 = ?',    respuestaCorrecta: '1000' },
    { id: 4, orden: 4, dificultad: 'Fácil',   enunciado: '34 - 19 = ?',    respuestaCorrecta: '15' },
  ],
  preguntasProblema: [
    {
      id: 1, orden: 1, dificultad: 'Fácil',
      contexto: 'Tienda de frutas',
      enunciado: 'María compró 3 manzanas a C$5 cada una. ¿Cuánto pagó en total?',
      respuestaCorrecta: 'C$15',
    },
    {
      id: 2, orden: 2, dificultad: 'Medio',
      contexto: 'Aula de clases',
      enunciado: 'En un salón hay 32 estudiantes. El 25% son niñas. ¿Cuántas niñas hay?',
      respuestaCorrecta: '8',
    },
  ],
  subtests: [
    { id: 1, nombre: 'Operaciones Básicas',  tipoTest: 'Operación', tiempoLimiteMinutos: 20, totalPreguntas: 30 },
    { id: 2, nombre: 'Razonamiento Numérico', tipoTest: 'Problema',  tiempoLimiteMinutos: 25, totalPreguntas: 20 },
  ],
  resultados: [
    { id: 1, evaluado: 'Ana Sofía Pérez',    subtest: 'Operaciones Básicas',   capturadoPor: 'María López', aciertos: 22, errores: 8,  puntajeDirecto: 22, percentil: 75 },
    { id: 2, evaluado: 'Luis Alberto Gómez', subtest: 'Razonamiento Numérico', capturadoPor: 'Carlos Mendoza', aciertos: 15, errores: 5, puntajeDirecto: 15, percentil: 60 },
  ],
};

/* ────────────────────────────────────────────────────────────────
   ESTADO DE LA APLICACIÓN
   ──────────────────────────────────────────────────────────────── */
const state = {
  currentUser: null,
  currentSection: 'dashboard',
  editingId: null,
};

/* ════════════════════════════════════════════════════════════════
   UTILIDADES
   ════════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);
const $qa = sel => document.querySelectorAll(sel);

function showToast(icon, title, text = '') {
  Swal.fire({
    icon,
    title,
    text: text || undefined,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

function confirmDelete(nombre, onConfirm) {
  Swal.fire({
    title: '¿Eliminar registro?',
    html: `Se eliminará <strong>${nombre}</strong>. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#a05050',
    reverseButtons: true,
  }).then(result => {
    if (result.isConfirmed) onConfirm();
  });
}

function badgeDificultad(nivel) {
  const map = { 'Fácil': 'facil', 'Medio': 'medio', 'Difícil': 'dificil' };
  return `<span class="badge-nivel badge-${map[nivel] || 'medio'}">${nivel}</span>`;
}

function truncate(str, max = 60) {
  return str && str.length > max ? str.slice(0, max) + '…' : str || '—';
}

function resetForm(formId) {
  const form = $(formId);
  if (!form) return;
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function validateForm(formId) {
  const form = $(formId);
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      valid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });
  return valid;
}

function updateCount(countId, n) {
  const el = $(countId);
  if (el) el.textContent = `${n} ${n === 1 ? 'registro' : 'registros'}`;
}

/* ════════════════════════════════════════════════════════════════
   LOGIN
   ════════════════════════════════════════════════════════════════ */

/* Toggle mostrar/ocultar contraseña */
$('toggle-login-pw').addEventListener('click', () => {
  const input = $('login-password');
  const icon  = $('login-pw-icon');
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  icon.className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
});

/* Submit login */
$('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = $('login-username').value.trim();
  const password = $('login-password').value.trim();

  if (!username || !password) {
    showToast('error', 'Campos requeridos', 'Ingresa usuario y contraseña.');
    return;
  }

  /* ── REEMPLAZAR con fetch() al endpoint de autenticación ─────── */
  // Ejemplo de llamada real:
  // fetch('/numerico/api/auth/login', { method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, password })
  // }).then(r => r.json()).then(data => { if (data.token) onLoginSuccess(username); });

  // Validación temporal de prueba:
  if (username && password) {
    onLoginSuccess(username);
  } else {
    showToast('error', 'Credenciales incorrectas', 'Verifica tus datos e intenta de nuevo.');
  }
});

function onLoginSuccess(username) {
  state.currentUser = username;

  $('sidebar-user-name').textContent = username;
  $('topbar-user-name').textContent  = username;

  $('login-screen').classList.add('d-none');
  $('main-app').classList.remove('d-none');

  navigateTo('dashboard');
  loadDashboard();
}

/* ════════════════════════════════════════════════════════════════
   CIERRE DE SESIÓN
   ════════════════════════════════════════════════════════════════ */
$('btn-logout').addEventListener('click', () => {
  Swal.fire({
    title: '¿Cerrar sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  }).then(result => {
    if (result.isConfirmed) {
      state.currentUser = null;
      $('login-form').reset();
      $('main-app').classList.add('d-none');
      $('login-screen').classList.remove('d-none');
      closeSidebar();
    }
  });
});

/* ════════════════════════════════════════════════════════════════
   NAVEGACIÓN
   ════════════════════════════════════════════════════════════════ */
const SECTION_TITLES = {
  dashboard:              'Dashboard',
  usuarios:               'Usuarios',
  estudiantes:            'Estudiantes Evaluados',
  'preguntas-operacion':  'Preguntas de Operación',
  'preguntas-problema':   'Preguntas Problema',
  'configuracion-subtest':'Config. Subtest',
  resultados:             'Resultados Numéricos',
};

function navigateTo(section) {
  /* Ocultar todas las secciones */
  $qa('.app-section').forEach(s => {
    s.classList.remove('active-section');
    s.classList.add('d-none');
  });

  /* Activar sección destino */
  const target = $(`section-${section}`);
  if (target) {
    target.classList.remove('d-none');
    target.classList.add('active-section');
  }

  /* Actualizar link activo en sidebar */
  $qa('.sidebar-nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = $q(`.sidebar-nav-link[data-section="${section}"]`);
  if (activeLink) activeLink.classList.add('active');

  /* Título en topbar */
  const title = SECTION_TITLES[section] || section;
  $('topbar-title').textContent = title;
  document.title = `${title} — BFA Numérico`;

  state.currentSection = section;
  closeSidebar();

  /* Cargar datos del módulo */
  loadSection(section);
}

function loadSection(section) {
  switch (section) {
    case 'usuarios':              renderUsuarios(); break;
    case 'estudiantes':           renderEstudiantes(); break;
    case 'preguntas-operacion':   renderPreguntasOperacion(); break;
    case 'preguntas-problema':    renderPreguntasProblema(); break;
    case 'configuracion-subtest': renderSubtests(); break;
    case 'resultados':            renderResultados(); break;
    case 'dashboard':             loadDashboard(); break;
  }
}

/* Links del sidebar */
$qa('.sidebar-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

/* Stat cards del dashboard → navegan */
$qa('.stat-card[data-section-target]').forEach(card => {
  card.addEventListener('click', () => navigateTo(card.dataset.sectionTarget));
});

/* Botones de acceso rápido en dashboard */
$qa('.quick-btn[data-section]').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    const modalId = btn.dataset.openModal;
    navigateTo(section);
    if (modalId) {
      setTimeout(() => {
        const modal = bootstrap.Modal.getOrCreateInstance($(`#${modalId}`) || document.querySelector(`#${modalId}`));
        modal.show();
      }, 100);
    }
  });
});

/* ════════════════════════════════════════════════════════════════
   SIDEBAR MÓVIL
   ════════════════════════════════════════════════════════════════ */
$('btn-toggle-sidebar').addEventListener('click', () => {
  $('sidebar').classList.toggle('sidebar-open');
  $('sidebar-overlay').classList.toggle('overlay-visible');
});

$('sidebar-overlay').addEventListener('click', closeSidebar);

function closeSidebar() {
  $('sidebar').classList.remove('sidebar-open');
  $('sidebar-overlay').classList.remove('overlay-visible');
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════════════════ */
function loadDashboard() {
  /* ── REEMPLAZAR con fetch() reales cuando el backend esté listo ─ */
  // Promise.all([
  //   fetch(API.USUARIOS).then(r => r.json()),
  //   fetch(API.ESTUDIANTES).then(r => r.json()),
  //   fetch(API.RESULTADOS).then(r => r.json()),
  //   fetch(API.PREGUNTAS_OPERACION).then(r => r.json()),
  //   fetch(API.PREGUNTAS_PROBLEMA).then(r => r.json()),
  //   fetch(API.CONFIGURACION_SUBTEST).then(r => r.json()),
  // ]).then(([u, e, r, po, pp, sub]) => { ... });

  const u   = mockData.usuarios.length;
  const e   = mockData.estudiantes.length;
  const r   = mockData.resultados.length;
  const po  = mockData.preguntasOperacion.length;
  const pp  = mockData.preguntasProblema.length;
  const sub = mockData.subtests.length;

  $('stat-usuarios').textContent    = u;
  $('stat-estudiantes').textContent = e;
  $('stat-resultados').textContent  = r;
  $('stat-preguntas').textContent   = po + pp;
  $('stat-subtests').textContent    = sub;
  $('stat-op').textContent          = po;
  $('stat-prob').textContent        = pp;
  $('api-status').textContent       = 'Simulado';

  /* Fecha */
  const now = new Date();
  $('dashboard-date').textContent = now.toLocaleDateString('es-NI', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ════════════════════════════════════════════════════════════════
   BÚSQUEDA EN TABLAS
   ════════════════════════════════════════════════════════════════ */
function bindSearch(inputId, tbodyId) {
  const input = $(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const rows = $(tbodyId).querySelectorAll('tr');
    rows.forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   MÓDULO: USUARIOS
   ════════════════════════════════════════════════════════════════ */

/* ── Render ── */
function renderUsuarios() {
  /* REEMPLAZAR: fetch(API.USUARIOS).then(r=>r.json()).then(renderUsuariosData) */
  renderUsuariosData(mockData.usuarios);
}

function renderUsuariosData(list) {
  const tbody = $('tbody-usuarios');
  const empty = $('empty-usuarios');
  tbody.innerHTML = '';

  if (!list.length) {
    empty.classList.add('show');
    updateCount('count-usuarios', 0);
    return;
  }
  empty.classList.remove('show');
  updateCount('count-usuarios', list.length);

  list.forEach((u, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-muted" style="width:48px">${i + 1}</td>
      <td><code style="font-size:.8rem;color:var(--text-secondary)">${u.username}</code></td>
      <td>${u.nombreCompleto}</td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditUsuario(${u.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deleteUsuario(${u.id}, '${u.username}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });

  bindSearch('search-usuarios', 'tbody-usuarios');
}

/* ── Crear / Editar ── */
$('btn-add-usuario').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-usuario');
  $('modalUsuarioLabel').textContent = 'Nuevo usuario';
  $('modalUsuarioSub').textContent   = 'Completa los datos del nuevo usuario del sistema.';
});

window.openEditUsuario = function(id) {
  const u = mockData.usuarios.find(x => x.id === id);
  if (!u) return;
  state.editingId = id;
  resetForm('form-usuario');
  $('u-id').value              = u.id;
  $('u-username').value        = u.username;
  $('u-nombre-completo').value = u.nombreCompleto;
  $('modalUsuarioLabel').textContent = 'Editar usuario';
  $('modalUsuarioSub').textContent   = `Modificando: ${u.username}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalUsuario')).show();
};

$('btn-save-usuario').addEventListener('click', () => {
  if (!validateForm('form-usuario')) {
    showToast('error', 'Campos requeridos', 'Completa todos los campos obligatorios.');
    return;
  }
  const id       = $('u-id').value;
  const username = $('u-username').value.trim();
  const nombre   = $('u-nombre-completo').value.trim();

  /* ── REEMPLAZAR con fetch() ──
     const method = id ? 'PUT' : 'POST';
     const url    = id ? `${API.USUARIOS}/${id}` : API.USUARIOS;
     fetch(url, { method, headers:{'Content-Type':'application/json'},
       body: JSON.stringify({ username, nombreCompleto: nombre })
     }).then(r=>r.json()).then(() => { renderUsuarios(); ... }); */

  if (id) {
    const u = mockData.usuarios.find(x => x.id === +id);
    if (u) { u.username = username; u.nombreCompleto = nombre; }
  } else {
    mockData.usuarios.push({ id: Date.now(), username, nombreCompleto: nombre });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalUsuario')).hide();
  renderUsuarios();
  showToast('success', id ? 'Usuario actualizado' : 'Usuario creado');
});

window.deleteUsuario = function(id, username) {
  confirmDelete(username, () => {
    /* REEMPLAZAR: fetch(`${API.USUARIOS}/${id}`, {method:'DELETE'}).then(()=>renderUsuarios()) */
    mockData.usuarios = mockData.usuarios.filter(u => u.id !== id);
    renderUsuarios();
    showToast('success', 'Usuario eliminado');
  });
};

/* ════════════════════════════════════════════════════════════════
   MÓDULO: ESTUDIANTES
   ════════════════════════════════════════════════════════════════ */
function renderEstudiantes() {
  renderEstudiantesData(mockData.estudiantes);
}

function renderEstudiantesData(list) {
  const tbody = $('tbody-estudiantes');
  const empty = $('empty-estudiantes');
  tbody.innerHTML = '';

  if (!list.length) { empty.classList.add('show'); updateCount('count-estudiantes', 0); return; }
  empty.classList.remove('show');
  updateCount('count-estudiantes', list.length);

  list.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code style="font-size:.8rem;color:var(--text-muted)">${e.codigo}</code></td>
      <td>${e.nombre}</td>
      <td>${e.grado}</td>
      <td>${e.edad} años</td>
      <td>${e.genero === 'F' ? 'Femenino' : 'Masculino'}</td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditEstudiante(${e.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deleteEstudiante(${e.id}, '${e.nombre}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
  bindSearch('search-estudiantes', 'tbody-estudiantes');
}

$('btn-add-estudiante').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-estudiante');
  $('modalEstudianteLabel').textContent = 'Nuevo estudiante';
  $('modalEstudianteSub').textContent   = 'Registra los datos del estudiante a evaluar.';
});

window.openEditEstudiante = function(id) {
  const e = mockData.estudiantes.find(x => x.id === id);
  if (!e) return;
  state.editingId = id;
  resetForm('form-estudiante');
  $('est-id').value     = e.id;
  $('est-codigo').value = e.codigo;
  $('est-nombre').value = e.nombre;
  $('est-grado').value  = e.grado;
  $('est-edad').value   = e.edad;
  $('est-genero').value = e.genero;
  $('modalEstudianteLabel').textContent = 'Editar estudiante';
  $('modalEstudianteSub').textContent   = `Modificando: ${e.nombre}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalEstudiante')).show();
};

$('btn-save-estudiante').addEventListener('click', () => {
  if (!validateForm('form-estudiante')) {
    showToast('error', 'Campos requeridos', 'Completa todos los campos obligatorios.'); return;
  }
  const id = $('est-id').value;
  const data = {
    codigo: $('est-codigo').value.trim(),
    nombre: $('est-nombre').value.trim(),
    grado:  $('est-grado').value.trim(),
    edad:   +$('est-edad').value,
    genero: $('est-genero').value,
  };

  if (id) {
    Object.assign(mockData.estudiantes.find(x => x.id === +id), data);
  } else {
    mockData.estudiantes.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalEstudiante')).hide();
  renderEstudiantes();
  showToast('success', id ? 'Estudiante actualizado' : 'Estudiante registrado');
});

window.deleteEstudiante = function(id, nombre) {
  confirmDelete(nombre, () => {
    mockData.estudiantes = mockData.estudiantes.filter(e => e.id !== id);
    renderEstudiantes();
    showToast('success', 'Estudiante eliminado');
  });
};

/* ════════════════════════════════════════════════════════════════
   MÓDULO: PREGUNTAS DE OPERACIÓN
   ════════════════════════════════════════════════════════════════ */
function renderPreguntasOperacion() {
  renderPreguntasOpData(mockData.preguntasOperacion);
}

function renderPreguntasOpData(list) {
  const tbody = $('tbody-preguntas-operacion');
  const empty = $('empty-preguntas-op');
  tbody.innerHTML = '';

  if (!list.length) { empty.classList.add('show'); updateCount('count-preguntas-op', 0); return; }
  empty.classList.remove('show');
  updateCount('count-preguntas-op', list.length);

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center" style="width:60px">${p.orden}</td>
      <td>${badgeDificultad(p.dificultad)}</td>
      <td>${truncate(p.enunciado, 55)}</td>
      <td><strong>${p.respuestaCorrecta}</strong></td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditPreguntaOp(${p.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deletePreguntaOp(${p.id}, '${truncate(p.enunciado, 30)}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
  bindSearch('search-preguntas-op', 'tbody-preguntas-operacion');
}

$('btn-add-pregunta-op').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-pregunta-operacion');
  $('modalPreguntaOperacionLabel').textContent = 'Nueva pregunta de operación';
  $('modalPreguntaOperacionSub').textContent   = 'Crea una nueva pregunta de cálculo numérico.';
});

window.openEditPreguntaOp = function(id) {
  const p = mockData.preguntasOperacion.find(x => x.id === id);
  if (!p) return;
  state.editingId = id;
  resetForm('form-pregunta-operacion');
  $('po-id').value          = p.id;
  $('po-orden').value       = p.orden;
  $('po-dificultad').value  = p.dificultad;
  $('po-enunciado').value   = p.enunciado;
  $('po-respuesta').value   = p.respuestaCorrecta;
  $('modalPreguntaOperacionLabel').textContent = 'Editar pregunta de operación';
  $('modalPreguntaOperacionSub').textContent   = `Pregunta #${p.orden}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPreguntaOperacion')).show();
};

$('btn-save-pregunta-op').addEventListener('click', () => {
  if (!validateForm('form-pregunta-operacion')) {
    showToast('error', 'Campos requeridos'); return;
  }
  const id = $('po-id').value;
  const data = {
    orden:             +$('po-orden').value,
    dificultad:        $('po-dificultad').value,
    enunciado:         $('po-enunciado').value.trim(),
    respuestaCorrecta: $('po-respuesta').value.trim(),
  };

  if (id) {
    Object.assign(mockData.preguntasOperacion.find(x => x.id === +id), data);
  } else {
    mockData.preguntasOperacion.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalPreguntaOperacion')).hide();
  renderPreguntasOperacion();
  showToast('success', id ? 'Pregunta actualizada' : 'Pregunta creada');
});

window.deletePreguntaOp = function(id, label) {
  confirmDelete(label, () => {
    mockData.preguntasOperacion = mockData.preguntasOperacion.filter(p => p.id !== id);
    renderPreguntasOperacion();
    showToast('success', 'Pregunta eliminada');
  });
};

/* ════════════════════════════════════════════════════════════════
   MÓDULO: PREGUNTAS PROBLEMA
   ════════════════════════════════════════════════════════════════ */
function renderPreguntasProblema() {
  renderPreguntasProbData(mockData.preguntasProblema);
}

function renderPreguntasProbData(list) {
  const tbody = $('tbody-preguntas-problema');
  const empty = $('empty-preguntas-prob');
  tbody.innerHTML = '';

  if (!list.length) { empty.classList.add('show'); updateCount('count-preguntas-prob', 0); return; }
  empty.classList.remove('show');
  updateCount('count-preguntas-prob', list.length);

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center" style="width:60px">${p.orden}</td>
      <td>${badgeDificultad(p.dificultad)}</td>
      <td><span class="text-muted">${truncate(p.contexto, 30)}</span></td>
      <td>${truncate(p.enunciado, 55)}</td>
      <td><strong>${p.respuestaCorrecta}</strong></td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditPreguntaProb(${p.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deletePreguntaProb(${p.id}, '${truncate(p.enunciado, 25)}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
  bindSearch('search-preguntas-prob', 'tbody-preguntas-problema');
}

$('btn-add-pregunta-prob').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-pregunta-problema');
  $('modalPreguntaProblemaLabel').textContent = 'Nueva pregunta problema';
  $('modalPreguntasProblemaSub').textContent  = 'Crea una pregunta contextualizada de razonamiento.';
});

window.openEditPreguntaProb = function(id) {
  const p = mockData.preguntasProblema.find(x => x.id === id);
  if (!p) return;
  state.editingId = id;
  resetForm('form-pregunta-problema');
  $('pp-id').value         = p.id;
  $('pp-orden').value      = p.orden;
  $('pp-dificultad').value = p.dificultad;
  $('pp-contexto').value   = p.contexto;
  $('pp-enunciado').value  = p.enunciado;
  $('pp-respuesta').value  = p.respuestaCorrecta;
  $('modalPreguntaProblemaLabel').textContent = 'Editar pregunta problema';
  $('modalPreguntasProblemaSub').textContent  = `Pregunta #${p.orden}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPreguntaProblema')).show();
};

$('btn-save-pregunta-prob').addEventListener('click', () => {
  if (!validateForm('form-pregunta-problema')) {
    showToast('error', 'Campos requeridos'); return;
  }
  const id = $('pp-id').value;
  const data = {
    orden:             +$('pp-orden').value,
    dificultad:        $('pp-dificultad').value,
    contexto:          $('pp-contexto').value.trim(),
    enunciado:         $('pp-enunciado').value.trim(),
    respuestaCorrecta: $('pp-respuesta').value.trim(),
  };

  if (id) {
    Object.assign(mockData.preguntasProblema.find(x => x.id === +id), data);
  } else {
    mockData.preguntasProblema.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalPreguntaProblema')).hide();
  renderPreguntasProblema();
  showToast('success', id ? 'Pregunta actualizada' : 'Pregunta creada');
});

window.deletePreguntaProb = function(id, label) {
  confirmDelete(label, () => {
    mockData.preguntasProblema = mockData.preguntasProblema.filter(p => p.id !== id);
    renderPreguntasProblema();
    showToast('success', 'Pregunta eliminada');
  });
};

/* ════════════════════════════════════════════════════════════════
   MÓDULO: CONFIGURACIÓN DE SUBTEST
   ════════════════════════════════════════════════════════════════ */
function renderSubtests() {
  renderSubtestsData(mockData.subtests);
}

function renderSubtestsData(list) {
  const tbody = $('tbody-configuracion-subtest');
  const empty = $('empty-subtests');
  tbody.innerHTML = '';

  if (!list.length) { empty.classList.add('show'); updateCount('count-subtests', 0); return; }
  empty.classList.remove('show');
  updateCount('count-subtests', list.length);

  list.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.nombre}</strong></td>
      <td>${s.tipoTest}</td>
      <td>${s.tiempoLimiteMinutos} min</td>
      <td class="text-center">${s.totalPreguntas}</td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditSubtest(${s.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deleteSubtest(${s.id}, '${s.nombre}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
  bindSearch('search-subtests', 'tbody-configuracion-subtest');
}

$('btn-add-subtest').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-configuracion-subtest');
  $('modalConfiguracionSubtestLabel').textContent = 'Nuevo subtest';
  $('modalConfiguracionSubtestSub').textContent   = 'Configura los parámetros del subtest de evaluación.';
});

window.openEditSubtest = function(id) {
  const s = mockData.subtests.find(x => x.id === id);
  if (!s) return;
  state.editingId = id;
  resetForm('form-configuracion-subtest');
  $('cs-id').value              = s.id;
  $('cs-nombre').value          = s.nombre;
  $('cs-tipo-test').value       = s.tipoTest;
  $('cs-tiempo-limite').value   = s.tiempoLimiteMinutos;
  $('cs-total-preguntas').value = s.totalPreguntas;
  $('modalConfiguracionSubtestLabel').textContent = 'Editar subtest';
  $('modalConfiguracionSubtestSub').textContent   = `Modificando: ${s.nombre}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalConfiguracionSubtest')).show();
};

$('btn-save-subtest').addEventListener('click', () => {
  if (!validateForm('form-configuracion-subtest')) {
    showToast('error', 'Campos requeridos'); return;
  }
  const id = $('cs-id').value;
  const data = {
    nombre:               $('cs-nombre').value.trim(),
    tipoTest:             $('cs-tipo-test').value,
    tiempoLimiteMinutos:  +$('cs-tiempo-limite').value,
    totalPreguntas:       +$('cs-total-preguntas').value,
  };

  if (id) {
    Object.assign(mockData.subtests.find(x => x.id === +id), data);
  } else {
    mockData.subtests.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalConfiguracionSubtest')).hide();
  renderSubtests();
  showToast('success', id ? 'Subtest actualizado' : 'Subtest creado');
});

window.deleteSubtest = function(id, nombre) {
  confirmDelete(nombre, () => {
    mockData.subtests = mockData.subtests.filter(s => s.id !== id);
    renderSubtests();
    showToast('success', 'Subtest eliminado');
  });
};

/* ════════════════════════════════════════════════════════════════
   MÓDULO: RESULTADOS NUMÉRICOS
   ════════════════════════════════════════════════════════════════ */
function renderResultados() {
  /* Poblar selects dinámicos */
  populateSelect('r-evaluado', mockData.estudiantes, 'id', 'nombre');
  populateSelect('r-subtest',  mockData.subtests,    'id', 'nombre');
  renderResultadosData(mockData.resultados);
}

function renderResultadosData(list) {
  const tbody = $('tbody-resultados');
  const empty = $('empty-resultados');
  tbody.innerHTML = '';

  if (!list.length) { empty.classList.add('show'); updateCount('count-resultados', 0); return; }
  empty.classList.remove('show');
  updateCount('count-resultados', list.length);

  list.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.evaluado}</td>
      <td>${r.subtest}</td>
      <td>${r.capturadoPor}</td>
      <td class="text-center"><strong>${r.aciertos}</strong></td>
      <td class="text-center" style="color:var(--color-danger)">${r.errores}</td>
      <td class="text-center">${r.puntajeDirecto}</td>
      <td class="text-center">
        <span class="badge-nivel ${r.percentil >= 75 ? 'badge-facil' : r.percentil >= 50 ? 'badge-medio' : 'badge-dificil'}">
          P${r.percentil}
        </span>
      </td>
      <td class="text-center">
        <button class="btn-tbl btn-tbl-edit me-1" title="Editar" onclick="openEditResultado(${r.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-tbl btn-tbl-del" title="Eliminar" onclick="deleteResultado(${r.id}, '${r.evaluado}')">
          <i class="bi bi-trash3"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
  bindSearch('search-resultados', 'tbody-resultados');
}

$('btn-add-resultado').addEventListener('click', () => {
  state.editingId = null;
  resetForm('form-resultado');
  $('modalResultadoLabel').textContent = 'Nuevo resultado';
  $('modalResultadoSub').textContent   = 'Registra el resultado de evaluación numérica.';
  populateSelect('r-evaluado', mockData.estudiantes, 'id', 'nombre');
  populateSelect('r-subtest',  mockData.subtests,    'id', 'nombre');
});

window.openEditResultado = function(id) {
  const r = mockData.resultados.find(x => x.id === id);
  if (!r) return;
  state.editingId = id;
  resetForm('form-resultado');
  populateSelect('r-evaluado', mockData.estudiantes, 'id', 'nombre');
  populateSelect('r-subtest',  mockData.subtests,    'id', 'nombre');
  $('r-id').value            = r.id;
  $('r-capturado-por').value = r.capturadoPor;
  $('r-aciertos').value      = r.aciertos;
  $('r-errores').value       = r.errores;
  $('r-puntaje-directo').value = r.puntajeDirecto;
  $('r-percentil').value     = r.percentil;
  $('modalResultadoLabel').textContent = 'Editar resultado';
  $('modalResultadoSub').textContent   = `Resultado de: ${r.evaluado}`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalResultado')).show();
};

$('btn-save-resultado').addEventListener('click', () => {
  if (!validateForm('form-resultado')) {
    showToast('error', 'Campos requeridos'); return;
  }
  const id = $('r-id').value;

  const evaluadoId = +$('r-evaluado').value;
  const subtestId  = +$('r-subtest').value;
  const evaluadoNombre = mockData.estudiantes.find(e => e.id === evaluadoId)?.nombre || '—';
  const subtestNombre  = mockData.subtests.find(s => s.id === subtestId)?.nombre || '—';

  const data = {
    evaluado:       evaluadoNombre,
    subtest:        subtestNombre,
    capturadoPor:   $('r-capturado-por').value.trim(),
    aciertos:       +$('r-aciertos').value,
    errores:        +$('r-errores').value,
    puntajeDirecto: +$('r-puntaje-directo').value,
    percentil:      +$('r-percentil').value,
  };

  if (id) {
    Object.assign(mockData.resultados.find(x => x.id === +id), data);
  } else {
    mockData.resultados.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(document.querySelector('#modalResultado')).hide();
  renderResultados();
  showToast('success', id ? 'Resultado actualizado' : 'Resultado guardado');
});

window.deleteResultado = function(id, nombre) {
  confirmDelete(nombre, () => {
    mockData.resultados = mockData.resultados.filter(r => r.id !== id);
    renderResultados();
    showToast('success', 'Resultado eliminado');
  });
};

/* ────────────────────────────────────────────────────────────────
   UTILIDAD: Poblar <select> dinámicamente
   ──────────────────────────────────────────────────────────────── */
function populateSelect(selectId, list, valueField, labelField) {
  const sel = $(selectId);
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = `<option value="" disabled selected>Selecciona…</option>`;
  list.forEach(item => {
    const opt = document.createElement('option');
    opt.value       = item[valueField];
    opt.textContent = item[labelField];
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

/* ════════════════════════════════════════════════════════════════
   LIMPIAR INPUTS AL CERRAR MODALES (Bootstrap event)
   ════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('hidden.bs.modal', () => {
    const formId = modal.querySelector('form')?.id;
    if (formId) resetForm(formId);
    state.editingId = null;
  });
});

/* ════════════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ════════════════════════════════════════════════════════════════ */
(function init() {
  /* Mostrar pantalla de login al cargar */
  $('login-screen').classList.remove('d-none');
  $('main-app').classList.add('d-none');

  /* Limpiar el formulario de login por si acaso */
  $('login-form').reset();
})();
// ══════════════════════════════════════════════════════════
// APLICAR TEST - FLUJO DE EVALUACIÓN
// ══════════════════════════════════════════════════════════

let testPreguntaActual = 0;
let respuestasEstudiante = [];

const preguntasDemo = [
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

function normalizarRespuesta(valor) {
    return String(valor).trim().toLowerCase();
}

function entrarModoTest() {
    document.body.classList.add("modo-test-activo");

    const mainApp = document.getElementById("main-app");
    if (mainApp) {
        mainApp.classList.add("test-fullscreen");
    }

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
            console.log("Pantalla completa no activada por el navegador.");
        });
    }
}

function salirModoTest() {
    document.body.classList.remove("modo-test-activo");

    const mainApp = document.getElementById("main-app");
    if (mainApp) {
        mainApp.classList.remove("test-fullscreen");
    }

    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
            console.log("No se pudo salir de pantalla completa.");
        });
    }
}

function guardarRespuestaActual() {
    const answer = document.getElementById("test-answer");

    if (answer) {
        respuestasEstudiante[testPreguntaActual] = answer.value;
    }
}

function mostrarPreguntaTest() {
    const pregunta = preguntasDemo[testPreguntaActual];

    const label = document.getElementById("test-question-label");
    const text = document.getElementById("test-question-text");
    const progress = document.getElementById("test-progress");
    const answer = document.getElementById("test-answer");
    const btnNext = document.getElementById("btn-next-question");
    const btnFinalizar = document.getElementById("btn-finalizar-test");

    if (!label || !text || !progress || !answer) return;

    label.textContent = `Pregunta ${testPreguntaActual + 1}`;
    text.textContent = pregunta.texto;
    progress.textContent = `Pregunta ${testPreguntaActual + 1} de ${preguntasDemo.length}`;
    answer.value = respuestasEstudiante[testPreguntaActual] || "";

    let dificultadBadge = document.getElementById("test-dificultad");

    if (!dificultadBadge) {
        dificultadBadge = document.createElement("span");
        dificultadBadge.id = "test-dificultad";
        dificultadBadge.className = "test-difficulty-badge";
        label.insertAdjacentElement("afterend", dificultadBadge);
    }

    dificultadBadge.textContent = `Dificultad: ${pregunta.dificultad}`;

    const esUltima = testPreguntaActual === preguntasDemo.length - 1;

    if (btnNext) {
        btnNext.classList.toggle("d-none", esUltima);
    }

    if (btnFinalizar) {
        btnFinalizar.classList.toggle("d-none", !esUltima);
    }

    if (esUltima) {
        progress.textContent = `Última pregunta (${testPreguntaActual + 1} de ${preguntasDemo.length})`;
    }
}

const btnIniciarTest = document.getElementById("btn-iniciar-test");

if (btnIniciarTest) {
    btnIniciarTest.addEventListener("click", function () {
        const estudiante = document.getElementById("test-estudiante").value;
        const subtest = document.getElementById("test-subtest").value;
        const runner = document.getElementById("test-runner");

        if (!estudiante || !subtest) {
            Swal.fire({
                icon: "warning",
                title: "Faltan datos",
                text: "Selecciona un estudiante y un subtest antes de iniciar.",
                confirmButtonText: "Entendido"
            });
            return;
        }

        testPreguntaActual = 0;
        respuestasEstudiante = [];

        runner.classList.remove("d-none");
        entrarModoTest();
        mostrarPreguntaTest();

        Swal.fire({
            icon: "success",
            title: "Evaluación iniciada",
            text: "Ahora el estudiante puede concentrarse solo en el test.",
            confirmButtonText: "Continuar"
        });
    });
}

const btnNextQuestion = document.getElementById("btn-next-question");

if (btnNextQuestion) {
    btnNextQuestion.addEventListener("click", function () {
        guardarRespuestaActual();

        if (testPreguntaActual < preguntasDemo.length - 1) {
            testPreguntaActual++;
            mostrarPreguntaTest();
        }
    });
}

const btnPrevQuestion = document.getElementById("btn-prev-question");

if (btnPrevQuestion) {
    btnPrevQuestion.addEventListener("click", function () {
        guardarRespuestaActual();

        if (testPreguntaActual > 0) {
            testPreguntaActual--;
            mostrarPreguntaTest();
        }
    });
}
const btnFinalizarTest = document.getElementById("btn-finalizar-test");

if (btnFinalizarTest) {
    btnFinalizarTest.addEventListener("click", function () {
        guardarRespuestaActual();

        let aciertos = 0;
        let errores = 0;

        let resumenHtml = `
            <div style="text-align:left;">
                <p>La evaluación fue completada correctamente.</p>
                <hr>
        `;

        preguntasDemo.forEach((pregunta, index) => {
            const respuestaEstudianteOriginal = respuestasEstudiante[index] || "";
            const respuestaEstudiante = normalizarRespuesta(respuestaEstudianteOriginal);
            const respuestaCorrecta = normalizarRespuesta(pregunta.respuestaCorrecta);

            const esCorrecta = respuestaEstudiante === respuestaCorrecta;

            if (esCorrecta) {
                aciertos++;
            } else {
                errores++;
            }

            resumenHtml += `
                <div style="margin-bottom:14px;">
                    <strong>Pregunta ${index + 1}</strong><br>
                    <span>${pregunta.texto}</span><br>
                    <span><strong>Tu respuesta:</strong> ${respuestaEstudianteOriginal || "Sin responder"}</span><br>
                    <span><strong>Respuesta correcta:</strong> ${pregunta.respuestaCorrecta}</span><br>
                    <span style="font-weight:600; color:${esCorrecta ? "#2e7d32" : "#8f1d1d"};">
                        ${esCorrecta ? "Correcta" : "Incorrecta"}
                    </span>
                </div>
            `;
        });

        const subtestSeleccionado = document.getElementById("test-subtest").value;

        let puntajeDirecto = aciertos;

        if (subtestSeleccionado === "problemas") {
            puntajeDirecto = aciertos - (errores * 0.25);
            if (puntajeDirecto < 0) puntajeDirecto = 0;
        }

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
            confirmButtonText: "Guardar resultado"
        }).then(() => {
            salirModoTest();
        });
    });
}