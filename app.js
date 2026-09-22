/* ==========================================================
   app.js – Lógica del cuestionario interactivo
   Vanilla JS (ES6+) · Sin dependencias externas
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. DATOS – Banco de preguntas por sección y subsección
   ---------------------------------------------------------- */
const BANCO_PREGUNTAS = {
  teoria: {
    1: [
      {
        id: 1,
        pregunta: "¿Cuál de las siguientes opciones describe la autoridad general para realizar una auditoría de SI?",
        alternativas: [
          { id: "a", texto: "El alcance de la auditoría con metas y objetivos" },
          { id: "b", texto: "Una solicitud de la gerencia para realizar una auditoría" },
          { id: "c", texto: "La carta de auditoría (audit charter) aprobada" },
          { id: "d", texto: "El cronograma de auditoría aprobado" }
        ],
        respuestaCorrectaId: "c",
        justificacion: ""
      },
      {
        id: 2,
        pregunta: "¿Cuál es el beneficio clave de una autoevaluación de control (CSA)?",
        alternativas: [
          { id: "a", texto: "Se refuerza la apropiación por parte de la gerencia de los controles internos" },
          { id: "b", texto: "Se reducen los gastos de auditoría" },
          { id: "c", texto: "Mejora la detección de fraude" },
          { id: "d", texto: "Los auditores internos pueden adoptar un enfoque consultivo" }
        ],
        respuestaCorrectaId: "a",
        justificacion: ""
      },
      {
        id: 3,
        pregunta: "¿En qué se enfocaría MÁS un auditor de SI al desarrollar un programa de auditoría basado en riesgo?",
        alternativas: [
          { id: "a", texto: "Procesos de negocio" },
          { id: "b", texto: "Controles administrativos" },
          { id: "c", texto: "Controles ambientales" },
          { id: "d", texto: "Estrategias de negocio" }
        ],
        respuestaCorrectaId: "a",
        justificacion: ""
      },
      {
        id: 4,
        pregunta: "¿Qué tipo de riesgo de auditoría asume la ausencia de controles compensatorios en el área revisada?",
        alternativas: [
          { id: "a", texto: "Riesgo de control" },
          { id: "b", texto: "Riesgo de detección" },
          { id: "c", texto: "Riesgo inherente" },
          { id: "d", texto: "Riesgo de muestreo" }
        ],
        respuestaCorrectaId: "c",
        justificacion: ""
      },
      {
        id: 5,
        pregunta: "Un auditor de SI que revisa los controles de una aplicación encuentra una debilidad en el software de sistema que podría afectar materialmente la aplicación. ¿Qué debe hacer?",
        alternativas: [
          { id: "a", texto: "Ignorarla por estar fuera de alcance" },
          { id: "b", texto: "Realizar una revisión detallada del software de sistema y reportarla" },
          { id: "c", texto: "Incluir una declaración de que la auditoría se limitó a la aplicación" },
          { id: "d", texto: "Revisar los controles relevantes del software de sistema y recomendar una revisión detallada" }
        ],
        respuestaCorrectaId: "d",
        justificacion: ""
      },
      {
        id: 6,
        pregunta: "¿Cuál es la razón MÁS importante para revisar periódicamente el proceso de planificación de auditoría?",
        alternativas: [
          { id: "a", texto: "Planificar el despliegue de recursos" },
          { id: "b", texto: "Considerar cambios en el entorno de riesgo" },
          { id: "c", texto: "Aportar insumos para la carta de auditoría" },
          { id: "d", texto: "Identificar los estándares de auditoría aplicables" }
        ],
        respuestaCorrectaId: "b",
        justificacion: ""
      },
      {
        id: 7,
        pregunta: "¿Cuál es el paso MÁS crítico al planificar una auditoría de SI?",
        alternativas: [
          { id: "a", texto: "Revisión de hallazgos de auditorías previas" },
          { id: "b", texto: "Aprobación del plan por la alta gerencia" },
          { id: "c", texto: "Revisión de políticas de seguridad de la información" },
          { id: "d", texto: "Realizar una evaluación de riesgo" }
        ],
        respuestaCorrectaId: "d",
        justificacion: ""
      },
      {
        id: 8,
        pregunta: "El enfoque para planificar la cobertura de auditoría de SI debe basarse en:",
        alternativas: [
          { id: "a", texto: "Riesgo" },
          { id: "b", texto: "Materialidad" },
          { id: "c", texto: "Monitoreo de fraude" },
          { id: "d", texto: "Suficiencia de la evidencia" }
        ],
        respuestaCorrectaId: "a",
        justificacion: ""
      },
      {
        id: 9,
        pregunta: "Una organización respalda diariamente datos y software críticos y almacena los medios fuera del sitio para restaurar archivos ante una interrupción. Esto es un ejemplo de un control:",
        alternativas: [
          { id: "a", texto: "Preventivo" },
          { id: "b", texto: "De gestión" },
          { id: "c", texto: "Correctivo" },
          { id: "d", texto: "Detective" }
        ],
        respuestaCorrectaId: "c",
        justificacion: ""
      }
    ],
    2: [],
    3: [],
    4: [],
    5: []
  },
  casos: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  }
};

/* ----------------------------------------------------------
   Metadatos de secciones para la UI
   ---------------------------------------------------------- */
const SECCIONES_META = {
  teoria: { label: "Dominio Teoría", emoji: "📖" },
  casos:  { label: "Casos de Estudio", emoji: "🔍" }
};

/* ----------------------------------------------------------
   2. ESTADO DE LA APLICACIÓN
   ---------------------------------------------------------- */
const state = {
  seccionActual:    null,   // 'teoria' | 'casos'
  subseccionActual: null,   // 1 | 2 | 3 | 4 | 5
  preguntas:        [],     // array de preguntas de la subsección seleccionada
  indiceActual:     0,
  correctas:        0,
  incorrectas:      0,
  respondida:       false,
};

/* ----------------------------------------------------------
   3. REFERENCIAS AL DOM
   ---------------------------------------------------------- */
const DOM = {
  // Pantallas
  screenStart:       document.getElementById('screen-start'),
  screenSubsections: document.getElementById('screen-subsections'),
  screenQuestion:    document.getElementById('screen-question'),
  screenResults:     document.getElementById('screen-results'),

  // Inicio
  btnTeoria:         document.getElementById('btn-seccion-teoria'),
  btnCasos:          document.getElementById('btn-seccion-casos'),

  // Subsecciones
  subsectionTitle:   document.getElementById('subsection-title'),
  subsectionGrid:    document.getElementById('subsection-grid'),
  btnBackToStart:    document.getElementById('btn-back-to-start'),

  // Pregunta
  questionCurrent:   document.getElementById('question-current'),
  questionTotal:     document.getElementById('question-total'),
  liveScore:         document.getElementById('live-score'),
  progressFill:      document.getElementById('progress-fill'),
  progressBar:       document.querySelector('.progress-bar'),
  questionNumber:    document.getElementById('question-number-label'),
  questionText:      document.getElementById('question-text'),
  alternativesList:  document.getElementById('alternatives-list'),
  feedbackCard:      document.getElementById('feedback-card'),
  feedbackIcon:      document.getElementById('feedback-icon'),
  feedbackStatus:    document.getElementById('feedback-status'),
  feedbackJust:      document.getElementById('feedback-justification'),
  btnNext:           document.getElementById('btn-next'),

  // Resultados
  resultsTrophy:     document.getElementById('results-trophy'),
  resultsTitle:      document.getElementById('results-title'),
  resultsSubtitle:   document.getElementById('results-subtitle'),
  ringFill:          document.getElementById('ring-fill'),
  ringScore:         document.getElementById('ring-score'),
  ringTotal:         document.getElementById('ring-total'),
  resultsStats:      document.getElementById('results-stats'),
  btnRestart:        document.getElementById('btn-restart'),
};

/* ----------------------------------------------------------
   4. NAVEGACIÓN ENTRE PANTALLAS
   ---------------------------------------------------------- */
function showScreen(screen) {
  [DOM.screenStart, DOM.screenSubsections, DOM.screenQuestion, DOM.screenResults]
    .forEach(s => s.classList.remove('screen--active'));
  screen.classList.add('screen--active');
  requestAnimationFrame(() => {
    const focusable = screen.querySelector('button, [tabindex="0"], h1, h2');
    if (focusable) focusable.focus({ preventScroll: true });
  });
}

/* ----------------------------------------------------------
   5. PANTALLA: SELECCIÓN DE SUBSECCIÓN
   ---------------------------------------------------------- */
function mostrarSubsecciones(seccion) {
  state.seccionActual = seccion;
  const meta = SECCIONES_META[seccion];

  DOM.subsectionTitle.textContent = `${meta.emoji} ${meta.label}`;

  // Limpiar grid
  DOM.subsectionGrid.innerHTML = '';

  for (let n = 1; n <= 5; n++) {
    const preguntas = BANCO_PREGUNTAS[seccion][n];
    const disponible = preguntas && preguntas.length > 0;

    const btn = document.createElement('button');
    btn.className = `subsection-btn${disponible ? '' : ' subsection-btn--empty'}`;
    btn.disabled  = !disponible;
    btn.setAttribute('aria-label', `${meta.label} ${n}${disponible ? '' : ' (próximamente)'}`);

    btn.innerHTML = `
      <span class="subsection-num">${n}</span>
      <span class="subsection-label">${meta.label} ${n}</span>
      <span class="subsection-count">${disponible ? preguntas.length + ' preguntas' : 'Próximamente'}</span>
    `;

    if (disponible) {
      btn.addEventListener('click', () => iniciarCuestionario(seccion, n));
    }

    DOM.subsectionGrid.appendChild(btn);
  }

  showScreen(DOM.screenSubsections);
}

/* ----------------------------------------------------------
   6. INICIO DEL CUESTIONARIO
   ---------------------------------------------------------- */
function iniciarCuestionario(seccion, subseccion) {
  state.seccionActual    = seccion;
  state.subseccionActual = subseccion;
  state.preguntas        = [...BANCO_PREGUNTAS[seccion][subseccion]];
  state.indiceActual     = 0;
  state.correctas        = 0;
  state.incorrectas      = 0;
  state.respondida       = false;

  DOM.questionTotal.textContent = state.preguntas.length;
  DOM.liveScore.textContent     = 0;
  actualizarProgreso();
  mostrarPregunta();
  showScreen(DOM.screenQuestion);
}

/* ----------------------------------------------------------
   7. RENDERIZAR PREGUNTA ACTUAL
   ---------------------------------------------------------- */
function mostrarPregunta() {
  state.respondida = false;
  const pregunta   = state.preguntas[state.indiceActual];
  const numHumano  = state.indiceActual + 1;

  DOM.questionCurrent.textContent = numHumano;
  DOM.questionNumber.textContent  = `P.${numHumano}`;
  DOM.questionText.textContent    = pregunta.pregunta;
  actualizarProgreso();

  ocultarFeedback();
  DOM.btnNext.hidden = true;

  // Renderizar alternativas
  DOM.alternativesList.innerHTML = '';
  pregunta.alternativas.forEach(alt => {
    const li  = document.createElement('li');
    li.setAttribute('role', 'listitem');

    const btn = document.createElement('button');
    btn.className          = 'alternative-btn';
    btn.dataset.id         = alt.id;
    btn.dataset.letter     = alt.id.toUpperCase();
    btn.setAttribute('aria-label', `Opción ${alt.id.toUpperCase()}: ${alt.texto}`);

    const span = document.createElement('span');
    span.className   = 'alternative-text';
    span.textContent = alt.texto;

    btn.appendChild(span);
    btn.addEventListener('click', () => manejarRespuesta(alt.id, pregunta));

    li.appendChild(btn);
    DOM.alternativesList.appendChild(li);
  });
}

/* ----------------------------------------------------------
   8. MANEJAR RESPUESTA DEL USUARIO
   ---------------------------------------------------------- */
function manejarRespuesta(idSeleccionado, pregunta) {
  if (state.respondida) return;
  state.respondida = true;

  const esCorrecta = idSeleccionado === pregunta.respuestaCorrectaId;

  if (esCorrecta) {
    state.correctas++;
  } else {
    state.incorrectas++;
  }
  DOM.liveScore.textContent = state.correctas;

  // Deshabilitar y marcar botones
  const botones = DOM.alternativesList.querySelectorAll('.alternative-btn');
  botones.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.id === pregunta.respuestaCorrectaId) {
      btn.classList.add('alternative-btn--correct');
    } else if (btn.dataset.id === idSeleccionado && !esCorrecta) {
      btn.classList.add('alternative-btn--wrong');
    }
  });

  mostrarFeedback(esCorrecta, pregunta.justificacion);

  const esUltima = state.indiceActual >= state.preguntas.length - 1;
  DOM.btnNext.hidden      = false;
  DOM.btnNext.textContent = esUltima ? 'Ver resultados' : 'Siguiente pregunta';

  const arrow = document.createElement('span');
  arrow.className   = 'btn-arrow';
  arrow.textContent = esUltima ? ' ↗' : ' →';
  arrow.setAttribute('aria-hidden', 'true');
  DOM.btnNext.appendChild(arrow);

  DOM.feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ----------------------------------------------------------
   9. FEEDBACK
   ---------------------------------------------------------- */
function mostrarFeedback(esCorrecta, justificacion) {
  DOM.feedbackCard.hidden    = false;
  DOM.feedbackCard.className = `feedback-card feedback-card--${esCorrecta ? 'correct' : 'wrong'}`;
  DOM.feedbackIcon.textContent   = esCorrecta ? '✅' : '❌';
  DOM.feedbackStatus.textContent = esCorrecta ? '¡Correcto!' : 'Incorrecto';

  if (justificacion && justificacion.trim() !== '') {
    DOM.feedbackJust.textContent = justificacion;
    DOM.feedbackJust.hidden      = false;
  } else {
    DOM.feedbackJust.hidden      = true;
  }
}

function ocultarFeedback() {
  DOM.feedbackCard.hidden    = true;
  DOM.feedbackCard.className = 'feedback-card';
}

/* ----------------------------------------------------------
   10. PROGRESO
   ---------------------------------------------------------- */
function actualizarProgreso() {
  const total      = state.preguntas.length;
  const respondidas = state.indiceActual;
  const pct        = total > 0 ? Math.round((respondidas / total) * 100) : 0;

  DOM.progressFill.style.width = `${pct}%`;
  DOM.progressBar.setAttribute('aria-valuenow', pct);
}

/* ----------------------------------------------------------
   11. SIGUIENTE PREGUNTA
   ---------------------------------------------------------- */
function siguientePregunta() {
  const esUltima = state.indiceActual >= state.preguntas.length - 1;

  if (esUltima) {
    mostrarResultados();
  } else {
    state.indiceActual++;
    mostrarPregunta();
    DOM.screenQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ----------------------------------------------------------
   12. PANTALLA DE RESULTADOS
   ---------------------------------------------------------- */
function mostrarResultados() {
  const total = state.preguntas.length;
  const score = state.correctas;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;

  let trophy    = '🏆';
  let titulo    = '¡Excelente trabajo!';
  let subtitulo = 'Obtuviste una puntuación perfecta. ¡Sigue así!';

  if (pct < 40) {
    trophy    = '📚';
    titulo    = '¡Sigue estudiando!';
    subtitulo = 'No te rindas, cada intento te acerca más al dominio del tema.';
  } else if (pct < 70) {
    trophy    = '👍';
    titulo    = '¡Buen esfuerzo!';
    subtitulo = 'Vas por buen camino. Repasa las preguntas que fallaste.';
  } else if (pct < 100) {
    trophy    = '🌟';
    titulo    = '¡Muy bien!';
    subtitulo = 'Casi perfecto. Revisa las respuestas incorrectas para alcanzar el 100%.';
  }

  DOM.resultsTrophy.textContent   = trophy;
  DOM.resultsTitle.textContent    = titulo;
  DOM.resultsSubtitle.textContent = subtitulo;
  DOM.ringScore.textContent       = score;
  DOM.ringTotal.textContent       = `/ ${total}`;

  const circunferencia = 314.16;
  const offset         = circunferencia - (circunferencia * pct) / 100;

  requestAnimationFrame(() => {
    setTimeout(() => {
      DOM.ringFill.style.strokeDashoffset = offset;
    }, 300);
  });

  const meta = SECCIONES_META[state.seccionActual];
  DOM.resultsStats.innerHTML = `
    <div class="stat-item stat-item--correct">
      <span class="stat-value">${state.correctas}</span>
      <span class="stat-label">Correctas</span>
    </div>
    <div class="stat-item stat-item--wrong">
      <span class="stat-value">${state.incorrectas}</span>
      <span class="stat-label">Incorrectas</span>
    </div>
    <div class="stat-item stat-item--total">
      <span class="stat-value">${pct}%</span>
      <span class="stat-label">Acierto</span>
    </div>
    <div class="stat-item stat-item--section" style="grid-column: 1 / -1;">
      <span class="stat-value" style="font-size: var(--font-size-base);">${meta.emoji} ${meta.label} ${state.subseccionActual}</span>
      <span class="stat-label">Sección</span>
    </div>
  `;

  showScreen(DOM.screenResults);
}

/* ----------------------------------------------------------
   13. REINICIAR – vuelve a la selección de subsección
   ---------------------------------------------------------- */
function reiniciarCuestionario() {
  DOM.ringFill.style.strokeDashoffset = 314.16;
  mostrarSubsecciones(state.seccionActual);
}

/* ----------------------------------------------------------
   14. INICIALIZACIÓN Y EVENTOS
   ---------------------------------------------------------- */
function init() {
  DOM.btnTeoria.addEventListener('click', () => mostrarSubsecciones('teoria'));
  DOM.btnCasos.addEventListener('click',  () => mostrarSubsecciones('casos'));

  DOM.btnBackToStart.addEventListener('click', () => showScreen(DOM.screenStart));
  DOM.btnNext.addEventListener('click', siguientePregunta);
  DOM.btnRestart.addEventListener('click', reiniciarCuestionario);

  showScreen(DOM.screenStart);
}

document.addEventListener('DOMContentLoaded', init);
