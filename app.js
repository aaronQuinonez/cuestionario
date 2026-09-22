/* ==========================================================
   app.js – Lógica del cuestionario interactivo
   Vanilla JS (ES6+) · Sin dependencias externas
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. DATOS – Banco de preguntas (JSON separado de la lógica)
   ---------------------------------------------------------- */
const PREGUNTAS = [
  {
    id: 1,
    pregunta: "¿Cuál es el resultado de ejecutar `typeof null` en JavaScript?",
    alternativas: [
      { id: "a", texto: "\"null\"" },
      { id: "b", texto: "\"undefined\"" },
      { id: "c", texto: "\"object\"" },
      { id: "d", texto: "\"symbol\"" },
      { id: "e", texto: "Lanza un TypeError" }
    ],
    respuestaCorrectaId: "c",
    justificacion: "En JavaScript, `typeof null` devuelve \"object\". Esto es un error histórico que existe desde la primera versión del lenguaje (Netscape Navigator 2.0). El valor null fue diseñado para representar la ausencia intencional de un objeto, y la implementación interna almacenaba todos los valores como tipos etiquetados; el tag de los objetos era 0, y null tenía un puntero nulo (0x00), lo que causó que el sistema de tipos lo clasificara como objeto. Se decidió mantener este comportamiento para no romper código existente."
  },
  {
    id: 2,
    pregunta: "En CSS, ¿qué valor de `display` hace que un elemento genere un contexto de formato de bloque (BFC) sin afectar el flujo exterior del documento?",
    alternativas: [
      { id: "a", texto: "display: block" },
      { id: "b", texto: "display: inline-block" },
      { id: "c", texto: "display: flow-root" },
      { id: "d", texto: "display: contents" },
      { id: "e", texto: "overflow: hidden en el elemento padre" }
    ],
    respuestaCorrectaId: "c",
    justificacion: "`display: flow-root` crea un nuevo BFC (Block Formatting Context) de forma explícita y sin efectos secundarios. A diferencia de `overflow: hidden` (que también crea un BFC pero corta el contenido desbordado) o `display: inline-block` (que cambia el tipo externo del elemento a inline), `flow-root` fue diseñado específicamente para este propósito. Es la solución moderna para contener flotantes o evitar colapso de márgenes sin alterar el flujo del documento."
  },
  {
    id: 3,
    pregunta: "¿Cuál de las siguientes afirmaciones describe correctamente la diferencia entre `==` y `===` en JavaScript?",
    alternativas: [
      { id: "a", texto: "`==` compara valor y tipo; `===` solo compara valor." },
      { id: "b", texto: "`===` realiza coerción de tipos antes de comparar; `==` no lo hace." },
      { id: "c", texto: "`==` realiza coerción de tipos (comparación abstracta); `===` compara valor y tipo sin coerción (comparación estricta)." },
      { id: "d", texto: "Ambos operadores son idénticos en comportamiento desde ES6." },
      { id: "e", texto: "`===` lanza un error si los tipos son distintos." }
    ],
    respuestaCorrectaId: "c",
    justificacion: "El operador `==` usa el algoritmo de «Abstract Equality Comparison», que convierte los operandos a un tipo común antes de comparar (ej: `'5' == 5` → `true`). El operador `===` usa «Strict Equality Comparison» y devuelve `false` directamente si los tipos son distintos, sin coerción (ej: `'5' === 5` → `false`). La práctica recomendada es usar siempre `===` para evitar resultados inesperados derivados de la coerción implícita."
  },
  {
    id: 4,
    pregunta: "En el modelo de cajas de CSS, ¿qué propiedad cambia el modelo de cálculo del tamaño para que `width` y `height` incluyan el padding y el borde?",
    alternativas: [
      { id: "a", texto: "box-model: border-box" },
      { id: "b", texto: "sizing: border-box" },
      { id: "c", texto: "box-sizing: border-box" },
      { id: "d", texto: "box-sizing: content-box" },
      { id: "e", texto: "border-sizing: include" }
    ],
    respuestaCorrectaId: "c",
    justificacion: "La propiedad `box-sizing: border-box` hace que el cálculo de `width` y `height` incluya el contenido, el padding y el borde. Con el valor por defecto `content-box`, `width` solo describe el área de contenido y el padding + borde se suman por fuera. La práctica universal en CSS moderno es aplicar `*, *::before, *::after { box-sizing: border-box; }` al inicio de cualquier hoja de estilos para simplificar los cálculos de dimensiones."
  },
  {
    id: 5,
    pregunta: "¿Cuál es la principal ventaja de usar `const` en lugar de `let` al declarar variables en JavaScript moderno?",
    alternativas: [
      { id: "a", texto: "Las variables `const` no pueden ser reasignadas, lo que comunica la intención de inmutabilidad del enlace." },
      { id: "b", texto: "`const` hace que el valor del objeto sea completamente inmutable y sus propiedades no puedan modificarse." },
      { id: "c", texto: "`const` mejora el rendimiento en tiempo de ejecución al optimizar las variables en el compilador V8." },
      { id: "d", texto: "`const` tiene alcance de función, mientras que `let` tiene alcance de bloque." },
      { id: "e", texto: "`const` es idéntico a `var` pero sin hoisting." }
    ],
    respuestaCorrectaId: "a",
    justificacion: "La principal ventaja de `const` es semántica: deja claro que el **enlace** (binding) de la variable no será reasignado, lo que reduce errores y mejora la legibilidad. Importante: `const` no congela el *valor* del objeto; sus propiedades sí pueden modificarse (para eso existe `Object.freeze()`). Tanto `let` como `const` tienen alcance de bloque, no de función. No hay diferencias de rendimiento significativas respecto a `let` en motores modernos."
  }
];

/* ----------------------------------------------------------
   2. ESTADO DE LA APLICACIÓN
   ---------------------------------------------------------- */
const state = {
  preguntas:       [],   // array barajado o en orden
  indiceActual:    0,
  correctas:       0,
  incorrectas:     0,
  respondida:      false,
};

/* ----------------------------------------------------------
   3. REFERENCIAS AL DOM
   ---------------------------------------------------------- */
const DOM = {
  // Pantallas
  screenStart:    document.getElementById('screen-start'),
  screenQuestion: document.getElementById('screen-question'),
  screenResults:  document.getElementById('screen-results'),

  // Inicio
  badgeTotalQuestions: document.getElementById('badge-total-questions'),
  btnStart:            document.getElementById('btn-start'),

  // Pregunta
  questionCurrent:  document.getElementById('question-current'),
  questionTotal:    document.getElementById('question-total'),
  liveScore:        document.getElementById('live-score'),
  progressFill:     document.getElementById('progress-fill'),
  progressBar:      document.querySelector('.progress-bar'),
  questionNumber:   document.getElementById('question-number-label'),
  questionText:     document.getElementById('question-text'),
  alternativesList: document.getElementById('alternatives-list'),
  feedbackCard:     document.getElementById('feedback-card'),
  feedbackIcon:     document.getElementById('feedback-icon'),
  feedbackStatus:   document.getElementById('feedback-status'),
  feedbackJust:     document.getElementById('feedback-justification'),
  btnNext:          document.getElementById('btn-next'),

  // Resultados
  resultsTrophy:   document.getElementById('results-trophy'),
  resultsTitle:    document.getElementById('results-title'),
  resultsSubtitle: document.getElementById('results-subtitle'),
  ringFill:        document.getElementById('ring-fill'),
  ringScore:       document.getElementById('ring-score'),
  ringTotal:       document.getElementById('ring-total'),
  resultsStats:    document.getElementById('results-stats'),
  btnRestart:      document.getElementById('btn-restart'),
};

/* ----------------------------------------------------------
   4. NAVEGACIÓN ENTRE PANTALLAS
   ---------------------------------------------------------- */
/**
 * Oculta todas las pantallas y muestra la indicada.
 * @param {HTMLElement} screen
 */
function showScreen(screen) {
  [DOM.screenStart, DOM.screenQuestion, DOM.screenResults].forEach(s => {
    s.classList.remove('screen--active');
  });
  screen.classList.add('screen--active');
  // Enfoca el primer elemento enfocable para accesibilidad
  requestAnimationFrame(() => {
    const focusable = screen.querySelector('button, [tabindex="0"], h1, h2');
    if (focusable) focusable.focus({ preventScroll: true });
  });
}

/* ----------------------------------------------------------
   5. INICIO DEL CUESTIONARIO
   ---------------------------------------------------------- */
function iniciarCuestionario() {
  // Copia el array de preguntas (no modifica el original)
  state.preguntas    = [...PREGUNTAS];
  state.indiceActual = 0;
  state.correctas    = 0;
  state.incorrectas  = 0;
  state.respondida   = false;

  DOM.questionTotal.textContent = state.preguntas.length;
  DOM.liveScore.textContent     = 0;
  actualizarProgreso();
  mostrarPregunta();
  showScreen(DOM.screenQuestion);
}

/* ----------------------------------------------------------
   6. RENDERIZAR PREGUNTA ACTUAL
   ---------------------------------------------------------- */
function mostrarPregunta() {
  state.respondida = false;
  const pregunta   = state.preguntas[state.indiceActual];
  const numHumano  = state.indiceActual + 1;

  // Actualizar indicadores de progreso
  DOM.questionCurrent.textContent = numHumano;
  DOM.questionNumber.textContent  = `P.${numHumano}`;
  DOM.questionText.textContent    = pregunta.pregunta;
  actualizarProgreso();

  // Ocultar feedback y botón siguiente
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
   7. MANEJAR RESPUESTA DEL USUARIO
   ---------------------------------------------------------- */
/**
 * @param {string} idSeleccionado  – id de la alternativa elegida
 * @param {Object} pregunta        – objeto de la pregunta actual
 */
function manejarRespuesta(idSeleccionado, pregunta) {
  if (state.respondida) return;
  state.respondida = true;

  const esCorrecta = idSeleccionado === pregunta.respuestaCorrectaId;

  // Actualizar puntuación
  if (esCorrecta) {
    state.correctas++;
  } else {
    state.incorrectas++;
  }
  DOM.liveScore.textContent = state.correctas;

  // Deshabilitar todos los botones
  const botones = DOM.alternativesList.querySelectorAll('.alternative-btn');
  botones.forEach(btn => {
    btn.disabled = true;

    if (btn.dataset.id === pregunta.respuestaCorrectaId) {
      btn.classList.add('alternative-btn--correct');
    } else if (btn.dataset.id === idSeleccionado && !esCorrecta) {
      btn.classList.add('alternative-btn--wrong');
    }
  });

  // Mostrar feedback
  mostrarFeedback(esCorrecta, pregunta.justificacion);

  // Mostrar botón siguiente o finalizar
  const esUltima = state.indiceActual >= state.preguntas.length - 1;
  DOM.btnNext.hidden      = false;
  DOM.btnNext.textContent = esUltima ? 'Ver resultados' : 'Siguiente pregunta';
  // Re-añadir ícono de flecha (el textContent lo reemplazó)
  const arrow = document.createElement('span');
  arrow.className   = 'btn-arrow';
  arrow.textContent = esUltima ? ' ↗' : ' →';
  arrow.setAttribute('aria-hidden', 'true');
  DOM.btnNext.appendChild(arrow);

  // Scroll suave hacia el feedback
  DOM.feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ----------------------------------------------------------
   8. FEEDBACK
   ---------------------------------------------------------- */
function mostrarFeedback(esCorrecta, justificacion) {
  DOM.feedbackCard.hidden = false;
  DOM.feedbackCard.className = `feedback-card feedback-card--${esCorrecta ? 'correct' : 'wrong'}`;
  DOM.feedbackIcon.textContent   = esCorrecta ? '✅' : '❌';
  DOM.feedbackStatus.textContent = esCorrecta ? '¡Correcto!' : 'Incorrecto';
  DOM.feedbackJust.textContent   = justificacion;
}

function ocultarFeedback() {
  DOM.feedbackCard.hidden    = true;
  DOM.feedbackCard.className = 'feedback-card';
}

/* ----------------------------------------------------------
   9. PROGRESO
   ---------------------------------------------------------- */
function actualizarProgreso() {
  const total      = state.preguntas.length;
  const respondidas = state.indiceActual; // preguntas ya superadas
  const pct        = total > 0 ? Math.round((respondidas / total) * 100) : 0;

  DOM.progressFill.style.width = `${pct}%`;
  DOM.progressBar.setAttribute('aria-valuenow', pct);
}

/* ----------------------------------------------------------
   10. SIGUIENTE PREGUNTA
   ---------------------------------------------------------- */
function siguientePregunta() {
  const esUltima = state.indiceActual >= state.preguntas.length - 1;

  if (esUltima) {
    mostrarResultados();
  } else {
    state.indiceActual++;
    mostrarPregunta();
    // Scroll al inicio de la pantalla
    DOM.screenQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ----------------------------------------------------------
   11. PANTALLA DE RESULTADOS
   ---------------------------------------------------------- */
function mostrarResultados() {
  const total   = state.preguntas.length;
  const score   = state.correctas;
  const pct     = total > 0 ? Math.round((score / total) * 100) : 0;

  // Emoji y mensaje según rendimiento
  let trophy   = '🏆';
  let titulo   = '¡Excelente trabajo!';
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

  // Animar el anillo SVG (circunferencia = 2π·50 ≈ 314.16)
  const circunferencia = 314.16;
  const offset         = circunferencia - (circunferencia * pct) / 100;

  // Pequeño delay para que la animación sea visible al entrar la pantalla
  requestAnimationFrame(() => {
    setTimeout(() => {
      DOM.ringFill.style.strokeDashoffset = offset;
    }, 300);
  });

  // Estadísticas
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
  `;

  showScreen(DOM.screenResults);
}

/* ----------------------------------------------------------
   12. REINICIAR
   ---------------------------------------------------------- */
function reiniciarCuestionario() {
  // Resetear anillo para la próxima animación
  DOM.ringFill.style.strokeDashoffset = 314.16;
  showScreen(DOM.screenStart);
}

/* ----------------------------------------------------------
   13. INICIALIZACIÓN Y EVENTOS
   ---------------------------------------------------------- */
function init() {
  // Badge con total de preguntas en pantalla de inicio
  DOM.badgeTotalQuestions.textContent = `${PREGUNTAS.length} preguntas`;

  // Eventos
  DOM.btnStart.addEventListener('click', iniciarCuestionario);
  DOM.btnNext.addEventListener('click', siguientePregunta);
  DOM.btnRestart.addEventListener('click', reiniciarCuestionario);

  // Mostrar pantalla de inicio al cargar
  showScreen(DOM.screenStart);
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
