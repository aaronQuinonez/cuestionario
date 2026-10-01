/* ==========================================================
   app.js – Lógica del cuestionario interactivo
   Vanilla JS (ES6+) · Sin dependencias externas
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   0. SISTEMA DE IDIOMAS
   ---------------------------------------------------------- */
const TRANSLATIONS = {
  es: {
    appTitle:          'Cuestionario<br>Interactivo',
    appSubtitle:       'Selecciona una sección para comenzar. Recibirás retroalimentación inmediata en cada pregunta.',
    teoriaLabel:       'Dominio Teoría',
    casosLabel:        'Casos de Estudio',
    subsCount:         '5 subsecciones',
    chooseSubsection:  'Elige una subsección para practicar',
    backBtn:           'Volver al inicio',
    questionWord:      'Pregunta',
    ofWord:            'de',
    scoreWord:         'Puntos',
    nextBtn:           'Siguiente pregunta',
    finishBtn:         'Ver resultados',
    correct:           '¡Correcto!',
    incorrect:         'Incorrecto',
    restartBtn:        'Volver al inicio',
    preguntas:         'preguntas',
    comingSoon:        'Próximamente',
    statCorrect:       'Correctas',
    statIncorrect:     'Incorrectas',
    statAccuracy:      'Acierto',
    statSection:       'Sección',
    randomModeTitle:   'Modo Aleatorio',
    randomModeDesc:    'Mezcla las alternativas en cada pregunta',
    randomBadge:       '🔀 Aleatorio',
    reorderNotice:     '🔄 Opciones sincronizadas en su orden original con la justificación',
    score0:  ['📚', '¡Sigue estudiando!',  'No te rindas, cada intento te acerca más al dominio del tema.'],
    score40: ['👍', '¡Buen esfuerzo!',     'Vas por buen camino. Repasa las preguntas que fallaste.'],
    score70: ['🌟', '¡Muy bien!',          'Casi perfecto. Revisa las respuestas incorrectas para alcanzar el 100%.'],
    score100:['🏆', '¡Excelente trabajo!', 'Obtuviste una puntuación perfecta. ¡Sigue así!'],
    sectionMeta: {
      teoria:   { label: 'Dominio Teoría',   emoji: '📖' },
      casos:    { label: 'Casos de Estudio', emoji: '🔍' },
      deepseek: {
        label: 'Banco DeepSeek',
        emoji: '🤖',
        subLabels: {
          1: 'Parte 1 (Preguntas 1 - 10)',
          2: 'Parte 2 (Preguntas 11 - 20)',
          3: 'Examen Completo (20 preguntas)'
        }
      },
      gemini: {
        label: 'Banco Gemini',
        emoji: '✨',
        subLabels: {
          1: 'Parte 1 (Preguntas 1 - 10)',
          2: 'Parte 2 (Preguntas 11 - 20)',
          3: 'Examen Completo (20 preguntas)'
        }
      },
      gpt: {
        label: 'Banco GPT',
        emoji: '💡',
        subLabels: {
          1: 'Parte 1: Por Dominio (1 - 10)',
          2: 'Parte 2: Casos de Estudio (11 - 20)',
          3: 'Examen Completo (20 preguntas)'
        }
      },
      multiples: {
        label: 'Opciones Múltiples',
        emoji: '☑️',
        subLabels: {
          1: 'Capítulo 1: Proceso de Auditoría de SI (1 - 10)',
          2: 'Capítulo 2: Gobernanza y Gestión de TI (11 - 20)',
          3: 'Simulacro Parcial Completo (20 preguntas)'
        }
      },
      multiples2: {
        label: 'Opciones Múltiples 2',
        emoji: '📋',
        subLabels: {
          1: 'Capítulo 3: Adquisición y Desarrollo (1 - 10)',
          2: 'Capítulo 4: Operaciones y Resiliencia (11 - 20)',
          3: 'Capítulo 5: Protección de Activos (21 - 30)',
          4: 'Simulacro Completo (30 preguntas)'
        }
      }
    },
    deepseekLabel:     'Banco DeepSeek',
    deepseekCount:     '20 preguntas',
    geminiLabel:       'Banco Gemini',
    geminiCount:       '20 preguntas',
    gptLabel:          'Banco GPT',
    gptCount:          '20 preguntas',
    multiplesLabel:    'Opciones Múltiples',
    multiplesCount:    '20 preguntas (A-F)',
    multiples2Label:   'Opciones Múltiples 2',
    multiples2Count:   '30 preguntas (A-F)',
    multiBadge:        '☑️ Selección Múltiple',
    multiInstruction:  'Marca de 2 a 5 opciones correctas:',
    submitMultiBtn:    'Confirmar respuestas',
    missedOptionTag:   '(Correcta omitida)'
  },
  en: {
    appTitle:          'Interactive<br>Quiz',
    appSubtitle:       'Select a section to start. You will receive immediate feedback after each question.',
    teoriaLabel:       'Theory Domain',
    casosLabel:        'Case Studies',
    subsCount:         '5 subsections',
    chooseSubsection:  'Choose a subsection to practice',
    backBtn:           'Back to home',
    questionWord:      'Question',
    ofWord:            'of',
    scoreWord:         'Score',
    nextBtn:           'Next question',
    finishBtn:         'See results',
    correct:           'Correct!',
    incorrect:         'Incorrect',
    restartBtn:        'Back to home',
    preguntas:         'questions',
    comingSoon:        'Coming soon',
    statCorrect:       'Correct',
    statIncorrect:     'Incorrect',
    statAccuracy:      'Accuracy',
    statSection:       'Section',
    randomModeTitle:   'Shuffle Mode',
    randomModeDesc:    'Shuffles alternatives on each question',
    randomBadge:       '🔀 Shuffled',
    reorderNotice:     '🔄 Options synchronized in original order with justification',
    score0:  ['📚', 'Keep studying!',    "Don't give up, each attempt brings you closer to mastering the topic."],
    score40: ['👍', 'Good effort!',      "You're on the right track. Review the questions you got wrong."],
    score70: ['🌟', 'Well done!',        'Almost perfect. Review incorrect answers to reach 100%.'],
    score100:['🏆', 'Excellent work!',   'You got a perfect score. Keep it up!'],
    sectionMeta: {
      teoria:   { label: 'Theory Domain', emoji: '📖' },
      casos:    { label: 'Case Studies',  emoji: '🔍' },
      deepseek: {
        label: 'DeepSeek Bank',
        emoji: '🤖',
        subLabels: {
          1: 'Part 1 (Questions 1 - 10)',
          2: 'Part 2 (Questions 11 - 20)',
          3: 'Full Exam (20 questions)'
        }
      },
      gemini: {
        label: 'Gemini Bank',
        emoji: '✨',
        subLabels: {
          1: 'Part 1 (Questions 1 - 10)',
          2: 'Part 2 (Questions 11 - 20)',
          3: 'Full Exam (20 questions)'
        }
      },
      gpt: {
        label: 'GPT Bank',
        emoji: '💡',
        subLabels: {
          1: 'Part 1: By Domain (1 - 10)',
          2: 'Part 2: Case Studies (11 - 20)',
          3: 'Full Exam (20 questions)'
        }
      },
      multiples: {
        label: 'Multiple Choice',
        emoji: '☑️',
        subLabels: {
          1: 'Chapter 1: IS Audit Process (1 - 10)',
          2: 'Chapter 2: IT Governance & Management (11 - 20)',
          3: 'Full Midterm Mock Exam (20 questions)'
        }
      },
      multiples2: {
        label: 'Multiple Choice 2',
        emoji: '📋',
        subLabels: {
          1: 'Chapter 3: Acquisition & Development (1 - 10)',
          2: 'Chapter 4: Operations & Resilience (11 - 20)',
          3: 'Chapter 5: Protection of Information Assets (21 - 30)',
          4: 'Full Mock Exam (30 questions)'
        }
      }
    },
    deepseekLabel:     'DeepSeek Bank',
    deepseekCount:     '20 questions',
    geminiLabel:       'Gemini Bank',
    geminiCount:       '20 questions',
    gptLabel:          'GPT Bank',
    gptCount:          '20 questions',
    multiplesLabel:    'Multiple Choice',
    multiplesCount:    '20 questions (A-F)',
    multiples2Label:   'Multiple Choice 2',
    multiples2Count:   '30 questions (A-F)',
    multiBadge:        '☑️ Multiple Selection',
    multiInstruction:  'Select 2 to 5 correct options:',
    submitMultiBtn:    'Confirm answers',
    missedOptionTag:   '(Missed correct option)'
  }
};

let currentLang = 'es';

function t(key) {
  return TRANSLATIONS[currentLang][key];
}

/** Mezcla un arreglo garantizando un orden diferente (Fisher-Yates) */
function shuffleAlts(array) {
  if (array.length <= 1) return [...array];
  let shuffled;
  let attempts = 0;
  do {
    shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (attempts < 10 && shuffled.every((val, idx) => val === array[idx]));
  return shuffled;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const flag  = document.getElementById('lang-flag');
  const label = document.getElementById('lang-label');
  if (lang === 'es') {
    flag.textContent  = '🇺🇸';
    label.textContent = 'EN';
  } else {
    flag.textContent  = '🇪🇸';
    label.textContent = 'ES';
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val !== undefined) {
      el.innerHTML = val;
    }
  });

  if (DOM && DOM.screenSubsections && DOM.screenSubsections.classList.contains('screen--active')) {
    mostrarSubsecciones(state.seccionActual);
  }

  if (DOM && DOM.screenQuestion && DOM.screenQuestion.classList.contains('screen--active')) {
    const pregunta = state.preguntas[state.indiceActual];
    if (pregunta) {
      const useEn = currentLang === 'en' && pregunta.preguntaEn;
      DOM.questionText.textContent = useEn ? pregunta.preguntaEn : pregunta.pregunta;
      const alts = useEn ? pregunta.alternativasEn : pregunta.alternativas;

      const botones = DOM.alternativesList.querySelectorAll('.alternative-btn');
      botones.forEach(btn => {
        const alt = alts.find(a => a.id === btn.dataset.id);
        if (alt) {
          const span = btn.querySelector('.alternative-text');
          if (span) {
            span.textContent = alt.texto;
            if (btn.classList.contains('alternative-btn--missed')) {
              const tag = document.createElement('span');
              tag.className = 'alt-tag-missed';
              tag.textContent = t('missedOptionTag') || '(Correcta omitida)';
              span.appendChild(tag);
            }
          }
          btn.setAttribute('aria-label', `${currentLang === 'en' ? 'Option' : 'Opción'} ${btn.dataset.letter || alt.id.toUpperCase()}: ${alt.texto}`);
        }
      });

      if (DOM.badgeRandomMode && state.modoAleatorio) {
        DOM.badgeRandomMode.textContent = t('randomBadge');
      }

      if (state.respondida) {
        const esCorrecta = DOM.feedbackCard.classList.contains('feedback-card--correct');
        const just = useEn ? pregunta.justificacionEn : pregunta.justificacion;
        mostrarFeedback(esCorrecta, just);

        if (DOM.feedbackReorderNotice && state.modoAleatorio) {
          DOM.feedbackReorderNotice.textContent = t('reorderNotice');
        }

        const esUltima = state.indiceActual >= state.preguntas.length - 1;
        const nextText = DOM.btnNext.querySelector('#btn-next-text') || DOM.btnNext;
        nextText.textContent = esUltima ? t('finishBtn') : t('nextBtn');
      }
    }
  }

  if (DOM && DOM.screenResults && DOM.screenResults.classList.contains('screen--active')) {
    mostrarResultados();
  }
}

function toggleLanguage() {
  applyLanguage(currentLang === 'es' ? 'en' : 'es');
}

/* ----------------------------------------------------------
   1. DATOS – Banco de preguntas por sección y subsección
   ---------------------------------------------------------- */
const BANCO_PREGUNTAS = {
  "teoria": {
    "1": [
      {
        "id": 1,
        "pregunta": "¿Cuál de las siguientes opciones describe la autoridad general para realizar una auditoría de SI?",
        "preguntaEn": "Which of the following best describes the general authority to perform an IS audit?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El alcance de la auditoría con metas y objetivos"
          },
          {
            "id": "b",
            "texto": "Una solicitud de la gerencia para realizar una auditoría"
          },
          {
            "id": "c",
            "texto": "La carta de auditoría (audit charter) aprobada"
          },
          {
            "id": "d",
            "texto": "El cronograma de auditoría aprobado"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The audit scope with goals and objectives"
          },
          {
            "id": "b",
            "texto": "A request from management to perform an audit"
          },
          {
            "id": "c",
            "texto": "The approved audit charter"
          },
          {
            "id": "d",
            "texto": "The approved audit schedule"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. El alcance de la auditoría es específico para una sola auditoría y no otorga la autoridad para realizar una auditoría. B. Una solicitud de la gerencia para realizar una auditoría no es suficiente porque se refiere a una auditoría específica. C. La carta de auditoría (audit charter) aprobada describe la responsabilidad, autoridad y rendición de cuentas (accountability) del auditor. D. El cronograma de auditoría aprobado no otorga la autoridad para realizar una auditoría.",
        "justificacionEn": "A. The audit scope is specific to a single audit and does not grant authority to perform an audit. B. A request from management to perform an audit is not sufficient because it relates to a specific audit. C. The approved audit charter outlines the auditor's responsibility, authority and accountability. D. The approved audit schedule does not grant authority to perform an audit."
      },
      {
        "id": 2,
        "pregunta": "¿Cuál es el beneficio clave de una autoevaluación de control (CSA)?",
        "preguntaEn": "What is the key benefit of a control self-assessment (CSA)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Se refuerza la apropiación por parte de la gerencia de los controles internos"
          },
          {
            "id": "b",
            "texto": "Se reducen los gastos de auditoría"
          },
          {
            "id": "c",
            "texto": "Mejora la detección de fraude"
          },
          {
            "id": "d",
            "texto": "Los auditores internos pueden adoptar un enfoque consultivo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Management ownership of internal controls is reinforced"
          },
          {
            "id": "b",
            "texto": "Audit expenses are reduced"
          },
          {
            "id": "c",
            "texto": "Fraud detection is improved"
          },
          {
            "id": "d",
            "texto": "Internal auditors can take a more consultative role"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. El objetivo de la autoevaluación de control (CSA) es lograr que los gerentes de negocio sean más conscientes de la importancia del control interno y de su responsabilidad en términos de gobierno corporativo. B. Reducir los gastos de auditoría no es un beneficio clave de la CSA. C. Mejorar la detección de fraude es importante, pero no tanto como la apropiación del control (control ownership). No es un objetivo principal de la CSA. D. La CSA puede brindar más información a los auditores internos, permitiéndoles asumir un rol más consultivo; sin embargo, este es un beneficio adicional, no el beneficio clave.",
        "justificacionEn": "A. The objective of control self-assessment (CSA) is to have business managers become more aware of the importance of internal control and their responsibility in terms of corporate governance. B. Reducing audit expenses is not a key benefit of CSA. C. Improved fraud detection is important but not as important as control ownership. It is not a principal objective of CSA. D. CSA may give more insights to internal auditors, allowing them to take a more consultative role; however, this is an additional benefit, not the key benefit."
      },
      {
        "id": 3,
        "pregunta": "¿En qué se enfocaría MÁS un auditor de SI al desarrollar un programa de auditoría basado en riesgo?",
        "preguntaEn": "What would an IS auditor MOST focus on when developing a risk-based audit program?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Procesos de negocio"
          },
          {
            "id": "b",
            "texto": "Controles administrativos"
          },
          {
            "id": "c",
            "texto": "Controles ambientales"
          },
          {
            "id": "d",
            "texto": "Estrategias de negocio"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Business processes"
          },
          {
            "id": "b",
            "texto": "Administrative controls"
          },
          {
            "id": "c",
            "texto": "Environmental controls"
          },
          {
            "id": "d",
            "texto": "Business strategies"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Un enfoque de auditoría basado en riesgos se centra en comprender la naturaleza del negocio y en ser capaz de identificar y categorizar el riesgo. El riesgo de negocio impacta la viabilidad a largo plazo de un negocio específico. Por lo tanto, un auditor de SI que utiliza un enfoque de auditoría basado en riesgos debe ser capaz de comprender los procesos de negocio. B. Los controles administrativos, aunque son un subconjunto importante de controles, no son el foco principal necesario para comprender los procesos de negocio dentro del alcance de una auditoría. C. Al igual que los controles administrativos, los controles ambientales son un subconjunto de control importante; sin embargo, no abordan los procesos de negocio generales de alto nivel bajo revisión. D. Las estrategias de negocio son las impulsoras de los procesos de negocio; sin embargo, en este caso, el auditor de SI se enfoca en los procesos de negocio que se implementaron para permitir a la organización ejecutar sus estrategias.",
        "justificacionEn": "A. A risk-based audit approach focuses on understanding the nature of the business and being able to identify and categorize risk. Business risk impacts the long-term viability of a specific business. Thus, an IS auditor using a risk-based audit approach must be able to understand business processes. B. Administrative controls, while an important subset of controls, are not the primary focus needed to understand the business processes within the scope of an audit. C. Like administrative controls, environmental controls are an important control subset; however, they do not address high-level overarching business processes under review. D. Business strategies are the drivers for business processes; however, in this case, an IS auditor is focusing on the business processes that were put in place to enable the organization to implement its strategies."
      },
      {
        "id": 4,
        "pregunta": "¿Qué tipo de riesgo de auditoría asume la ausencia de controles compensatorios en el área revisada?",
        "preguntaEn": "Which type of audit risk is assumed when there are no compensating controls in the area under review?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo de control"
          },
          {
            "id": "b",
            "texto": "Riesgo de detección"
          },
          {
            "id": "c",
            "texto": "Riesgo inherente"
          },
          {
            "id": "d",
            "texto": "Riesgo de muestreo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Control risk"
          },
          {
            "id": "b",
            "texto": "Detection risk"
          },
          {
            "id": "c",
            "texto": "Inherent risk"
          },
          {
            "id": "d",
            "texto": "Sampling risk"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. El riesgo de control es el riesgo de que exista un error material que no sea prevenido o detectado de manera oportuna por el sistema de controles internos. B. El riesgo de detección es el riesgo de que una incorrección material con una afirmación de la gerencia no sea detectada por las pruebas sustantivas de un profesional de auditoría y aseguramiento. Consta de dos componentes: riesgo de muestreo y riesgo de no muestreo. C. El riesgo inherente es el nivel de riesgo o exposición evaluado sin considerar las acciones que la gerencia ha tomado o podría tomar. D. El riesgo de muestreo es el riesgo de que se hagan suposiciones incorrectas sobre las características de una población de la cual se toma una muestra. El riesgo de no muestreo es el riesgo de detección no relacionado con el muestreo; puede deberse a una variedad de razones, incluido el error humano.",
        "justificacionEn": "A. Control risk is the risk that a material error exists that will not be prevented or detected in a timely manner by the system of internal controls. B. Detection risk is the risk that a material misstatement with a management assertion will not be detected by an audit and assurance professional's substantive tests. It consists of two components: sampling risk and non-sampling risk. C. Inherent risk is the risk level or exposure assessed without considering the actions that management has taken or might take. D. Sampling risk is the risk that incorrect assumptions are made about the characteristics of a population from which a sample is taken. Non-sampling risk is detection risk that is unrelated to sampling; it can be due to a variety of reasons, including human error."
      },
      {
        "id": 5,
        "pregunta": "Un auditor de SI que revisa los controles de una aplicación encuentra una debilidad en el software de sistema que podría afectar materialmente la aplicación. ¿Qué debe hacer?",
        "preguntaEn": "An IS auditor reviewing application controls discovers a weakness in the systems software that could materially affect the application. What should the auditor do?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ignorarla por estar fuera de alcance"
          },
          {
            "id": "b",
            "texto": "Realizar una revisión detallada del software de sistema y reportarla"
          },
          {
            "id": "c",
            "texto": "Incluir una declaración de que la auditoría se limitó a la aplicación"
          },
          {
            "id": "d",
            "texto": "Revisar los controles relevantes del software de sistema y recomendar una revisión detallada"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Ignore it because it is outside the scope of the review"
          },
          {
            "id": "b",
            "texto": "Perform a detailed systems software review and report it"
          },
          {
            "id": "c",
            "texto": "Include a disclaimer that the audit was limited to the application"
          },
          {
            "id": "d",
            "texto": "Review relevant systems software controls and recommend a detailed review"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. No se espera que un auditor de SI ignore las debilidades de control solo porque estén fuera del alcance de la revisión actual. B. Llevar a cabo una revisión detallada del software de sistemas puede obstaculizar el cronograma de la auditoría, y es posible que un auditor de SI no sea técnicamente competente para realizar dicha revisión en el momento de la auditoría. C. Si hay debilidades de control descubiertas por un auditor de SI, deben ser reveladas. Al emitir una exención de responsabilidad (disclaimer), se renunciaría a esta responsabilidad. D. La opción adecuada sería revisar el software de sistemas relevante y recomendar una revisión detallada del software de sistemas para la cual se puedan recomendar recursos adicionales.",
        "justificacionEn": "A. An information systems (IS) auditor is not expected to ignore control weaknesses just because they are outside the scope of a current review. B. The conduct of a detailed systems software review may hamper the audit's schedule, and an IS auditor may not be technically competent to do such a review at the time of the audit. C. If there are control weaknesses that have been discovered by an IS auditor, they should be disclosed. By issuing a disclaimer, this responsibility would be waived. D. The appropriate option would be to review the relevant systems software and recommend a detailed systems software review for which additional resources may be recommended."
      },
      {
        "id": 6,
        "pregunta": "¿Cuál es la razón MÁS importante para revisar periódicamente el proceso de planificación de auditoría?",
        "preguntaEn": "What is the MOST important reason for periodically reviewing the audit planning process?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Planificar el despliegue de recursos"
          },
          {
            "id": "b",
            "texto": "Considerar cambios en el entorno de riesgo"
          },
          {
            "id": "c",
            "texto": "Aportar insumos para la carta de auditoría"
          },
          {
            "id": "d",
            "texto": "Identificar los estándares de auditoría aplicables"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Plan the deployment of audit resources"
          },
          {
            "id": "b",
            "texto": "Consider changes in the risk environment"
          },
          {
            "id": "c",
            "texto": "Provide input for the audit charter"
          },
          {
            "id": "d",
            "texto": "Identify applicable audit standards"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. El despliegue de los recursos de auditoría disponibles está determinado por las asignaciones de auditoría, las cuales están influenciadas por el proceso de planificación. B. Los asuntos a corto y largo plazo que impulsan la planificación de la auditoría pueden verse fuertemente afectados por cambios en el entorno de riesgo, las tecnologías y los procesos de negocio de la empresa. C. La carta de auditoría refleja el mandato de la alta gerencia hacia la función de auditoría y reside en un nivel más abstracto. D. La aplicabilidad de los estándares, directrices y procedimientos de auditoría de SI es universal para cualquier encargo de auditoría y no está influenciada por problemas a corto y largo plazo.",
        "justificacionEn": "A. Deployment of available audit resources is determined by the audit assignments, which are influenced by the planning process. B. Short- and long-term issues that drive audit planning can be heavily impacted by changes to the risk environment, technologies and business processes of the enterprise. C. The audit charter reflects the mandate of top management to the audit function and resides at a more abstract level. D. Applicability of information systems (IS) audit standards, guidelines and procedures is universal to any audit engagement and is not influenced by short- and long-term issues."
      },
      {
        "id": 7,
        "pregunta": "¿Cuál es el paso MÁS crítico al planificar una auditoría de SI?",
        "preguntaEn": "What is the MOST critical step when planning an IS audit?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisión de hallazgos de auditorías previas"
          },
          {
            "id": "b",
            "texto": "Aprobación del plan por la alta gerencia"
          },
          {
            "id": "c",
            "texto": "Revisión de políticas de seguridad de la información"
          },
          {
            "id": "d",
            "texto": "Realizar una evaluación de riesgo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Review of findings from previous audits"
          },
          {
            "id": "b",
            "texto": "Approval of the plan by senior management"
          },
          {
            "id": "c",
            "texto": "Review of information security policies"
          },
          {
            "id": "d",
            "texto": "Performing a risk assessment"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Los hallazgos de una auditoría anterior son de interés para el auditor, pero no son el paso más crítico. El paso más crítico implica encontrar los problemas actuales o las áreas de alto riesgo, no revisar la resolución de problemas anteriores. B. No se requiere que la gerencia ejecutiva apruebe el plan de auditoría. Por lo general, es aprobado por el comité de auditoría o la junta directiva. La gerencia podría recomendar áreas a auditar. C. La revisión de las políticas y procedimientos de seguridad de la información normalmente se lleva a cabo durante el trabajo de campo, no en la planificación. D. De todos los pasos enumerados, realizar una evaluación de riesgos es el más crítico. La evaluación de riesgos es obligatoria según el Estándar 1201 de ISACA: los profesionales de auditoría y aseguramiento de TI deben identificar y evaluar el riesgo relevante para el área bajo revisión al planificar compromisos individuales. Si no se realiza una evaluación de riesgos, es posible que las áreas de alto riesgo no se identifiquen para su evaluación.",
        "justificacionEn": "A. The findings of a previous audit are of interest to the auditor, but they are not the most critical step. The most critical step involves finding the current issues or high-risk areas, not reviewing the resolution of older issues. A review of historical audit findings could indicate that management is not resolving the risk items identified or that the recommendations were ineffective. B. Executive management is not required to approve the audit plan. It is typically approved by the audit committee or board of directors. Management could recommend areas to audit. C. Reviewing information security policies and procedures is normally conducted during fieldwork, not planning. D. Of all the steps listed, performing a risk assessment is the most critical. Risk assessment is required by ISACA IS Audit and Assurance Standard 1201: IT audit and assurance practitioners shall identify and assess risk relevant to the area under review when planning individual engagements. If a risk assessment is not performed, then high-risk areas may not be identified for evaluation."
      },
      {
        "id": 8,
        "pregunta": "El enfoque para planificar la cobertura de auditoría de SI debe basarse en:",
        "preguntaEn": "The approach to planning IS audit coverage should be based on:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo"
          },
          {
            "id": "b",
            "texto": "Materialidad"
          },
          {
            "id": "c",
            "texto": "Monitoreo de fraude"
          },
          {
            "id": "d",
            "texto": "Suficiencia de la evidencia"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Risk"
          },
          {
            "id": "b",
            "texto": "Materiality"
          },
          {
            "id": "c",
            "texto": "Fraud monitoring"
          },
          {
            "id": "d",
            "texto": "Sufficiency of audit evidence"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La planificación de la auditoría requiere un enfoque basado en riesgos. B. La materialidad se refiere a debilidades potenciales o ausencias de controles al planificar un encargo específico, y si tales debilidades podrían resultar en una deficiencia significativa o una debilidad material. C. El monitoreo del fraude se refiere a la identificación de transacciones y patrones relacionados con el fraude y puede desempeñar un papel en la planificación de la auditoría, pero solo en la medida en que se relacione con el riesgo organizacional. D. La suficiencia de la evidencia de auditoría se refiere a la evaluación de la suficiencia de la evidencia obtenida para respaldar las conclusiones y alcanzar los objetivos específicos del encargo.",
        "justificacionEn": "A. Audit planning requires a risk-based approach. B. Materiality pertains to potential weaknesses or absences of controls while planning a specific engagement, and whether such weaknesses or absences of controls could result in a significant deficiency or a material weakness. C. Fraud monitoring pertains to the identification of fraud-related transactions and patterns and may play a part in audit planning but only as it pertains to organizational risk. D. Sufficiency of audit evidence pertains to the evaluation of the sufficiency of evidence obtained to support conclusions and achieve specific engagement objectives."
      },
      {
        "id": 9,
        "pregunta": "Una organización respalda diariamente datos y software críticos y almacena los medios fuera del sitio para restaurar archivos ante una interrupción. Esto es un ejemplo de un control:",
        "preguntaEn": "An organization backs up critical data and software daily and stores the media off-site to restore files in the event of a disruption. This is an example of a:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Preventivo"
          },
          {
            "id": "b",
            "texto": "De gestión"
          },
          {
            "id": "c",
            "texto": "Correctivo"
          },
          {
            "id": "d",
            "texto": "Detective"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Preventive control"
          },
          {
            "id": "b",
            "texto": "Management control"
          },
          {
            "id": "c",
            "texto": "Corrective control"
          },
          {
            "id": "d",
            "texto": "Detective control"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Los controles preventivos son aquellos que evitan los problemas antes de que surjan. Los medios de respaldo no se pueden usar para prevenir daños a los archivos y, por lo tanto, no se pueden clasificar como controles preventivos. B. Los controles de gestión modifican los sistemas de procesamiento para minimizar las recurrencias del problema. Los medios de respaldo no modifican los sistemas de procesamiento. C. Un control correctivo ayuda a corregir o minimizar el impacto de un problema. Los medios de respaldo se pueden utilizar para restaurar los archivos en caso de daño a los mismos, reduciendo así el impacto de una interrupción. D. Los controles detectivos ayudan a detectar e informar problemas a medida que ocurren. Los medios de respaldo no ayudan a detectar errores.",
        "justificacionEn": "A. Preventive controls are those that avert problems before they arise. Backup media cannot be used to prevent damage to files and, therefore, cannot be classified as preventive controls. B. Management controls modify processing systems to minimize repeat occurrences of the problem. Backup media do not modify processing systems and, therefore, do not fit the definition of management controls. C. A corrective control helps to correct or minimize the impact of a problem. Backup media can be used for restoring the files in case of damage to the files, thereby reducing the impact of a disruption. D. Detective controls help to detect and report problems as they occur. Backup media do not aid in detecting errors."
      }
    ],
    "2": [
      {
        "id": 1,
        "pregunta": "Para que la gerencia monitoree eficazmente el cumplimiento de procesos y aplicaciones, ¿qué sería lo MÁS ideal?",
        "preguntaEn": "To most effectively monitor compliance with processes and applications, which tool would be MOST ideal for management?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Repositorio central de documentos"
          },
          {
            "id": "b",
            "texto": "Sistema de gestión del conocimiento"
          },
          {
            "id": "c",
            "texto": "Un tablero (dashboard)"
          },
          {
            "id": "d",
            "texto": "Benchmarking"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A central document repository"
          },
          {
            "id": "b",
            "texto": "A knowledge management system"
          },
          {
            "id": "c",
            "texto": "A dashboard"
          },
          {
            "id": "d",
            "texto": "Benchmarking"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Un repositorio central de documentos alberga una gran cantidad de datos, pero no necesariamente la información específica que sería útil para el monitoreo y el cumplimiento. B. Un sistema de gestión del conocimiento proporciona información valiosa, pero por lo general la gerencia no lo utiliza para fines de cumplimiento. C. Un panel de control (dashboard) proporciona información que ilustra el cumplimiento de los procesos, aplicaciones y elementos configurables, y mantiene a la empresa en el rumbo correcto. D. El benchmarking proporciona información para ayudar a los gerentes a adaptar la empresa rápidamente, de acuerdo con las tendencias y el entorno.",
        "justificacionEn": "A. A central document repository hosts a great deal of data but not necessarily the specific information that would be useful for monitoring and compliance. B. A knowledge management system provides valuable information but generally is not used by management for compliance purposes. C. A dashboard provides information that illustrates compliance with the processes, applications and configurable elements and keeps the enterprise on course. D. Benchmarking provides information to help managers adapt the enterprise promptly, according to trends and environment."
      },
      {
        "id": 2,
        "pregunta": "¿Qué se incluiría en un plan estratégico de SI?",
        "preguntaEn": "Which of the following would be included in an IS strategic plan?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Especificaciones de compras de hardware"
          },
          {
            "id": "b",
            "texto": "Análisis de objetivos de negocio futuros"
          },
          {
            "id": "c",
            "texto": "Fechas objetivo de proyectos de desarrollo"
          },
          {
            "id": "d",
            "texto": "Metas presupuestarias anuales de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Specifications for planned hardware purchases"
          },
          {
            "id": "b",
            "texto": "Analysis of future business objectives"
          },
          {
            "id": "c",
            "texto": "Target dates for development projects"
          },
          {
            "id": "d",
            "texto": "Annual budgetary targets for the IT department"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Las especificaciones para las compras de hardware planificadas no son elementos estratégicos. B. Los planes estratégicos de SI deben abordar las necesidades del negocio y cumplir con los objetivos comerciales futuros. Las compras de hardware pueden delinearse a grandes rasgos, pero no especificarse, y ni las metas presupuestarias ni los proyectos de desarrollo son opciones apropiadas. C. Las fechas objetivo para proyectos de desarrollo no son elementos estratégicos. D. Las metas presupuestarias anuales para el departamento de TI no son elementos estratégicos.",
        "justificacionEn": "A. Specifications for planned hardware purchases are not strategic items. B. Information systems (IS) strategic plans must address the needs of the business and meet future business objectives. Hardware purchases may be outlined, but not specified, and neither budget targets nor development projects are appropriate choices. C. Target dates for development projects are not strategic items. D. Annual budgetary targets for the IT department are not strategic items."
      },
      {
        "id": 3,
        "pregunta": "¿Cuál describe MEJOR el proceso de planificación estratégica del departamento de TI?",
        "preguntaEn": "Which BEST describes the IT department's strategic planning process?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Tendrá planes de corto o largo plazo según los planes de la organización"
          },
          {
            "id": "b",
            "texto": "El plan no necesita ser tan detallado que ayude a priorizar"
          },
          {
            "id": "c",
            "texto": "La planificación de largo plazo debe reconocer las metas empresariales, avances tecnológicos y requisitos regulatorios"
          },
          {
            "id": "d",
            "texto": "La planificación de corto plazo no necesita integrarse con la de la empresa"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "It will have short- or long-range plans consistent with the organization's plans"
          },
          {
            "id": "b",
            "texto": "Plans do not need to be detailed enough to help prioritize"
          },
          {
            "id": "c",
            "texto": "Long-range planning must recognize enterprise goals, technological advances and regulatory requirements"
          },
          {
            "id": "d",
            "texto": "Short-range planning does not need to be integrated with the enterprise's plans"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Por lo general, el departamento de TI tendrá planes a corto o a largo plazo que sean consistentes e integrados con los planes de la organización. B. Los planes deben estar orientados al tiempo y a los proyectos, y abordar los planes más amplios de la empresa orientados a alcanzar sus metas. C. La planificación a largo plazo para el departamento de TI debe reconocer las metas de la empresa, los avances tecnológicos y los requisitos regulatorios. D. La planificación a corto plazo para el departamento de TI debe integrarse en los planes a corto plazo de la empresa para permitir que el departamento de TI sea más ágil y receptivo a los avances tecnológicos necesarios.",
        "justificacionEn": "A. Typically, the IT department will have short- or long-range plans that are consistent and integrated with the organization's plans. B. Plans must be time- and project-oriented and address the enterprise's broader plans toward attaining its goals. C. Long-range planning for the IT department should recognize enterprise goals, technological advances and regulatory requirements. D. Short-range planning for the IT department should be integrated into the short-range plans of the enterprise to better enable the IT department to be agile and responsive to needed technological advances that align with enterprise goals and objectives."
      },
      {
        "id": 4,
        "pregunta": "¿Cuál es la responsabilidad MÁS importante de un oficial de seguridad de datos?",
        "preguntaEn": "What is the MOST important responsibility of a data security officer?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Recomendar y monitorear las políticas de seguridad de datos"
          },
          {
            "id": "b",
            "texto": "Promover la concienciación de seguridad"
          },
          {
            "id": "c",
            "texto": "Establecer procedimientos de políticas de seguridad de TI"
          },
          {
            "id": "d",
            "texto": "Administrar controles de acceso físico y lógico"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Recommend and monitor data security policies"
          },
          {
            "id": "b",
            "texto": "Promote security awareness within the enterprise"
          },
          {
            "id": "c",
            "texto": "Establish procedures for IT security policies"
          },
          {
            "id": "d",
            "texto": "Administer physical and logical access controls"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La principal responsabilidad de un oficial de seguridad de datos es recomendar y monitorear las políticas de seguridad de datos. B. Promover la concientización sobre seguridad dentro de la empresa es una de las responsabilidades de un oficial de seguridad de datos; sin embargo, es menos importante que recomendar y monitorear las políticas de seguridad de datos. C. El departamento de TI, y no el oficial de seguridad de datos, es responsable de establecer los procedimientos para las políticas de seguridad de TI recomendadas por el oficial de seguridad de datos. D. El departamento de TI, y no el oficial de seguridad de datos, es responsable de la administración de los controles de acceso físico y lógico.",
        "justificacionEn": "A. A data security officer's prime responsibility is recommending and monitoring data security policies. B. Promoting security awareness within the enterprise is one of the responsibilities of a data security officer. However, it is less important than recommending and monitoring data security policies. C. The IT department, not the data security officer, is responsible for establishing procedures for IT security policies recommended by the data security officer. D. The IT department, not the data security officer, is responsible for the administration of physical and logical access controls."
      },
      {
        "id": 5,
        "pregunta": "¿Qué se considera el elemento MÁS crítico para implementar con éxito un programa de seguridad de la información?",
        "preguntaEn": "What is considered the MOST critical element for successfully implementing an information security program?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Un marco de ERM efectivo"
          },
          {
            "id": "b",
            "texto": "El compromiso de la alta gerencia"
          },
          {
            "id": "c",
            "texto": "Un proceso de presupuestación adecuado"
          },
          {
            "id": "d",
            "texto": "Una planificación meticulosa del programa"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "An effective enterprise risk management (ERM) framework"
          },
          {
            "id": "b",
            "texto": "Senior management's commitment"
          },
          {
            "id": "c",
            "texto": "An effective information security budgeting process"
          },
          {
            "id": "d",
            "texto": "Meticulous program planning"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Un marco eficaz de gestión de riesgos empresariales (ERM) no es un factor clave de éxito para un programa de seguridad de la información. B. El compromiso de la alta gerencia proporciona la base indispensable para lograr el éxito en la implementación de un programa de seguridad de la información. C. Aunque un proceso eficaz de presupuestación de la seguridad de la información contribuirá al éxito, el compromiso de la alta gerencia es el elemento clave. D. La planificación del programa es importante, pero no será suficiente sin el compromiso de la alta gerencia.",
        "justificacionEn": "A. An effective enterprise risk management (ERM) framework is not a key success factor for an information security program. B. Senior management's commitment provides the basis for success in implementing an information security program. C. Although an effective information security budgeting process will contribute to success, senior management commitment is the key element. D. Program planning is important but will not be sufficient without senior management commitment."
      },
      {
        "id": 6,
        "pregunta": "Un auditor de SI debe asegurar que las medidas de desempeño de gobierno de TI:",
        "preguntaEn": "An IS auditor should ensure that IT governance performance measures:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Evalúen las actividades de los comités de supervisión de TI"
          },
          {
            "id": "b",
            "texto": "Provean impulsores estratégicos de TI"
          },
          {
            "id": "c",
            "texto": "Cumplan estándares regulatorios de reporte"
          },
          {
            "id": "d",
            "texto": "Evalúen al departamento de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Evaluate the activities of boards and committees providing oversight"
          },
          {
            "id": "b",
            "texto": "Provide strategic IT drivers"
          },
          {
            "id": "c",
            "texto": "Adhere to regulatory reporting standards and definitions"
          },
          {
            "id": "d",
            "texto": "Evaluate the IT department"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Evaluar las actividades de las juntas y comités que ejercen la supervisión es un aspecto importante del gobierno y debe medirse. B. Proporcionar impulsores estratégicos de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI. C. Adherirse a los estándares y definiciones de informes regulatorios es irrelevante para evaluar las medidas de desempeño del gobierno de TI. D. Evaluar al departamento de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI.",
        "justificacionEn": "A. Evaluating the activities of boards and committees providing oversight is an important aspect of governance and should be measured. B. Providing strategic IT drivers is irrelevant to evaluating IT governance performance measures. C. Adhering to regulatory reporting standards and definitions is irrelevant to evaluating IT governance performance measures. D. Evaluating the IT department is irrelevant to evaluating IT governance performance measures."
      },
      {
        "id": 7,
        "pregunta": "¿Qué tareas pueden realizarse por la misma persona en un centro de procesamiento bien controlado?",
        "preguntaEn": "Which tasks can be performed by the same person in a well-controlled processing center?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Administración de seguridad y gestión de cambios"
          },
          {
            "id": "b",
            "texto": "Operaciones de cómputo y desarrollo de sistemas"
          },
          {
            "id": "c",
            "texto": "Desarrollo de sistemas y gestión de cambios"
          },
          {
            "id": "d",
            "texto": "Desarrollo de sistemas y mantenimiento de sistemas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Security administration and change management"
          },
          {
            "id": "b",
            "texto": "Computer operations and system development"
          },
          {
            "id": "c",
            "texto": "System development and change management"
          },
          {
            "id": "d",
            "texto": "System development and system maintenance"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Las funciones de administración de seguridad y gestión de cambios son incompatibles; el nivel de derechos de acceso de la administración de seguridad podría permitir que los cambios pasen desapercibidos. B. Operaciones de cómputo y desarrollo de sistemas es la opción incorrecta porque esto haría posible que un operador ejecute un programa que él mismo haya modificado. C. La combinación de desarrollo de sistemas y control de cambios permitiría que las modificaciones de programas eludan las aprobaciones de control de cambios. D. Es común que el desarrollo y el mantenimiento de sistemas sean asumidos por la misma persona; en ambos, el programador requiere acceso al código fuente en el entorno de desarrollo, pero no se le debe permitir el acceso en el entorno de producción.",
        "justificacionEn": "A. The roles of security administration and change management are incompatible functions. The level of security administration access rights could allow changes to go undetected. B. Computer operations and system development is the incorrect choice because this would make it possible for an operator to run a program they had amended. C. The combination of system development and change control would allow program modifications to bypass change control approvals. D. It is common for system development and maintenance to be undertaken by the same person. In both, the programmer requires access to the source code in the development environment but should not be allowed access in the production environment."
      },
      {
        "id": 8,
        "pregunta": "¿Cuál es el control MÁS crítico sobre la administración de bases de datos (DBA)?",
        "preguntaEn": "What is the MOST critical control over database administration (DBA)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aprobación de actividades del DBA"
          },
          {
            "id": "b",
            "texto": "Separación de funciones respecto al otorgamiento/revocación de derechos de acceso"
          },
          {
            "id": "c",
            "texto": "Revisión de logs de acceso"
          },
          {
            "id": "d",
            "texto": "Revisión del uso de herramientas de base de datos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Approval of DBA activities"
          },
          {
            "id": "b",
            "texto": "Separation of duties regarding granting/revoking access rights"
          },
          {
            "id": "c",
            "texto": "Review of access logs and activities"
          },
          {
            "id": "d",
            "texto": "Review of the use of database tools"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. La aprobación de las actividades de administración de bases de datos (DBA) no evita la combinación de funciones incompatibles; la revisión de registros de acceso y actividades es un control de detección. B. La segregación de funciones (SoD) evitará la combinación de funciones incompatibles; este es un control preventivo y es el control más crítico sobre el DBA. C. Revisar los registros de acceso y las actividades puede no reducir el riesgo si las actividades del DBA se aprueban de forma inadecuada. D. Revisar el uso de herramientas de base de datos no reduce el riesgo porque esto es únicamente un control detectivo y no previene la combinación de funciones incompatibles.",
        "justificacionEn": "A. Approval of database administration (DBA) activities does not prevent the combination of conflicting functions. Review of access logs and activities is a detective control. B. Separation of duties (SoD) will prevent the combination of conflicting functions. This is a preventive control, and it is the most critical control over DBA. C. Reviewing access logs and activities may not reduce the risk if DBA activities are improperly approved. D. Reviewing the use of database tools does not reduce the risk because this is only a detective control and does not prevent the combination of conflicting functions."
      },
      {
        "id": 9,
        "pregunta": "Cuando no se puede lograr una separación de funciones completa en un entorno en línea, ¿qué función debe separarse de las demás?",
        "preguntaEn": "When complete separation of duties cannot be achieved in an online environment, which function should be separated from the others?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Origen"
          },
          {
            "id": "b",
            "texto": "Autorización"
          },
          {
            "id": "c",
            "texto": "Registro"
          },
          {
            "id": "d",
            "texto": "Corrección"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Origination"
          },
          {
            "id": "b",
            "texto": "Authorization"
          },
          {
            "id": "c",
            "texto": "Recording"
          },
          {
            "id": "d",
            "texto": "Correction"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. La originación, en conjunto con el registro y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. B. La autorización debe separarse de todos los aspectos del mantenimiento de registros (originación, registro y corrección); dicha separación mejora la capacidad de detectar el registro de transacciones no autorizadas. C. El registro, en conjunto con la originación y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. D. La corrección, en conjunto con la originación y el registro, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro.",
        "justificacionEn": "A. Origination, in conjunction with recording and correction, does not enable the transaction to be authorized for processing and committed within the system of record. B. Authorization should be separated from all aspects of record keeping (origination, recording and correction). Such a separation enhances the ability to detect the recording of unauthorized transactions. C. Recording, in conjunction with origination and correction, does not enable the transaction to be authorized for processing and committed within the system of record. D. Correction, in conjunction with origination and recording, does not enable the transaction to be authorized for processing and committed within the system of record."
      },
      {
        "id": 10,
        "pregunta": "En una pequeña empresa donde un mismo empleado es operador de cómputo y programador de aplicaciones, ¿qué control debe recomendar el auditor?",
        "preguntaEn": "In a small enterprise where the same employee is both computer operator and application programmer, what control should the auditor recommend?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Registro automatizado de cambios en bibliotecas de desarrollo"
          },
          {
            "id": "b",
            "texto": "Personal adicional para lograr SoD"
          },
          {
            "id": "c",
            "texto": "Procedimientos que verifiquen que solo se implementan cambios de programa aprobados"
          },
          {
            "id": "d",
            "texto": "Controles de acceso que impidan al operador modificar programas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Automated logging of changes to development libraries"
          },
          {
            "id": "b",
            "texto": "Recruiting additional staff to achieve SoD"
          },
          {
            "id": "c",
            "texto": "Processes that detect changes to production source and object code"
          },
          {
            "id": "d",
            "texto": "Access controls to prevent the operator from making program modifications"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. El registro automatizado de cambios en las bibliotecas de desarrollo no detectaría los cambios realizados en las bibliotecas de producción. B. En empresas más pequeñas, por lo general no es apropiado contratar personal adicional para lograr una separación estricta de funciones; el auditor de SI debe buscar alternativas. C. El auditor de SI debe recomendar procesos que detecten cambios en el código fuente y objeto de producción, como comparaciones de código, para que los cambios puedan ser revisados periódicamente por un tercero; este sería un proceso de control compensatorio. D. Los controles de acceso para evitar que el operador realice modificaciones a los programas requieren que un tercero realice los cambios, lo cual puede no ser práctico en una empresa pequeña.",
        "justificacionEn": "A. Logging changes to development libraries would not detect changes to production libraries. B. In smaller enterprises, it generally is not appropriate to recruit additional staff to achieve a strict separation of duties. The IS auditor must look at alternatives. C. The information systems (IS) auditor should recommend processes that detect changes to production source and object code, such as code comparisons, so that the changes can be reviewed by a third party regularly. This would be a compensating control process. D. Access controls to prevent the operator from making program modifications require a third party to make the changes, which may not be practical in a small enterprise."
      }
    ],
    "3": [
      {
        "id": 1,
        "pregunta": "Para probar un sistema bancario esencial que se está adquiriendo, la empresa entregó al proveedor datos sensibles de producción. La preocupación PRIMARIA del auditor es que los datos sean:",
        "preguntaEn": "To test a critical banking system being acquired, the company gave the vendor sensitive production data. The auditor's PRIMARY concern is that the data be:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Anonimizados/saneados (sanitized)"
          },
          {
            "id": "b",
            "texto": "Completos"
          },
          {
            "id": "c",
            "texto": "Representativos"
          },
          {
            "id": "d",
            "texto": "Actuales"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Sanitized/anonymized"
          },
          {
            "id": "b",
            "texto": "Complete"
          },
          {
            "id": "c",
            "texto": "Representative"
          },
          {
            "id": "d",
            "texto": "Current"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Los datos de prueba deben ser saneados (sanitized) para evitar que los datos sensibles se filtren a personas no autorizadas. B. Aunque es importante que el conjunto de datos esté completo, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. C. Aunque es importante abarcar una representación de los datos transaccionales, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. D. Aunque es importante que el conjunto de datos represente los datos actuales que se están procesando, la preocupación principal sigue siendo la sanitización para evitar que los datos sensibles se filtren a personas no autorizadas.",
        "justificacionEn": "A. Test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. B. Although it is important that the data set be complete, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. C. Although it is important to encompass a representation of the transactional data, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. D. Although it is important that the data set represent current data being processed, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons."
      },
      {
        "id": 2,
        "pregunta": "¿Cuál es el propósito PRIMARIO de realizar pruebas en paralelo?",
        "preguntaEn": "What is the PRIMARY purpose of parallel testing?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Determinar si el sistema es costo-efectivo"
          },
          {
            "id": "b",
            "texto": "Permitir pruebas exhaustivas de unidad y sistema"
          },
          {
            "id": "c",
            "texto": "Resaltar errores en interfaces de programa con archivos"
          },
          {
            "id": "d",
            "texto": "Asegurar que el nuevo sistema cumpla los requisitos del usuario"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Determine whether the system is cost-effective"
          },
          {
            "id": "b",
            "texto": "Allow exhaustive unit and system testing"
          },
          {
            "id": "c",
            "texto": "Highlight errors in program interfaces with files"
          },
          {
            "id": "d",
            "texto": "Ensure the new system meets user requirements"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Las pruebas en paralelo pueden mostrar que el sistema anterior es más rentable (cost-effective) que el nuevo sistema, pero esta no es la razón principal. B. Las pruebas unitarias y de sistema se completan antes de las pruebas en paralelo. C. Las interfaces del programa con los archivos se prueban en busca de errores durante las pruebas del sistema. D. El propósito de las pruebas en paralelo es asegurar que la implementación de un nuevo sistema cumplirá con los requisitos del usuario.",
        "justificacionEn": "A. Parallel testing may show that the old system is more cost-effective than the new system, but this is not the primary reason. B. Unit and system testing are completed before parallel testing. C. Program interfaces with files are tested for errors during system testing. D. The purpose of parallel testing is to ensure that the implementation of a new system will meet user requirements."
      },
      {
        "id": 3,
        "pregunta": "Al revisar una reingeniería de procesos de negocio (BPR), el auditor encuentra que se eliminó un control preventivo importante. Debe:",
        "preguntaEn": "When reviewing a business process reengineering (BPR) initiative, the auditor finds that an important preventive control was eliminated. The auditor should:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Informar a la gerencia y determinar si acepta el riesgo material potencial"
          },
          {
            "id": "b",
            "texto": "Determinar si un control detectivo lo reemplazó y, si no, reportarlo"
          },
          {
            "id": "c",
            "texto": "Recomendar reincorporar todos los controles previos"
          },
          {
            "id": "d",
            "texto": "Desarrollar un enfoque de auditoría continua"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Inform management and determine whether they accept the potential material risk"
          },
          {
            "id": "b",
            "texto": "Determine whether a detective control replaced it and, if not, report it"
          },
          {
            "id": "c",
            "texto": "Recommend reinstating all previous controls"
          },
          {
            "id": "d",
            "texto": "Develop a continuous audit approach"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La gerencia debe ser informada inmediatamente para determinar si está dispuesta a aceptar el riesgo material potencial de no tener implementado ese control preventivo. B. La existencia de un control detectivo en lugar de un control preventivo generalmente incrementa el riesgo de que ocurra un problema material. C. A menudo, durante una reingeniería de procesos de negocio (BPR), se eliminan muchos controles que no agregan valor. Esto es bueno, a menos que los controles incrementen el riesgo comercial y financiero. D. Un auditor de SI puede querer recomendar que la gerencia monitoree el nuevo proceso, pero esto debe hacerse solo después de que la gerencia haya sido informada y acepte el riesgo.",
        "justificacionEn": "A. Management should be informed immediately to determine whether they are willing to accept the potential material risk of not having that preventive control in place. B. The existence of a detective control instead of a preventive control usually increases the risk that a material problem may occur. C. Often, during business process reengineering (BPR), many nonvalue-added controls are eliminated. This is good, unless the controls increase the business and financial risk. D. An IS auditor may want to monitor, or recommend that management monitor, the new process, but this should be done only after management has been informed and accepts the risk of not having the preventive control in place."
      },
      {
        "id": 4,
        "pregunta": "¿Qué edición de validación de datos es eficaz para detectar errores de transposición y transcripción?",
        "preguntaEn": "Which data validation edit is effective for detecting transposition and transcription errors?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Rango (range check)"
          },
          {
            "id": "b",
            "texto": "Dígito de control (check digit)"
          },
          {
            "id": "c",
            "texto": "Validez"
          },
          {
            "id": "d",
            "texto": "Duplicados"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Range check"
          },
          {
            "id": "b",
            "texto": "Check digit"
          },
          {
            "id": "c",
            "texto": "Availability check"
          },
          {
            "id": "d",
            "texto": "Duplicate check"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Una verificación de rango comprueba datos que coinciden con un rango de valores predeterminado. B. Un dígito de control es un valor numérico que se calcula matemáticamente y se añade a los datos para asegurar que los datos originales no hayan sido alterados. Este control es eficaz para detectar errores de transposición y transcripción. C. Una verificación de validez es una comprobación programada de la validez de los datos de acuerdo con criterios predeterminados. D. En una verificación de duplicados, las transacciones nuevas o recientes se cotejan con las ingresadas anteriormente para asegurar que no estén ya en el sistema.",
        "justificacionEn": "A. A range check is checking data that match a predetermined range of values. B. A check digit is a numeric value that is calculated mathematically and appended to data to ensure that the original data have not been altered. This control is effective in detecting transposition and transcription errors. C. An availability check is programmed checking of the data validity in accordance with predetermined criteria. D. In a duplicate check, new or fresh transactions are matched to those previously entered to ensure that they are not already in the system."
      },
      {
        "id": 5,
        "pregunta": "¿Qué debilidad sería la MÁS significativa en un ERP usado por una entidad financiera?",
        "preguntaEn": "Which weakness would be MOST significant in an ERP used by a financial entity?",
        "alternativas": [
          {
            "id": "a",
            "texto": "No se han revisado los controles de acceso"
          },
          {
            "id": "b",
            "texto": "Documentación limitada"
          },
          {
            "id": "c",
            "texto": "Medios de respaldo de dos años sin reemplazar"
          },
          {
            "id": "d",
            "texto": "Respaldos de base de datos una vez al día"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Access controls have not been reviewed"
          },
          {
            "id": "b",
            "texto": "Limited documentation"
          },
          {
            "id": "c",
            "texto": "Two-year-old backup media not replaced"
          },
          {
            "id": "d",
            "texto": "Database backups performed once a day"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La falta de revisión de los controles de acceso en una empresa financiera puede tener graves consecuencias dados los tipos de datos y activos a los que se puede acceder. B. La falta de documentación puede no ser tan grave como no tener los controles de acceso debidamente revisados. C. Es posible que no se puedan recuperar datos de medios de respaldo de dos años de antigüedad. D. Para el negocio puede ser aceptable realizar respaldos de la base de datos una vez al día, dependiendo del volumen de transacciones.",
        "justificacionEn": "A. A lack of review of access controls in a financial enterprise can have serious consequences given the types of data and assets that can be accessed. B. A lack of documentation may not be as serious as not having properly reviewed access controls. C. It may not be possible to retrieve data from two-year-old backup media. D. It may be acceptable to the business to perform database backups once a day, depending on the volume of transactions."
      },
      {
        "id": 6,
        "pregunta": "Al auditar la fase de requisitos de una adquisición de software, el auditor debe:",
        "preguntaEn": "When auditing the requirements phase of a software acquisition, the auditor should:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Evaluar la razonabilidad del cronograma"
          },
          {
            "id": "b",
            "texto": "Evaluar los procesos de calidad del proveedor"
          },
          {
            "id": "c",
            "texto": "Asegurar que se adquiera el mejor paquete"
          },
          {
            "id": "d",
            "texto": "Revisar la completitud de las especificaciones"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Evaluate the reasonableness of the project timetable"
          },
          {
            "id": "b",
            "texto": "Assess vendor quality processes"
          },
          {
            "id": "c",
            "texto": "Ensure the best package is acquired"
          },
          {
            "id": "d",
            "texto": "Review the completeness of specifications"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Normalmente, el cronograma de un proyecto no se encuentra en un documento de requisitos. B. La evaluación de los procesos de calidad del proveedor se realiza después de que se han completado los requisitos. C. La decisión de adquirir un paquete comercial de un proveedor se toma después de que se han completado los requisitos. D. El propósito de la fase de requisitos es especificar la funcionalidad del sistema propuesto; por lo tanto, un auditor de SI se concentraría en la completitud de las especificaciones.",
        "justificacionEn": "A. A project timetable normally is not found in a requirements document. B. Assessing the vendor quality processes comes after the requirements have been completed. C. The decision to purchase a package from a vendor comes after the requirements have been completed. D. The purpose of the requirements phase is to specify the functionality of the proposed system; therefore, an information systems (IS) auditor would concentrate on the completeness of the specifications."
      },
      {
        "id": 7,
        "pregunta": "Al comprar un paquete de software en vez de desarrollarlo, las fases de diseño y desarrollo del SDLC tradicional se reemplazan por:",
        "preguntaEn": "When purchasing a software package instead of developing it, the design and development phases of the traditional SDLC are replaced by:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Fases de selección y configuración"
          },
          {
            "id": "b",
            "texto": "Factibilidad y requisitos"
          },
          {
            "id": "c",
            "texto": "Implementación y pruebas"
          },
          {
            "id": "d",
            "texto": "No se requiere reemplazo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Selection and configuration phases"
          },
          {
            "id": "b",
            "texto": "Feasibility and requirements phases"
          },
          {
            "id": "c",
            "texto": "Implementation and testing phases"
          },
          {
            "id": "d",
            "texto": "No replacement is needed"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Con un paquete comprado, las fases de diseño y desarrollo del ciclo de vida tradicional se reemplazan con las fases de selección y configuración. Se solicita una propuesta al proveedor de sistemas empaquetados y se evalúa contra criterios predefinidos para la selección, antes de tomar la decisión de comprar el software. Después de que se adquiere el software, se configura para satisfacer los requisitos de la empresa. B. Las otras fases del SDLC, tales como el estudio de factibilidad, la definición de requisitos, la implementación y la postimplementación, permanecen inalteradas. C. Las otras fases del SDLC permanecen inalteradas. D. En este escenario, las fases de diseño y desarrollo del ciclo de vida tradicional sí son reemplazables por las fases de selección y configuración.",
        "justificacionEn": "A. With a purchased package, the design and development phases of the traditional life cycle are replaced with selection and configuration phases. A proposal from the supplier of packaged systems is requested and evaluated against predefined criteria for selection, before a decision is made to purchase the software. After the software is purchased, it is configured to meet the enterprise's requirements. B. The other phases of the system development life cycle (SDLC), such as feasibility study, requirements definition, implementation and postimplementation, remain unaltered. C. The other phases of the SDLC, such as feasibility study, requirements definition, implementation and postimplementation, remain unaltered. D. In this scenario, the design and development phases of the traditional life cycle are replaceable with selection and configuration phases."
      },
      {
        "id": 8,
        "pregunta": "Las especificaciones de usuario no se cumplieron en un proyecto con metodología waterfall. ¿Cuál es la fuente MÁS probable de la causa?",
        "preguntaEn": "User specifications were not met in a waterfall methodology project. What is the MOST likely source of the problem?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aseguramiento de calidad (QA)"
          },
          {
            "id": "b",
            "texto": "Requisitos"
          },
          {
            "id": "c",
            "texto": "Desarrollo"
          },
          {
            "id": "d",
            "texto": "Capacitación de usuarios"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Quality assurance (QA)"
          },
          {
            "id": "b",
            "texto": "Requirements"
          },
          {
            "id": "c",
            "texto": "Development"
          },
          {
            "id": "d",
            "texto": "User training"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. El aseguramiento de calidad (QA) se enfoca en aspectos formales del desarrollo de software, tales como adherirse a estándares de codificación o a una metodología de desarrollo específica. B. Fallar en las especificaciones de usuario implica que la ingeniería de requisitos se ha realizado para describir las demandas de los usuarios; de lo contrario, no habría una línea base de especificaciones contra la cual verificar. C. La gestión del proyecto falló al no establecer o no verificar los controles que aseguran que el software en desarrollo se apegue a esas especificaciones de usuario. D. Una falla en cumplir las especificaciones de usuario podría manifestarse durante la capacitación del usuario o en las pruebas de aceptación, pero no es la causa.",
        "justificacionEn": "A. Quality assurance (QA) has its focus on formal aspects of software development, such as adhering to coding standards or a specific development methodology. B. To fail at user specifications implies that requirements engineering has been done to describe the users' demands. Otherwise, there would not be a baseline of specifications against which to check. C. Project management failed to either set up or verify controls that provide for software or software modules under development that adhere to those user specifications. D. A failure to meet user specifications might show up during user training or acceptance testing but is not the cause."
      },
      {
        "id": 9,
        "pregunta": "Al introducir una arquitectura de cliente ligero (thin client), ¿qué tipo de riesgo de servidores aumenta significativamente?",
        "preguntaEn": "When introducing a thin client architecture, which type of server risk increases significantly?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Integridad"
          },
          {
            "id": "b",
            "texto": "Concurrencia"
          },
          {
            "id": "c",
            "texto": "Confidencialidad"
          },
          {
            "id": "d",
            "texto": "Disponibilidad"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Integrity"
          },
          {
            "id": "b",
            "texto": "Concurrency"
          },
          {
            "id": "c",
            "texto": "Confidentiality"
          },
          {
            "id": "d",
            "texto": "Availability"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Debido a que los otros elementos no necesitan cambiar, el riesgo de integridad no se incrementa. B. Debido a que los otros elementos no necesitan cambiar, el riesgo de concurrencia no se incrementa. C. Debido a que los otros elementos no necesitan cambiar, el riesgo de confidencialidad no se incrementa. D. El cambio principal al usar una arquitectura de cliente ligero es hacer que los servidores sean críticos para la operación. Por lo tanto, la probabilidad de que uno de ellos falle se incrementa y, como resultado, el riesgo de disponibilidad aumenta.",
        "justificacionEn": "A. Because the other elements do not need to change, the integrity risk is not increased. B. Because the other elements do not need to change, the concurrency risk is not increased. C. Because the other elements do not need to change, the confidentiality risk is not increased. D. The main change when using thin client architecture is making the servers critical to the operation. Therefore, the probability that one of them fails is increased and, as a result, the availability risk is increased."
      },
      {
        "id": 10,
        "pregunta": "¿Qué se asocia MÁS comúnmente con una metodología de desarrollo ágil?",
        "preguntaEn": "What is MOST commonly associated with an agile development methodology?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Dependencia de documentación detallada"
          },
          {
            "id": "b",
            "texto": "Dependencia de procedimientos operativos estrictos"
          },
          {
            "id": "c",
            "texto": "Falta de requisitos de usuario"
          },
          {
            "id": "d",
            "texto": "Fuerte dependencia del conocimiento tácito"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Reliance on detailed documentation"
          },
          {
            "id": "b",
            "texto": "Reliance on strict standard operating procedures"
          },
          {
            "id": "c",
            "texto": "Lack of user requirements"
          },
          {
            "id": "d",
            "texto": "Strong reliance on tacit knowledge"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. La documentación del proyecto generalmente queda en segundo plano frente a la funcionalidad real para la metodología de desarrollo ágil. B. Procedimientos operativos estándar estrictos serían perjudiciales para la capacidad del desarrollador de pensar de forma creativa y colaborativa. C. Todas las metodologías de desarrollo requieren alguna forma de definición de requisitos. Ágil se basa en que los requisitos claros se definan por adelantado. D. El conocimiento tácito (es decir, el conocimiento implícito adquirido por la experiencia y difícil de documentar) es aprovechado enormemente por los métodos ágiles para aumentar la colaboración y la creatividad de los equipos de desarrollo.",
        "justificacionEn": "A. Project documentation is generally second to actual functionality for agile development methodology. B. Strict standard operating procedures would be detrimental to a developer's ability to think creatively and collaboratively. C. All development methodologies require some form of requirements definition. Agile relies on clear requirements being defined up front. D. Tacit knowledge (i.e., implicit knowledge gained from experience and difficult to document) is leveraged greatly by agile methods to increase collaboration and creativity of development teams."
      }
    ],
    "4": [
      {
        "id": 1,
        "pregunta": "¿Cuál es el MEJOR método para determinar el nivel de desempeño de instalaciones de procesamiento de información (IPF) similares?",
        "preguntaEn": "What is the BEST method for determining the performance level of similar information processing facilities (IPF)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Satisfacción del usuario"
          },
          {
            "id": "b",
            "texto": "Logro de metas"
          },
          {
            "id": "c",
            "texto": "Benchmarking"
          },
          {
            "id": "d",
            "texto": "Planificación de capacidad y crecimiento"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "User satisfaction"
          },
          {
            "id": "b",
            "texto": "Goal accomplishment"
          },
          {
            "id": "c",
            "texto": "Benchmarking"
          },
          {
            "id": "d",
            "texto": "Capacity and growth planning"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. La satisfacción del usuario es la medida para asegurar que una operación eficaz de procesamiento de información cumpla con los requisitos del usuario. B. El cumplimiento de metas evalúa la efectividad implicada al comparar el desempeño con metas predefinidas. C. La evaluación comparativa (benchmarking) proporciona un medio para determinar el nivel de desempeño ofrecido por entornos similares de centros de procesamiento de información (IPF). D. La planificación de capacidad y crecimiento es esencial debido a la importancia de TI en las organizaciones y al cambio tecnológico constante.",
        "justificacionEn": "A. User satisfaction is the measure to ensure that an effective information processing operation meets user requirements. B. Goal accomplishment evaluates the effectiveness involved in comparing performance with predefined goals. C. Benchmarking provides a means of determining the level of performance offered by similar information processing facility (IPF) environments. D. Capacity and growth planning are essential due to the importance of IT in organizations and the constant technological change."
      },
      {
        "id": 2,
        "pregunta": "Para sistemas de misión crítica con baja tolerancia a interrupciones y alto costo de recuperación, ¿qué opción de recuperación se recomienda en principio?",
        "preguntaEn": "For mission-critical systems with low tolerance for disruption and high recovery cost, which recovery option is principally recommended?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Sitio móvil"
          },
          {
            "id": "b",
            "texto": "Sitio cálido (warm)"
          },
          {
            "id": "c",
            "texto": "Sitio frío (cold)"
          },
          {
            "id": "d",
            "texto": "Sitio caliente (hot site)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Mobile site"
          },
          {
            "id": "b",
            "texto": "Warm site"
          },
          {
            "id": "c",
            "texto": "Cold site"
          },
          {
            "id": "d",
            "texto": "Hot site"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Los sitios móviles son tráileres especialmente diseñados que pueden transportarse rápidamente a una ubicación de la empresa o a un sitio alterno para proporcionar un centro de procesamiento de información (IPF) previamente acondicionado. B. Los sitios templados (warm sites) están parcialmente configurados, por lo general con conexiones de red y equipos periféricos seleccionados, pero sin la computadora principal. C. Los sitios en frío (cold sites) solo cuentan con el entorno básico para operar un IPF. Están listos para recibir equipo, pero no ofrecen ningún componente en el sitio antes de presentarse la necesidad. D. Los sitios en caliente (hot sites) están completamente configurados y listos para operar en unas pocas horas o, en algunos casos, incluso minutos.",
        "justificacionEn": "A. Mobile sites are specially designed trailers that can be quickly transported to a business location or to an alternate site to provide a ready-conditioned information processing facility (IPF). B. Warm sites are partially configured, usually with network connections and selected peripheral equipment—such as disk drives and controllers—but without the main computer. C. Cold sites have only the basic environment to operate an IPF. Cold sites are ready to receive equipment but do not offer any components at the site before the need. D. Hot sites are fully configured and ready to operate within several hours or, in some cases, even minutes."
      },
      {
        "id": 3,
        "pregunta": "¿Cuál es el método MÁS eficaz para probar el proceso de gestión de cambios de programas?",
        "preguntaEn": "What is the MOST effective method for testing the program change management process?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Rastrear desde información generada por el sistema hacia la documentación de gestión de cambios"
          },
          {
            "id": "b",
            "texto": "Examinar la documentación en busca de evidencia de exactitud"
          },
          {
            "id": "c",
            "texto": "Rastrear desde la documentación hacia una pista de auditoría del sistema"
          },
          {
            "id": "d",
            "texto": "Examinar la documentación en busca de evidencia de completitud"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Trace from system-generated information to change management documentation"
          },
          {
            "id": "b",
            "texto": "Examine documentation for evidence of accuracy"
          },
          {
            "id": "c",
            "texto": "Trace from documentation to a system audit trail"
          },
          {
            "id": "d",
            "texto": "Examine documentation for evidence of completeness"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Al probar la gestión de cambios, el auditor de SI debe comenzar con la información generada por el sistema, que contiene la fecha y la hora en que un módulo se actualizó por última vez, y rastrear desde allí hacia la documentación que autoriza el cambio. B. Enfocarse exclusivamente en la exactitud de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados. C. Rastrear en la dirección opuesta correría el riesgo de no detectar cambios indocumentados. D. Enfocarse exclusivamente en la exhaustividad (completeness) de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados.",
        "justificacionEn": "A. When testing change management, the information systems (IS) auditor should start with system-generated information, containing the date and time a module was last updated, and trace from there to the documentation authorizing the change. B. Focusing exclusively on the accuracy of the documentation examined does not ensure that all changes were, in fact, documented. C. To trace in the opposite direction would run the risk of not detecting undocumented changes. D. Focusing exclusively on the completeness of the documentation examined does not ensure that all changes were, in fact, documented."
      },
      {
        "id": 4,
        "pregunta": "¿Qué permitiría a una empresa extender su intranet a través de Internet hacia sus socios de negocio?",
        "preguntaEn": "What would allow an enterprise to extend its intranet through the Internet to its business partners?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Red privada virtual (VPN)"
          },
          {
            "id": "b",
            "texto": "Cliente-servidor"
          },
          {
            "id": "c",
            "texto": "Acceso dial-up"
          },
          {
            "id": "d",
            "texto": "Proveedor de servicios de red (NSP)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Virtual private network (VPN)"
          },
          {
            "id": "b",
            "texto": "Client-server"
          },
          {
            "id": "c",
            "texto": "Dial-up access"
          },
          {
            "id": "d",
            "texto": "Network service provider (NSP)"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La tecnología de red privada virtual (VPN) permite a los socios externos participar de forma segura en la extranet utilizando redes públicas como transporte. Las VPN se basan en técnicas de tunelización/encapsulamiento, las cuales permiten que el Protocolo de Internet (IP) transporte una variedad de protocolos diferentes. B. Cliente-servidor se refiere a un grupo de computadoras dentro de una organización conectadas por una red interna donde el cliente es la máquina solicitante y el servidor es la máquina proveedora; no aborda la extensión de la red hacia los socios comerciales. C. Aunque técnicamente sea posible extender la intranet mediante acceso telefónico (dial-up), no sería práctico ni rentable hacerlo. D. Un proveedor de servicios de red puede brindar servicios a una red privada compartida al proporcionar servicios de Internet, pero no extiende la intranet de una organización.",
        "justificacionEn": "A. Virtual private network (VPN) technology allows external partners to securely participate in the extranet using public networks as a transport. VPNs rely on tunneling/encapsulation techniques, which allow the Internet Protocol (IP) to carry a variety of different protocols. B. Client-server does not address extending the network to business partners. C. Although it may be technically possible for an enterprise to extend its intranet using dial-up access, it would not be practical or cost effective to do so. D. A network service provider may provide services to a shared private network by providing Internet services, but it does not extend an organization's intranet."
      },
      {
        "id": 5,
        "pregunta": "La clasificación por criticidad de una aplicación en un plan de continuidad del negocio se determina por:",
        "preguntaEn": "The criticality classification of an application in a business continuity plan is determined by:",
        "alternativas": [
          {
            "id": "a",
            "texto": "La naturaleza del negocio y el valor de la aplicación para el negocio"
          },
          {
            "id": "b",
            "texto": "El costo de reemplazo"
          },
          {
            "id": "c",
            "texto": "El soporte del proveedor disponible"
          },
          {
            "id": "d",
            "texto": "Las amenazas y vulnerabilidades asociadas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The nature of the business and the value of the application to the business"
          },
          {
            "id": "b",
            "texto": "The replacement cost of the application"
          },
          {
            "id": "c",
            "texto": "Available vendor support"
          },
          {
            "id": "d",
            "texto": "The associated threats and vulnerabilities"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La clasificación de criticidad está determinada por el rol del sistema de aplicación en el respaldo de la estrategia de la organización. B. El costo de reposición de la aplicación no refleja el valor relativo de la aplicación para el negocio. C. El soporte del proveedor no es un factor relevante para determinar la clasificación de criticidad. D. Las amenazas y vulnerabilidades asociadas se evaluarán únicamente si la aplicación es crítica para el negocio.",
        "justificacionEn": "A. The criticality classification is determined by the role of the application system in supporting the strategy of the organization. B. The replacement cost of the application does not reflect the relative value of the application to the business. C. Vendor support is not a relevant factor for determining the criticality classification. D. The associated threats and vulnerabilities will be evaluated only if the application is critical to the business."
      },
      {
        "id": 6,
        "pregunta": "Al auditar la seguridad de bases de datos cliente-servidor, la MAYOR preocupación es la disponibilidad de:",
        "preguntaEn": "When auditing client-server database security, the GREATEST concern is the availability of:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Utilidades del sistema"
          },
          {
            "id": "b",
            "texto": "Generadores de programas de aplicación"
          },
          {
            "id": "c",
            "texto": "Documentación de seguridad de sistemas"
          },
          {
            "id": "d",
            "texto": "Acceso a procedimientos almacenados"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "System utilities"
          },
          {
            "id": "b",
            "texto": "Application program generators"
          },
          {
            "id": "c",
            "texto": "Security documentation"
          },
          {
            "id": "d",
            "texto": "Access to stored procedures"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Las utilidades del sistema pueden permitir que se realicen cambios no autorizados en los datos de la base de datos cliente-servidor. En una auditoría de seguridad de bases de datos, los controles sobre tales utilidades serían la principal preocupación del auditor de SI. B. Los generadores de programas de aplicación son una parte intrínseca de la tecnología cliente-servidor, y el auditor de SI evaluaría los controles sobre los derechos de acceso del generador a la base de datos en lugar de su disponibilidad. C. La documentación de seguridad debe restringirse al personal de seguridad autorizado, pero esta no es una preocupación principal. D. El acceso a los procedimientos almacenados no es una preocupación principal.",
        "justificacionEn": "A. System utilities may enable unauthorized changes to be made to data on the client-server database. In an audit of database security, the controls over such utilities would be the primary concern of the information systems (IS) auditor. B. Application program generators are an intrinsic part of client-server technology, and the IS auditor would evaluate the controls over the generator's access rights to the database rather than their availability. C. Security documentation should be restricted to authorized security staff, but this is not a primary concern. D. Access to stored procedures is not a primary concern."
      },
      {
        "id": 7,
        "pregunta": "Al revisar una red usada para comunicaciones por Internet, el auditor PRIMERO examinará:",
        "preguntaEn": "When reviewing a network used for Internet communications, the auditor will FIRST examine:",
        "alternativas": [
          {
            "id": "a",
            "texto": "La validez de los cambios de contraseña"
          },
          {
            "id": "b",
            "texto": "La arquitectura de la aplicación cliente-servidor"
          },
          {
            "id": "c",
            "texto": "La arquitectura y diseño de la red"
          },
          {
            "id": "d",
            "texto": "La protección de firewall y servidores proxy"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The validity of password changes"
          },
          {
            "id": "b",
            "texto": "The client-server application architecture"
          },
          {
            "id": "c",
            "texto": "The network architecture and design"
          },
          {
            "id": "d",
            "texto": "The firewall and proxy server protection"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. La revisión de la validez de los cambios de contraseñas se realizaría como parte de las pruebas sustantivas. B. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas de información y la arquitectura de acceso, incluyendo las aplicaciones cliente-servidor. C. El primer paso al auditar una red es comprender la arquitectura y el diseño de la red. Esto proporciona una imagen general de la red y su conectividad. D. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas, tales como servidores proxy y firewalls.",
        "justificacionEn": "A. Reviewing the validity of password changes would be performed as part of substantive testing. B. Understanding the network architecture and design is the starting point for identifying the various layers of information and the access architecture across the various layers, such as client-server applications. C. The first step in auditing a network is to understand the network architecture and design. Understanding the network architecture and design provides an overall picture of the network and its connectivity. D. Understanding the network architecture and design is the starting point for identifying the various layers of information and the access architecture across the various layers, such as proxy servers and firewalls."
      },
      {
        "id": 8,
        "pregunta": "El auditor de SI debe involucrarse en:",
        "preguntaEn": "The IS auditor should be involved in:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Observar las pruebas del plan de recuperación ante desastres (DRP)"
          },
          {
            "id": "b",
            "texto": "Desarrollar el DRP"
          },
          {
            "id": "c",
            "texto": "Mantener el DRP"
          },
          {
            "id": "d",
            "texto": "Revisar los requisitos de recuperación de contratos de proveedores"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Observing disaster recovery plan (DRP) testing"
          },
          {
            "id": "b",
            "texto": "Developing the DRP"
          },
          {
            "id": "c",
            "texto": "Maintaining the DRP"
          },
          {
            "id": "d",
            "texto": "Reviewing recovery requirements in supplier contracts"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. El auditor de SI siempre debe estar presente cuando se prueban los planes de recuperación ante desastres (DRP) para asegurar que los procedimientos de recuperación probados alcancen los objetivos requeridos de restauración, que los procedimientos de recuperación sean efectivos y eficientes, y para informar sobre los resultados según corresponda. B. Los auditores de SI pueden participar en la supervisión del desarrollo del plan, pero es poco probable que participen en el proceso de desarrollo en sí. C. Se puede llevar a cabo una auditoría de los procedimientos de mantenimiento del plan, pero el auditor de SI normalmente no tendría ninguna responsabilidad sobre el mantenimiento en sí. D. A un auditor de SI se le puede pedir que comente sobre varios elementos de un contrato de proveedor, pero este no siempre es el caso.",
        "justificacionEn": "A. The information systems (IS) auditor should always be present when disaster recovery plans (DRP) are tested to ensure that the tested recovery procedures meet the required targets for restoration, that recovery procedures are effective and efficient, and to report on the results as appropriate. B. IS auditors may be involved in overseeing plan development, but they are unlikely to be involved in the actual development process. C. Similarly, an audit of plan maintenance procedures may be conducted, but the IS auditor normally would not have any responsibility for the actual maintenance. D. An IS auditor may be asked to comment upon various elements of a supplier contract, but this is not always the case."
      },
      {
        "id": 9,
        "pregunta": "La duplicación (mirroring) de datos debe implementarse como estrategia de recuperación cuando:",
        "preguntaEn": "Data mirroring should be implemented as a recovery strategy when:",
        "alternativas": [
          {
            "id": "a",
            "texto": "El RPO es bajo"
          },
          {
            "id": "b",
            "texto": "El RPO es alto"
          },
          {
            "id": "c",
            "texto": "El RTO es alto"
          },
          {
            "id": "d",
            "texto": "La tolerancia al desastre es alta"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The RPO is low"
          },
          {
            "id": "b",
            "texto": "The RPO is high"
          },
          {
            "id": "c",
            "texto": "The RTO is high"
          },
          {
            "id": "d",
            "texto": "Disaster tolerance is high"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. El objetivo de punto de recuperación (RPO) indica la antigüedad de los datos recuperados. Si el RPO es muy bajo, como minutos, significa que la organización no puede darse el lujo de perder siquiera unos pocos minutos de datos. En tales casos, la duplicación de datos (replicación sincrónica) debe utilizarse como estrategia de recuperación. B. Si el RPO es alto, como horas, entonces se podrían utilizar otros procedimientos de respaldo. C. Un objetivo de tiempo de recuperación (RTO) alto significa que el sistema de TI puede no ser necesario inmediatamente después de la interrupción; puede recuperarse más tarde. D. El RTO es el tiempo a partir de la interrupción durante el cual el negocio puede tolerar la indisponibilidad de las instalaciones de TI. Si el RTO es alto, se pueden utilizar estrategias de recuperación más lentas.",
        "justificacionEn": "A. Recovery point objective (RPO) is the earliest point in time at which it is acceptable to recover the data. If RPO is very low, such as minutes, it means that the organization cannot afford to lose even a few minutes of data. In such cases, data mirroring (synchronous data replication) should be used as a recovery strategy. B. If RPO is high, such as hours, then other backup procedures could be used. C. A high recovery time objective (RTO) means that the IT system may not be needed immediately after the disruption/declaration of disaster (i.e., it can be recovered later). D. RTO is the time from the disruption/declaration of disaster during which the business can tolerate the nonavailability of IT facilities. If RTO is high, slower recovery strategies that bring up IT systems and facilities can be used."
      },
      {
        "id": 10,
        "pregunta": "¿Qué componente de un BCP es PRINCIPALMENTE responsabilidad del departamento de TI de la organización?",
        "preguntaEn": "Which component of a BCP is PRIMARILY the responsibility of the organization's IT department?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Desarrollar el BCP"
          },
          {
            "id": "b",
            "texto": "Seleccionar y aprobar las estrategias de recuperación"
          },
          {
            "id": "c",
            "texto": "Declarar un desastre"
          },
          {
            "id": "d",
            "texto": "Restaurar los sistemas y datos de TI después de un desastre"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Developing the BCP"
          },
          {
            "id": "b",
            "texto": "Selecting and approving recovery strategies"
          },
          {
            "id": "c",
            "texto": "Declaring a disaster"
          },
          {
            "id": "d",
            "texto": "Restoring IT systems and data after a disaster"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Los miembros de la alta gerencia de la organización son los principales responsables de supervisar el desarrollo del plan de continuidad del negocio (BCP) y son responsables de los resultados (accountable). B. La gerencia también es responsable de seleccionar y aprobar las estrategias utilizadas para la recuperación ante desastres. C. TI puede estar involucrado en la declaración de un desastre, pero no es el responsable principal. D. El departamento de TI de una organización es el principal responsable de restaurar los sistemas y datos de TI después de un desastre dentro de los plazos designados.",
        "justificacionEn": "A. Members of the organization's senior management are primarily responsible for overseeing the development of the business continuity plan (BCP) and are accountable for the results. B. Management is also accountable for selecting and approving the strategies used for disaster recovery. C. IT may be involved in declaring a disaster but is not primarily responsible. D. The IT department of an organization is primarily responsible for restoring the IT systems and data after a disaster within the designated timeframes."
      }
    ],
    "5": [
      {
        "id": 1,
        "pregunta": "Al revisar la configuración de un sistema de detección de intrusos (IDS) basado en firmas, ¿qué preocuparía MÁS al auditor?",
        "preguntaEn": "When reviewing the configuration of a signature-based intrusion detection system (IDS), what would MOST concern the auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La autoactualización está desactivada"
          },
          {
            "id": "b",
            "texto": "El escaneo de vulnerabilidades de aplicación está desactivado"
          },
          {
            "id": "c",
            "texto": "El análisis de paquetes cifrados está desactivado"
          },
          {
            "id": "d",
            "texto": "El IDS está ubicado entre la DMZ y el firewall"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Automatic signature updates are disabled"
          },
          {
            "id": "b",
            "texto": "Application vulnerability scanning is disabled"
          },
          {
            "id": "c",
            "texto": "Encrypted packet analysis is disabled"
          },
          {
            "id": "d",
            "texto": "The IDS is placed between the DMZ and the firewall"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. El aspecto más importante de un sistema de detección de intrusos (IDS) basado en firmas es su capacidad para proteger contra patrones de intrusión conocidos (firmas); dichas firmas son provistas por el proveedor y son fundamentales para proteger a la empresa frente a ataques externos. B. Una de las desventajas clave de un IDS es su incapacidad inherente para escanear en busca de vulnerabilidades a nivel de aplicación. C. Un IDS no puede descifrar paquetes de datos cifrados para identificar el origen del tráfico entrante. D. Una zona desmilitarizada (DMZ) es un segmento de red interno en el que se alojan los sistemas accesibles al público; para proporcionar la mayor seguridad y eficiencia, un IDS debe colocarse detrás del firewall para que detecte solo aquellos ataques/intrusos que logran entrar a través del firewall.",
        "justificacionEn": "A. The most important aspect of a signature-based intrusion detection system (IDS) is its ability to protect against known (signature) intrusion patterns. Such signatures are provided by the vendor and are critical to protecting an enterprise from outside attacks. B. One of the key disadvantages of an IDS is its inherent inability to scan for vulnerabilities at the application level. C. An IDS cannot break encrypted data packets to identify the source of the incoming traffic. D. A demilitarized zone (DMZ) is an internal network segment in which systems accessible to the public are housed. An IDS should be placed behind the firewall so that it will detect only those attacks/intruders that enter the firewall."
      },
      {
        "id": 2,
        "pregunta": "¿Qué provee MEJOR el control de acceso a datos de nómina procesados en un servidor local?",
        "preguntaEn": "Which BEST provides access control to payroll data processed on a local server?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Registrar el acceso a información personal"
          },
          {
            "id": "b",
            "texto": "Usar contraseñas separadas para transacciones sensibles"
          },
          {
            "id": "c",
            "texto": "Usar software que restrinja las reglas de acceso al personal autorizado"
          },
          {
            "id": "d",
            "texto": "Restringir el acceso del sistema al horario laboral"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Logging access to personal information"
          },
          {
            "id": "b",
            "texto": "Using separate passwords for sensitive transactions"
          },
          {
            "id": "c",
            "texto": "Using software that restricts access rules to authorized staff"
          },
          {
            "id": "d",
            "texto": "Restricting system access to business hours"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Registrar el acceso a la información personal es un buen control ya que permitirá analizar el acceso en caso de preocupación sobre accesos no autorizados; sin embargo, no prevendrá el acceso. B. Restringir el acceso a transacciones sensibles solo restringirá el acceso a una parte de los datos; no prevendrá el acceso a los demás datos. C. La seguridad del servidor y del sistema debe definirse para permitir únicamente que los miembros del personal autorizados accedan a la información sobre el personal cuyos registros gestionan en el día a día. D. Restringir el acceso al sistema al horario comercial solo afectaría el momento en que podría ocurrir un acceso no autorizado y no prevendría dicho acceso en otros momentos.",
        "justificacionEn": "A. Logging access to personal information is a good control in that it will allow access to be analyzed if there is concern over unauthorized access. However, it will not prevent access. B. Restricting access to sensitive transactions will restrict access only to some of the data. It will not prevent access to other data. C. The server and system security should be defined to allow only authorized staff members access to information about the staff whose records they handle on a day-to-day basis. D. Restricting system access to business hours would only affect when unauthorized access could occur and would not prevent such access at other times."
      },
      {
        "id": 3,
        "pregunta": "En una organización con un mainframe y dos servidores de base de datos donde residen todos los datos de producción, ¿qué debilidad sería la MÁS seria?",
        "preguntaEn": "In an organization with a mainframe and two database servers where all production data resides, which weakness would be MOST serious?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El oficial de seguridad también es el DBA"
          },
          {
            "id": "b",
            "texto": "No hay controles de contraseña en los dos servidores de base de datos"
          },
          {
            "id": "c",
            "texto": "No hay BCP para aplicaciones no críticas del mainframe"
          },
          {
            "id": "d",
            "texto": "Las LAN no respaldan regularmente los discos de servidor de archivos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The security officer is also the DBA"
          },
          {
            "id": "b",
            "texto": "No password controls exist on the two database servers"
          },
          {
            "id": "c",
            "texto": "No BCP exists for noncritical mainframe applications"
          },
          {
            "id": "d",
            "texto": "LANs do not regularly back up file server disks"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Que el oficial de seguridad se desempeñe también como administrador de base de datos, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. B. La ausencia de controles de contraseñas en los dos servidores de bases de datos, donde residen los datos de producción, es la debilidad más crítica. C. No tener un plan de continuidad de negocio (BCP) para las aplicaciones no críticas del sistema mainframe, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. D. Que las redes de área local (LAN) no realicen copias de seguridad de los discos fijos de los servidores de archivos con regularidad, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas.",
        "justificacionEn": "A. The security officer serving as the database administrator, while a control weakness, does not carry the same disastrous impact as the absence of password controls. B. The absence of password controls on the two database servers, where production data resides, is the most critical weakness. C. Having no business continuity plan (BCP) for the mainframe system's noncritical applications, while a control weakness, does not carry the same disastrous impact as the absence of password controls. D. Local area networks (LANs) not backing up regularly, while a control weakness, does not carry the same disastrous impact as the absence of password controls."
      },
      {
        "id": 4,
        "pregunta": "Al implementar inicio de sesión único (SSO) en todos los sistemas, la organización debe saber que:",
        "preguntaEn": "When implementing single sign-on (SSO) across all systems, the organization should be aware that:",
        "alternativas": [
          {
            "id": "a",
            "texto": "El acceso no autorizado máximo sería posible si se divulga una contraseña"
          },
          {
            "id": "b",
            "texto": "Los derechos de acceso se restringirían por parámetros de seguridad adicionales"
          },
          {
            "id": "c",
            "texto": "La carga del administrador de seguridad aumentaría"
          },
          {
            "id": "d",
            "texto": "Los derechos de acceso del usuario aumentarían"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Maximum unauthorized access would be possible if a password is disclosed"
          },
          {
            "id": "b",
            "texto": "Access rights would be restricted by additional security parameters"
          },
          {
            "id": "c",
            "texto": "The security administrator workload would increase"
          },
          {
            "id": "d",
            "texto": "User access rights would increase"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Si se revela una contraseña cuando el inicio de sesión único (SSO) está habilitado, existe el riesgo de que sea posible el acceso no autorizado a todos los sistemas. B. Los derechos de acceso de los usuarios deben permanecer sin cambios con el SSO, ya que es posible que no se implementen parámetros de seguridad adicionales. C. Uno de los beneficios previstos del SSO es la simplificación de la administración de la seguridad. D. Uno de los beneficios previstos del SSO es la improbabilidad de un incremento en la carga de trabajo.",
        "justificacionEn": "A. If a password is disclosed when single sign-on (SSO) is enabled, there is a risk that unauthorized access to all systems will be possible. B. User access rights should remain unchanged by SSO, as additional security parameters might not be implemented. C. One of the intended benefits of SSO is the simplification of security administration. D. One of the intended benefits of SSO is the unlikelihood of an increased workload."
      },
      {
        "id": 5,
        "pregunta": "Al revisar una implementación de VoIP en una WAN corporativa, el auditor debería esperar encontrar:",
        "preguntaEn": "When reviewing a VoIP implementation on a corporate WAN, the auditor should expect to find:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ingeniería de tráfico"
          },
          {
            "id": "b",
            "texto": "Un enlace de datos ISDN"
          },
          {
            "id": "c",
            "texto": "Cifrado WEP de los datos"
          },
          {
            "id": "d",
            "texto": "Terminales telefónicos analógicos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Traffic engineering"
          },
          {
            "id": "b",
            "texto": "An ISDN data link"
          },
          {
            "id": "c",
            "texto": "WEP encryption of the data"
          },
          {
            "id": "d",
            "texto": "Analog telephone terminals"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Para garantizar que se cumplan los requisitos de calidad de servicio (QoS), el servicio de VoIP a través de la WAN debe protegerse frente a pérdidas de paquetes, latencia o fluctuación (jitter); para alcanzar este objetivo, el rendimiento de la red se puede gestionar a fin de proporcionar QoS mediante el uso de técnicas estadísticas, como la ingeniería de tráfico (traffic engineering). B. El ancho de banda estándar de un enlace de datos de red digital de servicios integrados (ISDN) no proporcionaría la QoS requerida para los servicios corporativos de VoIP. C. WEP (Wired Equivalent Privacy) es un esquema de cifrado relacionado con redes inalámbricas. D. Los teléfonos VoIP generalmente están conectados a una red de área local (LAN) corporativa y no son analógicos.",
        "justificacionEn": "A. To ensure that quality of service (QoS) requirements is achieved, the Voice over Internet Protocol (VoIP) service over the wide area network should be protected from packet losses, latency or jitter. To reach this objective, network performance can be managed to provide QoS and class of service support using statistical techniques, such as traffic engineering. B. The standard bandwidth of an integrated services digital network (ISDN) data link would not provide the QoS required for corporate VoIP services. C. Wired equivalent privacy is an encryption scheme related to wireless networking. D. VoIP phones are usually connected to a corporate local area network (LAN) and are not analog."
      },
      {
        "id": 6,
        "pregunta": "Una aseguradora usa nube pública para una aplicación crítica para reducir costos. ¿Qué preocuparía MÁS al auditor?",
        "preguntaEn": "An insurance company uses a public cloud for a critical application to reduce costs. What would MOST concern the auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Incapacidad de recuperar el servicio ante una falla técnica mayor"
          },
          {
            "id": "b",
            "texto": "Que los datos en el entorno compartido sean accedidos por otras empresas"
          },
          {
            "id": "c",
            "texto": "Que el proveedor no incluya soporte investigativo para incidentes"
          },
          {
            "id": "d",
            "texto": "La viabilidad a largo plazo del proveedor"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Inability to recover the service after a major technical failure"
          },
          {
            "id": "b",
            "texto": "Data in the shared environment being accessed by other companies"
          },
          {
            "id": "c",
            "texto": "The provider not including investigative support for incidents"
          },
          {
            "id": "d",
            "texto": "The long-term viability of the provider"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Los beneficios de la computación en la nube son la redundancia y la capacidad de acceder a los sistemas y datos en caso de una falla técnica. B. Considerando que una compañía de seguros debe preservar la privacidad y la confidencialidad de la información del cliente, el acceso no autorizado a la información y las fugas de datos son las principales preocupaciones. C. La capacidad de investigar un incidente es importante, pero lo más importante es abordar el riesgo de un incidente: la exposición de datos confidenciales. D. Si un proveedor de servicios en la nube quiebra, los datos aún deberían estar disponibles a partir de las copias de seguridad.",
        "justificacionEn": "A. Benefits of cloud computing are redundancy and the ability to access systems and data in the event of a technical failure. B. Considering that an insurance company must preserve the privacy/confidentiality of customer information, unauthorized access to information and data leakage are the major concerns. C. The ability to investigate an incident is important, but most important is addressing the risk of an incident: the exposure of sensitive data. D. If a cloud provider goes out of business, the data should still be available from backups."
      },
      {
        "id": 7,
        "pregunta": "¿Qué determina MEJOR si existen protocolos completos de cifrado y autenticación para proteger la información en tránsito?",
        "preguntaEn": "What BEST determines whether complete encryption and authentication protocols exist to protect information in transit?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Firma digital con RSA"
          },
          {
            "id": "b",
            "texto": "Trabajo en modo túnel con los servicios anidados de AH y ESP"
          },
          {
            "id": "c",
            "texto": "Certificados digitales con RSA"
          },
          {
            "id": "d",
            "texto": "Trabajo en modo transporte con AH y ESP anidados"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A digital signature with RSA"
          },
          {
            "id": "b",
            "texto": "Tunnel mode with nested AH and ESP services"
          },
          {
            "id": "c",
            "texto": "A digital certificate with RSA"
          },
          {
            "id": "d",
            "texto": "Transport mode with nested AH and ESP"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Una firma digital proporciona autenticación e integridad. B. El modo túnel (tunnel mode) proporciona cifrado y autenticación del paquete completo del Protocolo de Internet (IP); para lograr esto, los servicios de cabecera de autenticación (AH) y de carga útil de seguridad encapsuladora (ESP) se pueden anidar. C. Un certificado digital proporciona autenticación e integridad. D. El modo de transporte proporciona protección primaria para las capas superiores de los protocolos (es decir, la protección se extiende al campo de datos [carga útil o payload] de un paquete IP).",
        "justificacionEn": "A. A digital signature provides authentication and integrity. B. Tunnel mode provides encryption and authentication of the complete IP package. To accomplish this, the authentication header (AH) and encapsulating security payload (ESP) services can be nested. C. A digital certificate provides authentication and integrity. D. The transport mode provides primary protection for the protocols' higher layers (i.e., protection extends to the data field [payload] of an IP package)."
      },
      {
        "id": 8,
        "pregunta": "¿Qué preocupación de seguridad de un mensaje electrónico abordan las firmas digitales?",
        "preguntaEn": "Which electronic message security concern do digital signatures address?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Alteración"
          },
          {
            "id": "b",
            "texto": "Lectura no autorizada"
          },
          {
            "id": "c",
            "texto": "Robo"
          },
          {
            "id": "d",
            "texto": "Copia no autorizada"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Alteration"
          },
          {
            "id": "b",
            "texto": "Unauthorized reading"
          },
          {
            "id": "c",
            "texto": "Theft"
          },
          {
            "id": "d",
            "texto": "Unauthorized copying"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Una firma digital incluye un total hash cifrado del tamaño del mensaje tal como fue transmitido por su originador; este hash ya no sería exacto si el mensaje se alterara posteriormente, indicando así que la alteración ha ocurrido. B. Las firmas digitales no identificarán, evitarán ni disuadirán la lectura no autorizada. C. Las firmas digitales no identificarán, evitarán ni disuadirán el robo. D. Las firmas digitales no identificarán, evitarán ni disuadirán la copia no autorizada.",
        "justificacionEn": "A. A digital signature includes an encrypted hash total of the size of the message as it was transmitted by its originator. This hash would no longer be accurate if the message were subsequently altered, indicating that the alteration had occurred. B. Digital signatures will not identify, prevent or deter unauthorized reading. C. Digital signatures will not identify, prevent or deter theft. D. Digital signatures will not identify, prevent or deter unauthorized copying."
      },
      {
        "id": 9,
        "pregunta": "¿Qué caracteriza un ataque de denegación de servicio distribuido (DDoS)?",
        "preguntaEn": "What characterizes a distributed denial of service (DDoS) attack?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Iniciación central de computadoras intermediarias para dirigir tráfico espurio simultáneo a un sitio objetivo específico"
          },
          {
            "id": "b",
            "texto": "Iniciación local de computadoras intermediarias hacia múltiples sitios"
          },
          {
            "id": "c",
            "texto": "Iniciación central de una computadora primaria hacia múltiples sitios objetivo"
          },
          {
            "id": "d",
            "texto": "Iniciación local con tráfico escalonado"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Centrally initiated intermediate computers directing simultaneous spurious traffic at a specific target site"
          },
          {
            "id": "b",
            "texto": "Locally initiated intermediate computers toward multiple sites"
          },
          {
            "id": "c",
            "texto": "Centrally initiated primary computer targeting multiple sites"
          },
          {
            "id": "d",
            "texto": "Locally initiated with staggered traffic"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Esto describe de la mejor manera un ataque de denegación de servicio distribuido (DDoS); tales ataques se inician de forma centralizada e involucran el uso de múltiples computadoras comprometidas, operando mediante la inundación del sitio objetivo con tráfico de mensajes espurios para sobrecargar la red; para lograr este objetivo, los ataques deben dirigirse a un objetivo específico y ocurrir simultáneamente. B. Los ataques DDoS no se inician localmente. C. Los ataques DDoS no se inician utilizando una computadora primaria única. D. Los ataques DDoS no son escalonados (staggered).",
        "justificacionEn": "A. This best describes a distributed denial of service (DDoS) attack. Such attacks are centrally initiated and involve the use of multiple compromised computers. The attacks work by flooding the target site with spurious data, thereby overwhelming the network and other related resources. To achieve this objective, the attacks need to be directed at a specific target and occur simultaneously. B. DDoS attacks are not locally initiated. C. DDoS attacks are not initiated using a primary computer. D. DDoS attacks are not staggered."
      },
      {
        "id": 10,
        "pregunta": "¿Cuál es el control antivirus preventivo MÁS eficaz?",
        "preguntaEn": "What is the MOST effective preventive antivirus control?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Escanear los adjuntos de correo en el servidor de correo"
          },
          {
            "id": "b",
            "texto": "Restaurar sistemas desde copias limpias"
          },
          {
            "id": "c",
            "texto": "Deshabilitar los puertos USB"
          },
          {
            "id": "d",
            "texto": "Escaneo antivirus en línea con definiciones actualizadas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Scanning email attachments on the mail server"
          },
          {
            "id": "b",
            "texto": "Restoring systems from clean copies"
          },
          {
            "id": "c",
            "texto": "Disabling USB ports"
          },
          {
            "id": "d",
            "texto": "Online antivirus scanning with updated definitions"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. El escaneo de archivos adjuntos de correo electrónico en el servidor de correo es un control preventivo; evitará que los destinatarios abran archivos de correo electrónico infectados, lo que causaría la infección de sus equipos. B. Restaurar los sistemas a partir de copias limpias garantizará que no se introduzcan virus provenientes de copias o respaldos infectados. C. Deshabilitar los puertos USB evita que se copien archivos infectados desde una unidad USB hacia un equipo. D. El software antivirus se puede utilizar para prevenir ataques de virus; la ejecución de análisis regulares es útil para detectar infecciones por virus que ya han ocurrido; se requieren actualizaciones regulares del software para garantizar que pueda detectar y tratar los virus a medida que surgen.",
        "justificacionEn": "A. Scanning email attachments on the mail server is a preventive control. It will prevent infected email files from being opened by the recipients, which would cause their machines to become infected. B. Restoring systems from clean copies is a preventive control. It will ensure that viruses are not introduced from infected copies or backups, which would reinfect machines. C. Disabling universal serial bus (USB) ports is a preventive control. It prevents infected files from being copied from a USB drive onto a machine, which would cause the machine to become infected. D. Antivirus software can be used to prevent virus attacks. Running regular scans is useful to detect virus infections that have already occurred. Regular updates of the software are required to ensure it can update, detect and treat viruses as they emerge."
      }
    ]
  },
  "casos": {
    "1": [
      {
        "id": 1,
        "pregunta": "¿Qué debe hacer el auditor de SI PRIMERO?",
        "preguntaEn": "What should the IS auditor do FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Auditoría de encuesta de controles de acceso lógico"
          },
          {
            "id": "b",
            "texto": "Revisar el plan de auditoría hacia un enfoque basado en riesgo"
          },
          {
            "id": "c",
            "texto": "Realizar una evaluación de riesgo de TI"
          },
          {
            "id": "d",
            "texto": "Comenzar a probar los controles que considere más críticos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Perform a survey audit of logical access controls"
          },
          {
            "id": "b",
            "texto": "Revise the audit plan to focus on risk-based auditing"
          },
          {
            "id": "c",
            "texto": "Perform an IT risk assessment"
          },
          {
            "id": "d",
            "texto": "Begin testing controls the IS auditor feels are most critical"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Realizar una auditoría de encuesta de controles de acceso lógico ocurriría después de una evaluación de riesgos de TI. B. Revisar el plan de auditoría para enfocarse en una auditoría basada en riesgos ocurriría después de una evaluación de riesgos de TI. C. Se debe realizar primero una evaluación de riesgos de TI para determinar qué áreas presentan el mayor riesgo y qué controles mitigan ese riesgo. Aunque se han creado narrativas y flujos de procesos, la organización aún no ha evaluado cuáles controles son críticos. D. Probar los controles que el auditor de SI considere más críticos ocurriría después de una evaluación de riesgos de TI.",
        "justificacionEn": "A. Performing a survey audit of logical access controls would occur after an IT risk assessment. B. Revising the audit plan to focus on risk-based auditing would occur after an IT risk assessment. C. An IT risk assessment should be performed first to ascertain which areas present the greatest risk and which controls mitigate that risk. Although narratives and process flows have been created, the organization has not yet assessed which controls are critical. D. Testing controls that the IS auditor feels are most critical would occur after an IT risk assessment."
      },
      {
        "id": 2,
        "pregunta": "Al auditar la seguridad lógica, ¿qué preocupa MÁS al auditor?",
        "preguntaEn": "When auditing logical security, what MOST concerns the auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que la cuenta de administrador del sistema sea conocida por todos"
          },
          {
            "id": "b",
            "texto": "Que las contraseñas no cambien con frecuencia"
          },
          {
            "id": "c",
            "texto": "Que el administrador de red tenga permisos excesivos"
          },
          {
            "id": "d",
            "texto": "Ausencia de política escrita de gestión de privilegios"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The system administrator account being known by everybody"
          },
          {
            "id": "b",
            "texto": "Infrequent password changing"
          },
          {
            "id": "c",
            "texto": "The network administrator being given excessive permissions"
          },
          {
            "id": "d",
            "texto": "The absence of a privilege management policy"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Que la cuenta de administrador del sistema sea conocida por todos es lo más peligroso. En ese caso, cualquier usuario podría realizar cualquier acción en el sistema, incluido el acceso a archivos y ajustes de permisos y parámetros. B. El cambio poco frecuente de contraseñas presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. C. Que se le otorguen permisos excesivos al administrador de red presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. D. La ausencia de una política de gestión de privilegios sería motivo de preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema.",
        "justificacionEn": "A. The system administrator account being known by everybody is most dangerous. In that case, any user could perform any action in the system, including accessing files and making permission and parameter adjustments. B. Infrequent password changing would present a concern but would not be as serious as everyone knowing the system administrator account. C. The network administrator being given excessive permissions would present a concern, but it would not be as serious as everyone knowing the system administrator account. D. The absence of a privilege management policy would be a concern, but it would not be as serious as everyone knowing the system administrator account."
      },
      {
        "id": 3,
        "pregunta": "Al probar la gestión de cambios de programas, ¿cómo debe seleccionarse la muestra?",
        "preguntaEn": "When testing program change management, how should the sample be selected?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Documentos de gestión de cambios al azar"
          },
          {
            "id": "b",
            "texto": "Cambios en el código de producción, rastreados hasta la documentación de autorización"
          },
          {
            "id": "c",
            "texto": "Documentos según criticidad del sistema"
          },
          {
            "id": "d",
            "texto": "Cambios en producción rastreados a logs del sistema"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A random sample of change management documents"
          },
          {
            "id": "b",
            "texto": "Changes to production code, traced to authorization documentation"
          },
          {
            "id": "c",
            "texto": "Documents based on system criticality"
          },
          {
            "id": "d",
            "texto": "Production changes traced to system logs"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. B. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación adecuada. En consecuencia, los cambios en el código de producción proporcionan la base más apropiada para seleccionar una muestra. C. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. D. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente.",
        "justificacionEn": "A. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. B. When testing a control, it is advisable to trace from the item being controlled to the relevant control documentation. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. Accordingly, changes to production code provide the most appropriate basis for selecting a sample. C. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. D. When testing a control, it is advisable to trace from the item being controlled to the relevant control documentation."
      },
      {
        "id": 4,
        "pregunta": "La PRIMERA prioridad del auditor en el año uno debe ser estudiar:",
        "preguntaEn": "The IS auditor's FIRST priority in year one should be to study:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Informes de auditorías previas"
          },
          {
            "id": "b",
            "texto": "La carta de auditoría, para planificar el cronograma"
          },
          {
            "id": "c",
            "texto": "El impacto de la rotación de empleados"
          },
          {
            "id": "d",
            "texto": "El impacto de la implementación de un nuevo ERP"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Previous IS audit reports"
          },
          {
            "id": "b",
            "texto": "The audit charter, to plan the schedule"
          },
          {
            "id": "c",
            "texto": "The impact of employee turnover"
          },
          {
            "id": "d",
            "texto": "The impact of a new ERP implementation"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Los informes previos de auditoría de SI se revisarán para evitar trabajo redundante y para usarlos como referencia al realizar el trabajo de auditoría de SI. B. La carta de auditoría (audit charter) define el propósito, la autoridad y la responsabilidad de las actividades de auditoría de SI. También sienta las bases para las próximas actividades. C. El impacto de la rotación de empleados se abordaría al negociar actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar. D. El impacto de la implementación de un nuevo ERP se abordaría al negociar las actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar.",
        "justificacionEn": "A. Previous IS audit reports will be revisited to save redundant work and to use as references when doing the IS audit work. B. The audit charter defines the purpose, authority and responsibility of the IS audit activities. It also sets the foundation for upcoming activities. C. Impact of employee turnover would be addressed when negotiating follow-up activities for respective areas if there is any gap to close. D. Impact of the implementation of a new ERP would be addressed when negotiating the follow-up activities for respective areas if there is any gap to close."
      },
      {
        "id": 5,
        "pregunta": "¿Cómo debe evaluar el auditor el respaldo y procesamiento por lotes en operaciones de cómputo?",
        "preguntaEn": "How should the auditor evaluate backup and batch processing in computing operations?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Confiar en el informe del auditor de servicio"
          },
          {
            "id": "b",
            "texto": "Estudiar el contrato con el proveedor"
          },
          {
            "id": "c",
            "texto": "Comparar el informe de entrega de servicio con el SLA"
          },
          {
            "id": "d",
            "texto": "Planificar y ejecutar una revisión independiente de las operaciones de cómputo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Rely on the service auditor's report"
          },
          {
            "id": "b",
            "texto": "Review the contract with the vendor"
          },
          {
            "id": "c",
            "texto": "Compare the service delivery report with the SLA"
          },
          {
            "id": "d",
            "texto": "Plan and conduct an independent review of computing operations"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. El informe del auditor de servicio no puede asegurar el descubrimiento de ineficiencias de control. B. La revisión del contrato no puede asegurar el descubrimiento de ineficiencias de control. C. Comparar el informe de entrega de servicios con el acuerdo de nivel de servicio (SLA) no puede asegurar el descubrimiento de ineficiencias de control. D. La auditoría de SI debe realizar una revisión independiente del respaldo y del procesamiento por lotes. Todas las demás opciones no pueden asegurar el descubrimiento de ineficiencias de control en el proceso.",
        "justificacionEn": "A. The service auditor's report cannot ensure the discovery of control inefficiencies. B. Review of the contract cannot ensure the discovery of control inefficiencies. C. Comparing the service delivery report and the service level agreement cannot ensure the discovery of control inefficiencies. D. IS audit should conduct an independent review of the backup and batch processing. All other choices cannot ensure the discovery of control inefficiencies in the process."
      },
      {
        "id": 6,
        "pregunta": "Durante el trabajo diario, el auditor advierte que la revisión de logs puede no detectar errores a tiempo. ¿A qué tipo de riesgo corresponde esto?",
        "preguntaEn": "During daily work, the auditor notices that log review may not detect errors in time. What type of risk does this represent?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo inherente"
          },
          {
            "id": "b",
            "texto": "Riesgo residual"
          },
          {
            "id": "c",
            "texto": "Riesgo de control"
          },
          {
            "id": "d",
            "texto": "Riesgo material"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Inherent risk"
          },
          {
            "id": "b",
            "texto": "Residual risk"
          },
          {
            "id": "c",
            "texto": "Control risk"
          },
          {
            "id": "d",
            "texto": "Material risk"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Este no es un ejemplo de riesgo inherente. El riesgo inherente es el nivel de riesgo o exposición sin considerar las acciones que la gerencia ha tomado o podría tomar (por ejemplo, implementar controles). B. Este no es un ejemplo de riesgo residual. El riesgo residual es el riesgo restante después de que la gerencia ha implementado una respuesta al riesgo. C. El riesgo de control existe cuando un riesgo no puede ser prevenido o detectado de manera oportuna por el sistema de controles de SI, lo cual se describe en este caso. D. Este no es un ejemplo de riesgo material. El riesgo material es cualquier riesgo lo suficientemente grande como para amenazar el éxito general del negocio de manera material.",
        "justificacionEn": "A. This is not an example of inherent risk. Inherent risk is the risk level or exposure without considering the actions that management has taken or might take (e.g., implementing controls). B. This is not an example of residual risk. Residual risk is the remaining risk after management has implemented a risk response. C. Control risk exists when a risk cannot be prevented or detected on a timely basis by the system of IS controls, which is described in this instance. D. This is not an example of material risk. Material risk is any risk large enough to threaten the overall success of the business in a material way."
      }
    ],
    "2": [
      {
        "id": 1,
        "pregunta": "¿Qué debería preocupar MÁS al auditor sobre la estrategia de negocio de TI de Accenco?",
        "preguntaEn": "What should MOST concern the auditor about Accenco's IT business strategy?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los documentos de estrategia son informales e incompletos"
          },
          {
            "id": "b",
            "texto": "El comité de riesgo casi no se reúne y no deja actas"
          },
          {
            "id": "c",
            "texto": "Los presupuestos no parecen adecuados"
          },
          {
            "id": "d",
            "texto": "No hay CIO de tiempo completo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Strategy documents are informal and incomplete"
          },
          {
            "id": "b",
            "texto": "The risk committee barely meets and leaves no minutes"
          },
          {
            "id": "c",
            "texto": "Budgets do not appear adequate"
          },
          {
            "id": "d",
            "texto": "There is no full-time CIO"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. TI pierde de vista la dirección de la empresa sin documentos de estrategia explícitos, lo que dificulta la selección de proyectos y complica la definición de los niveles de servicio; en general, TI se vuelve subóptima en la entrega y en la obtención de valor. B. El hecho de que el comité de gestión de riesgos no celebre reuniones periódicas ni elabore una documentación adecuada implica una falta de buen gobierno del riesgo; el riesgo viene después de establecer los objetivos del negocio y de TI. C. Aunque un presupuesto inadecuado para futuras inversiones de TI genera preocupación, esto es menos importante que una estrategia incompleta. D. La falta de un CIO a tiempo completo puede ser motivo de preocupación, pero no es tan importante como una estrategia incompleta.",
        "justificacionEn": "A. IT loses sight of the enterprise direction without explicit strategy documents, making project selection harder and service levels difficult to define. Overall, IT becomes suboptimal in delivery and value realization. B. The failure of the risk management committee to hold regular meetings and produce good documentation implies a lack of good risk governance. Risk follows when setting the business and IT objectives. C. Although an inadequate budget for future IT investments raises concern, this is less important than an incomplete strategy. D. The lack of a full-time CIO may be a concern, but it is not as important as an incomplete strategy."
      },
      {
        "id": 2,
        "pregunta": "¿Cuál sería el problema MÁS significativo relacionado con la estrategia de negocio de TI de Accenco?",
        "preguntaEn": "What would be the MOST significant problem related to Accenco's IT business strategy?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El comportamiento de acceso y migración de código de los programadores"
          },
          {
            "id": "b",
            "texto": "La falta de políticas y procedimientos de TI"
          },
          {
            "id": "c",
            "texto": "Las prácticas de gestión de riesgo comparadas con pares"
          },
          {
            "id": "d",
            "texto": "La estructura de reporte de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Programmer behavior related to access and code migration"
          },
          {
            "id": "b",
            "texto": "The lack of IT policies and procedures"
          },
          {
            "id": "c",
            "texto": "Risk management practices compared to peer enterprises"
          },
          {
            "id": "d",
            "texto": "The IT reporting structure"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. El comportamiento relacionado con el acceso y la migración de código por parte de los programadores de aplicaciones representa una falta de políticas y procedimientos de TI. B. La falta de políticas y procedimientos de TI provoca que el trabajo relacionado con TI se entregue de forma inconsistente; la política refleja las intenciones de la gerencia y las normas fijadas por la estrategia, mientras que los procedimientos son fundamentales para la entrega diaria de TI. C. Las prácticas de gestión de riesgos no tienen por qué compararse con las de empresas homólogas (peers). D. Aunque la estructura de reporte para TI es importante, no es tan crítica como las políticas y procedimientos de TI.",
        "justificacionEn": "A. The behavior related to application programmers' access and migration code represents a lack of IT policies and procedures. B. The lack of IT policies and procedures makes IT-related work inconsistently delivered. The policy reflects management intentions and norms set by the strategy. The procedures are instrumental to day-to-day IT delivery. C. Risk management practices do not have to compare to peer enterprises. D. Although the reporting structure for IT is important, it is not as critical as IT policies and procedures."
      },
      {
        "id": 3,
        "pregunta": "Desde la perspectiva de gobierno de TI, ¿qué sería de MAYOR preocupación?",
        "preguntaEn": "From an IT governance perspective, what would be of GREATEST concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "No hay CIO de tiempo completo"
          },
          {
            "id": "b",
            "texto": "No hay comité directivo de TI"
          },
          {
            "id": "c",
            "texto": "La junta juega un rol importante en el monitoreo de TI"
          },
          {
            "id": "d",
            "texto": "El gerente de SI reporta al CFO"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "There is no full-time CIO"
          },
          {
            "id": "b",
            "texto": "There is no IT steering committee"
          },
          {
            "id": "c",
            "texto": "The board plays a major role in IT monitoring"
          },
          {
            "id": "d",
            "texto": "The IS manager reports to the CFO"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. No tener un CIO a tiempo completo puede ser una preocupación, pero no resulta tan preocupante como que el gerente de SI reporte al CFO. B. La falta de un comité directivo de TI puede causar problemas, pero no es una preocupación tan grande como que el gerente de SI reporte al CFO. C. Que la junta directiva desempeñe un rol principal en las iniciativas de TI no constituye una preocupación importante. D. Idealmente, el gerente de SI debería reportar a la junta directiva o al CEO para proporcionar suficiente independencia; la estructura de reporte que exige que el gerente de SI reporte al CFO no es deseable y podría comprometer ciertos controles.",
        "justificacionEn": "A. Not having a full-time CIO may be a concern but is not as concerning as the information systems manager reporting to the CFO. B. The lack of an IT steering committee may cause issues but is not as big a concern as the information systems manager reporting to the CFO. C. The board of directors playing a major role in IT initiatives is not a major concern. D. The IS manager should ideally report to the board of directors or the CEO to provide sufficient independence. The reporting structure that requires the IS manager to report to the CFO is not desirable and could compromise certain controls."
      },
      {
        "id": 4,
        "pregunta": "Desde la perspectiva de SoD, ¿qué sería de MAYOR preocupación?",
        "preguntaEn": "From a SoD perspective, what would be of GREATEST concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los programadores solo necesitan aprobación del DBA para acceso de escritura directa a datos"
          },
          {
            "id": "b",
            "texto": "Entrega de código al bibliotecario"
          },
          {
            "id": "c",
            "texto": "Auditoría interna reporta al CFO"
          },
          {
            "id": "d",
            "texto": "Los reportes de desempeño solo son firmados por gerentes de negocio"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Programmers only need DBA approval for direct-write data access"
          },
          {
            "id": "b",
            "texto": "Handing program code to the librarian"
          },
          {
            "id": "c",
            "texto": "Internal audit reports to the CFO"
          },
          {
            "id": "d",
            "texto": "Performance reports are only signed by business managers"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Los programadores de aplicaciones deben obtener la aprobación de los dueños del negocio (business owners) antes de acceder a los datos; los DBAs son únicamente custodios de los datos y solo deben proporcionar el acceso autorizado por el dueño de los datos (data owner). B. Aunque esto puede ser un problema, no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. C. Que el departamento de auditoría interna reporte al CFO no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. D. Esto no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa.",
        "justificacionEn": "A. Application programmers should obtain approval from the business owners before accessing data. DBAs are only custodians of the data and should provide only the access authorized by the data owner. B. Although this may be an issue, it is not as big a SoD concern as the DBA approving direct-write access. C. The internal audit department reporting to the CFO is not as big a SoD concern as the DBA approving direct-write access. D. This is not as big a SoD concern as the DBA approving direct-write access."
      },
      {
        "id": 5,
        "pregunta": "¿Qué control mitigaría MEJOR la integridad de datos?",
        "preguntaEn": "Which control would BEST mitigate data integrity concerns?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Separación de funciones técnica"
          },
          {
            "id": "b",
            "texto": "Políticas de desarrollo"
          },
          {
            "id": "c",
            "texto": "Reportes de auditoría"
          },
          {
            "id": "d",
            "texto": "Que los resultados de desempeño del negocio sean revisados y firmados por los gerentes de negocio"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Technical separation of duties"
          },
          {
            "id": "b",
            "texto": "Development policies"
          },
          {
            "id": "c",
            "texto": "Audit reports"
          },
          {
            "id": "d",
            "texto": "Business performance results reviewed and signed off by business managers"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Esto no es lo que mejor mitiga la manipulación de datos. B. Entregar el código de programa al bibliotecario no es lo que mejor mitiga la manipulación de datos. C. La estructura de reporte no mitiga la manipulación de datos. D. La aprobación y firma (sign-off) de los datos contenidos en los resultados financieros por parte de los gerentes de negocio al final del mes detectaría cualquier discrepancia significativa que pudiera resultar de la alteración de datos mediante un acceso directo inapropiado obtenido sin la aprobación o el conocimiento de los gerentes de negocio.",
        "justificacionEn": "A. This does not best mitigate tampering with data. B. Handing program code to the librarian does not best mitigate tampering with data. C. The reporting structure does not mitigate data tampering. D. Sign-off on data contained in the financial results by the business managers at the end of the month would detect any significant discrepancies that can result from the tampering of data through inappropriate direct access of the data gained without the approval or knowledge of the business managers."
      }
    ],
    "3": [
      {
        "id": 1,
        "pregunta": "¿Cuál presenta el riesgo MÁS significativo para el minorista?",
        "preguntaEn": "Which presents the MOST significant risk to the retailer?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Parches de base de datos muy desactualizados"
          },
          {
            "id": "b",
            "texto": "Los registros POS inalámbricos usan cifrado WEP"
          },
          {
            "id": "c",
            "texto": "Los datos de tarjetahabientes se envían por Internet"
          },
          {
            "id": "d",
            "texto": "Los datos agregados de ventas se envían por correo a un tercero"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Database patches are very outdated"
          },
          {
            "id": "b",
            "texto": "Wireless POS registers use WEP encryption"
          },
          {
            "id": "c",
            "texto": "Cardholder data is sent over the Internet"
          },
          {
            "id": "d",
            "texto": "Aggregate sales data is mailed to a third party"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Los servidores de bases de datos sin parches están ubicados en una subred filtrada (screened subnet); esto mitiga el riesgo para la empresa. B. El uso del cifrado WEP presenta el riesgo más significativo porque WEP utiliza una clave secreta fija que es fácil de vulnerar. La transmisión de información de los titulares de tarjetas de crédito por medio de cajas registradoras inalámbricas es susceptible de intercepción y representa un riesgo muy grave. C. El envío de datos de titulares de tarjetas de crédito a través de Internet representa un riesgo menor debido a que se está utilizando un cifrado robusto. D. Debido a que los datos de ventas enviados al tercero son datos agregados, no debería incluirse información de titulares de tarjetas.",
        "justificacionEn": "A. Unpatched database servers are located on a screened subnet; this mitigates the risk to the enterprise. B. Use of WEP encryption presents the most significant risk because WEP uses a fixed secret key that is easy to break. Transmission of credit cardholder information by wireless registers is susceptible to interception and presents a very serious risk. C. Sending credit cardholder data over the Internet is less of a risk because strong encryption is being used. D. Because the sales data being sent to the third party are aggregate data, no cardholder information should be included."
      },
      {
        "id": 2,
        "pregunta": "Según el caso, ¿qué control es el MÁS importante de implementar?",
        "preguntaEn": "According to the case, which control is the MOST important to implement?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Autenticación de dos factores en los POS"
          },
          {
            "id": "b",
            "texto": "Filtrado MAC en los puntos de acceso inalámbricos"
          },
          {
            "id": "c",
            "texto": "Parchear el ERP para cumplir el RGPD"
          },
          {
            "id": "d",
            "texto": "Anonimizar y cifrar los datos agregados de ventas antes de distribuirlos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Two-factor authentication on POS registers"
          },
          {
            "id": "b",
            "texto": "MAC filtering on wireless access points"
          },
          {
            "id": "c",
            "texto": "Patching the ERP to comply with GDPR"
          },
          {
            "id": "d",
            "texto": "Anonymizing and encrypting aggregate sales data before distribution"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. De acuerdo con el caso de estudio, no está claro si las cajas registradoras de punto de venta (POS) ya utilizan autenticación de dos factores. Se sabe que los datos agregados de ventas se copian en otros medios tal cual (as-is), sin ningún control, para su distribución externa. B. De acuerdo con el caso de estudio, no está claro si los puntos de acceso inalámbricos utilizan filtrado de direcciones MAC. Se sabe que los datos agregados de ventas se copian sin ningún control para su distribución externa. C. El cumplimiento del GDPR, aunque es importante, no es lo más importante debido a que las operaciones actuales radican únicamente en los Estados Unidos, y la posible expansión hacia la Unión Europea constituye una visión a largo plazo. D. No está claro si los datos de ventas están seguros y libres de información de identificación personal (PII). Esto representa el riesgo más significativo y debe ser abordado.",
        "justificacionEn": "A. According to the case study, it is unclear whether the POS registers already use two-factor authentication. It is known that aggregate sales data are copied onto other media as-is, without any controls, for external distribution. B. According to the case study, it is unclear whether the wireless access points use MAC address filtering. It is known that aggregate sales data are copied without any controls for external distribution. C. Compliance with the GDPR, although important, is not the most important due to the current operations being only in the United States, and the potential for expansion into the EU is a long-term vision for the enterprise. D. It is unclear whether sales data are secure and free of personally identifiable information, such as credit card information and Social Security numbers. This presents the most significant risk and should be addressed."
      },
      {
        "id": 3,
        "pregunta": "En el informe preliminar sobre la actualización de la base de datos, ¿qué es lo MÁS importante de incluir?",
        "preguntaEn": "In the preliminary report on the database upgrade, what is MOST important to include?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que auditoría interna sea incluida en las aprobaciones del comité directivo"
          },
          {
            "id": "b",
            "texto": "Posible incompatibilidad de la nueva base de datos con el ERP existente"
          },
          {
            "id": "c",
            "texto": "Se requiere una actualización/parche del ERP"
          },
          {
            "id": "d",
            "texto": "Auditoría interna debe poder revisar la base de datos actualizada para PCI DSS"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "That internal audit be included in steering committee approvals"
          },
          {
            "id": "b",
            "texto": "Possible incompatibility of the new database with the existing ERP"
          },
          {
            "id": "c",
            "texto": "An ERP upgrade/patch is required"
          },
          {
            "id": "d",
            "texto": "Internal audit must be able to review the upgraded database for PCI DSS"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Si auditoría interna forma parte del comité directivo (steering committee), tendrá voz y voto respecto a los controles de seguridad y cumplimiento normativo que deben incluirse en las versiones de pase a producción. B. Asegurar el cumplimiento de la base de datos es una responsabilidad operativa y no una responsabilidad de auditoría. C. La compatibilidad con la arquitectura existente debe ser una función del equipo de proyecto de implementación de la base de datos en su conjunto, el cual puede incluir a auditoría interna y también comprende a operaciones. D. Aunque es importante que la solución de base de datos actualizada cumpla con todas las regulaciones, dicha revisión no debe limitarse a una sola regulación.",
        "justificacionEn": "A. If internal audit is part of the steering committee, then it will have a say in the compliance and security-related controls to be included in production releases. B. Ensuring database compliance is an operational responsibility and not an audit responsibility. C. Compatibility with existing architecture must be a function of the database implementation project team as a whole, which can include internal audit and also includes operations. Therefore, it is not the best answer choice. D. Although it is important that the upgraded database solution be compliant with all regulations affecting the enterprise, such a review should not be limited to one regulation. Therefore, it is not the best choice of those answers provided."
      },
      {
        "id": 4,
        "pregunta": "Para contribuir directamente a resolver los problemas de la actualización de base de datos, el auditor debe:",
        "preguntaEn": "To directly contribute to resolving the database upgrade problems, the auditor should:",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisar la validez de las especificaciones funcionales"
          },
          {
            "id": "b",
            "texto": "Proponerse como consultor de control de calidad del proyecto"
          },
          {
            "id": "c",
            "texto": "Investigar más a fondo para identificar causas raíz y definir contramedidas apropiadas"
          },
          {
            "id": "d",
            "texto": "Contactar al líder de proyecto y recomendar redefinir el cronograma con PERT"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Review the validity of functional project specifications"
          },
          {
            "id": "b",
            "texto": "Propose to be the project quality control consultant"
          },
          {
            "id": "c",
            "texto": "Conduct further research to identify root causes and define appropriate countermeasures"
          },
          {
            "id": "d",
            "texto": "Contact the project leader and recommend redesigning the schedule with PERT"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. Las especificaciones funcionales del proyecto deben ser ejecutadas por los usuarios y analistas de sistemas, no por el auditor. B. Proponer ser consultor de calidad del proyecto no aportaría una contribución esencial, ya que la calidad es una característica formal; mientras que, en el caso actual, el problema es una inestabilidad sustancial del sistema. C. La única acción apropiada es realizar una investigación adicional, incluso si la naturaleza aparentemente técnica del problema hace improbable que el auditor pueda resolverlo por sí solo. D. Contactar al líder del proyecto y rediseñar el cronograma de entregas no resolvería el problema. Además, la definición de las causas reales puede alterar de forma sustancial el entorno del proyecto.",
        "justificacionEn": "A. Functional project specifications should be executed by users and systems analysts, and not by the auditor. B. To propose to be project consultant for quality would not bring about an essential contribution, because quality is a formal characteristic; whereas, in the current case, the problem is substantial system instability. C. The only appropriate action is additional research, even if the apparently technical nature of the problem renders it unlikely that the auditor may find it alone. D. To contact the project leader and redesign the schedule of deliveries would not solve the problem. Furthermore, the definition of real causes may sensibly alter the project environment."
      }
    ],
    "4": [
      {
        "id": 1,
        "pregunta": "¿Cuál sería la preocupación MÁS importante sobre el uso de sistemas de radio por microondas?",
        "preguntaEn": "What would be the MOST important concern about the use of microwave radio systems?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Susceptibilidad a la interceptación de datos transmitidos"
          },
          {
            "id": "b",
            "texto": "Falta de soluciones de cifrado disponibles"
          },
          {
            "id": "c",
            "texto": "Probabilidad de interrupción del servicio"
          },
          {
            "id": "d",
            "texto": "Sobrecostos de implementación"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Susceptibility to interception of transmitted data"
          },
          {
            "id": "b",
            "texto": "Lack of available encryption solutions"
          },
          {
            "id": "c",
            "texto": "Likelihood of a service outage"
          },
          {
            "id": "d",
            "texto": "Cost overruns in implementation"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. La falta de cifrado es la preocupación más importante, dado que los sistemas de radio por microondas son fáciles de intervenir (tap). B. La falta de escalabilidad es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. C. La probabilidad de una interrupción del servicio es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. D. Los sobrecostos en la implementación son importantes, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes.",
        "justificacionEn": "A. Lack of encryption is the most important concern since microwave radio systems are easy to tap. B. Lack of scalability is important but not as important as ensuring the confidentiality and integrity of customer data. C. The likelihood of a service outage is important but not as important as ensuring the confidentiality and integrity of customer data. D. Cost overruns in implementation are important but not as important as ensuring the confidentiality and integrity of customer data."
      },
      {
        "id": 2,
        "pregunta": "¿Qué reduciría MEJOR la probabilidad de que los sistemas de negocio sean atacados desde Internet a través de la red inalámbrica?",
        "preguntaEn": "What would BEST reduce the likelihood of business systems being attacked from the Internet through the wireless network?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Escanear todos los dispositivos conectados en busca de malware"
          },
          {
            "id": "b",
            "texto": "Segmentar la red interna y el acceso a Internet público mediante una subred con firewall"
          },
          {
            "id": "c",
            "texto": "Registrar todos los accesos y alertar sobre intentos fallidos"
          },
          {
            "id": "d",
            "texto": "Limitar el acceso a horario laboral y protocolos estándar"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Scanning all connected devices for malware"
          },
          {
            "id": "b",
            "texto": "Isolating the wireless network by placing it on a firewalled subnet"
          },
          {
            "id": "c",
            "texto": "Logging all access and alerting on failed attempts"
          },
          {
            "id": "d",
            "texto": "Limiting access to business hours and standard protocols"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. El escaneo en busca de malware no detectaría el uso de herramientas de investigación diseñadas para recolectar contraseñas o revelar vulnerabilidades de la red. B. Aislar la red inalámbrica ubicándola en una subred protegida por firewall reduciría de la mejor manera la probabilidad de un ataque. C. Registrar el acceso (logging access) no evitaría un ataque exitoso. D. Limitar el acceso al horario laboral normal no evitaría un ataque exitoso.",
        "justificacionEn": "A. Scanning for malware would not detect the use of investigative tools designed to harvest passwords or reveal network vulnerabilities. B. Isolating the wireless network by placing it on a firewalled subnet would best reduce the likelihood of attack. C. Logging access would not prevent a successful attack. D. Limiting access to normal business hours would not prevent a successful attack."
      },
      {
        "id": 3,
        "pregunta": "Al negociar nuevos contratos con el proveedor, ¿qué debe recomendar el auditor sobre el hot site?",
        "preguntaEn": "When negotiating new contracts with the vendor, what should the auditor recommend regarding the hot site?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentar los escritorios a 750"
          },
          {
            "id": "b",
            "texto": "Añadir 35 servidores adicionales al contrato"
          },
          {
            "id": "c",
            "texto": "Almacenar todos los medios de respaldo en el hot site"
          },
          {
            "id": "d",
            "texto": "Revisar trimestralmente los requisitos de equipo de escritorio y servidores"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increase desktops to 750"
          },
          {
            "id": "b",
            "texto": "Add 35 additional servers to the contract"
          },
          {
            "id": "c",
            "texto": "Store all backup media at the hot site"
          },
          {
            "id": "d",
            "texto": "Conduct quarterly reviews of desktop and server equipment requirements"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "A. Debido a que no todas las funciones laborales de los empleados son críticas durante un desastre, no es necesario contratar en una instalación de recuperación el mismo número de computadoras de escritorio que el número de empleados. B. Del mismo modo, no todos los servidores son críticos para la operación continua del negocio; solo se requerirá un subconjunto de ellos. C. Debido a que no existe certeza de que el sitio en caliente no esté ya ocupado, no sería aconsejable almacenar los medios de respaldo en dicha instalación. Por lo general, estas instalaciones no están diseñadas para proporcionar un almacenamiento extenso de medios, y las pruebas frecuentes realizadas por otros clientes podrían comprometer la seguridad de dichos soportes. D. Como las necesidades de equipamiento en una empresa de rápido crecimiento están sujetas a cambios frecuentes, las revisiones trimestrales son necesarias para asegurar que la capacidad de recuperación se mantenga al ritmo de la organización.",
        "justificacionEn": "A. Because not all employee job functions are critical during a disaster, it is not necessary to contract the same number of desktops at a recovery facility as the number of employees. B. Similarly, not every server is critical to the continued operation of the business. Only a subset will be required. C. Because there is no assurance that the hot site will not already be occupied, storing backup media at the facility would not be advisable. These facilities are generally not designed to provide extensive media storage, and frequent testing by other customers could compromise the security of the media. D. As equipment needs in a rapidly growing business are subject to frequent change, quarterly reviews are necessary to ensure that the recovery capability keeps pace with the organization."
      },
      {
        "id": 4,
        "pregunta": "¿Qué debe recomendar el auditor sobre la recuperación de las oficinas de sucursal?",
        "preguntaEn": "What should the auditor recommend regarding recovery of branch offices?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Añadir cada sucursal al contrato de hot site existente"
          },
          {
            "id": "b",
            "texto": "Asegurar que las sucursales tengan capacidad suficiente para respaldarse entre sí"
          },
          {
            "id": "c",
            "texto": "Reubicar todos los servidores de sucursal al centro de datos"
          },
          {
            "id": "d",
            "texto": "Añadir capacidad al hot site equivalente a la sucursal más grande"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Add each branch to the existing hot site contract"
          },
          {
            "id": "b",
            "texto": "Ensure that branches have sufficient capacity to accommodate critical personnel from another branch"
          },
          {
            "id": "c",
            "texto": "Relocate all branch servers to the data center"
          },
          {
            "id": "d",
            "texto": "Add capacity to the hot site equivalent to the largest branch"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Agregar cada sucursal al contrato del sitio en caliente resultaría mucho más costoso. B. La solución más rentable (cost-effective) consiste en recomendar que las sucursales tengan capacidad suficiente para albergar al personal crítico proveniente de otra sucursal. Debido a que las funciones laborales críticas representarían solo quizás un 20 por ciento del personal de la sucursal afectada, únicamente se necesitaría espacio para entre cuatro y siete miembros clave del personal. C. Reubicar los servidores de las sucursales en el centro de datos principal podría generar problemas de rendimiento; asimismo, no resolvería la cuestión de dónde ubicar físicamente a los empleados desplazados. D. Agregar capacidad al contrato del sitio en caliente no brindaría cobertura, ya que los contratos de sitios en caliente basan su precio individualmente en cada ubicación cubierta.",
        "justificacionEn": "A. Adding each branch to the hot site contract would be far more expensive. B. The most cost-effective solution is to recommend that branches have sufficient capacity to accommodate critical personnel from another branch. Because critical job functions would represent only perhaps 20 percent of the staff from the affected branch, accommodations for only four to seven critical staff members would be needed. C. Relocating branch servers to the data center could result in performance issues. It would not address the question of where to locate displaced employees. D. Adding capacity to the hot site contract would not provide coverage, as hot site contracts base their pricing on each location covered."
      }
    ],
    "5": [
      {
        "id": 1,
        "pregunta": "[Caso Spectertainment] ¿Qué preocuparía MÁS a un auditor de SI al revisar una implementación de VPN? Las computadoras de la red ubicadas:",
        "preguntaEn": "[Spectertainment Case] What would MOST concern an IS auditor reviewing a VPN implementation? Network computers located:",
        "alternativas": [
          {
            "id": "a",
            "texto": "En la red interna de la empresa"
          },
          {
            "id": "b",
            "texto": "En el sitio de respaldo"
          },
          {
            "id": "c",
            "texto": "En los hogares de los empleados"
          },
          {
            "id": "d",
            "texto": "En las oficinas remotas de la empresa"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "On the enterprise's internal network"
          },
          {
            "id": "b",
            "texto": "At the backup site"
          },
          {
            "id": "c",
            "texto": "At employees' homes"
          },
          {
            "id": "d",
            "texto": "At the enterprise's remote offices"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "A. En la red interna de la empresa, las políticas y controles de seguridad deben estar implementados para detectar y detener un ataque externo que utilice una máquina interna como plataforma de lanzamiento; por lo tanto, esta no sería la mayor preocupación. B. Las computadoras en el sitio de respaldo están sujetas a la política de seguridad corporativa y, por lo tanto, no son computadoras de alto riesgo. C. La VPN ofrece una conexión segura entre la PC remota y la red corporativa. Sin embargo, la VPN no protege a la PC remota de ataques externos (como desde Internet). Si la PC remota se ve comprometida, un actor malicioso puede usar el punto de entrada de la PC remota comprometida para ingresar a la red corporativa (movimiento lateral). D. Las computadoras en las oficinas remotas de la empresa son más riesgosas que las computadoras en la oficina principal o en el sitio de respaldo, pero obviamente son menos riesgosas que las computadoras domésticas.",
        "justificacionEn": "A. On an enterprise's internal network, security policies and controls should be in place to detect and halt an outside attack that uses an internal machine as a staging platform. Therefore, this would not be the biggest concern to the IS audit. B. Computers at the backup site are subject to the corporate security policy and therefore are not high-risk computers. C. VPN offers a secure connection between the remote PC and the corporate network. VPN does not, however, protect the remote PC from outside attack (such as from the Internet). If the remote PC is compromised, a malicious actor can use the entry point of the compromised remote PC to enter the corporate network (lateral movement). D. Computers on the network that are at the enterprise's remote offices, perhaps with IS and security employees who have different ideas about security, are riskier than computers in the main office or backup site, but obviously less risky than home computers."
      },
      {
        "id": 2,
        "pregunta": "[Caso Spectertainment] ¿Qué nivel provee un MAYOR grado de protección al aplicar software de control de acceso contra riesgo de acceso no autorizado?",
        "preguntaEn": "[Spectertainment Case] Which level provides the GREATEST degree of protection when applying access control software against unauthorized access risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Nivel de red y sistema operativo"
          },
          {
            "id": "b",
            "texto": "Nivel de aplicación"
          },
          {
            "id": "c",
            "texto": "Nivel de base de datos"
          },
          {
            "id": "d",
            "texto": "Nivel de archivo de log"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Network and operating system level"
          },
          {
            "id": "b",
            "texto": "Application level"
          },
          {
            "id": "c",
            "texto": "Database level"
          },
          {
            "id": "d",
            "texto": "Log file level"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. El mayor grado de protección al aplicar software de control de acceso contra el acceso no autorizado de usuarios internos y externos se encuentra en los niveles de red y de plataforma/SO. Estos sistemas también se denominan sistemas de soporte general y constituyen la infraestructura principal sobre la que residirán los sistemas de aplicaciones y bases de datos. B. El nivel de aplicación es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. C. El nivel de base de datos es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. D. El nivel de archivos de registro (log files) es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO.",
        "justificacionEn": "A. The greatest degree of protection in applying access control software against internal and external users' unauthorized access is at the network and platform/OS levels. These systems are also referred to as general support systems, and they make up the primary infrastructure on which applications and database systems will reside. B. The application level is part of the infrastructure made up by the general support systems, supported by the network and OS level. C. The database level is part of the infrastructure made up by the general support systems, supported by the network and OS level. D. The log file level is part of the infrastructure made up by the general support systems, supported by the network and OS level."
      },
      {
        "id": 3,
        "pregunta": "[Caso Spectertainment] Cuando un empleado reporta el olvido de su contraseña, ¿qué debe hacer PRIMERO el administrador de seguridad?",
        "preguntaEn": "[Spectertainment Case] When an employee reports a forgotten password, what should the security administrator do FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Permitir que el sistema genere aleatoriamente una nueva contraseña"
          },
          {
            "id": "b",
            "texto": "Verificar la identidad del usuario mediante un sistema de desafío/respuesta"
          },
          {
            "id": "c",
            "texto": "Proveer la contraseña por defecto y explicar que debe cambiarse"
          },
          {
            "id": "d",
            "texto": "Pedir al empleado que use la terminal del administrador"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Allow the system to randomly generate a new password"
          },
          {
            "id": "b",
            "texto": "Verify the user's identity using a challenge/response system"
          },
          {
            "id": "c",
            "texto": "Provide a default password and explain it must be changed"
          },
          {
            "id": "d",
            "texto": "Ask the employee to use the administrator's terminal"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Cuando un empleado informa una contraseña olvidada, el administrador de seguridad debe iniciar un procedimiento de generación de contraseña solo después de verificar la identificación del usuario mediante un sistema de desafío/respuesta (challenge/response) o un procedimiento similar. B. Un sistema de desafío/respuesta o un procedimiento similar debe ser el primer paso para verificar la identidad del usuario. Para verificar, se aconseja que el administrador de seguridad devuelva la llamada al usuario después de verificar su extensión o llamar a su supervisor. C. Antes de proporcionarle a un empleado una contraseña predeterminada, la identidad de la persona debe verificarse mediante un sistema de desafío/respuesta o un procedimiento similar. D. Antes de tomar cualquier otra medida, se debe verificar la identidad del usuario. No se debe generar una nueva contraseña hasta que se confirme, independientemente de la seguridad de la terminal.",
        "justificacionEn": "A. When an employee reports a forgotten password, the security administrator should start a password process generation procedure only after verifying the user's identification using a challenge/response system or similar procedure. B. A challenge/response system or similar procedure should be the first step in verifying a user's identity. To verify, it is advised that the security administrator should return the user's call after verifying their extension or calling their supervisor for verification. C. Before an employee is provided with a default password, the individual's identity should be verified using a challenge/response system or similar procedure. D. Before any further action is taken, the user's identity must be verified. A new password should not be generated until it is confirmed, regardless of the security of the terminal."
      },
      {
        "id": 4,
        "pregunta": "[Caso Spectertainment] ¿Qué política debe asegurar Spectertainment que esté vigente ante el hallazgo de dispositivos personales conectados a la VPN?",
        "preguntaEn": "[Spectertainment Case] What policy should Spectertainment ensure is in place upon finding personal devices connected to the VPN?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Política de acceso remoto (ya existe, pero no cubre dispositivos personales)"
          },
          {
            "id": "b",
            "texto": "Política de uso aceptable"
          },
          {
            "id": "c",
            "texto": "Política de control de cambios"
          },
          {
            "id": "d",
            "texto": "Política de control de acceso"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Remote access policy (already exists but does not cover personal devices)"
          },
          {
            "id": "b",
            "texto": "Acceptable use policy"
          },
          {
            "id": "c",
            "texto": "Change control policy"
          },
          {
            "id": "d",
            "texto": "Access control policy"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "A. Spectertainment cuenta con una política de acceso remoto que describe los métodos aprobados para conectarse de forma remota a los recursos internos, pero no aborda el uso de dispositivos personales. B. Una política de uso aceptable describe lo que los empleados aceptan al utilizar y acceder a los activos de la organización. Confirmaría si se permite el uso de dispositivos personales y también puede incluir una política de Traiga Su Propio Dispositivo (BYOD) para codificar aún más su uso. C. Las políticas de control de cambios son necesarias al realizar cambios en los sistemas de TI, pero no son el control más importante en este contexto. D. Las políticas de control de acceso son necesarias para garantizar que los empleados comprendan cómo acceder a los sistemas, pero no son el control más importante ante este hallazgo.",
        "justificacionEn": "A. Spectertainment has a remote access policy in place that outlines the approved methods for remotely connecting to internal resources but does not address the use of personal devices. B. An acceptable use policy outlines what employees agree to when using and accessing organizational assets. It would confirm whether the use of personal devices is allowed and may also include a Bring Your Own Device (BYOD) policy to further codify their use. C. Change control policies are required when making changes to IT systems. While some changes may need to be submitted based on any changes needed to support BYOD, it is not the most important control. D. Access control policies are required to ensure employees understand how to access systems. While changes to the access control policy may need to be made to support BYOD, it is not the most important control."
      },
      {
        "id": 5,
        "pregunta": "[Caso Spectertainment] ¿Por qué elegiría Spectertainment apoyar el uso de dispositivos personales en lugar de prohibirlo?",
        "preguntaEn": "[Spectertainment Case] Why would Spectertainment choose to support the use of personal devices rather than prohibit them?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Mayor productividad del empleado"
          },
          {
            "id": "b",
            "texto": "No facilita la terminación de accesos"
          },
          {
            "id": "c",
            "texto": "Mayor ahorro de costos"
          },
          {
            "id": "d",
            "texto": "No implica mayor concienciación de seguridad"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increased employee productivity"
          },
          {
            "id": "b",
            "texto": "It does not facilitate termination of access"
          },
          {
            "id": "c",
            "texto": "Increased cost savings"
          },
          {
            "id": "d",
            "texto": "It does not imply increased security awareness"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "A. Las políticas de BYOD han demostrado un aumento en la productividad y la satisfacción de los empleados. B. El uso de BYOD puede hacer que sea más difícil dar por terminado el acceso de un empleado. C. Dado que los empleados utilizan sus propios dispositivos, BYOD puede ayudar a las organizaciones a aumentar su ahorro de costos. D. El uso de BYOD no indica que los empleados tengan una mayor conciencia del riesgo de seguridad que representa el uso de sus dispositivos personales para el trabajo.",
        "justificacionEn": "A. BYOD policies have shown increased productivity and employee satisfaction. B. BYOD use can make it more difficult to terminate employee access. C. Since employees are using their own devices, BYOD can help organizations increase their cost savings. D. The use of BYOD does not indicate that employees have increased awareness of the security risk posed by their use of their personal devices for work."
      }
    ]
  },
  "deepseek": {
    "1": [
      {
        "id": 1,
        "pregunta": "Un auditor de SI está planificando una auditoría de una aplicación crítica. ¿Cuál de las siguientes actividades debe realizarse PRIMERO?",
        "preguntaEn": "An IS auditor is planning an audit of a critical application. Which of the following activities should be performed FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisar los papeles de trabajo de auditorías anteriores"
          },
          {
            "id": "b",
            "texto": "Realizar una evaluación de riesgos del área a auditar"
          },
          {
            "id": "c",
            "texto": "Entrevistar al personal clave del departamento de TI"
          },
          {
            "id": "d",
            "texto": "Revisar las políticas y procedimientos de seguridad de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Review working papers from previous audits"
          },
          {
            "id": "b",
            "texto": "Perform a risk assessment of the area to be audited"
          },
          {
            "id": "c",
            "texto": "Interview key IT department personnel"
          },
          {
            "id": "d",
            "texto": "Review IT security policies and procedures"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "Durante una auditoría, un auditor de SI descubre que los programadores tienen acceso directo a la biblioteca de producción. ¿Cuál debería ser la preocupación PRINCIPAL del auditor?",
        "preguntaEn": "During an audit, an IS auditor discovers that programmers have direct access to the production library. What should be the auditor's PRIMARY concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El costo de implementar controles adicionales de acceso"
          },
          {
            "id": "b",
            "texto": "La posibilidad de cambios no autorizados en el código de producción"
          },
          {
            "id": "c",
            "texto": "La velocidad de implementación de cambios de emergencia"
          },
          {
            "id": "d",
            "texto": "La satisfacción del personal de desarrollo con los procesos actuales"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The cost of implementing additional access controls"
          },
          {
            "id": "b",
            "texto": "The possibility of unauthorized changes to production code"
          },
          {
            "id": "c",
            "texto": "The speed of implementing emergency changes"
          },
          {
            "id": "d",
            "texto": "Development staff satisfaction with current processes"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Un auditor de SI está evaluando el riesgo de auditoría. ¿Cuál de los siguientes tipos de riesgo NO puede ser controlado directamente por el auditor?",
        "preguntaEn": "An IS auditor is evaluating audit risk. Which of the following types of risk CANNOT be directly controlled by the auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo de detección"
          },
          {
            "id": "b",
            "texto": "Riesgo inherente"
          },
          {
            "id": "c",
            "texto": "Riesgo de muestreo"
          },
          {
            "id": "d",
            "texto": "Riesgo de control"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Detection risk"
          },
          {
            "id": "b",
            "texto": "Inherent risk"
          },
          {
            "id": "c",
            "texto": "Sampling risk"
          },
          {
            "id": "d",
            "texto": "Control risk"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Al revisar un programa de auditoría basado en riesgos, ¿cuál de los siguientes elementos es MÁS importante incluir?",
        "preguntaEn": "When reviewing a risk-based audit program, which of the following elements is MOST important to include?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Lista de todo el personal de TI a entrevistar"
          },
          {
            "id": "b",
            "texto": "Procedimientos específicos para probar controles clave"
          },
          {
            "id": "c",
            "texto": "Cronograma detallado de todas las actividades sociales"
          },
          {
            "id": "d",
            "texto": "Inventario completo de todo el hardware de la organización"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "List of all IT personnel to interview"
          },
          {
            "id": "b",
            "texto": "Specific procedures for testing key controls"
          },
          {
            "id": "c",
            "texto": "Detailed schedule of all social activities"
          },
          {
            "id": "d",
            "texto": "Complete inventory of all organizational hardware"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "¿Cuál de los siguientes es el objetivo PRINCIPAL de un comité de dirección de TI (IT Steering Committee)?",
        "preguntaEn": "Which of the following is the PRIMARY objective of an IT Steering Committee?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Desarrollar código de aplicaciones críticas"
          },
          {
            "id": "b",
            "texto": "Asegurar la alineación de TI con los objetivos del negocio"
          },
          {
            "id": "c",
            "texto": "Realizar auditorías técnicas de infraestructura"
          },
          {
            "id": "d",
            "texto": "Gestionar las operaciones diarias del centro de datos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Develop critical application code"
          },
          {
            "id": "b",
            "texto": "Ensure IT alignment with business objectives"
          },
          {
            "id": "c",
            "texto": "Perform technical infrastructure audits"
          },
          {
            "id": "d",
            "texto": "Manage daily data center operations"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "Una organización está implementando un programa de gestión de riesgos empresariales (ERM). ¿Cuál de los siguientes debe ser el PRIMER paso?",
        "preguntaEn": "An organization is implementing an enterprise risk management (ERM) program. Which of the following should be the FIRST step?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Implementar controles técnicos de seguridad"
          },
          {
            "id": "b",
            "texto": "Establecer el apetito de riesgo de la organización"
          },
          {
            "id": "c",
            "texto": "Contratar personal especializado en riesgos"
          },
          {
            "id": "d",
            "texto": "Adquirir software de gestión de riesgos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Implement technical security controls"
          },
          {
            "id": "b",
            "texto": "Establish the organization risk appetite"
          },
          {
            "id": "c",
            "texto": "Hire specialized risk personnel"
          },
          {
            "id": "d",
            "texto": "Acquire risk management software"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "¿Cuál de las siguientes métricas es MÁS apropiada para medir la efectividad de la gobernanza de TI?",
        "preguntaEn": "Which of the following metrics is MOST appropriate for measuring IT governance effectiveness?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Número de incidentes de seguridad reportados"
          },
          {
            "id": "b",
            "texto": "Porcentaje de proyectos de TI completados a tiempo y dentro del presupuesto"
          },
          {
            "id": "c",
            "texto": "Cantidad de servidores administrados por el equipo de TI"
          },
          {
            "id": "d",
            "texto": "Número de tickets de help desk resueltos diariamente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Number of reported security incidents"
          },
          {
            "id": "b",
            "texto": "Percentage of IT projects completed on time and within budget"
          },
          {
            "id": "c",
            "texto": "Number of servers managed by the IT team"
          },
          {
            "id": "d",
            "texto": "Number of help desk tickets resolved daily"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "En el modelo de Tres Líneas del IIA, ¿cuál es la responsabilidad PRINCIPAL de la segunda línea de defensa?",
        "preguntaEn": "In the IIA Three Lines Model, what is the PRIMARY responsibility of the second line of defense?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ejecutar controles operativos diarios"
          },
          {
            "id": "b",
            "texto": "Proporcionar aseguramiento independiente"
          },
          {
            "id": "c",
            "texto": "Monitorear y supervisar los riesgos y controles"
          },
          {
            "id": "d",
            "texto": "Gestionar las operaciones de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Execute daily operational controls"
          },
          {
            "id": "b",
            "texto": "Provide independent assurance"
          },
          {
            "id": "c",
            "texto": "Monitor and oversee risks and controls"
          },
          {
            "id": "d",
            "texto": "Manage IT operations"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "Durante la fase de análisis de factibilidad de un proyecto de sistema, ¿cuál de los siguientes factores es MÁS importante considerar?",
        "preguntaEn": "During the feasibility analysis phase of a system project, which of the following factors is MOST important to consider?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La preferencia del equipo de desarrollo por una tecnología específica"
          },
          {
            "id": "b",
            "texto": "El retorno de inversión proyectado y los beneficios del negocio"
          },
          {
            "id": "c",
            "texto": "La disponibilidad de personal de TI para trabajar horas extras"
          },
          {
            "id": "d",
            "texto": "La compatibilidad con sistemas heredados únicamente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The development team preference for a specific technology"
          },
          {
            "id": "b",
            "texto": "Projected return on investment and business benefits"
          },
          {
            "id": "c",
            "texto": "Availability of IT staff to work overtime"
          },
          {
            "id": "d",
            "texto": "Compatibility with legacy systems only"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "En un proyecto de desarrollo ágil, ¿cuál de los siguientes controles es MÁS importante para mantener la seguridad de la aplicación?",
        "preguntaEn": "In an agile development project, which of the following controls is MOST important to maintain application security?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Documentación exhaustiva de todos los requisitos desde el inicio"
          },
          {
            "id": "b",
            "texto": "Integración de prácticas de seguridad en cada iteración del desarrollo"
          },
          {
            "id": "c",
            "texto": "Aprobación formal del comité de dirección antes de cada sprint"
          },
          {
            "id": "d",
            "texto": "Pruebas de seguridad únicamente antes del lanzamiento final"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Comprehensive documentation of all requirements upfront"
          },
          {
            "id": "b",
            "texto": "Integrating security practices into each development iteration"
          },
          {
            "id": "c",
            "texto": "Formal steering committee approval before each sprint"
          },
          {
            "id": "d",
            "texto": "Security testing only prior to final release"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "2": [
      {
        "id": 11,
        "pregunta": "Un auditor de SI está revisando la implementación de un nuevo sistema ERP. ¿Cuál de los siguientes sería el MAYOR riesgo si se descubre durante la fase de pruebas?",
        "preguntaEn": "An IS auditor is reviewing the implementation of a new ERP system. Which of the following would be the GREATEST risk if discovered during testing?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los usuarios no han recibido capacitación completa"
          },
          {
            "id": "b",
            "texto": "No se han probado los procedimientos de recuperación ante desastres"
          },
          {
            "id": "c",
            "texto": "Los informes gerenciales no tienen el formato preferido por la gerencia"
          },
          {
            "id": "d",
            "texto": "El sistema no cumple con todas las preferencias de interfaz de usuario"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Users have not received complete training"
          },
          {
            "id": "b",
            "texto": "Disaster recovery procedures have not been tested"
          },
          {
            "id": "c",
            "texto": "Management reports do not have management preferred format"
          },
          {
            "id": "d",
            "texto": "The system does not meet all user interface preferences"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "En el contexto de la gestión de cambios, ¿cuál de los siguientes controles es MÁS efectivo para prevenir cambios no autorizados en producción?",
        "preguntaEn": "In the context of change management, which of the following controls is MOST effective in preventing unauthorized changes in production?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Realizar copias de seguridad diarias del sistema"
          },
          {
            "id": "b",
            "texto": "Implementar separación de funciones entre desarrollo y producción"
          },
          {
            "id": "c",
            "texto": "Documentar todos los cambios en una bitácora"
          },
          {
            "id": "d",
            "texto": "Notificar a los usuarios sobre los cambios planificados"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Performing daily system backups"
          },
          {
            "id": "b",
            "texto": "Implementing segregation of duties between development and production"
          },
          {
            "id": "c",
            "texto": "Documenting all changes in a log"
          },
          {
            "id": "d",
            "texto": "Notifying users about scheduled changes"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "Una organización está determinando su estrategia de recuperación ante desastres. Si el RTO (Recovery Time Objective) es de 2 horas, ¿cuál es la solución MÁS apropiada?",
        "preguntaEn": "An organization is determining its disaster recovery strategy. If the RTO (Recovery Time Objective) is 2 hours, which solution is MOST appropriate?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Sitio frío con restauración desde cintas de respaldo"
          },
          {
            "id": "b",
            "texto": "Sitio caliente con replicación de datos en tiempo real"
          },
          {
            "id": "c",
            "texto": "Acuerdo recíproco con otra organización"
          },
          {
            "id": "d",
            "texto": "Centro de datos móvil con configuración bajo demanda"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Cold site with restoration from backup tapes"
          },
          {
            "id": "b",
            "texto": "Hot site with real-time data replication"
          },
          {
            "id": "c",
            "texto": "Reciprocal agreement with another organization"
          },
          {
            "id": "d",
            "texto": "Mobile data center with on-demand configuration"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "¿Cuál de los siguientes es el propósito PRINCIPAL de un Análisis de Impacto al Negocio (BIA)?",
        "preguntaEn": "Which of the following is the PRIMARY purpose of a Business Impact Analysis (BIA)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Identificar vulnerabilidades técnicas en la infraestructura"
          },
          {
            "id": "b",
            "texto": "Determinar los recursos críticos y los tiempos de recuperación aceptables"
          },
          {
            "id": "c",
            "texto": "Evaluar el desempeño del personal de TI"
          },
          {
            "id": "d",
            "texto": "Calcular el costo total de propiedad de los activos de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Identify technical vulnerabilities in infrastructure"
          },
          {
            "id": "b",
            "texto": "Determine critical resources and acceptable recovery times"
          },
          {
            "id": "c",
            "texto": "Evaluate IT staff performance"
          },
          {
            "id": "d",
            "texto": "Calculate total cost of ownership of IT assets"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "Durante una auditoría de operaciones de TI, el auditor nota que los operadores pueden acceder a los logs del sistema y modificarlos. ¿Cuál es la preocupación PRINCIPAL?",
        "preguntaEn": "During an audit of IT operations, the auditor notes that operators can access and modify system logs. What is the PRIMARY concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los operadores podrían eliminar evidencia de actividades maliciosas"
          },
          {
            "id": "b",
            "texto": "Los operadores podrían mejorar el rendimiento del sistema"
          },
          {
            "id": "c",
            "texto": "Los operadores podrían optimizar el uso del almacenamiento"
          },
          {
            "id": "d",
            "texto": "Los operadores podrían facilitar el mantenimiento del sistema"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Operators could delete evidence of malicious activities"
          },
          {
            "id": "b",
            "texto": "Operators could improve system performance"
          },
          {
            "id": "c",
            "texto": "Operators could optimize storage usage"
          },
          {
            "id": "d",
            "texto": "Operators could facilitate system maintenance"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "¿Cuál de las siguientes es la MEJOR práctica para la gestión de parches de seguridad en servidores críticos?",
        "preguntaEn": "Which of the following is the BEST practice for security patch management on critical servers?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aplicar todos los parches inmediatamente al ser liberados"
          },
          {
            "id": "b",
            "texto": "Probar los parches en un entorno de desarrollo antes de producción"
          },
          {
            "id": "c",
            "texto": "Esperar seis meses antes de aplicar cualquier parche"
          },
          {
            "id": "d",
            "texto": "Aplicar parches solo cuando ocurra un incidente de seguridad"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Applying all patches immediately upon release"
          },
          {
            "id": "b",
            "texto": "Testing patches in a development environment prior to production"
          },
          {
            "id": "c",
            "texto": "Waiting six months before applying any patch"
          },
          {
            "id": "d",
            "texto": "Applying patches only when a security incident occurs"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "Una organización está implementando autenticación multifactor (MFA). ¿Cuál de las siguientes combinaciones proporciona la MAYOR seguridad?",
        "preguntaEn": "An organization is implementing multi-factor authentication (MFA). Which of the following combinations provides the GREATEST security?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Contraseña + Pregunta de seguridad"
          },
          {
            "id": "b",
            "texto": "Contraseña + Token de hardware"
          },
          {
            "id": "c",
            "texto": "PIN + Contraseña"
          },
          {
            "id": "d",
            "texto": "Nombre de usuario + Contraseña"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Password + Security question"
          },
          {
            "id": "b",
            "texto": "Password + Hardware token"
          },
          {
            "id": "c",
            "texto": "PIN + Password"
          },
          {
            "id": "d",
            "texto": "Username + Password"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "¿Cuál de los siguientes ataques es MÁS difícil de detectar mediante un sistema de detección de intrusiones (IDS) basado en firmas?",
        "preguntaEn": "Which of the following attacks is MOST difficult to detect using a signature-based intrusion detection system (IDS)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ataque de fuerza bruta contra contraseñas"
          },
          {
            "id": "b",
            "texto": "Ataque de día cero (zero-day)"
          },
          {
            "id": "c",
            "texto": "Escaneo de puertos conocido"
          },
          {
            "id": "d",
            "texto": "Ataque de denegación de servicio volumétrico"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Brute-force password attack"
          },
          {
            "id": "b",
            "texto": "Zero-day attack"
          },
          {
            "id": "c",
            "texto": "Known port scan"
          },
          {
            "id": "d",
            "texto": "Volumetric denial of service attack"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "En el contexto de la gestión de identidades, ¿cuál de los siguientes es el principio de MENOR privilegio?",
        "preguntaEn": "In the context of identity management, which of the following describes the principle of LEAST privilege?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Otorgar a los usuarios todos los permisos que podrían necesitar"
          },
          {
            "id": "b",
            "texto": "Otorgar a los usuarios solo los permisos necesarios para realizar sus funciones"
          },
          {
            "id": "c",
            "texto": "Otorgar permisos basados en la antigüedad del empleado"
          },
          {
            "id": "d",
            "texto": "Otorgar permisos temporales que expiran cada año"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Granting users all permissions they might ever need"
          },
          {
            "id": "b",
            "texto": "Granting users only permissions necessary to perform their duties"
          },
          {
            "id": "c",
            "texto": "Granting permissions based on employee tenure"
          },
          {
            "id": "d",
            "texto": "Granting temporary permissions that expire annually"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "Una organización está implementando cifrado para datos en reposo. ¿Cuál de los siguientes es el MAYOR desafío?",
        "preguntaEn": "An organization is implementing encryption for data at rest. Which of the following is the GREATEST challenge?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El costo del hardware de cifrado"
          },
          {
            "id": "b",
            "texto": "La gestión segura de las claves de cifrado"
          },
          {
            "id": "c",
            "texto": "La velocidad de transmisión de datos"
          },
          {
            "id": "d",
            "texto": "La compatibilidad con aplicaciones antiguas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The cost of encryption hardware"
          },
          {
            "id": "b",
            "texto": "Secure management of encryption keys"
          },
          {
            "id": "c",
            "texto": "Data transmission speed"
          },
          {
            "id": "d",
            "texto": "Compatibility with legacy applications"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "3": [
      {
        "id": 1,
        "pregunta": "Un auditor de SI está planificando una auditoría de una aplicación crítica. ¿Cuál de las siguientes actividades debe realizarse PRIMERO?",
        "preguntaEn": "An IS auditor is planning an audit of a critical application. Which of the following activities should be performed FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisar los papeles de trabajo de auditorías anteriores"
          },
          {
            "id": "b",
            "texto": "Realizar una evaluación de riesgos del área a auditar"
          },
          {
            "id": "c",
            "texto": "Entrevistar al personal clave del departamento de TI"
          },
          {
            "id": "d",
            "texto": "Revisar las políticas y procedimientos de seguridad de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Review working papers from previous audits"
          },
          {
            "id": "b",
            "texto": "Perform a risk assessment of the area to be audited"
          },
          {
            "id": "c",
            "texto": "Interview key IT department personnel"
          },
          {
            "id": "d",
            "texto": "Review IT security policies and procedures"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "Durante una auditoría, un auditor de SI descubre que los programadores tienen acceso directo a la biblioteca de producción. ¿Cuál debería ser la preocupación PRINCIPAL del auditor?",
        "preguntaEn": "During an audit, an IS auditor discovers that programmers have direct access to the production library. What should be the auditor's PRIMARY concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El costo de implementar controles adicionales de acceso"
          },
          {
            "id": "b",
            "texto": "La posibilidad de cambios no autorizados en el código de producción"
          },
          {
            "id": "c",
            "texto": "La velocidad de implementación de cambios de emergencia"
          },
          {
            "id": "d",
            "texto": "La satisfacción del personal de desarrollo con los procesos actuales"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The cost of implementing additional access controls"
          },
          {
            "id": "b",
            "texto": "The possibility of unauthorized changes to production code"
          },
          {
            "id": "c",
            "texto": "The speed of implementing emergency changes"
          },
          {
            "id": "d",
            "texto": "Development staff satisfaction with current processes"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Un auditor de SI está evaluando el riesgo de auditoría. ¿Cuál de los siguientes tipos de riesgo NO puede ser controlado directamente por el auditor?",
        "preguntaEn": "An IS auditor is evaluating audit risk. Which of the following types of risk CANNOT be directly controlled by the auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo de detección"
          },
          {
            "id": "b",
            "texto": "Riesgo inherente"
          },
          {
            "id": "c",
            "texto": "Riesgo de muestreo"
          },
          {
            "id": "d",
            "texto": "Riesgo de control"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Detection risk"
          },
          {
            "id": "b",
            "texto": "Inherent risk"
          },
          {
            "id": "c",
            "texto": "Sampling risk"
          },
          {
            "id": "d",
            "texto": "Control risk"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Al revisar un programa de auditoría basado en riesgos, ¿cuál de los siguientes elementos es MÁS importante incluir?",
        "preguntaEn": "When reviewing a risk-based audit program, which of the following elements is MOST important to include?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Lista de todo el personal de TI a entrevistar"
          },
          {
            "id": "b",
            "texto": "Procedimientos específicos para probar controles clave"
          },
          {
            "id": "c",
            "texto": "Cronograma detallado de todas las actividades sociales"
          },
          {
            "id": "d",
            "texto": "Inventario completo de todo el hardware de la organización"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "List of all IT personnel to interview"
          },
          {
            "id": "b",
            "texto": "Specific procedures for testing key controls"
          },
          {
            "id": "c",
            "texto": "Detailed schedule of all social activities"
          },
          {
            "id": "d",
            "texto": "Complete inventory of all organizational hardware"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "¿Cuál de los siguientes es el objetivo PRINCIPAL de un comité de dirección de TI (IT Steering Committee)?",
        "preguntaEn": "Which of the following is the PRIMARY objective of an IT Steering Committee?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Desarrollar código de aplicaciones críticas"
          },
          {
            "id": "b",
            "texto": "Asegurar la alineación de TI con los objetivos del negocio"
          },
          {
            "id": "c",
            "texto": "Realizar auditorías técnicas de infraestructura"
          },
          {
            "id": "d",
            "texto": "Gestionar las operaciones diarias del centro de datos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Develop critical application code"
          },
          {
            "id": "b",
            "texto": "Ensure IT alignment with business objectives"
          },
          {
            "id": "c",
            "texto": "Perform technical infrastructure audits"
          },
          {
            "id": "d",
            "texto": "Manage daily data center operations"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "Una organización está implementando un programa de gestión de riesgos empresariales (ERM). ¿Cuál de los siguientes debe ser el PRIMER paso?",
        "preguntaEn": "An organization is implementing an enterprise risk management (ERM) program. Which of the following should be the FIRST step?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Implementar controles técnicos de seguridad"
          },
          {
            "id": "b",
            "texto": "Establecer el apetito de riesgo de la organización"
          },
          {
            "id": "c",
            "texto": "Contratar personal especializado en riesgos"
          },
          {
            "id": "d",
            "texto": "Adquirir software de gestión de riesgos"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Implement technical security controls"
          },
          {
            "id": "b",
            "texto": "Establish the organization risk appetite"
          },
          {
            "id": "c",
            "texto": "Hire specialized risk personnel"
          },
          {
            "id": "d",
            "texto": "Acquire risk management software"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "¿Cuál de las siguientes métricas es MÁS apropiada para medir la efectividad de la gobernanza de TI?",
        "preguntaEn": "Which of the following metrics is MOST appropriate for measuring IT governance effectiveness?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Número de incidentes de seguridad reportados"
          },
          {
            "id": "b",
            "texto": "Porcentaje de proyectos de TI completados a tiempo y dentro del presupuesto"
          },
          {
            "id": "c",
            "texto": "Cantidad de servidores administrados por el equipo de TI"
          },
          {
            "id": "d",
            "texto": "Número de tickets de help desk resueltos diariamente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Number of reported security incidents"
          },
          {
            "id": "b",
            "texto": "Percentage of IT projects completed on time and within budget"
          },
          {
            "id": "c",
            "texto": "Number of servers managed by the IT team"
          },
          {
            "id": "d",
            "texto": "Number of help desk tickets resolved daily"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "En el modelo de Tres Líneas del IIA, ¿cuál es la responsabilidad PRINCIPAL de la segunda línea de defensa?",
        "preguntaEn": "In the IIA Three Lines Model, what is the PRIMARY responsibility of the second line of defense?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ejecutar controles operativos diarios"
          },
          {
            "id": "b",
            "texto": "Proporcionar aseguramiento independiente"
          },
          {
            "id": "c",
            "texto": "Monitorear y supervisar los riesgos y controles"
          },
          {
            "id": "d",
            "texto": "Gestionar las operaciones de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Execute daily operational controls"
          },
          {
            "id": "b",
            "texto": "Provide independent assurance"
          },
          {
            "id": "c",
            "texto": "Monitor and oversee risks and controls"
          },
          {
            "id": "d",
            "texto": "Manage IT operations"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "Durante la fase de análisis de factibilidad de un proyecto de sistema, ¿cuál de los siguientes factores es MÁS importante considerar?",
        "preguntaEn": "During the feasibility analysis phase of a system project, which of the following factors is MOST important to consider?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La preferencia del equipo de desarrollo por una tecnología específica"
          },
          {
            "id": "b",
            "texto": "El retorno de inversión proyectado y los beneficios del negocio"
          },
          {
            "id": "c",
            "texto": "La disponibilidad de personal de TI para trabajar horas extras"
          },
          {
            "id": "d",
            "texto": "La compatibilidad con sistemas heredados únicamente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The development team preference for a specific technology"
          },
          {
            "id": "b",
            "texto": "Projected return on investment and business benefits"
          },
          {
            "id": "c",
            "texto": "Availability of IT staff to work overtime"
          },
          {
            "id": "d",
            "texto": "Compatibility with legacy systems only"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "En un proyecto de desarrollo ágil, ¿cuál de los siguientes controles es MÁS importante para mantener la seguridad de la aplicación?",
        "preguntaEn": "In an agile development project, which of the following controls is MOST important to maintain application security?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Documentación exhaustiva de todos los requisitos desde el inicio"
          },
          {
            "id": "b",
            "texto": "Integración de prácticas de seguridad en cada iteración del desarrollo"
          },
          {
            "id": "c",
            "texto": "Aprobación formal del comité de dirección antes de cada sprint"
          },
          {
            "id": "d",
            "texto": "Pruebas de seguridad únicamente antes del lanzamiento final"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Comprehensive documentation of all requirements upfront"
          },
          {
            "id": "b",
            "texto": "Integrating security practices into each development iteration"
          },
          {
            "id": "c",
            "texto": "Formal steering committee approval before each sprint"
          },
          {
            "id": "d",
            "texto": "Security testing only prior to final release"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 11,
        "pregunta": "Un auditor de SI está revisando la implementación de un nuevo sistema ERP. ¿Cuál de los siguientes sería el MAYOR riesgo si se descubre durante la fase de pruebas?",
        "preguntaEn": "An IS auditor is reviewing the implementation of a new ERP system. Which of the following would be the GREATEST risk if discovered during testing?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los usuarios no han recibido capacitación completa"
          },
          {
            "id": "b",
            "texto": "No se han probado los procedimientos de recuperación ante desastres"
          },
          {
            "id": "c",
            "texto": "Los informes gerenciales no tienen el formato preferido por la gerencia"
          },
          {
            "id": "d",
            "texto": "El sistema no cumple con todas las preferencias de interfaz de usuario"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Users have not received complete training"
          },
          {
            "id": "b",
            "texto": "Disaster recovery procedures have not been tested"
          },
          {
            "id": "c",
            "texto": "Management reports do not have management preferred format"
          },
          {
            "id": "d",
            "texto": "The system does not meet all user interface preferences"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "En el contexto de la gestión de cambios, ¿cuál de los siguientes controles es MÁS efectivo para prevenir cambios no autorizados en producción?",
        "preguntaEn": "In the context of change management, which of the following controls is MOST effective in preventing unauthorized changes in production?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Realizar copias de seguridad diarias del sistema"
          },
          {
            "id": "b",
            "texto": "Implementar separación de funciones entre desarrollo y producción"
          },
          {
            "id": "c",
            "texto": "Documentar todos los cambios en una bitácora"
          },
          {
            "id": "d",
            "texto": "Notificar a los usuarios sobre los cambios planificados"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Performing daily system backups"
          },
          {
            "id": "b",
            "texto": "Implementing segregation of duties between development and production"
          },
          {
            "id": "c",
            "texto": "Documenting all changes in a log"
          },
          {
            "id": "d",
            "texto": "Notifying users about scheduled changes"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "Una organización está determinando su estrategia de recuperación ante desastres. Si el RTO (Recovery Time Objective) es de 2 horas, ¿cuál es la solución MÁS apropiada?",
        "preguntaEn": "An organization is determining its disaster recovery strategy. If the RTO (Recovery Time Objective) is 2 hours, which solution is MOST appropriate?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Sitio frío con restauración desde cintas de respaldo"
          },
          {
            "id": "b",
            "texto": "Sitio caliente con replicación de datos en tiempo real"
          },
          {
            "id": "c",
            "texto": "Acuerdo recíproco con otra organización"
          },
          {
            "id": "d",
            "texto": "Centro de datos móvil con configuración bajo demanda"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Cold site with restoration from backup tapes"
          },
          {
            "id": "b",
            "texto": "Hot site with real-time data replication"
          },
          {
            "id": "c",
            "texto": "Reciprocal agreement with another organization"
          },
          {
            "id": "d",
            "texto": "Mobile data center with on-demand configuration"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "¿Cuál de los siguientes es el propósito PRINCIPAL de un Análisis de Impacto al Negocio (BIA)?",
        "preguntaEn": "Which of the following is the PRIMARY purpose of a Business Impact Analysis (BIA)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Identificar vulnerabilidades técnicas en la infraestructura"
          },
          {
            "id": "b",
            "texto": "Determinar los recursos críticos y los tiempos de recuperación aceptables"
          },
          {
            "id": "c",
            "texto": "Evaluar el desempeño del personal de TI"
          },
          {
            "id": "d",
            "texto": "Calcular el costo total de propiedad de los activos de TI"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Identify technical vulnerabilities in infrastructure"
          },
          {
            "id": "b",
            "texto": "Determine critical resources and acceptable recovery times"
          },
          {
            "id": "c",
            "texto": "Evaluate IT staff performance"
          },
          {
            "id": "d",
            "texto": "Calculate total cost of ownership of IT assets"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "Durante una auditoría de operaciones de TI, el auditor nota que los operadores pueden acceder a los logs del sistema y modificarlos. ¿Cuál es la preocupación PRINCIPAL?",
        "preguntaEn": "During an audit of IT operations, the auditor notes that operators can access and modify system logs. What is the PRIMARY concern?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los operadores podrían eliminar evidencia de actividades maliciosas"
          },
          {
            "id": "b",
            "texto": "Los operadores podrían mejorar el rendimiento del sistema"
          },
          {
            "id": "c",
            "texto": "Los operadores podrían optimizar el uso del almacenamiento"
          },
          {
            "id": "d",
            "texto": "Los operadores podrían facilitar el mantenimiento del sistema"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Operators could delete evidence of malicious activities"
          },
          {
            "id": "b",
            "texto": "Operators could improve system performance"
          },
          {
            "id": "c",
            "texto": "Operators could optimize storage usage"
          },
          {
            "id": "d",
            "texto": "Operators could facilitate system maintenance"
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "¿Cuál de las siguientes es la MEJOR práctica para la gestión de parches de seguridad en servidores críticos?",
        "preguntaEn": "Which of the following is the BEST practice for security patch management on critical servers?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aplicar todos los parches inmediatamente al ser liberados"
          },
          {
            "id": "b",
            "texto": "Probar los parches en un entorno de desarrollo antes de producción"
          },
          {
            "id": "c",
            "texto": "Esperar seis meses antes de aplicar cualquier parche"
          },
          {
            "id": "d",
            "texto": "Aplicar parches solo cuando ocurra un incidente de seguridad"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Applying all patches immediately upon release"
          },
          {
            "id": "b",
            "texto": "Testing patches in a development environment prior to production"
          },
          {
            "id": "c",
            "texto": "Waiting six months before applying any patch"
          },
          {
            "id": "d",
            "texto": "Applying patches only when a security incident occurs"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "Una organización está implementando autenticación multifactor (MFA). ¿Cuál de las siguientes combinaciones proporciona la MAYOR seguridad?",
        "preguntaEn": "An organization is implementing multi-factor authentication (MFA). Which of the following combinations provides the GREATEST security?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Contraseña + Pregunta de seguridad"
          },
          {
            "id": "b",
            "texto": "Contraseña + Token de hardware"
          },
          {
            "id": "c",
            "texto": "PIN + Contraseña"
          },
          {
            "id": "d",
            "texto": "Nombre de usuario + Contraseña"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Password + Security question"
          },
          {
            "id": "b",
            "texto": "Password + Hardware token"
          },
          {
            "id": "c",
            "texto": "PIN + Password"
          },
          {
            "id": "d",
            "texto": "Username + Password"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "¿Cuál de los siguientes ataques es MÁS difícil de detectar mediante un sistema de detección de intrusiones (IDS) basado en firmas?",
        "preguntaEn": "Which of the following attacks is MOST difficult to detect using a signature-based intrusion detection system (IDS)?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Ataque de fuerza bruta contra contraseñas"
          },
          {
            "id": "b",
            "texto": "Ataque de día cero (zero-day)"
          },
          {
            "id": "c",
            "texto": "Escaneo de puertos conocido"
          },
          {
            "id": "d",
            "texto": "Ataque de denegación de servicio volumétrico"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Brute-force password attack"
          },
          {
            "id": "b",
            "texto": "Zero-day attack"
          },
          {
            "id": "c",
            "texto": "Known port scan"
          },
          {
            "id": "d",
            "texto": "Volumetric denial of service attack"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "En el contexto de la gestión de identidades, ¿cuál de los siguientes es el principio de MENOR privilegio?",
        "preguntaEn": "In the context of identity management, which of the following describes the principle of LEAST privilege?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Otorgar a los usuarios todos los permisos que podrían necesitar"
          },
          {
            "id": "b",
            "texto": "Otorgar a los usuarios solo los permisos necesarios para realizar sus funciones"
          },
          {
            "id": "c",
            "texto": "Otorgar permisos basados en la antigüedad del empleado"
          },
          {
            "id": "d",
            "texto": "Otorgar permisos temporales que expiran cada año"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Granting users all permissions they might ever need"
          },
          {
            "id": "b",
            "texto": "Granting users only permissions necessary to perform their duties"
          },
          {
            "id": "c",
            "texto": "Granting permissions based on employee tenure"
          },
          {
            "id": "d",
            "texto": "Granting temporary permissions that expire annually"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "Una organización está implementando cifrado para datos en reposo. ¿Cuál de los siguientes es el MAYOR desafío?",
        "preguntaEn": "An organization is implementing encryption for data at rest. Which of the following is the GREATEST challenge?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El costo del hardware de cifrado"
          },
          {
            "id": "b",
            "texto": "La gestión segura de las claves de cifrado"
          },
          {
            "id": "c",
            "texto": "La velocidad de transmisión de datos"
          },
          {
            "id": "d",
            "texto": "La compatibilidad con aplicaciones antiguas"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The cost of encryption hardware"
          },
          {
            "id": "b",
            "texto": "Secure management of encryption keys"
          },
          {
            "id": "c",
            "texto": "Data transmission speed"
          },
          {
            "id": "d",
            "texto": "Compatibility with legacy applications"
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      }
    ]
  },
  "gemini": {
    "1": [
      {
        "id": 1,
        "pregunta": "Un auditor de SI recién incorporado descubre que la organización nunca ha formalizado ni aprobado un estatuto de auditoría (audit charter). ¿Cuál debe ser su curso de acción INMEDIATO?",
        "preguntaEn": "A newly hired IS auditor discovers that the organization has never formalized or approved an audit charter. What should be their IMMEDIATE course of action?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Continuar ejecutando el cronograma de auditoría previamente acordado con la gerencia general."
          },
          {
            "id": "b",
            "texto": "Suspender de forma indefinida cualquier interacción con los dueños de procesos de negocio."
          },
          {
            "id": "c",
            "texto": "Elaborar el borrador del estatuto de auditoría y presentarlo a la junta directiva o comité de auditoría para su aprobación formal."
          },
          {
            "id": "d",
            "texto": "Limitar las actividades de auditoría a revisiones financieras sin involucrar sistemas de información."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Continue executing the audit schedule previously agreed upon with executive management."
          },
          {
            "id": "b",
            "texto": "Indefinitely suspend any interaction with business process owners."
          },
          {
            "id": "c",
            "texto": "Draft the audit charter and submit it to the board of directors or audit committee for formal approval."
          },
          {
            "id": "d",
            "texto": "Limit audit activities to financial reviews without involving information systems."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "Al planificar una auditoría sobre una plataforma transaccional en la nube, el auditor de SI evalúa la probabilidad y el impacto de pérdidas operacionales considerando que no existen controles internos ni salvaguardas implementadas. ¿Qué categoría de riesgo está valorando?",
        "preguntaEn": "When planning an audit of a cloud-based transactional platform, the IS auditor assesses the likelihood and impact of operational losses assuming no internal controls or safeguards are in place. What risk category is being assessed?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo residual"
          },
          {
            "id": "b",
            "texto": "Riesgo de control"
          },
          {
            "id": "c",
            "texto": "Riesgo de detección"
          },
          {
            "id": "d",
            "texto": "Riesgo inherente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Residual risk"
          },
          {
            "id": "b",
            "texto": "Control risk"
          },
          {
            "id": "c",
            "texto": "Detection risk"
          },
          {
            "id": "d",
            "texto": "Inherent risk"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Durante la evaluación de la gestión de cambios a programas en un entorno productivo, ¿cuál es el procedimiento de muestreo MÁS eficaz para identificar cambios no autorizados?",
        "preguntaEn": "During an evaluation of program change management in a production environment, what is the MOST effective sampling procedure to identify unauthorized changes?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Seleccionar una muestra aleatoria de solicitudes de cambio aprobadas en el sistema de tickets y rastrearlas hacia el entorno de producción."
          },
          {
            "id": "b",
            "texto": "Extraer la muestra a partir de los cambios detectados directamente en el código de producción y rastrearlos hacia la documentación de autorización previa."
          },
          {
            "id": "c",
            "texto": "Seleccionar solicitudes de cambio según la criticidad del sistema documentada en el inventario de aplicaciones."
          },
          {
            "id": "d",
            "texto": "Rastrear los cambios documentados en el plan de trabajo anual contra los incidentes reportados por usuarios finales."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Select a random sample of approved change requests in the ticketing system and trace them to the production environment."
          },
          {
            "id": "b",
            "texto": "Draw the sample from changes detected directly in production code and trace them back to prior authorization documentation."
          },
          {
            "id": "c",
            "texto": "Select change requests based on system criticality documented in the application inventory."
          },
          {
            "id": "d",
            "texto": "Trace changes documented in the annual work plan against incidents reported by end users."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Una entidad financiera adopta un programa de Autoevaluación de Controles (CSA) en sus áreas operativas. ¿Cuál debe ser el rol primordial del auditor de SI en este proceso?",
        "preguntaEn": "A financial institution adopts a Control Self-Assessment (CSA) program in its operational areas. What should be the primary role of the IS auditor in this process?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Diseñar y configurar directamente los controles compensatorios requeridos en las aplicaciones."
          },
          {
            "id": "b",
            "texto": "Facilitar los talleres y proporcionar guía metodológica a los dueños de los procesos de negocio."
          },
          {
            "id": "c",
            "texto": "Asumir la propiedad y rendición de cuentas sobre la efectividad de los controles evaluados."
          },
          {
            "id": "d",
            "texto": "Reemplazar a la gerencia en la toma de decisiones sobre mitigación de riesgos."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Directly design and configure required compensating controls in applications."
          },
          {
            "id": "b",
            "texto": "Facilitate workshops and provide methodological guidance to business process owners."
          },
          {
            "id": "c",
            "texto": "Assume ownership and accountability for the effectiveness of evaluated controls."
          },
          {
            "id": "d",
            "texto": "Replace management in risk mitigation decision-making."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "Al revisar la estructura de gobierno corporativo de TI, el auditor observa que los proyectos tecnológicos se ejecutan sin contar con un plan estratégico de TI formalizado. ¿Cuál es la consecuencia MÁS probable de esta situación?",
        "preguntaEn": "When reviewing the IT corporate governance structure, the auditor notes that technology projects are executed without a formalized IT strategic plan. What is the MOST likely consequence of this situation?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El personal técnico no podrá aplicar parches de seguridad en los servidores perimetrales."
          },
          {
            "id": "b",
            "texto": "Las inversiones y proyectos de TI perderán alineación con los objetivos del negocio y la entrega de valor."
          },
          {
            "id": "c",
            "texto": "Los acuerdos de nivel de servicio (SLA) con proveedores se cancelarán automáticamente."
          },
          {
            "id": "d",
            "texto": "Se incrementará el riesgo de muestreo durante las pruebas de auditoría continua."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Technical staff will be unable to apply security patches on perimeter servers."
          },
          {
            "id": "b",
            "texto": "IT investments and projects will lose alignment with business objectives and value delivery."
          },
          {
            "id": "c",
            "texto": "Service level agreements (SLAs) with vendors will be automatically canceled."
          },
          {
            "id": "d",
            "texto": "Sampling risk will increase during continuous audit testing."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "En una institución financiera mediana, el Gerente de Sistemas de Información reporta directamente al Director Financiero (CFO). Desde la perspectiva de gobernanza y control interno, ¿cuál es la MAYOR preocupación para el auditor de SI?",
        "preguntaEn": "In a mid-sized financial institution, the IS Manager reports directly to the Chief Financial Officer (CFO). From a governance and internal control perspective, what is the GREATEST concern for the IS auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que el CFO carezca de certificaciones técnicas en administración de bases de datos."
          },
          {
            "id": "b",
            "texto": "Que las decisiones y presupuestos de TI se subordinen a metas de costos contables a corto plazo, comprometiendo controles y proyectos de seguridad."
          },
          {
            "id": "c",
            "texto": "Que el comité de riesgos deje de reportar a la gerencia de operaciones."
          },
          {
            "id": "d",
            "texto": "Que los auditores externos deban ejecutar tareas de mesa de ayuda."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "That the CFO lacks technical certifications in database administration."
          },
          {
            "id": "b",
            "texto": "That IT decisions and budgets are subordinated to short-term accounting cost goals, compromising controls and security projects."
          },
          {
            "id": "c",
            "texto": "That the risk committee stops reporting to operations management."
          },
          {
            "id": "d",
            "texto": "That external auditors must perform help desk tasks."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "Un desarrollador necesita modificar registros transaccionales directamente en la base de datos de producción debido a un error de cálculo del aplicativo. ¿Quién debe autorizar formalmente este acceso de escritura?",
        "preguntaEn": "A developer needs to modify transactional records directly in the production database due to an application calculation error. Who must formally authorize this write access?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Administrador de Bases de Datos (DBA)"
          },
          {
            "id": "b",
            "texto": "El Líder Técnico de Desarrollo de Software"
          },
          {
            "id": "c",
            "texto": "El Dueño de los Datos de Negocio (Data Owner)"
          },
          {
            "id": "d",
            "texto": "El Operador de Consola del Centro de Cómputo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Database Administrator (DBA)"
          },
          {
            "id": "b",
            "texto": "The Technical Software Development Lead"
          },
          {
            "id": "c",
            "texto": "The Business Data Owner"
          },
          {
            "id": "d",
            "texto": "The Computer Center Console Operator"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "En una empresa pequeña donde resulta inviable contratar personal adicional para separar las funciones de programación y de operación de cómputo, ¿cuál es el MEJOR control compensatorio que el auditor debe recomendar?",
        "preguntaEn": "In a small company where hiring additional staff to separate programming and computer operation functions is unfeasible, what is the BEST compensating control the auditor should recommend?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Exigir la firma periódica de acuerdos de confidencialidad y ética profesional."
          },
          {
            "id": "b",
            "texto": "Implementar procesos independientes y periódicos que comparen el código autorizado con el código en producción para detectar cambios no autorizados."
          },
          {
            "id": "c",
            "texto": "Deshabilitar los puertos USB en las estaciones de trabajo de los desarrolladores."
          },
          {
            "id": "d",
            "texto": "Prohibir el uso de software de depuración en entornos de desarrollo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Requiring periodic signing of confidentiality and professional ethics agreements."
          },
          {
            "id": "b",
            "texto": "Implementing independent periodic processes that compare authorized code with production code to detect unauthorized changes."
          },
          {
            "id": "c",
            "texto": "Disabling USB ports on developer workstations."
          },
          {
            "id": "d",
            "texto": "Prohibiting debugging software in development environments."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "Para realizar pruebas de estrés de un nuevo sistema bancario, la gerencia entrega una copia de la base de datos productiva a un proveedor externo de pruebas. ¿Cuál es la preocupación PRIMARIA que el auditor de SI debe comunicar?",
        "preguntaEn": "To conduct stress testing on a new banking system, management provides a copy of the production database to an external testing vendor. What is the PRIMARY concern the IS auditor must report?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que el conjunto de datos no esté completamente actualizado con las transacciones del día."
          },
          {
            "id": "b",
            "texto": "Que no se hayan anonimizado ni saneado (sanitized) los datos sensibles y confidenciales de los clientes."
          },
          {
            "id": "c",
            "texto": "Que el tiempo de respuesta del enlace de pruebas supere las métricas acordadas en el contrato."
          },
          {
            "id": "d",
            "texto": "Que la muestra de prueba no incluya transacciones de años fiscales cerrados."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "That the dataset is not fully updated with current day transactions."
          },
          {
            "id": "b",
            "texto": "That sensitive and confidential customer data has not been sanitized or anonymized."
          },
          {
            "id": "c",
            "texto": "That test link response time exceeds contractually agreed metrics."
          },
          {
            "id": "d",
            "texto": "That the test sample does not include closed fiscal year transactions."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "Una organización ha finalizado las pruebas unitarias y de integración de su nuevo software de pagos y decide iniciar pruebas en paralelo junto al software antiguo. ¿Cuál es el propósito PRINCIPAL de este enfoque?",
        "preguntaEn": "An organization has completed unit and integration testing of its new payment software and decides to begin parallel testing alongside the legacy software. What is the MAIN purpose of this approach?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Reducir los costos de licenciamiento del software antiguo de manera anticipada."
          },
          {
            "id": "b",
            "texto": "Identificar fallos de sintaxis en los módulos de integración con el sistema operativo."
          },
          {
            "id": "c",
            "texto": "Asegurar que la implementación del nuevo sistema satisfaga los requisitos de negocio de los usuarios comparando sus resultados con el sistema anterior."
          },
          {
            "id": "d",
            "texto": "Probar la resistencia física de los servidores ante variaciones de voltaje."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Reducing legacy software licensing costs early."
          },
          {
            "id": "b",
            "texto": "Identifying syntax errors in operating system integration modules."
          },
          {
            "id": "c",
            "texto": "Ensuring that implementation of the new system satisfies user business requirements by comparing its outputs with the legacy system."
          },
          {
            "id": "d",
            "texto": "Testing physical server resilience against voltage fluctuations."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "2": [
      {
        "id": 11,
        "pregunta": "Durante la fase de codificación de un desarrollo en cascada, los usuarios solicitan continuas modificaciones que amenazan el cumplimiento del plazo y presupuesto acordados. ¿Qué control preventivo debió establecerse para mitigar este desvío (scope creep)?",
        "preguntaEn": "During the coding phase of a waterfall development project, users request continuous modifications that threaten the agreed-upon timeline and budget. Which preventive control should have been established to mitigate this scope creep?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El congelamiento formal del diseño mediante una línea base de software (software baselining) sujeta a control de cambios."
          },
          {
            "id": "b",
            "texto": "La adopción inmediata de metodologías de desarrollo ágil en medio de la fase de despliegue."
          },
          {
            "id": "c",
            "texto": "El incremento automático de horas extra para los programadores del proyecto."
          },
          {
            "id": "d",
            "texto": "La eliminación de las pruebas de aceptación de usuario (UAT)."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Formal design freezing through software baselining subject to change control."
          },
          {
            "id": "b",
            "texto": "Immediate adoption of agile development methodologies midway through deployment."
          },
          {
            "id": "c",
            "texto": "Automatic overtime increase for project programmers."
          },
          {
            "id": "d",
            "texto": "Elimination of user acceptance testing (UAT)."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "Al reemplazar el desarrollo interno por la adquisición de un paquete de software comercial (COTS), ¿qué fases del ciclo de vida de desarrollo de sistemas (SDLC) tradicional son sustituidas principalmente?",
        "preguntaEn": "When replacing in-house development with a commercial off-the-shelf (COTS) software package, which phases of the traditional SDLC are primarily substituted?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El estudio de factibilidad y la definición de requisitos de usuario."
          },
          {
            "id": "b",
            "texto": "El diseño y el desarrollo, las cuales se reemplazan por selección y configuración."
          },
          {
            "id": "c",
            "texto": "Las pruebas de aceptación de usuario y la revisión post-implementación."
          },
          {
            "id": "d",
            "texto": "La migración de datos y la capacitación a usuarios finales."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Feasibility study and user requirements definition."
          },
          {
            "id": "b",
            "texto": "Design and development, which are replaced by selection and configuration."
          },
          {
            "id": "c",
            "texto": "User acceptance testing and post-implementation review."
          },
          {
            "id": "d",
            "texto": "Data migration and end-user training."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "El análisis de impacto en el negocio (BIA) determina que una aplicación bancaria de transferencias interbancarias tiene un Objetivo de Punto de Recuperación (RPO) cercano a cero (pocos minutos). ¿Qué estrategia técnica de respaldo es indispensable para cumplir esta meta?",
        "preguntaEn": "Business Impact Analysis (BIA) determines that an interbank wire transfer application has a Recovery Point Objective (RPO) close to zero (a few minutes). Which technical backup strategy is essential to meet this target?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Copias de respaldo completas ejecutadas semanalmente en cintas magnéticas fuera del sitio."
          },
          {
            "id": "b",
            "texto": "Replicación sincrónica de datos en espejo (data mirroring) hacia un centro de datos alterno."
          },
          {
            "id": "c",
            "texto": "Respaldos incrementales ejecutados cada doce horas mediante scripts programados."
          },
          {
            "id": "d",
            "texto": "Almacenamiento de archivos en discos duros externos desconectados de la red corporativa."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Full weekly backups on magnetic tapes stored off-site."
          },
          {
            "id": "b",
            "texto": "Synchronous data mirroring to an alternate data center."
          },
          {
            "id": "c",
            "texto": "Incremental backups executed every twelve hours via scheduled scripts."
          },
          {
            "id": "d",
            "texto": "File storage on external hard drives disconnected from the corporate network."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "¿Cuál de las siguientes características describe con precisión a un sitio de contingencia templado (warm site)?",
        "preguntaEn": "Which of the following characteristics accurately describes a warm recovery site?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Cuenta únicamente con el espacio físico, cableado y servicios básicos, sin componentes de cómputo preinstalados."
          },
          {
            "id": "b",
            "texto": "Dispone de energía, conexiones de red y equipos periféricos parciales, pero carece de la computadora o servidor central principal."
          },
          {
            "id": "c",
            "texto": "Es una instalación totalmente equipada y sincronizada que puede operar en cuestión de minutos tras el desastre."
          },
          {
            "id": "d",
            "texto": "Es una oficina móvil transportada en un remolque hacia la sede afectada tras la contingencia."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "It has only physical space, wiring, and basic utilities, without pre-installed computing components."
          },
          {
            "id": "b",
            "texto": "It has power, network connections, and selected peripherals, but lacks the main computer or central server."
          },
          {
            "id": "c",
            "texto": "It is a fully equipped, synchronized facility that can operate within minutes after a disaster."
          },
          {
            "id": "d",
            "texto": "It is a mobile office transported in a trailer to the affected site following contingency."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "Durante la ejecución de un simulacro anual del Plan de Recuperación ante Desastres (DRP) en la sede alterna, ¿cuál debe ser el papel del auditor de SI?",
        "preguntaEn": "During the execution of an annual Disaster Recovery Plan (DRP) simulation at an alternate site, what should be the role of the IS auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Declarar formalmente el estado de desastre e iniciar los comandos de failover en la consola."
          },
          {
            "id": "b",
            "texto": "Observar y evaluar las pruebas para verificar si se cumplen los objetivos de tiempo y efectividad del plan."
          },
          {
            "id": "c",
            "texto": "Asumir la reconfiguración de los firewalls y conmutadores durante la contingencia."
          },
          {
            "id": "d",
            "texto": "Ajustar los cronogramas operativos de los operadores de cómputo presentes en la prueba."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Formally declare a disaster state and initiate failover commands at the console."
          },
          {
            "id": "b",
            "texto": "Observe and evaluate testing to verify whether timeline and effectiveness objectives are met."
          },
          {
            "id": "c",
            "texto": "Assume responsibility for reconfiguring firewalls and switches during contingency."
          },
          {
            "id": "d",
            "texto": "Adjust operational schedules of computer operators present at the test."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "Una corporación con múltiples sedes decide implementar acuerdos recíprocos entre sucursales como estrategia de contingencia para la continuidad operativa. ¿Cuál es la limitación MÁS crítica de este modelo?",
        "preguntaEn": "A multi-branch corporation decides to implement reciprocal agreements between branches as a contingency strategy. What is the MOST critical limitation of this model?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El alto costo asociado a la contratación mensual de empresas especializadas de hot site."
          },
          {
            "id": "b",
            "texto": "La alta probabilidad de que la sucursal receptora no disponga de capacidad excedente suficiente para absorber la carga de ambas sedes."
          },
          {
            "id": "c",
            "texto": "La incompatibilidad con los estándares de cableado de fibra óptica subterránea."
          },
          {
            "id": "d",
            "texto": "La necesidad de solicitar autorizaciones regulatorias previas para cada conexión remota."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "High costs associated with monthly contracts with specialized hot site vendors."
          },
          {
            "id": "b",
            "texto": "High probability that the receiving branch lacks sufficient spare capacity to absorb the workload of both locations."
          },
          {
            "id": "c",
            "texto": "Incompatibility with underground fiber optic cabling standards."
          },
          {
            "id": "d",
            "texto": "The need to obtain prior regulatory approvals for each remote link."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "Al evaluar la seguridad de la red inalámbrica de una cadena minorista, el auditor descubre que los puntos de venta (POS) móviles transmiten datos de tarjetas utilizando cifrado WEP. ¿Por qué representa esto un riesgo crítico de seguridad?",
        "preguntaEn": "When assessing wireless network security for a retail chain, the auditor discovers mobile point-of-sale (POS) units transmit cardholder data using WEP encryption. Why does this represent a critical security risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Porque WEP restringe la conexión a un máximo de diez terminales concurrentes."
          },
          {
            "id": "b",
            "texto": "Porque WEP emplea claves estáticas con vectores de inicialización débiles que permiten descifrar el tráfico fácilmente."
          },
          {
            "id": "c",
            "texto": "Porque WEP impide el uso de túneles VPN punto a punto hacia la sede central."
          },
          {
            "id": "d",
            "texto": "Porque WEP no es compatible con el protocolo IPv4 de los conmutadores."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Because WEP limits connections to a maximum of ten concurrent terminals."
          },
          {
            "id": "b",
            "texto": "Because WEP uses static keys with weak initialization vectors that allow traffic to be easily decrypted."
          },
          {
            "id": "c",
            "texto": "Because WEP prevents point-to-point VPN tunnels to corporate headquarters."
          },
          {
            "id": "d",
            "texto": "Because WEP is incompatible with switch IPv4 protocols."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "En un modelo de Control de Acceso Mandatorio (MAC), ¿quién posee la autoridad exclusiva para modificar o asignar las etiquetas de seguridad de un archivo o recurso?",
        "preguntaEn": "In a Mandatory Access Control (MAC) model, who holds exclusive authority to modify or assign security labels to a file or resource?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El usuario creador que originó el documento en su estación de trabajo."
          },
          {
            "id": "b",
            "texto": "El administrador de seguridad del sistema conforme a la política formal de clasificación."
          },
          {
            "id": "c",
            "texto": "El custodio del almacenamiento en cinta del centro de cómputo."
          },
          {
            "id": "d",
            "texto": "Cualquier integrante del departamento que cuente con privilegios de lectura."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The originating user who created the document on their workstation."
          },
          {
            "id": "b",
            "texto": "The system security administrator in accordance with formal classification policy."
          },
          {
            "id": "c",
            "texto": "The computer center tape storage custodian."
          },
          {
            "id": "d",
            "texto": "Any department member holding read privileges."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "Un empleado contacta a la mesa de ayuda (Help Desk) solicitando el restablecimiento inmediato de su contraseña por olvido. Para prevenir ataques de ingeniería social, ¿qué control debe verificar el auditor que se aplique en PRIMER lugar?",
        "preguntaEn": "An employee contacts the Help Desk requesting an immediate password reset due to forgetfulness. To prevent social engineering attacks, which control should the auditor verify is applied FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Generar una contraseña temporal y enviarla al correo electrónico personal del usuario."
          },
          {
            "id": "b",
            "texto": "Validar de forma concluyente la identidad del solicitante mediante un mecanismo predefinido de desafío/respuesta o canal seguro secundario."
          },
          {
            "id": "c",
            "texto": "Deshabilitar la cuenta del usuario de forma preventiva durante las siguientes veinticuatro horas."
          },
          {
            "id": "d",
            "texto": "Solicitar una autorización escrita firmada por el Director General de la empresa."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Generating a temporary password and emailing it to the user personal email."
          },
          {
            "id": "b",
            "texto": "Conclusively validating the requester identity using a predefined challenge/response mechanism or secondary secure channel."
          },
          {
            "id": "c",
            "texto": "Preventively disabling the user account for the next twenty-four hours."
          },
          {
            "id": "d",
            "texto": "Requiring written authorization signed by the company Chief Executive Officer."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "¿En qué nivel arquitectónico proporciona el software de control de acceso el MAYOR grado de protección integral contra accesos no autorizados por parte de usuarios internos y externos?",
        "preguntaEn": "At which architectural level does access control software provide the GREATEST degree of comprehensive protection against unauthorized access by internal and external users?",
        "alternativas": [
          {
            "id": "a",
            "texto": "A nivel de los formularios de entrada de la aplicación de usuario."
          },
          {
            "id": "b",
            "texto": "A nivel de los procedimientos almacenados en el motor de base de datos."
          },
          {
            "id": "c",
            "texto": "A nivel de red y de plataforma / sistema operativo (sistemas de soporte general)."
          },
          {
            "id": "d",
            "texto": "A nivel de los repositorios de respaldo y bitácoras históricas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "At the user application entry form level."
          },
          {
            "id": "b",
            "texto": "At the database engine stored procedure level."
          },
          {
            "id": "c",
            "texto": "At the network and platform / operating system level (general support systems)."
          },
          {
            "id": "d",
            "texto": "At the backup repository and historical log level."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "3": [
      {
        "id": 1,
        "pregunta": "Un auditor de SI recién incorporado descubre que la organización nunca ha formalizado ni aprobado un estatuto de auditoría (audit charter). ¿Cuál debe ser su curso de acción INMEDIATO?",
        "preguntaEn": "A newly hired IS auditor discovers that the organization has never formalized or approved an audit charter. What should be their IMMEDIATE course of action?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Continuar ejecutando el cronograma de auditoría previamente acordado con la gerencia general."
          },
          {
            "id": "b",
            "texto": "Suspender de forma indefinida cualquier interacción con los dueños de procesos de negocio."
          },
          {
            "id": "c",
            "texto": "Elaborar el borrador del estatuto de auditoría y presentarlo a la junta directiva o comité de auditoría para su aprobación formal."
          },
          {
            "id": "d",
            "texto": "Limitar las actividades de auditoría a revisiones financieras sin involucrar sistemas de información."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Continue executing the audit schedule previously agreed upon with executive management."
          },
          {
            "id": "b",
            "texto": "Indefinitely suspend any interaction with business process owners."
          },
          {
            "id": "c",
            "texto": "Draft the audit charter and submit it to the board of directors or audit committee for formal approval."
          },
          {
            "id": "d",
            "texto": "Limit audit activities to financial reviews without involving information systems."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "Al planificar una auditoría sobre una plataforma transaccional en la nube, el auditor de SI evalúa la probabilidad y el impacto de pérdidas operacionales considerando que no existen controles internos ni salvaguardas implementadas. ¿Qué categoría de riesgo está valorando?",
        "preguntaEn": "When planning an audit of a cloud-based transactional platform, the IS auditor assesses the likelihood and impact of operational losses assuming no internal controls or safeguards are in place. What risk category is being assessed?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Riesgo residual"
          },
          {
            "id": "b",
            "texto": "Riesgo de control"
          },
          {
            "id": "c",
            "texto": "Riesgo de detección"
          },
          {
            "id": "d",
            "texto": "Riesgo inherente"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Residual risk"
          },
          {
            "id": "b",
            "texto": "Control risk"
          },
          {
            "id": "c",
            "texto": "Detection risk"
          },
          {
            "id": "d",
            "texto": "Inherent risk"
          }
        ],
        "respuestaCorrectaId": "d",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Durante la evaluación de la gestión de cambios a programas en un entorno productivo, ¿cuál es el procedimiento de muestreo MÁS eficaz para identificar cambios no autorizados?",
        "preguntaEn": "During an evaluation of program change management in a production environment, what is the MOST effective sampling procedure to identify unauthorized changes?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Seleccionar una muestra aleatoria de solicitudes de cambio aprobadas en el sistema de tickets y rastrearlas hacia el entorno de producción."
          },
          {
            "id": "b",
            "texto": "Extraer la muestra a partir de los cambios detectados directamente en el código de producción y rastrearlos hacia la documentación de autorización previa."
          },
          {
            "id": "c",
            "texto": "Seleccionar solicitudes de cambio según la criticidad del sistema documentada en el inventario de aplicaciones."
          },
          {
            "id": "d",
            "texto": "Rastrear los cambios documentados en el plan de trabajo anual contra los incidentes reportados por usuarios finales."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Select a random sample of approved change requests in the ticketing system and trace them to the production environment."
          },
          {
            "id": "b",
            "texto": "Draw the sample from changes detected directly in production code and trace them back to prior authorization documentation."
          },
          {
            "id": "c",
            "texto": "Select change requests based on system criticality documented in the application inventory."
          },
          {
            "id": "d",
            "texto": "Trace changes documented in the annual work plan against incidents reported by end users."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Una entidad financiera adopta un programa de Autoevaluación de Controles (CSA) en sus áreas operativas. ¿Cuál debe ser el rol primordial del auditor de SI en este proceso?",
        "preguntaEn": "A financial institution adopts a Control Self-Assessment (CSA) program in its operational areas. What should be the primary role of the IS auditor in this process?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Diseñar y configurar directamente los controles compensatorios requeridos en las aplicaciones."
          },
          {
            "id": "b",
            "texto": "Facilitar los talleres y proporcionar guía metodológica a los dueños de los procesos de negocio."
          },
          {
            "id": "c",
            "texto": "Asumir la propiedad y rendición de cuentas sobre la efectividad de los controles evaluados."
          },
          {
            "id": "d",
            "texto": "Reemplazar a la gerencia en la toma de decisiones sobre mitigación de riesgos."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Directly design and configure required compensating controls in applications."
          },
          {
            "id": "b",
            "texto": "Facilitate workshops and provide methodological guidance to business process owners."
          },
          {
            "id": "c",
            "texto": "Assume ownership and accountability for the effectiveness of evaluated controls."
          },
          {
            "id": "d",
            "texto": "Replace management in risk mitigation decision-making."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "Al revisar la estructura de gobierno corporativo de TI, el auditor observa que los proyectos tecnológicos se ejecutan sin contar con un plan estratégico de TI formalizado. ¿Cuál es la consecuencia MÁS probable de esta situación?",
        "preguntaEn": "When reviewing the IT corporate governance structure, the auditor notes that technology projects are executed without a formalized IT strategic plan. What is the MOST likely consequence of this situation?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El personal técnico no podrá aplicar parches de seguridad en los servidores perimetrales."
          },
          {
            "id": "b",
            "texto": "Las inversiones y proyectos de TI perderán alineación con los objetivos del negocio y la entrega de valor."
          },
          {
            "id": "c",
            "texto": "Los acuerdos de nivel de servicio (SLA) con proveedores se cancelarán automáticamente."
          },
          {
            "id": "d",
            "texto": "Se incrementará el riesgo de muestreo durante las pruebas de auditoría continua."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Technical staff will be unable to apply security patches on perimeter servers."
          },
          {
            "id": "b",
            "texto": "IT investments and projects will lose alignment with business objectives and value delivery."
          },
          {
            "id": "c",
            "texto": "Service level agreements (SLAs) with vendors will be automatically canceled."
          },
          {
            "id": "d",
            "texto": "Sampling risk will increase during continuous audit testing."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "En una institución financiera mediana, el Gerente de Sistemas de Información reporta directamente al Director Financiero (CFO). Desde la perspectiva de gobernanza y control interno, ¿cuál es la MAYOR preocupación para el auditor de SI?",
        "preguntaEn": "In a mid-sized financial institution, the IS Manager reports directly to the Chief Financial Officer (CFO). From a governance and internal control perspective, what is the GREATEST concern for the IS auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que el CFO carezca de certificaciones técnicas en administración de bases de datos."
          },
          {
            "id": "b",
            "texto": "Que las decisiones y presupuestos de TI se subordinen a metas de costos contables a corto plazo, comprometiendo controles y proyectos de seguridad."
          },
          {
            "id": "c",
            "texto": "Que el comité de riesgos deje de reportar a la gerencia de operaciones."
          },
          {
            "id": "d",
            "texto": "Que los auditores externos deban ejecutar tareas de mesa de ayuda."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "That the CFO lacks technical certifications in database administration."
          },
          {
            "id": "b",
            "texto": "That IT decisions and budgets are subordinated to short-term accounting cost goals, compromising controls and security projects."
          },
          {
            "id": "c",
            "texto": "That the risk committee stops reporting to operations management."
          },
          {
            "id": "d",
            "texto": "That external auditors must perform help desk tasks."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "Un desarrollador necesita modificar registros transaccionales directamente en la base de datos de producción debido a un error de cálculo del aplicativo. ¿Quién debe autorizar formalmente este acceso de escritura?",
        "preguntaEn": "A developer needs to modify transactional records directly in the production database due to an application calculation error. Who must formally authorize this write access?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Administrador de Bases de Datos (DBA)"
          },
          {
            "id": "b",
            "texto": "El Líder Técnico de Desarrollo de Software"
          },
          {
            "id": "c",
            "texto": "El Dueño de los Datos de Negocio (Data Owner)"
          },
          {
            "id": "d",
            "texto": "El Operador de Consola del Centro de Cómputo"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Database Administrator (DBA)"
          },
          {
            "id": "b",
            "texto": "The Technical Software Development Lead"
          },
          {
            "id": "c",
            "texto": "The Business Data Owner"
          },
          {
            "id": "d",
            "texto": "The Computer Center Console Operator"
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "En una empresa pequeña donde resulta inviable contratar personal adicional para separar las funciones de programación y de operación de cómputo, ¿cuál es el MEJOR control compensatorio que el auditor debe recomendar?",
        "preguntaEn": "In a small company where hiring additional staff to separate programming and computer operation functions is unfeasible, what is the BEST compensating control the auditor should recommend?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Exigir la firma periódica de acuerdos de confidencialidad y ética profesional."
          },
          {
            "id": "b",
            "texto": "Implementar procesos independientes y periódicos que comparen el código autorizado con el código en producción para detectar cambios no autorizados."
          },
          {
            "id": "c",
            "texto": "Deshabilitar los puertos USB en las estaciones de trabajo de los desarrolladores."
          },
          {
            "id": "d",
            "texto": "Prohibir el uso de software de depuración en entornos de desarrollo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Requiring periodic signing of confidentiality and professional ethics agreements."
          },
          {
            "id": "b",
            "texto": "Implementing independent periodic processes that compare authorized code with production code to detect unauthorized changes."
          },
          {
            "id": "c",
            "texto": "Disabling USB ports on developer workstations."
          },
          {
            "id": "d",
            "texto": "Prohibiting debugging software in development environments."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "Para realizar pruebas de estrés de un nuevo sistema bancario, la gerencia entrega una copia de la base de datos productiva a un proveedor externo de pruebas. ¿Cuál es la preocupación PRIMARIA que el auditor de SI debe comunicar?",
        "preguntaEn": "To conduct stress testing on a new banking system, management provides a copy of the production database to an external testing vendor. What is the PRIMARY concern the IS auditor must report?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Que el conjunto de datos no esté completamente actualizado con las transacciones del día."
          },
          {
            "id": "b",
            "texto": "Que no se hayan anonimizado ni saneado (sanitized) los datos sensibles y confidenciales de los clientes."
          },
          {
            "id": "c",
            "texto": "Que el tiempo de respuesta del enlace de pruebas supere las métricas acordadas en el contrato."
          },
          {
            "id": "d",
            "texto": "Que la muestra de prueba no incluya transacciones de años fiscales cerrados."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "That the dataset is not fully updated with current day transactions."
          },
          {
            "id": "b",
            "texto": "That sensitive and confidential customer data has not been sanitized or anonymized."
          },
          {
            "id": "c",
            "texto": "That test link response time exceeds contractually agreed metrics."
          },
          {
            "id": "d",
            "texto": "That the test sample does not include closed fiscal year transactions."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "Una organización ha finalizado las pruebas unitarias y de integración de su nuevo software de pagos y decide iniciar pruebas en paralelo junto al software antiguo. ¿Cuál es el propósito PRINCIPAL de este enfoque?",
        "preguntaEn": "An organization has completed unit and integration testing of its new payment software and decides to begin parallel testing alongside the legacy software. What is the MAIN purpose of this approach?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Reducir los costos de licenciamiento del software antiguo de manera anticipada."
          },
          {
            "id": "b",
            "texto": "Identificar fallos de sintaxis en los módulos de integración con el sistema operativo."
          },
          {
            "id": "c",
            "texto": "Asegurar que la implementación del nuevo sistema satisfaga los requisitos de negocio de los usuarios comparando sus resultados con el sistema anterior."
          },
          {
            "id": "d",
            "texto": "Probar la resistencia física de los servidores ante variaciones de voltaje."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Reducing legacy software licensing costs early."
          },
          {
            "id": "b",
            "texto": "Identifying syntax errors in operating system integration modules."
          },
          {
            "id": "c",
            "texto": "Ensuring that implementation of the new system satisfies user business requirements by comparing its outputs with the legacy system."
          },
          {
            "id": "d",
            "texto": "Testing physical server resilience against voltage fluctuations."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 11,
        "pregunta": "Durante la fase de codificación de un desarrollo en cascada, los usuarios solicitan continuas modificaciones que amenazan el cumplimiento del plazo y presupuesto acordados. ¿Qué control preventivo debió establecerse para mitigar este desvío (scope creep)?",
        "preguntaEn": "During the coding phase of a waterfall development project, users request continuous modifications that threaten the agreed-upon timeline and budget. Which preventive control should have been established to mitigate this scope creep?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El congelamiento formal del diseño mediante una línea base de software (software baselining) sujeta a control de cambios."
          },
          {
            "id": "b",
            "texto": "La adopción inmediata de metodologías de desarrollo ágil en medio de la fase de despliegue."
          },
          {
            "id": "c",
            "texto": "El incremento automático de horas extra para los programadores del proyecto."
          },
          {
            "id": "d",
            "texto": "La eliminación de las pruebas de aceptación de usuario (UAT)."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Formal design freezing through software baselining subject to change control."
          },
          {
            "id": "b",
            "texto": "Immediate adoption of agile development methodologies midway through deployment."
          },
          {
            "id": "c",
            "texto": "Automatic overtime increase for project programmers."
          },
          {
            "id": "d",
            "texto": "Elimination of user acceptance testing (UAT)."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "Al reemplazar el desarrollo interno por la adquisición de un paquete de software comercial (COTS), ¿qué fases del ciclo de vida de desarrollo de sistemas (SDLC) tradicional son sustituidas principalmente?",
        "preguntaEn": "When replacing in-house development with a commercial off-the-shelf (COTS) software package, which phases of the traditional SDLC are primarily substituted?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El estudio de factibilidad y la definición de requisitos de usuario."
          },
          {
            "id": "b",
            "texto": "El diseño y el desarrollo, las cuales se reemplazan por selección y configuración."
          },
          {
            "id": "c",
            "texto": "Las pruebas de aceptación de usuario y la revisión post-implementación."
          },
          {
            "id": "d",
            "texto": "La migración de datos y la capacitación a usuarios finales."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Feasibility study and user requirements definition."
          },
          {
            "id": "b",
            "texto": "Design and development, which are replaced by selection and configuration."
          },
          {
            "id": "c",
            "texto": "User acceptance testing and post-implementation review."
          },
          {
            "id": "d",
            "texto": "Data migration and end-user training."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "El análisis de impacto en el negocio (BIA) determina que una aplicación bancaria de transferencias interbancarias tiene un Objetivo de Punto de Recuperación (RPO) cercano a cero (pocos minutos). ¿Qué estrategia técnica de respaldo es indispensable para cumplir esta meta?",
        "preguntaEn": "Business Impact Analysis (BIA) determines that an interbank wire transfer application has a Recovery Point Objective (RPO) close to zero (a few minutes). Which technical backup strategy is essential to meet this target?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Copias de respaldo completas ejecutadas semanalmente en cintas magnéticas fuera del sitio."
          },
          {
            "id": "b",
            "texto": "Replicación sincrónica de datos en espejo (data mirroring) hacia un centro de datos alterno."
          },
          {
            "id": "c",
            "texto": "Respaldos incrementales ejecutados cada doce horas mediante scripts programados."
          },
          {
            "id": "d",
            "texto": "Almacenamiento de archivos en discos duros externos desconectados de la red corporativa."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Full weekly backups on magnetic tapes stored off-site."
          },
          {
            "id": "b",
            "texto": "Synchronous data mirroring to an alternate data center."
          },
          {
            "id": "c",
            "texto": "Incremental backups executed every twelve hours via scheduled scripts."
          },
          {
            "id": "d",
            "texto": "File storage on external hard drives disconnected from the corporate network."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "¿Cuál de las siguientes características describe con precisión a un sitio de contingencia templado (warm site)?",
        "preguntaEn": "Which of the following characteristics accurately describes a warm recovery site?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Cuenta únicamente con el espacio físico, cableado y servicios básicos, sin componentes de cómputo preinstalados."
          },
          {
            "id": "b",
            "texto": "Dispone de energía, conexiones de red y equipos periféricos parciales, pero carece de la computadora o servidor central principal."
          },
          {
            "id": "c",
            "texto": "Es una instalación totalmente equipada y sincronizada que puede operar en cuestión de minutos tras el desastre."
          },
          {
            "id": "d",
            "texto": "Es una oficina móvil transportada en un remolque hacia la sede afectada tras la contingencia."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "It has only physical space, wiring, and basic utilities, without pre-installed computing components."
          },
          {
            "id": "b",
            "texto": "It has power, network connections, and selected peripherals, but lacks the main computer or central server."
          },
          {
            "id": "c",
            "texto": "It is a fully equipped, synchronized facility that can operate within minutes after a disaster."
          },
          {
            "id": "d",
            "texto": "It is a mobile office transported in a trailer to the affected site following contingency."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "Durante la ejecución de un simulacro anual del Plan de Recuperación ante Desastres (DRP) en la sede alterna, ¿cuál debe ser el papel del auditor de SI?",
        "preguntaEn": "During the execution of an annual Disaster Recovery Plan (DRP) simulation at an alternate site, what should be the role of the IS auditor?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Declarar formalmente el estado de desastre e iniciar los comandos de failover en la consola."
          },
          {
            "id": "b",
            "texto": "Observar y evaluar las pruebas para verificar si se cumplen los objetivos de tiempo y efectividad del plan."
          },
          {
            "id": "c",
            "texto": "Asumir la reconfiguración de los firewalls y conmutadores durante la contingencia."
          },
          {
            "id": "d",
            "texto": "Ajustar los cronogramas operativos de los operadores de cómputo presentes en la prueba."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Formally declare a disaster state and initiate failover commands at the console."
          },
          {
            "id": "b",
            "texto": "Observe and evaluate testing to verify whether timeline and effectiveness objectives are met."
          },
          {
            "id": "c",
            "texto": "Assume responsibility for reconfiguring firewalls and switches during contingency."
          },
          {
            "id": "d",
            "texto": "Adjust operational schedules of computer operators present at the test."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "Una corporación con múltiples sedes decide implementar acuerdos recíprocos entre sucursales como estrategia de contingencia para la continuidad operativa. ¿Cuál es la limitación MÁS crítica de este modelo?",
        "preguntaEn": "A multi-branch corporation decides to implement reciprocal agreements between branches as a contingency strategy. What is the MOST critical limitation of this model?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El alto costo asociado a la contratación mensual de empresas especializadas de hot site."
          },
          {
            "id": "b",
            "texto": "La alta probabilidad de que la sucursal receptora no disponga de capacidad excedente suficiente para absorber la carga de ambas sedes."
          },
          {
            "id": "c",
            "texto": "La incompatibilidad con los estándares de cableado de fibra óptica subterránea."
          },
          {
            "id": "d",
            "texto": "La necesidad de solicitar autorizaciones regulatorias previas para cada conexión remota."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "High costs associated with monthly contracts with specialized hot site vendors."
          },
          {
            "id": "b",
            "texto": "High probability that the receiving branch lacks sufficient spare capacity to absorb the workload of both locations."
          },
          {
            "id": "c",
            "texto": "Incompatibility with underground fiber optic cabling standards."
          },
          {
            "id": "d",
            "texto": "The need to obtain prior regulatory approvals for each remote link."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "Al evaluar la seguridad de la red inalámbrica de una cadena minorista, el auditor descubre que los puntos de venta (POS) móviles transmiten datos de tarjetas utilizando cifrado WEP. ¿Por qué representa esto un riesgo crítico de seguridad?",
        "preguntaEn": "When assessing wireless network security for a retail chain, the auditor discovers mobile point-of-sale (POS) units transmit cardholder data using WEP encryption. Why does this represent a critical security risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Porque WEP restringe la conexión a un máximo de diez terminales concurrentes."
          },
          {
            "id": "b",
            "texto": "Porque WEP emplea claves estáticas con vectores de inicialización débiles que permiten descifrar el tráfico fácilmente."
          },
          {
            "id": "c",
            "texto": "Porque WEP impide el uso de túneles VPN punto a punto hacia la sede central."
          },
          {
            "id": "d",
            "texto": "Porque WEP no es compatible con el protocolo IPv4 de los conmutadores."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Because WEP limits connections to a maximum of ten concurrent terminals."
          },
          {
            "id": "b",
            "texto": "Because WEP uses static keys with weak initialization vectors that allow traffic to be easily decrypted."
          },
          {
            "id": "c",
            "texto": "Because WEP prevents point-to-point VPN tunnels to corporate headquarters."
          },
          {
            "id": "d",
            "texto": "Because WEP is incompatible with switch IPv4 protocols."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "En un modelo de Control de Acceso Mandatorio (MAC), ¿quién posee la autoridad exclusiva para modificar o asignar las etiquetas de seguridad de un archivo o recurso?",
        "preguntaEn": "In a Mandatory Access Control (MAC) model, who holds exclusive authority to modify or assign security labels to a file or resource?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El usuario creador que originó el documento en su estación de trabajo."
          },
          {
            "id": "b",
            "texto": "El administrador de seguridad del sistema conforme a la política formal de clasificación."
          },
          {
            "id": "c",
            "texto": "El custodio del almacenamiento en cinta del centro de cómputo."
          },
          {
            "id": "d",
            "texto": "Cualquier integrante del departamento que cuente con privilegios de lectura."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The originating user who created the document on their workstation."
          },
          {
            "id": "b",
            "texto": "The system security administrator in accordance with formal classification policy."
          },
          {
            "id": "c",
            "texto": "The computer center tape storage custodian."
          },
          {
            "id": "d",
            "texto": "Any department member holding read privileges."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "Un empleado contacta a la mesa de ayuda (Help Desk) solicitando el restablecimiento inmediato de su contraseña por olvido. Para prevenir ataques de ingeniería social, ¿qué control debe verificar el auditor que se aplique en PRIMER lugar?",
        "preguntaEn": "An employee contacts the Help Desk requesting an immediate password reset due to forgetfulness. To prevent social engineering attacks, which control should the auditor verify is applied FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Generar una contraseña temporal y enviarla al correo electrónico personal del usuario."
          },
          {
            "id": "b",
            "texto": "Validar de forma concluyente la identidad del solicitante mediante un mecanismo predefinido de desafío/respuesta o canal seguro secundario."
          },
          {
            "id": "c",
            "texto": "Deshabilitar la cuenta del usuario de forma preventiva durante las siguientes veinticuatro horas."
          },
          {
            "id": "d",
            "texto": "Solicitar una autorización escrita firmada por el Director General de la empresa."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Generating a temporary password and emailing it to the user personal email."
          },
          {
            "id": "b",
            "texto": "Conclusively validating the requester identity using a predefined challenge/response mechanism or secondary secure channel."
          },
          {
            "id": "c",
            "texto": "Preventively disabling the user account for the next twenty-four hours."
          },
          {
            "id": "d",
            "texto": "Requiring written authorization signed by the company Chief Executive Officer."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "¿En qué nivel arquitectónico proporciona el software de control de acceso el MAYOR grado de protección integral contra accesos no autorizados por parte de usuarios internos y externos?",
        "preguntaEn": "At which architectural level does access control software provide the GREATEST degree of comprehensive protection against unauthorized access by internal and external users?",
        "alternativas": [
          {
            "id": "a",
            "texto": "A nivel de los formularios de entrada de la aplicación de usuario."
          },
          {
            "id": "b",
            "texto": "A nivel de los procedimientos almacenados en el motor de base de datos."
          },
          {
            "id": "c",
            "texto": "A nivel de red y de plataforma / sistema operativo (sistemas de soporte general)."
          },
          {
            "id": "d",
            "texto": "A nivel de los repositorios de respaldo y bitácoras históricas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "At the user application entry form level."
          },
          {
            "id": "b",
            "texto": "At the database engine stored procedure level."
          },
          {
            "id": "c",
            "texto": "At the network and platform / operating system level (general support systems)."
          },
          {
            "id": "d",
            "texto": "At the backup repository and historical log level."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      }
    ]
  },
  "gpt": {
    "1": [
      {
        "id": 1,
        "pregunta": "Una empresa creció rápidamente y el auditor debe elaborar su plan anual. Existen informes de auditorías anteriores, pero no una evaluación reciente de riesgos de TI. ¿Qué debería hacer PRIMERO?",
        "preguntaEn": "An enterprise grew rapidly and the auditor must prepare its annual plan. Previous audit reports exist, but no recent IT risk assessment is available. What should the auditor do FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Repetir las pruebas que detectaron más errores el año anterior."
          },
          {
            "id": "b",
            "texto": "Evaluar los riesgos de TI para establecer prioridades."
          },
          {
            "id": "c",
            "texto": "Solicitar a gerencia una lista de controles que desea revisar."
          },
          {
            "id": "d",
            "texto": "Seleccionar una muestra de transacciones críticas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Repeat the tests that detected the most exceptions in the prior year."
          },
          {
            "id": "b",
            "texto": "Perform an IT risk assessment to establish priorities."
          },
          {
            "id": "c",
            "texto": "Request from management a list of controls they want reviewed."
          },
          {
            "id": "d",
            "texto": "Select a sample of critical transactions."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "El auditor quiere comprobar si todos los cambios realizados en producción fueron autorizados. ¿Cuál es la mejor forma de seleccionar la muestra?",
        "preguntaEn": "The auditor wants to verify whether all changes made in production were authorized. What is the best method to select the sample?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Tomar solicitudes de cambio aprobadas y verificar sus firmas."
          },
          {
            "id": "b",
            "texto": "Tomar cambios registrados en producción y rastrearlos hasta su autorización."
          },
          {
            "id": "c",
            "texto": "Entrevistar al responsable de desarrollo sobre el procedimiento."
          },
          {
            "id": "d",
            "texto": "Revisar únicamente los cambios clasificados como urgentes."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Select approved change requests and verify signatures."
          },
          {
            "id": "b",
            "texto": "Sample changes recorded in production and trace them back to their authorization."
          },
          {
            "id": "c",
            "texto": "Interview the development manager regarding the change procedure."
          },
          {
            "id": "d",
            "texto": "Review only changes classified as emergency changes."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Una organización compra nuevas herramientas de TI sin comprobar si apoyan sus objetivos de negocio. ¿Qué medida atendería MEJOR el problema?",
        "preguntaEn": "An organization acquires new IT tools without verifying whether they support business objectives. Which measure BEST addresses this issue?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentar la frecuencia de copias de seguridad."
          },
          {
            "id": "b",
            "texto": "Integrar la planificación e inversión de TI con la estrategia de la organización."
          },
          {
            "id": "c",
            "texto": "Encargar todas las compras al administrador de sistemas."
          },
          {
            "id": "d",
            "texto": "Exigir que cada proveedor ofrezca soporte permanente."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increase backup frequency."
          },
          {
            "id": "b",
            "texto": "Integrate IT planning and investment with organizational strategy."
          },
          {
            "id": "c",
            "texto": "Assign all procurement decisions to the systems administrator."
          },
          {
            "id": "d",
            "texto": "Require every vendor to provide 24/7 technical support."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Un comité aprueba proyectos tecnológicos, pero nadie supervisa si entregan los beneficios esperados. ¿Cuál es la principal deficiencia?",
        "preguntaEn": "A committee approves technology projects, but no one monitors whether they deliver expected benefits. What is the primary deficiency?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Falta de seguimiento de la generación de valor de las inversiones de TI."
          },
          {
            "id": "b",
            "texto": "Falta de cifrado en los sistemas utilizados por el comité."
          },
          {
            "id": "c",
            "texto": "Exceso de participación de la alta dirección."
          },
          {
            "id": "d",
            "texto": "Ausencia de pruebas de recuperación de desastres."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Lack of monitoring of value delivery from IT investments."
          },
          {
            "id": "b",
            "texto": "Lack of encryption in the systems used by the committee."
          },
          {
            "id": "c",
            "texto": "Excessive involvement of executive management."
          },
          {
            "id": "d",
            "texto": "Absence of disaster recovery testing."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "Durante el desarrollo de un sistema de matrículas, los usuarios detectan al final que no se contempló la anulación de una inscripción. ¿Qué control habría reducido MEJOR este riesgo?",
        "preguntaEn": "During development of an enrollment system, users discover at the end that enrollment cancellation was omitted. Which control would have BEST reduced this risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentar la capacidad del servidor antes de instalar el sistema."
          },
          {
            "id": "b",
            "texto": "Obtener la revisión y aprobación de los requisitos por los usuarios responsables."
          },
          {
            "id": "c",
            "texto": "Ejecutar pruebas de penetración antes del despliegue."
          },
          {
            "id": "d",
            "texto": "Permitir que el programador agregue funciones después de la entrega."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increase server capacity prior to system deployment."
          },
          {
            "id": "b",
            "texto": "Obtain requirements review and sign-off by responsible business users."
          },
          {
            "id": "c",
            "texto": "Perform penetration testing prior to deployment."
          },
          {
            "id": "d",
            "texto": "Allow developers to add functionality after handover."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "Una institución migra los expedientes de sus alumnos a un sistema nuevo. ¿Cuál es la MEJOR evidencia de que la migración conservó los datos completos y correctos?",
        "preguntaEn": "An institution migrates student records to a new system. What is the BEST evidence that migration preserved complete and accurate data?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El nuevo sistema inicia sin mostrar errores."
          },
          {
            "id": "b",
            "texto": "Los usuarios recibieron capacitación."
          },
          {
            "id": "c",
            "texto": "Se conciliaron cantidades y totales clave entre el origen y el destino, investigando las diferencias."
          },
          {
            "id": "d",
            "texto": "El proveedor confirmó por correo que terminó la migración."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The new system boots without displaying errors."
          },
          {
            "id": "b",
            "texto": "Users received comprehensive operational training."
          },
          {
            "id": "c",
            "texto": "Reconciliation of key counts and totals between source and destination was performed and discrepancies investigated."
          },
          {
            "id": "d",
            "texto": "The vendor confirmed completion via email."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "Una clínica necesita recuperar su sistema de atención tras una interrupción. Antes de decidir qué infraestructura contratar, ¿qué debería definir PRIMERO?",
        "preguntaEn": "A clinic needs to recover its healthcare system after an outage. Before deciding what infrastructure to contract, what should be defined FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La marca de los servidores de respaldo."
          },
          {
            "id": "b",
            "texto": "Los procesos críticos y sus necesidades de recuperación mediante un análisis de impacto en el negocio."
          },
          {
            "id": "c",
            "texto": "El número de técnicos que trabajarán de noche."
          },
          {
            "id": "d",
            "texto": "La frecuencia de actualización del antivirus."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The hardware brand of backup servers."
          },
          {
            "id": "b",
            "texto": "Critical business processes and recovery requirements through a business impact analysis."
          },
          {
            "id": "c",
            "texto": "The number of technicians on the night shift."
          },
          {
            "id": "d",
            "texto": "The antivirus definition update frequency."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "Una empresa ejecuta copias de seguridad diarias y recibe mensajes de «respaldo completado». ¿Qué prueba ofrece la evidencia MÁS sólida de que podrá recuperar el servicio?",
        "preguntaEn": "An enterprise runs daily backups and receives 'backup completed' status logs. Which test provides the STRONGEST evidence that service can be recovered?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Comprobar que existe espacio libre en el almacenamiento."
          },
          {
            "id": "b",
            "texto": "Revisar que el programa de respaldo está instalado."
          },
          {
            "id": "c",
            "texto": "Restaurar periódicamente datos y verificar que sean utilizables."
          },
          {
            "id": "d",
            "texto": "Preguntar al administrador si conoce el procedimiento."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Verifying that free storage space exists on media."
          },
          {
            "id": "b",
            "texto": "Checking that backup software is properly installed."
          },
          {
            "id": "c",
            "texto": "Periodically restoring data and verifying that it is usable."
          },
          {
            "id": "d",
            "texto": "Asking the administrator if they know the procedure."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "En un sistema financiero, cuatro administradores utilizan la misma cuenta privilegiada. ¿Cuál es el riesgo MÁS importante?",
        "preguntaEn": "In a financial system, four administrators share the same privileged account. What is the MOST significant risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentará el tiempo de inicio de sesión."
          },
          {
            "id": "b",
            "texto": "No será posible atribuir con confianza las acciones a cada persona."
          },
          {
            "id": "c",
            "texto": "Los usuarios tendrán que recordar más contraseñas."
          },
          {
            "id": "d",
            "texto": "El sistema necesitará más capacidad de almacenamiento."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Login time will increase."
          },
          {
            "id": "b",
            "texto": "Actions cannot be reliably attributed to individual users."
          },
          {
            "id": "c",
            "texto": "Users will need to memorize more passwords."
          },
          {
            "id": "d",
            "texto": "The system will require greater storage capacity."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "Una universidad permite acceso remoto a expedientes con datos personales. Ya utiliza contraseñas, pero se detectaron intentos de acceso con credenciales robadas. ¿Qué control reduciría MEJOR ese riesgo?",
        "preguntaEn": "A university allows remote access to student records containing personal data. Passwords are used, but credential-stuffing attacks were detected. Which control BEST reduces this risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Autenticación multifactor para el acceso remoto."
          },
          {
            "id": "b",
            "texto": "Cambiar el nombre visible del portal."
          },
          {
            "id": "c",
            "texto": "Ampliar la capacidad de la base de datos."
          },
          {
            "id": "d",
            "texto": "Publicar las contraseñas en una intranet restringida."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Multi-factor authentication for remote access."
          },
          {
            "id": "b",
            "texto": "Changing the public portal URL name."
          },
          {
            "id": "c",
            "texto": "Expanding database storage capacity."
          },
          {
            "id": "d",
            "texto": "Publishing passwords on a restricted intranet."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "2": [
      {
        "id": 11,
        "pregunta": "[Caso A: Cambios en entidad financiera] Un banco actualiza con frecuencia su sistema de créditos. Algunos cambios urgentes se aplican directamente en producción sin registrar siempre quién hizo el despliegue. Si el auditor busca cambios no autorizados, ¿cuál sería su MEJOR punto de partida?",
        "preguntaEn": "[Case A: Financial Institution Changes] A bank frequently updates its credit processing system. Emergency changes are applied directly to production without consistent logs of deployers. If the auditor seeks unauthorized changes, what is the BEST starting point?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La carpeta de solicitudes aprobadas."
          },
          {
            "id": "b",
            "texto": "El registro de cambios efectivamente aplicados en producción."
          },
          {
            "id": "c",
            "texto": "El presupuesto del proyecto."
          },
          {
            "id": "d",
            "texto": "Las actas de capacitación de usuarios."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The repository of approved change tickets."
          },
          {
            "id": "b",
            "texto": "The log of changes actually implemented in production."
          },
          {
            "id": "c",
            "texto": "The project budget sheet."
          },
          {
            "id": "d",
            "texto": "User training attendance logs."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "[Caso A: Cambios en entidad financiera] ¿Qué hallazgo representa el riesgo MÁS directo para la integridad del cálculo de créditos?",
        "preguntaEn": "[Case A: Financial Institution Changes] Which finding represents the MOST direct risk to the integrity of credit calculations?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los cambios urgentes no siempre tienen pruebas documentadas antes de su aplicación."
          },
          {
            "id": "b",
            "texto": "El equipo utiliza nombres cortos para las versiones."
          },
          {
            "id": "c",
            "texto": "La reunión semanal dura más de una hora."
          },
          {
            "id": "d",
            "texto": "Los usuarios solicitan nuevas funciones por correo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Emergency changes lack documented testing prior to production release."
          },
          {
            "id": "b",
            "texto": "The team uses abbreviated version names."
          },
          {
            "id": "c",
            "texto": "The weekly status meeting exceeds one hour."
          },
          {
            "id": "d",
            "texto": "Users request new enhancements via email."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "[Caso A: Cambios en entidad financiera] El banco afirma que todos los cambios urgentes se revisan después de implementarlos. ¿Qué evidencia debería buscar el auditor?",
        "preguntaEn": "[Case A: Financial Institution Changes] The bank asserts all emergency changes are reviewed post-implementation. What evidence should the auditor seek?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Una declaración verbal del jefe de desarrollo."
          },
          {
            "id": "b",
            "texto": "La política general de TI, aunque no incluya excepciones."
          },
          {
            "id": "c",
            "texto": "Registros de revisión posterior, aprobación y resolución de problemas para una muestra de cambios urgentes."
          },
          {
            "id": "d",
            "texto": "La lista de empleados del banco."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A verbal statement from the development lead."
          },
          {
            "id": "b",
            "texto": "The general IT policy, even if silent on exceptions."
          },
          {
            "id": "c",
            "texto": "Post-implementation review records, approvals, and issue logs for a sample of emergency changes."
          },
          {
            "id": "d",
            "texto": "The corporate employee roster."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "[Caso A: Cambios en entidad financiera] Un desarrollador puede programar, aprobar y desplegar por sí mismo un cambio. ¿Cuál es la MEJOR recomendación?",
        "preguntaEn": "[Case A: Financial Institution Changes] A developer can code, approve, and deploy changes autonomously. What is the BEST recommendation?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Separar esas funciones o establecer una revisión independiente documentada cuando la separación no sea viable."
          },
          {
            "id": "b",
            "texto": "Permitirlo siempre que el desarrollador tenga experiencia."
          },
          {
            "id": "c",
            "texto": "Eliminar el registro de cambios para reducir demoras."
          },
          {
            "id": "d",
            "texto": "Revisar únicamente los cambios que produzcan una caída del sistema."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Segregate these functions or establish documented independent review when segregation is unfeasible."
          },
          {
            "id": "b",
            "texto": "Permit it provided the developer has sufficient seniority."
          },
          {
            "id": "c",
            "texto": "Eliminate change logging to minimize deployment latency."
          },
          {
            "id": "d",
            "texto": "Review only changes that result in unexpected system outages."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "[Caso B: Servicios tercerizados] Una clínica utiliza un proveedor en la nube para historias clínicas. No ha definido tolerancia a caídas ni pérdida de datos. ¿Qué debería hacer la clínica PRIMERO para establecer requisitos de recuperación adecuados?",
        "preguntaEn": "[Case B: Outsourced Services] A clinic uses a cloud provider for electronic health records without defining tolerated downtime or data loss thresholds. What should the clinic do FIRST to establish recovery targets?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Comprar otro servicio de respaldo inmediatamente."
          },
          {
            "id": "b",
            "texto": "Realizar un análisis de impacto en el negocio con los responsables de los procesos clínicos."
          },
          {
            "id": "c",
            "texto": "Aceptar los tiempos de recuperación que ofrece el proveedor por defecto."
          },
          {
            "id": "d",
            "texto": "Aumentar el número de cuentas de administrador."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Contract an additional backup provider immediately."
          },
          {
            "id": "b",
            "texto": "Conduct a business impact analysis with clinical process owners."
          },
          {
            "id": "c",
            "texto": "Accept the default vendor recovery timeframes."
          },
          {
            "id": "d",
            "texto": "Increase the number of administrative accounts."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "[Caso B: Servicios tercerizados] ¿Qué información permitiría evaluar MEJOR si el servicio contratado cubre las necesidades de recuperación?",
        "preguntaEn": "[Case B: Outsourced Services] Which information would BEST assess whether contracted cloud services meet recovery needs?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los objetivos de tiempo y punto de recuperación definidos por la clínica, comparados con los compromisos y capacidades comprobadas del proveedor."
          },
          {
            "id": "b",
            "texto": "La cantidad de clientes que tiene el proveedor."
          },
          {
            "id": "c",
            "texto": "El precio mensual del servicio."
          },
          {
            "id": "d",
            "texto": "La ubicación de la oficina comercial del proveedor."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "RTO and RPO defined by the clinic compared against contracted and demonstrated vendor capabilities."
          },
          {
            "id": "b",
            "texto": "The total customer count of the cloud provider."
          },
          {
            "id": "c",
            "texto": "The monthly subscription cost."
          },
          {
            "id": "d",
            "texto": "The physical address of the vendor sales office."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "[Caso B: Servicios tercerizados] El proveedor entrega informes que indican que los respaldos terminaron correctamente. ¿Qué debería solicitar el auditor para comprobar su utilidad?",
        "preguntaEn": "[Case B: Outsourced Services] The vendor provides logs stating backups completed successfully. What should the auditor request to confirm their utility?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Una demostración o evidencia de pruebas de restauración satisfactorias."
          },
          {
            "id": "b",
            "texto": "Una copia del logotipo del proveedor."
          },
          {
            "id": "c",
            "texto": "El listado de precios del próximo año."
          },
          {
            "id": "d",
            "texto": "Una explicación oral de cómo funciona la nube."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Demonstration or evidence of successful restoration test results."
          },
          {
            "id": "b",
            "texto": "A certified copy of the vendor corporate logo."
          },
          {
            "id": "c",
            "texto": "Next year upcoming pricing sheet."
          },
          {
            "id": "d",
            "texto": "An oral overview of cloud architecture."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "[Caso C: Cuentas universitarias] Una revisión encontró cuentas activas de ex trabajadores y permisos que algunos empleados conservaron tras cambiar de puesto. ¿Qué situación requiere la atención MÁS inmediata?",
        "preguntaEn": "[Case C: University Accounts] An audit revealed active accounts of terminated staff and lingering privileges after role transfers. Which situation warrants the MOST immediate attention?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Cuentas de ex trabajadores que todavía permiten ingresar."
          },
          {
            "id": "b",
            "texto": "Que cada área utilice nombres diferentes para sus puestos."
          },
          {
            "id": "c",
            "texto": "Que las contraseñas tengan distinta longitud entre usuarios."
          },
          {
            "id": "d",
            "texto": "Que el formulario de contratación tenga muchas páginas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Active accounts belonging to terminated employees that still permit logon."
          },
          {
            "id": "b",
            "texto": "Inconsistent job title naming conventions across academic departments."
          },
          {
            "id": "c",
            "texto": "Varying password lengths among individual user accounts."
          },
          {
            "id": "d",
            "texto": "Excessive page length of HR onboarding forms."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "[Caso C: Cuentas universitarias] ¿Qué control ayudaría MEJOR a evitar que el problema de cuentas huérfanas y permisos acumulados reaparezca?",
        "preguntaEn": "[Case C: University Accounts] Which control would BEST prevent orphaned accounts and privilege creep from recurring?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Un proceso oportuno y verificable que vincule las altas, los cambios de puesto y las bajas de Recursos Humanos con la modificación de accesos."
          },
          {
            "id": "b",
            "texto": "Pedir a cada trabajador que avise cuando quiera cerrar su cuenta."
          },
          {
            "id": "c",
            "texto": "Revisar los accesos solo cuando ocurra un incidente."
          },
          {
            "id": "d",
            "texto": "Crear una cuenta compartida para cada facultad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A timely, auditable process linking HR onboarding, transfers, and terminations with access management changes."
          },
          {
            "id": "b",
            "texto": "Instructing departing staff to notify IT when closing their accounts."
          },
          {
            "id": "c",
            "texto": "Reviewing user permissions only after an unauthorized access incident."
          },
          {
            "id": "d",
            "texto": "Creating shared departmental generic accounts."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "[Caso C: Cuentas universitarias] Para verificar si los permisos corresponden a las funciones actuales, ¿quién debería participar principalmente en su revisión periódica?",
        "preguntaEn": "[Case C: University Accounts] To verify that access permissions align with current job roles, who should primarily participate in periodic user access reviews?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los responsables de las áreas o propietarios de la información, con apoyo de TI."
          },
          {
            "id": "b",
            "texto": "Solo el proveedor de internet."
          },
          {
            "id": "c",
            "texto": "Únicamente los propios usuarios, sin validación adicional."
          },
          {
            "id": "d",
            "texto": "El personal encargado del mantenimiento de equipos."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Business unit managers or information asset owners, supported by IT."
          },
          {
            "id": "b",
            "texto": "The corporate internet service provider."
          },
          {
            "id": "c",
            "texto": "End users themselves without supervisory validation."
          },
          {
            "id": "d",
            "texto": "Hardware maintenance facility technicians."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      }
    ],
    "3": [
      {
        "id": 1,
        "pregunta": "Una empresa creció rápidamente y el auditor debe elaborar su plan anual. Existen informes de auditorías anteriores, pero no una evaluación reciente de riesgos de TI. ¿Qué debería hacer PRIMERO?",
        "preguntaEn": "An enterprise grew rapidly and the auditor must prepare its annual plan. Previous audit reports exist, but no recent IT risk assessment is available. What should the auditor do FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Repetir las pruebas que detectaron más errores el año anterior."
          },
          {
            "id": "b",
            "texto": "Evaluar los riesgos de TI para establecer prioridades."
          },
          {
            "id": "c",
            "texto": "Solicitar a gerencia una lista de controles que desea revisar."
          },
          {
            "id": "d",
            "texto": "Seleccionar una muestra de transacciones críticas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Repeat the tests that detected the most exceptions in the prior year."
          },
          {
            "id": "b",
            "texto": "Perform an IT risk assessment to establish priorities."
          },
          {
            "id": "c",
            "texto": "Request from management a list of controls they want reviewed."
          },
          {
            "id": "d",
            "texto": "Select a sample of critical transactions."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 2,
        "pregunta": "El auditor quiere comprobar si todos los cambios realizados en producción fueron autorizados. ¿Cuál es la mejor forma de seleccionar la muestra?",
        "preguntaEn": "The auditor wants to verify whether all changes made in production were authorized. What is the best method to select the sample?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Tomar solicitudes de cambio aprobadas y verificar sus firmas."
          },
          {
            "id": "b",
            "texto": "Tomar cambios registrados en producción y rastrearlos hasta su autorización."
          },
          {
            "id": "c",
            "texto": "Entrevistar al responsable de desarrollo sobre el procedimiento."
          },
          {
            "id": "d",
            "texto": "Revisar únicamente los cambios clasificados como urgentes."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Select approved change requests and verify signatures."
          },
          {
            "id": "b",
            "texto": "Sample changes recorded in production and trace them back to their authorization."
          },
          {
            "id": "c",
            "texto": "Interview the development manager regarding the change procedure."
          },
          {
            "id": "d",
            "texto": "Review only changes classified as emergency changes."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 3,
        "pregunta": "Una organización compra nuevas herramientas de TI sin comprobar si apoyan sus objetivos de negocio. ¿Qué medida atendería MEJOR el problema?",
        "preguntaEn": "An organization acquires new IT tools without verifying whether they support business objectives. Which measure BEST addresses this issue?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentar la frecuencia de copias de seguridad."
          },
          {
            "id": "b",
            "texto": "Integrar la planificación e inversión de TI con la estrategia de la organización."
          },
          {
            "id": "c",
            "texto": "Encargar todas las compras al administrador de sistemas."
          },
          {
            "id": "d",
            "texto": "Exigir que cada proveedor ofrezca soporte permanente."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increase backup frequency."
          },
          {
            "id": "b",
            "texto": "Integrate IT planning and investment with organizational strategy."
          },
          {
            "id": "c",
            "texto": "Assign all procurement decisions to the systems administrator."
          },
          {
            "id": "d",
            "texto": "Require every vendor to provide 24/7 technical support."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 4,
        "pregunta": "Un comité aprueba proyectos tecnológicos, pero nadie supervisa si entregan los beneficios esperados. ¿Cuál es la principal deficiencia?",
        "preguntaEn": "A committee approves technology projects, but no one monitors whether they deliver expected benefits. What is the primary deficiency?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Falta de seguimiento de la generación de valor de las inversiones de TI."
          },
          {
            "id": "b",
            "texto": "Falta de cifrado en los sistemas utilizados por el comité."
          },
          {
            "id": "c",
            "texto": "Exceso de participación de la alta dirección."
          },
          {
            "id": "d",
            "texto": "Ausencia de pruebas de recuperación de desastres."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Lack of monitoring of value delivery from IT investments."
          },
          {
            "id": "b",
            "texto": "Lack of encryption in the systems used by the committee."
          },
          {
            "id": "c",
            "texto": "Excessive involvement of executive management."
          },
          {
            "id": "d",
            "texto": "Absence of disaster recovery testing."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 5,
        "pregunta": "Durante el desarrollo de un sistema de matrículas, los usuarios detectan al final que no se contempló la anulación de una inscripción. ¿Qué control habría reducido MEJOR este riesgo?",
        "preguntaEn": "During development of an enrollment system, users discover at the end that enrollment cancellation was omitted. Which control would have BEST reduced this risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentar la capacidad del servidor antes de instalar el sistema."
          },
          {
            "id": "b",
            "texto": "Obtener la revisión y aprobación de los requisitos por los usuarios responsables."
          },
          {
            "id": "c",
            "texto": "Ejecutar pruebas de penetración antes del despliegue."
          },
          {
            "id": "d",
            "texto": "Permitir que el programador agregue funciones después de la entrega."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Increase server capacity prior to system deployment."
          },
          {
            "id": "b",
            "texto": "Obtain requirements review and sign-off by responsible business users."
          },
          {
            "id": "c",
            "texto": "Perform penetration testing prior to deployment."
          },
          {
            "id": "d",
            "texto": "Allow developers to add functionality after handover."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 6,
        "pregunta": "Una institución migra los expedientes de sus alumnos a un sistema nuevo. ¿Cuál es la MEJOR evidencia de que la migración conservó los datos completos y correctos?",
        "preguntaEn": "An institution migrates student records to a new system. What is the BEST evidence that migration preserved complete and accurate data?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El nuevo sistema inicia sin mostrar errores."
          },
          {
            "id": "b",
            "texto": "Los usuarios recibieron capacitación."
          },
          {
            "id": "c",
            "texto": "Se conciliaron cantidades y totales clave entre el origen y el destino, investigando las diferencias."
          },
          {
            "id": "d",
            "texto": "El proveedor confirmó por correo que terminó la migración."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The new system boots without displaying errors."
          },
          {
            "id": "b",
            "texto": "Users received comprehensive operational training."
          },
          {
            "id": "c",
            "texto": "Reconciliation of key counts and totals between source and destination was performed and discrepancies investigated."
          },
          {
            "id": "d",
            "texto": "The vendor confirmed completion via email."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 7,
        "pregunta": "Una clínica necesita recuperar su sistema de atención tras una interrupción. Antes de decidir qué infraestructura contratar, ¿qué debería definir PRIMERO?",
        "preguntaEn": "A clinic needs to recover its healthcare system after an outage. Before deciding what infrastructure to contract, what should be defined FIRST?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La marca de los servidores de respaldo."
          },
          {
            "id": "b",
            "texto": "Los procesos críticos y sus necesidades de recuperación mediante un análisis de impacto en el negocio."
          },
          {
            "id": "c",
            "texto": "El número de técnicos que trabajarán de noche."
          },
          {
            "id": "d",
            "texto": "La frecuencia de actualización del antivirus."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The hardware brand of backup servers."
          },
          {
            "id": "b",
            "texto": "Critical business processes and recovery requirements through a business impact analysis."
          },
          {
            "id": "c",
            "texto": "The number of technicians on the night shift."
          },
          {
            "id": "d",
            "texto": "The antivirus definition update frequency."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 8,
        "pregunta": "Una empresa ejecuta copias de seguridad diarias y recibe mensajes de «respaldo completado». ¿Qué prueba ofrece la evidencia MÁS sólida de que podrá recuperar el servicio?",
        "preguntaEn": "An enterprise runs daily backups and receives 'backup completed' status logs. Which test provides the STRONGEST evidence that service can be recovered?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Comprobar que existe espacio libre en el almacenamiento."
          },
          {
            "id": "b",
            "texto": "Revisar que el programa de respaldo está instalado."
          },
          {
            "id": "c",
            "texto": "Restaurar periódicamente datos y verificar que sean utilizables."
          },
          {
            "id": "d",
            "texto": "Preguntar al administrador si conoce el procedimiento."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Verifying that free storage space exists on media."
          },
          {
            "id": "b",
            "texto": "Checking that backup software is properly installed."
          },
          {
            "id": "c",
            "texto": "Periodically restoring data and verifying that it is usable."
          },
          {
            "id": "d",
            "texto": "Asking the administrator if they know the procedure."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 9,
        "pregunta": "En un sistema financiero, cuatro administradores utilizan la misma cuenta privilegiada. ¿Cuál es el riesgo MÁS importante?",
        "preguntaEn": "In a financial system, four administrators share the same privileged account. What is the MOST significant risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Aumentará el tiempo de inicio de sesión."
          },
          {
            "id": "b",
            "texto": "No será posible atribuir con confianza las acciones a cada persona."
          },
          {
            "id": "c",
            "texto": "Los usuarios tendrán que recordar más contraseñas."
          },
          {
            "id": "d",
            "texto": "El sistema necesitará más capacidad de almacenamiento."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Login time will increase."
          },
          {
            "id": "b",
            "texto": "Actions cannot be reliably attributed to individual users."
          },
          {
            "id": "c",
            "texto": "Users will need to memorize more passwords."
          },
          {
            "id": "d",
            "texto": "The system will require greater storage capacity."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 10,
        "pregunta": "Una universidad permite acceso remoto a expedientes con datos personales. Ya utiliza contraseñas, pero se detectaron intentos de acceso con credenciales robadas. ¿Qué control reduciría MEJOR ese riesgo?",
        "preguntaEn": "A university allows remote access to student records containing personal data. Passwords are used, but credential-stuffing attacks were detected. Which control BEST reduces this risk?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Autenticación multifactor para el acceso remoto."
          },
          {
            "id": "b",
            "texto": "Cambiar el nombre visible del portal."
          },
          {
            "id": "c",
            "texto": "Ampliar la capacidad de la base de datos."
          },
          {
            "id": "d",
            "texto": "Publicar las contraseñas en una intranet restringida."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Multi-factor authentication for remote access."
          },
          {
            "id": "b",
            "texto": "Changing the public portal URL name."
          },
          {
            "id": "c",
            "texto": "Expanding database storage capacity."
          },
          {
            "id": "d",
            "texto": "Publishing passwords on a restricted intranet."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 11,
        "pregunta": "[Caso A: Cambios en entidad financiera] Un banco actualiza con frecuencia su sistema de créditos. Algunos cambios urgentes se aplican directamente en producción sin registrar siempre quién hizo el despliegue. Si el auditor busca cambios no autorizados, ¿cuál sería su MEJOR punto de partida?",
        "preguntaEn": "[Case A: Financial Institution Changes] A bank frequently updates its credit processing system. Emergency changes are applied directly to production without consistent logs of deployers. If the auditor seeks unauthorized changes, what is the BEST starting point?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La carpeta de solicitudes aprobadas."
          },
          {
            "id": "b",
            "texto": "El registro de cambios efectivamente aplicados en producción."
          },
          {
            "id": "c",
            "texto": "El presupuesto del proyecto."
          },
          {
            "id": "d",
            "texto": "Las actas de capacitación de usuarios."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The repository of approved change tickets."
          },
          {
            "id": "b",
            "texto": "The log of changes actually implemented in production."
          },
          {
            "id": "c",
            "texto": "The project budget sheet."
          },
          {
            "id": "d",
            "texto": "User training attendance logs."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 12,
        "pregunta": "[Caso A: Cambios en entidad financiera] ¿Qué hallazgo representa el riesgo MÁS directo para la integridad del cálculo de créditos?",
        "preguntaEn": "[Case A: Financial Institution Changes] Which finding represents the MOST direct risk to the integrity of credit calculations?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los cambios urgentes no siempre tienen pruebas documentadas antes de su aplicación."
          },
          {
            "id": "b",
            "texto": "El equipo utiliza nombres cortos para las versiones."
          },
          {
            "id": "c",
            "texto": "La reunión semanal dura más de una hora."
          },
          {
            "id": "d",
            "texto": "Los usuarios solicitan nuevas funciones por correo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Emergency changes lack documented testing prior to production release."
          },
          {
            "id": "b",
            "texto": "The team uses abbreviated version names."
          },
          {
            "id": "c",
            "texto": "The weekly status meeting exceeds one hour."
          },
          {
            "id": "d",
            "texto": "Users request new enhancements via email."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 13,
        "pregunta": "[Caso A: Cambios en entidad financiera] El banco afirma que todos los cambios urgentes se revisan después de implementarlos. ¿Qué evidencia debería buscar el auditor?",
        "preguntaEn": "[Case A: Financial Institution Changes] The bank asserts all emergency changes are reviewed post-implementation. What evidence should the auditor seek?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Una declaración verbal del jefe de desarrollo."
          },
          {
            "id": "b",
            "texto": "La política general de TI, aunque no incluya excepciones."
          },
          {
            "id": "c",
            "texto": "Registros de revisión posterior, aprobación y resolución de problemas para una muestra de cambios urgentes."
          },
          {
            "id": "d",
            "texto": "La lista de empleados del banco."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A verbal statement from the development lead."
          },
          {
            "id": "b",
            "texto": "The general IT policy, even if silent on exceptions."
          },
          {
            "id": "c",
            "texto": "Post-implementation review records, approvals, and issue logs for a sample of emergency changes."
          },
          {
            "id": "d",
            "texto": "The corporate employee roster."
          }
        ],
        "respuestaCorrectaId": "c",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 14,
        "pregunta": "[Caso A: Cambios en entidad financiera] Un desarrollador puede programar, aprobar y desplegar por sí mismo un cambio. ¿Cuál es la MEJOR recomendación?",
        "preguntaEn": "[Case A: Financial Institution Changes] A developer can code, approve, and deploy changes autonomously. What is the BEST recommendation?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Separar esas funciones o establecer una revisión independiente documentada cuando la separación no sea viable."
          },
          {
            "id": "b",
            "texto": "Permitirlo siempre que el desarrollador tenga experiencia."
          },
          {
            "id": "c",
            "texto": "Eliminar el registro de cambios para reducir demoras."
          },
          {
            "id": "d",
            "texto": "Revisar únicamente los cambios que produzcan una caída del sistema."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Segregate these functions or establish documented independent review when segregation is unfeasible."
          },
          {
            "id": "b",
            "texto": "Permit it provided the developer has sufficient seniority."
          },
          {
            "id": "c",
            "texto": "Eliminate change logging to minimize deployment latency."
          },
          {
            "id": "d",
            "texto": "Review only changes that result in unexpected system outages."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 15,
        "pregunta": "[Caso B: Servicios tercerizados] Una clínica utiliza un proveedor en la nube para historias clínicas. No ha definido tolerancia a caídas ni pérdida de datos. ¿Qué debería hacer la clínica PRIMERO para establecer requisitos de recuperación adecuados?",
        "preguntaEn": "[Case B: Outsourced Services] A clinic uses a cloud provider for electronic health records without defining tolerated downtime or data loss thresholds. What should the clinic do FIRST to establish recovery targets?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Comprar otro servicio de respaldo inmediatamente."
          },
          {
            "id": "b",
            "texto": "Realizar un análisis de impacto en el negocio con los responsables de los procesos clínicos."
          },
          {
            "id": "c",
            "texto": "Aceptar los tiempos de recuperación que ofrece el proveedor por defecto."
          },
          {
            "id": "d",
            "texto": "Aumentar el número de cuentas de administrador."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Contract an additional backup provider immediately."
          },
          {
            "id": "b",
            "texto": "Conduct a business impact analysis with clinical process owners."
          },
          {
            "id": "c",
            "texto": "Accept the default vendor recovery timeframes."
          },
          {
            "id": "d",
            "texto": "Increase the number of administrative accounts."
          }
        ],
        "respuestaCorrectaId": "b",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 16,
        "pregunta": "[Caso B: Servicios tercerizados] ¿Qué información permitiría evaluar MEJOR si el servicio contratado cubre las necesidades de recuperación?",
        "preguntaEn": "[Case B: Outsourced Services] Which information would BEST assess whether contracted cloud services meet recovery needs?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los objetivos de tiempo y punto de recuperación definidos por la clínica, comparados con los compromisos y capacidades comprobadas del proveedor."
          },
          {
            "id": "b",
            "texto": "La cantidad de clientes que tiene el proveedor."
          },
          {
            "id": "c",
            "texto": "El precio mensual del servicio."
          },
          {
            "id": "d",
            "texto": "La ubicación de la oficina comercial del proveedor."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "RTO and RPO defined by the clinic compared against contracted and demonstrated vendor capabilities."
          },
          {
            "id": "b",
            "texto": "The total customer count of the cloud provider."
          },
          {
            "id": "c",
            "texto": "The monthly subscription cost."
          },
          {
            "id": "d",
            "texto": "The physical address of the vendor sales office."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 17,
        "pregunta": "[Caso B: Servicios tercerizados] El proveedor entrega informes que indican que los respaldos terminaron correctamente. ¿Qué debería solicitar el auditor para comprobar su utilidad?",
        "preguntaEn": "[Case B: Outsourced Services] The vendor provides logs stating backups completed successfully. What should the auditor request to confirm their utility?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Una demostración o evidencia de pruebas de restauración satisfactorias."
          },
          {
            "id": "b",
            "texto": "Una copia del logotipo del proveedor."
          },
          {
            "id": "c",
            "texto": "El listado de precios del próximo año."
          },
          {
            "id": "d",
            "texto": "Una explicación oral de cómo funciona la nube."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Demonstration or evidence of successful restoration test results."
          },
          {
            "id": "b",
            "texto": "A certified copy of the vendor corporate logo."
          },
          {
            "id": "c",
            "texto": "Next year upcoming pricing sheet."
          },
          {
            "id": "d",
            "texto": "An oral overview of cloud architecture."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 18,
        "pregunta": "[Caso C: Cuentas universitarias] Una revisión encontró cuentas activas de ex trabajadores y permisos que algunos empleados conservaron tras cambiar de puesto. ¿Qué situación requiere la atención MÁS inmediata?",
        "preguntaEn": "[Case C: University Accounts] An audit revealed active accounts of terminated staff and lingering privileges after role transfers. Which situation warrants the MOST immediate attention?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Cuentas de ex trabajadores que todavía permiten ingresar."
          },
          {
            "id": "b",
            "texto": "Que cada área utilice nombres diferentes para sus puestos."
          },
          {
            "id": "c",
            "texto": "Que las contraseñas tengan distinta longitud entre usuarios."
          },
          {
            "id": "d",
            "texto": "Que el formulario de contratación tenga muchas páginas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Active accounts belonging to terminated employees that still permit logon."
          },
          {
            "id": "b",
            "texto": "Inconsistent job title naming conventions across academic departments."
          },
          {
            "id": "c",
            "texto": "Varying password lengths among individual user accounts."
          },
          {
            "id": "d",
            "texto": "Excessive page length of HR onboarding forms."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 19,
        "pregunta": "[Caso C: Cuentas universitarias] ¿Qué control ayudaría MEJOR a evitar que el problema de cuentas huérfanas y permisos acumulados reaparezca?",
        "preguntaEn": "[Case C: University Accounts] Which control would BEST prevent orphaned accounts and privilege creep from recurring?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Un proceso oportuno y verificable que vincule las altas, los cambios de puesto y las bajas de Recursos Humanos con la modificación de accesos."
          },
          {
            "id": "b",
            "texto": "Pedir a cada trabajador que avise cuando quiera cerrar su cuenta."
          },
          {
            "id": "c",
            "texto": "Revisar los accesos solo cuando ocurra un incidente."
          },
          {
            "id": "d",
            "texto": "Crear una cuenta compartida para cada facultad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "A timely, auditable process linking HR onboarding, transfers, and terminations with access management changes."
          },
          {
            "id": "b",
            "texto": "Instructing departing staff to notify IT when closing their accounts."
          },
          {
            "id": "c",
            "texto": "Reviewing user permissions only after an unauthorized access incident."
          },
          {
            "id": "d",
            "texto": "Creating shared departmental generic accounts."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      },
      {
        "id": 20,
        "pregunta": "[Caso C: Cuentas universitarias] Para verificar si los permisos corresponden a las funciones actuales, ¿quién debería participar principalmente en su revisión periódica?",
        "preguntaEn": "[Case C: University Accounts] To verify that access permissions align with current job roles, who should primarily participate in periodic user access reviews?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Los responsables de las áreas o propietarios de la información, con apoyo de TI."
          },
          {
            "id": "b",
            "texto": "Solo el proveedor de internet."
          },
          {
            "id": "c",
            "texto": "Únicamente los propios usuarios, sin validación adicional."
          },
          {
            "id": "d",
            "texto": "El personal encargado del mantenimiento de equipos."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Business unit managers or information asset owners, supported by IT."
          },
          {
            "id": "b",
            "texto": "The corporate internet service provider."
          },
          {
            "id": "c",
            "texto": "End users themselves without supervisory validation."
          },
          {
            "id": "d",
            "texto": "Hardware maintenance facility technicians."
          }
        ],
        "respuestaCorrectaId": "a",
        "justificacion": "",
        "justificacionEn": ""
      }
    ]
  },
  "multiples": {
    "1": [
      {
        "id": 1,
        "tipo": "multiple",
        "pregunta": "Respecto al Estatuto de Auditoría (Audit Charter) según las directrices de ISACA, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the Audit Charter according to ISACA guidelines, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Define la autoridad, alcance global y responsabilidades del auditor de SI."
          },
          {
            "id": "b",
            "texto": "Debe ser aprobado formalmente por el Comité de Auditoría o la Junta Directiva."
          },
          {
            "id": "c",
            "texto": "Establece la rendición de cuentas (accountability) e independencia de la función de auditoría."
          },
          {
            "id": "d",
            "texto": "Debe redactarse nuevamente para cada encargo de auditoría individual."
          },
          {
            "id": "e",
            "texto": "Reemplaza la necesidad de realizar un plan de auditoría basado en riesgos."
          },
          {
            "id": "f",
            "texto": "Otorga el derecho de acceso a la información y sistemas necesarios para cumplir con su mandato."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Defines the authority, overall scope, and responsibilities of the IS auditor."
          },
          {
            "id": "b",
            "texto": "Must be formally approved by the Audit Committee or the Board of Directors."
          },
          {
            "id": "c",
            "texto": "Establishes accountability and independence of the audit function."
          },
          {
            "id": "d",
            "texto": "Must be drafted anew for each individual audit engagement."
          },
          {
            "id": "e",
            "texto": "Replaces the requirement to perform a risk-based audit plan."
          },
          {
            "id": "f",
            "texto": "Grants the right of access to information and systems necessary to fulfill its mandate."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B, C y F definen la naturaleza del Audit Charter: fija el mandato supremo, independencia, responsabilidad, acceso institucional y aprobación por el máximo órgano de gobierno.\n\nD es incorrecto: el estatuto es un documento marco de gobernanza permanente, no se elabora por auditoría individual.\n\nE es falso: el estatuto autoriza la función, pero la planificación basada en riesgos sigue siendo obligatoria.",
        "justificacionEn": "A, B, C, and F define the nature of the Audit Charter: it sets the supreme mandate, independence, accountability, institutional access, and approval by the highest governing body.\n\nD is incorrect: the charter is an enduring governance framework document, not drafted per audit engagement.\n\nE is false: the charter authorizes the function, but risk-based planning remains mandatory."
      },
      {
        "id": 2,
        "tipo": "multiple",
        "pregunta": "Sobre las pruebas de auditoría y su metodología técnica, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding audit testing and its technical methodology, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Las pruebas de cumplimiento verifican si los controles internos operan de forma efectiva y consistente."
          },
          {
            "id": "b",
            "texto": "Las pruebas sustantivas evalúan directamente la validez, exactitud e integridad de los datos y transacciones."
          },
          {
            "id": "c",
            "texto": "Si las pruebas de cumplimiento demuestran controles deficientes, se debe aumentar la extensión de las pruebas sustantivas."
          },
          {
            "id": "d",
            "texto": "Las pruebas de cumplimiento utilizan exclusivamente muestreo por variables monetarias."
          },
          {
            "id": "e",
            "texto": "Las pruebas sustantivas se eliminan si la empresa cuenta con un marco COBIT implementado."
          },
          {
            "id": "f",
            "texto": "El recálculo de intereses bancarios y el cotejo de saldos contra registros de base de datos son pruebas sustantivas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Compliance tests verify whether internal controls operate effectively and consistently."
          },
          {
            "id": "b",
            "texto": "Substantive tests directly evaluate the validity, accuracy, and completeness of data and transactions."
          },
          {
            "id": "c",
            "texto": "If compliance tests reveal deficient controls, the extent of substantive testing must be increased."
          },
          {
            "id": "d",
            "texto": "Compliance tests exclusively use monetary unit sampling (variable sampling)."
          },
          {
            "id": "e",
            "texto": "Substantive tests are eliminated if the enterprise has a COBIT framework implemented."
          },
          {
            "id": "f",
            "texto": "Recalculating bank interest and cross-checking ledger balances against database records are substantive tests."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B y F corresponden a las definiciones exactas de pruebas de cumplimiento (de controles) y pruebas sustantivas (de saldos y datos).\n\nC es la regla de auditoría inversa: a menor efectividad del control, mayor prueba sustantiva para reducir el riesgo de detección.\n\nD es falso: las pruebas de cumplimiento usan muestreo de atributos.\n\nE es incorrecto: ningún marco de gobierno elimina las pruebas sustantivas.",
        "justificacionEn": "A, B, and F correspond to the exact definitions of compliance testing (controls) and substantive testing (balances and data).\n\nC is the inverse audit relationship: lower control effectiveness requires greater substantive testing to reduce detection risk.\n\nD is false: compliance testing uses attribute sampling.\n\nE is incorrect: no governance framework eliminates substantive tests."
      },
      {
        "id": 3,
        "tipo": "multiple",
        "pregunta": "En relación con las técnicas de muestreo de auditoría en sistemas de información, identifique las opciones CORRECTAS:",
        "preguntaEn": "Regarding audit sampling techniques in information systems, identify the CORRECT statements:",
        "alternativas": [
          {
            "id": "a",
            "texto": "El muestreo de atributos se utiliza principalmente en pruebas de cumplimiento para evaluar tasas de ocurrencia."
          },
          {
            "id": "b",
            "texto": "El muestreo por variables se emplea para estimar magnitudes numéricas o valores monetarios en pruebas sustantivas."
          },
          {
            "id": "c",
            "texto": "El muestreo de descubrimiento (discovery sampling) es aplicable cuando se sospecha fraude o incumplimientos graves."
          },
          {
            "id": "d",
            "texto": "El riesgo de muestreo es la probabilidad de que la muestra seleccionada no represente las características de la población."
          },
          {
            "id": "e",
            "texto": "El muestreo no estadístico permite calcular de forma matemática y exacta el intervalo de confianza."
          },
          {
            "id": "f",
            "texto": "En un muestreo de descubrimiento, encontrar un solo error certifica que el control opera con normalidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Attribute sampling is primarily used in compliance testing to evaluate occurrence rates."
          },
          {
            "id": "b",
            "texto": "Variable sampling is used to estimate numerical amounts or monetary values in substantive tests."
          },
          {
            "id": "c",
            "texto": "Discovery sampling is applicable when fraud or severe non-compliance is suspected."
          },
          {
            "id": "d",
            "texto": "Sampling risk is the probability that the chosen sample does not represent population characteristics."
          },
          {
            "id": "e",
            "texto": "Non-statistical sampling allows for mathematical and exact calculation of the confidence interval."
          },
          {
            "id": "f",
            "texto": "In discovery sampling, finding a single error confirms that the control operates normally."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son principios matemáticos y metodológicos del muestreo de auditoría de ISACA.\n\nE es falso: solo el muestreo estadístico permite la medición matemática objetiva del riesgo de muestreo.\n\nF es falso: en descubrimiento, si se detecta un solo fallo, se presume comprometida toda la población.",
        "justificacionEn": "A, B, C, and D are mathematical and methodological principles of ISACA audit sampling.\n\nE is false: only statistical sampling allows objective mathematical measurement of sampling risk.\n\nF is false: in discovery sampling, if a single flaw is found, the entire population is presumed compromised."
      },
      {
        "id": 4,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de las siguientes son herramientas o técnicas aplicables en Técnicas de Auditoría Asistidas por Computadora (CAATs) y aseguramiento continuo?",
        "preguntaEn": "Which of the following are tools or techniques applicable to Computer-Assisted Audit Techniques (CAATs) and continuous assurance?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Software de Auditoría Generalizado (GAS como ACL o IDEA)"
          },
          {
            "id": "b",
            "texto": "Módulos de auditoría embebidos (como SCARF o EAM)"
          },
          {
            "id": "c",
            "texto": "Entornos de desarrollo integrados (IDE como Visual Studio o Eclipse)"
          },
          {
            "id": "d",
            "texto": "Sistemas integrados de compilación continua (Jenkins o GitHub Actions)"
          },
          {
            "id": "e",
            "texto": "Archivos o datos de prueba procesados en el sistema (Test Data)"
          },
          {
            "id": "f",
            "texto": "Monitoreo continuo automatizado de transacciones y controles (Continuous Auditing)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Generalized Audit Software (GAS such as ACL or IDEA)"
          },
          {
            "id": "b",
            "texto": "Embedded audit modules (such as SCARF or EAM)"
          },
          {
            "id": "c",
            "texto": "Integrated development environments (IDEs such as Visual Studio or Eclipse)"
          },
          {
            "id": "d",
            "texto": "Continuous integration/build systems (such as Jenkins or GitHub Actions)"
          },
          {
            "id": "e",
            "texto": "Test data files processed through the system (Test Data)"
          },
          {
            "id": "f",
            "texto": "Automated continuous transaction and control monitoring (Continuous Auditing)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "e",
          "f"
        ],
        "justificacion": "A, B, E y F corresponden a técnicas de CAATs para extracción, análisis de datos y monitoreo de transacciones.\n\nC y D son herramientas exclusivas de desarrollo de software y DevOps, no técnicas de auditoría asistida.",
        "justificacionEn": "A, B, E, and F are CAATs techniques for data extraction, analytics, and transaction monitoring.\n\nC and D are software engineering and DevOps tools, not computer-assisted audit techniques."
      },
      {
        "id": 5,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes son ejemplos de controles DETECTIVOS en sistemas de información?",
        "preguntaEn": "Which of the following are examples of DETECTIVE controls in information systems?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisión y análisis periódico de bitácoras (audit trails)"
          },
          {
            "id": "b",
            "texto": "Conciliaciones bancarias y de saldos transaccionales a fin de mes"
          },
          {
            "id": "c",
            "texto": "Cifrado robusto de bases de datos en reposo mediante AES-256"
          },
          {
            "id": "d",
            "texto": "Sistemas de detección de intrusiones en red (NIDS)"
          },
          {
            "id": "e",
            "texto": "Restauración de datos a partir de copias de seguridad en cinta"
          },
          {
            "id": "f",
            "texto": "Verificación de totales de control (hash totals) al cierre de lotes"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Periodic review and analysis of audit logs/trails"
          },
          {
            "id": "b",
            "texto": "Month-end bank and transactional balance reconciliations"
          },
          {
            "id": "c",
            "texto": "Strong database encryption at rest using AES-256"
          },
          {
            "id": "d",
            "texto": "Network intrusion detection systems (NIDS)"
          },
          {
            "id": "e",
            "texto": "Data restoration from tape backup copies"
          },
          {
            "id": "f",
            "texto": "Verification of control totals (hash totals) at batch closing"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "f"
        ],
        "justificacion": "A, B, D y F alertan o descubren la ocurrencia de una anomalía o error una vez que ha sucedido.\n\nC es un control preventivo (impide la lectura ilegítima).\n\nE es un control correctivo (repara el daño tras un fallo).",
        "justificacionEn": "A, B, D, and F alert or discover anomalies and errors after they have occurred.\n\nC is a preventive control (prevents illegitimate access).\n\nE is a corrective control (repairs damage following an outage or disruption)."
      },
      {
        "id": 6,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes son ejemplos de controles CORRECTIVOS en auditoría de sistemas?",
        "preguntaEn": "Which of the following are examples of CORRECTIVE controls in systems auditing?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Procedimientos de conmutación por error automatizada (failover)"
          },
          {
            "id": "b",
            "texto": "Políticas de contraseñas robustas y bloqueo automático por intentos fallidos"
          },
          {
            "id": "c",
            "texto": "Restauración de bases de datos a partir de respaldos (backups)"
          },
          {
            "id": "d",
            "texto": "Activación del Plan de Recuperación ante Desastres (DRP) tras un corte"
          },
          {
            "id": "e",
            "texto": "Listas de control de acceso (ACL) configuradas en el firewall perimetral"
          },
          {
            "id": "f",
            "texto": "Aislamiento, limpieza y reinstalación de un servidor infectado con malware"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Automated failover procedures"
          },
          {
            "id": "b",
            "texto": "Strong password policies and automatic lockout upon failed attempts"
          },
          {
            "id": "c",
            "texto": "Database restoration from backups"
          },
          {
            "id": "d",
            "texto": "Disaster Recovery Plan (DRP) activation following an outage"
          },
          {
            "id": "e",
            "texto": "Access control lists (ACLs) configured on the perimeter firewall"
          },
          {
            "id": "f",
            "texto": "Isolation, remediation, and reinstallation of a malware-infected server"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "c",
          "d",
          "f"
        ],
        "justificacion": "A, C, D y F entran en acción después del incidente para restaurar la operatividad y mitigar el daño.\n\nB y E son controles preventivos que bloquean incidentes antes de que ocurran.",
        "justificacionEn": "A, C, D, and F take action after an incident to restore normal operations and mitigate damage.\n\nB and E are preventive controls designed to block incidents before they occur."
      },
      {
        "id": 7,
        "tipo": "multiple",
        "pregunta": "Respecto a la evidencia de auditoría y los papeles de trabajo (audit workpapers), ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding audit evidence and audit workpapers, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La evidencia obtenida directamente por el auditor es más confiable que la entregada por el personal auditado."
          },
          {
            "id": "b",
            "texto": "La evidencia debe satisfacer los atributos de ser suficiente y apropiada/competente."
          },
          {
            "id": "c",
            "texto": "Las declaraciones verbales de la gerencia poseen mayor jerarquía probatoria que las bitácoras del sistema."
          },
          {
            "id": "d",
            "texto": "Los papeles de trabajo documentan la planificación, las pruebas ejecutadas, la evidencia y las conclusiones."
          },
          {
            "id": "e",
            "texto": "Confirmaciones escritas de terceros independientes ofrecen mayor confiabilidad que reportes internos."
          },
          {
            "id": "f",
            "texto": "Los papeles de trabajo deben ser destruidos inmediatamente tras entregar el informe por confidencialidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Evidence obtained directly by the auditor is more reliable than evidence supplied by auditee personnel."
          },
          {
            "id": "b",
            "texto": "Evidence must satisfy the criteria of being sufficient and appropriate/competent."
          },
          {
            "id": "c",
            "texto": "Oral statements from management carry higher evidentiary weight than automated system logs."
          },
          {
            "id": "d",
            "texto": "Workpapers document the planning, audit procedures performed, evidence gathered, and conclusions reached."
          },
          {
            "id": "e",
            "texto": "Written confirmations from independent third parties offer greater reliability than internal reports."
          },
          {
            "id": "f",
            "texto": "Workpapers must be destroyed immediately upon report delivery to preserve confidentiality."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E reflejan la jerarquía y requisitos de la evidencia según ITAF: la evidencia directa y de terceros externos siempre tiene mayor peso probatorio, y los papeles de trabajo respaldan las conclusiones.\n\nC es falso: el testimonio oral es la evidencia menos confiable.\n\nF es incorrecto: los papeles de trabajo deben custodiarse según las políticas de retención de la organización.",
        "justificacionEn": "A, B, D, and E reflect ITAF evidence hierarchy and standards: direct and third-party external evidence holds higher evidentiary value, and workpapers substantiate audit findings.\n\nC is false: oral testimony is the least reliable form of evidence.\n\nF is incorrect: workpapers must be retained according to corporate record retention policies."
      },
      {
        "id": 8,
        "tipo": "multiple",
        "pregunta": "Al documentar un hallazgo formal de auditoría según los estándares de ISACA, ¿cuáles elementos constituyen su estructura obligatoria?",
        "preguntaEn": "When documenting a formal audit finding according to ISACA standards, which elements constitute its mandatory structure?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Condición (la situación real observada en el examen)"
          },
          {
            "id": "b",
            "texto": "Criterio (la norma, estándar, ley o política que debe cumplirse)"
          },
          {
            "id": "c",
            "texto": "Causa (la razón de fondo por la cual ocurrió la desviación)"
          },
          {
            "id": "d",
            "texto": "Efecto o Impacto (el riesgo o consecuencia material de la falla)"
          },
          {
            "id": "e",
            "texto": "Asignación de puntos de historia y diagramas de casos de uso"
          },
          {
            "id": "f",
            "texto": "Recomendación (la acción constructiva propuesta para subsanar la causa)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Condition (the factual situation observed during the review)"
          },
          {
            "id": "b",
            "texto": "Criteria (the standard, policy, regulation, or law being measured against)"
          },
          {
            "id": "c",
            "texto": "Cause (the underlying reason why the deviation occurred)"
          },
          {
            "id": "d",
            "texto": "Effect or Impact (the risk exposure or material consequence of the deficiency)"
          },
          {
            "id": "e",
            "texto": "Story point estimation and UML use-case diagrams"
          },
          {
            "id": "f",
            "texto": "Recommendation (the constructive action proposed to remediate the root cause)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d",
          "f"
        ],
        "justificacion": "A, B, C, D y F conforman la estructura clásica del hallazgo: Condición, Criterio, Causa, Efecto y Recomendación.\n\nE pertenece a metodologías de desarrollo de software (Scrum/UML), ajenas a la redacción del hallazgo.",
        "justificacionEn": "A, B, C, D, and F constitute the classic audit finding structure: Condition, Criteria, Cause, Effect, and Recommendation.\n\nE belongs to software engineering methodologies (Scrum/UML) and is unrelated to audit findings."
      },
      {
        "id": 9,
        "tipo": "multiple",
        "pregunta": "En relación con la etapa de reporte y seguimiento (follow-up) de la auditoría de SI, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the reporting and follow-up phase of an IS audit, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El borrador del informe debe discutirse con los directores de área en una reunión de cierre previa."
          },
          {
            "id": "b",
            "texto": "El auditor de SI es el encargado de implementar materialmente los parches y cambios recomendados."
          },
          {
            "id": "c",
            "texto": "El proceso de seguimiento evalúa si la administración adoptó medidas correctivas oportunas."
          },
          {
            "id": "d",
            "texto": "Si la gerencia decide aceptar un riesgo residual importante, dicha decisión debe informarse al Directorio."
          },
          {
            "id": "e",
            "texto": "Las recomendaciones deben ser prácticas, realizables y orientadas a la causa raíz."
          },
          {
            "id": "f",
            "texto": "Las actividades de seguimiento se anulan si el personal auditado firma acuerdos de confidencialidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The draft report should be discussed with area management during an exit/closing conference."
          },
          {
            "id": "b",
            "texto": "The IS auditor is responsible for hands-on operational implementation of recommended patches and changes."
          },
          {
            "id": "c",
            "texto": "The follow-up process evaluates whether management took timely and appropriate corrective actions."
          },
          {
            "id": "d",
            "texto": "If management decides to accept significant residual risk, this decision must be reported to the Board."
          },
          {
            "id": "e",
            "texto": "Recommendations must be practical, achievable, and addressed to the root cause."
          },
          {
            "id": "f",
            "texto": "Follow-up activities are cancelled if auditee personnel sign non-disclosure agreements."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "c",
          "d",
          "e"
        ],
        "justificacion": "A, C, D y E cumplen el proceso de cierre y monitoreo de compromisos según ITAF: se socializan hallazgos, se hace seguimiento y la aceptación de riesgos altos se escala al gobierno corporativo.\n\nB es falso: el auditor pierde independencia si ejecuta la remediación operativa.\n\nF es falso: los acuerdos de confidencialidad no eximen el seguimiento de debilidades de control.",
        "justificacionEn": "A, C, D, and E adhere to ITAF closing and monitoring standards: findings are vetted with management, follow-up assesses remediation, and significant risk acceptance is escalated to the governing board.\n\nB is false: the auditor compromises independence by executing operational remediation.\n\nF is false: NDAs do not waive control remediation follow-up."
      },
      {
        "id": 10,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes corresponden a controles FÍSICOS o AMBIENTALES en un centro de cómputo?",
        "preguntaEn": "Which of the following correspond to PHYSICAL or ENVIRONMENTAL controls in a data center?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Sistemas de supresión de incendios mediante agentes limpios (FM-200 o Novec)"
          },
          {
            "id": "b",
            "texto": "Dispositivos de autenticación biométrica en la puerta de la sala de servidores"
          },
          {
            "id": "c",
            "texto": "Sistemas de Alimentación Ininterrumpida (UPS) y motogeneradores eléctricos"
          },
          {
            "id": "d",
            "texto": "Filtrado de paquetes mediante inspección con estado en el firewall"
          },
          {
            "id": "e",
            "texto": "Sensores de detección de aniego y monitoreo de temperatura/humedad relativa"
          },
          {
            "id": "f",
            "texto": "Cifrado de enlaces punto a punto con IPsec en modo transporte"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Clean-agent fire suppression systems (such as FM-200 or Novec)"
          },
          {
            "id": "b",
            "texto": "Biometric authentication access devices on the server room door"
          },
          {
            "id": "c",
            "texto": "Uninterruptible Power Supply (UPS) systems and diesel generators"
          },
          {
            "id": "d",
            "texto": "Packet filtering through stateful inspection firewalls"
          },
          {
            "id": "e",
            "texto": "Water leakage detection sensors and temperature/relative humidity monitoring"
          },
          {
            "id": "f",
            "texto": "Point-to-point link encryption using IPsec in transport mode"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "e"
        ],
        "justificacion": "A, B, C y E resguardan las instalaciones físicas y condiciones ambientales frente a intrusiones y desastres naturales.\n\nD y F son controles lógicos o técnicos aplicados a la red de datos.",
        "justificacionEn": "A, B, C, and E safeguard physical facilities and environmental parameters against intrusion and physical disasters.\n\nD and F are logical and technical network security controls."
      }
    ],
    "2": [
      {
        "id": 11,
        "tipo": "multiple",
        "pregunta": "Sobre las estructuras organizacionales de gobernanza y alineación de TI, ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding IT governance organizational structures and business alignment, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Comité de Estrategia de TI a nivel del Directorio supervisa la dirección general y las grandes inversiones."
          },
          {
            "id": "b",
            "texto": "El Comité de Dirección de TI (IT Steering Committee) prioriza proyectos y supervisa la entrega operativa."
          },
          {
            "id": "c",
            "texto": "El departamento de TI debe reportar formalmente al CFO para garantizar la reducción de costos."
          },
          {
            "id": "d",
            "texto": "El plan estratégico de TI debe elaborarse en concordancia con los objetivos de negocio de la empresa."
          },
          {
            "id": "e",
            "texto": "Los programadores deben formar parte obligatoria del Comité de Auditoría del Directorio."
          },
          {
            "id": "f",
            "texto": "La falta de documentos estratégicos dificulta la definición de acuerdos de nivel de servicio (SLA)."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The IT Strategy Committee at the Board level oversees overall direction and major investments."
          },
          {
            "id": "b",
            "texto": "The IT Steering Committee prioritizes projects and oversees operational service delivery."
          },
          {
            "id": "c",
            "texto": "The IT department must formally report to the CFO to guarantee cost reduction."
          },
          {
            "id": "d",
            "texto": "The IT strategic plan must be developed in alignment with corporate business objectives."
          },
          {
            "id": "e",
            "texto": "Programmers must be mandatory members of the Board's Audit Committee."
          },
          {
            "id": "f",
            "texto": "The absence of strategic documents impairs the effective definition of Service Level Agreements (SLAs)."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "f"
        ],
        "justificacion": "A, B, D y F corresponden a las buenas prácticas de gobernanza: distinción entre comité estratégico y directivo, alineación con el negocio y derivación de SLAs a partir de la estrategia.\n\nC es incorrecto: reportar al CFO genera conflicto de interés al supeditar la seguridad y calidad al gasto financiero.\n\nE es incorrecto: los desarrolladores son parte de la operación, no del órgano de supervisión del Directorio.",
        "justificacionEn": "A, B, D, and F align with governance best practices: distinction between strategy and steering committees, business alignment, and SLA derivation from strategy.\n\nC is incorrect: reporting directly to the CFO creates a conflict of interest by subordinating security and quality to cost reduction.\n\nE is incorrect: developers are operational staff, not members of board oversight committees."
      },
      {
        "id": 12,
        "tipo": "multiple",
        "pregunta": "En el modelo de gobernanza de las Tres Líneas, ¿cuáles asignaciones de responsabilidades son CORRECTAS?",
        "preguntaEn": "In the Three Lines Governance Model, which responsibility assignments are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Primera Línea: La gestión operativa y los líderes de proceso que poseen y gestionan el riesgo diario."
          },
          {
            "id": "b",
            "texto": "Segunda Línea: Funciones de soporte y supervisión especializada como Gestión de Riesgos y Cumplimiento."
          },
          {
            "id": "c",
            "texto": "Tercera Línea: La Auditoría Interna, brindando aseguramiento independiente y objetivo a la Junta."
          },
          {
            "id": "d",
            "texto": "Primera Línea: El auditor externo emitiendo la opinión de cumplimiento legal."
          },
          {
            "id": "e",
            "texto": "Segunda Línea: Los auditores de SI ejecutando auditorías sorpresa a los desarrolladores."
          },
          {
            "id": "f",
            "texto": "El Órgano de Gobierno (Junta Directiva) supervisa y recibe reportes directos de la tercera línea."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "First Line: Operational management and process owners who own and manage day-to-day risk."
          },
          {
            "id": "b",
            "texto": "Second Line: Support and specialized oversight functions such as Risk Management and Compliance."
          },
          {
            "id": "c",
            "texto": "Third Line: Internal Audit, providing independent and objective assurance to the Board."
          },
          {
            "id": "d",
            "texto": "First Line: The external auditor issuing the legal compliance opinion."
          },
          {
            "id": "e",
            "texto": "Second Line: IS auditors performing surprise audit inspections on developers."
          },
          {
            "id": "f",
            "texto": "The Governing Body (Board of Directors) oversees and receives direct reporting from the third line."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B, C y F describen con precisión el Modelo de las Tres Líneas: 1.ª línea opera y controla, 2.ª línea monitorea y asesora, 3.ª línea asegura de forma independiente y la Junta gobierna.\n\nD es falso: auditoría externa es un asegurador externo al modelo de tres líneas internas.\n\nE es falso: la auditoría es tercera línea, nunca segunda.",
        "justificacionEn": "A, B, C, and F accurately depict the Three Lines Model: 1st line operates and controls, 2nd line oversees and advises, 3rd line provides independent assurance, and the Board governs.\n\nD is false: external audit is an external assurance provider outside the internal three lines. E is false: audit is strictly the third line, never the second."
      },
      {
        "id": 13,
        "tipo": "multiple",
        "pregunta": "En un centro de procesamiento de información, ¿cuáles de las siguientes combinaciones de funciones representan un CONFLICTO de segregación de funciones (SoD)?",
        "preguntaEn": "In an information processing facility, which of the following job role combinations represent a Segregation of Duties (SoD) CONFLICT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Administrador de seguridad informática y responsable del control de cambios a producción"
          },
          {
            "id": "b",
            "texto": "Programador de aplicaciones y operador de consola en el entorno de producción"
          },
          {
            "id": "c",
            "texto": "Desarrollador de sistemas y personal encargado del mantenimiento en entorno de desarrollo"
          },
          {
            "id": "d",
            "texto": "Administrador de bases de datos (DBA) con autoridad para aprobar modificaciones a saldos contables"
          },
          {
            "id": "e",
            "texto": "Usuario que registra la creación de proveedores y a su vez aprueba los pagos de facturas"
          },
          {
            "id": "f",
            "texto": "Administrador de red que reporta al Oficial de Seguridad de la Información"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "IT security administrator and production change control coordinator"
          },
          {
            "id": "b",
            "texto": "Application programmer and computer console operator in the production environment"
          },
          {
            "id": "c",
            "texto": "Systems developer and software maintenance staff in the development environment"
          },
          {
            "id": "d",
            "texto": "Database administrator (DBA) with authority to approve changes to financial ledger balances"
          },
          {
            "id": "e",
            "texto": "User who enters vendor master records and also approves invoice disbursement payments"
          },
          {
            "id": "f",
            "texto": "Network administrator reporting to the Chief Information Security Officer (CISO)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E violan la segregación de funciones: permiten a una misma persona alterar parámetros, migrar código, manipular saldos o autorizar compras sin supervisión.\n\nC es una práctica habitual y permitida en desarrollo.\n\nF es una relación de reporte válida que no mezcla ejecución con autorización transaccional.",
        "justificacionEn": "A, B, D, and E violate segregation of duties: they allow a single individual to alter security settings, deploy unvetted code, manipulate ledger data, or approve fraudulent vendor disbursements.\n\nC is standard practice in development environments.\n\nF is an acceptable reporting relationship that does not compromise transactional checks."
      },
      {
        "id": 14,
        "tipo": "multiple",
        "pregunta": "En el diseño de un Cuadro de Mando Integral de TI (IT Balanced Scorecard), ¿cuáles son las cuatro perspectivas estándar?",
        "preguntaEn": "In the design of an IT Balanced Scorecard, which are the four standard perspectives?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Contribución corporativa / empresarial (Valor aportado al negocio)"
          },
          {
            "id": "b",
            "texto": "Orientación al usuario / cliente (Satisfacción del cliente interno y externo)"
          },
          {
            "id": "c",
            "texto": "Excelencia operacional (Eficiencia de los procesos de TI y entrega de servicios)"
          },
          {
            "id": "d",
            "texto": "Orientación al futuro (Capacidad de aprendizaje, innovación y capital humano)"
          },
          {
            "id": "e",
            "texto": "Rentabilidad de las campañas en redes sociales y marketing de influencers"
          },
          {
            "id": "f",
            "texto": "Análisis de casos de uso y diagramas de secuencia en UML"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Corporate / Business contribution (Value delivered to the enterprise)"
          },
          {
            "id": "b",
            "texto": "User / Customer orientation (Internal and external customer satisfaction)"
          },
          {
            "id": "c",
            "texto": "Operational excellence (Efficiency of IT processes and service delivery)"
          },
          {
            "id": "d",
            "texto": "Future orientation (Capacity for learning, innovation, and human capital)"
          },
          {
            "id": "e",
            "texto": "Social media advertising profitability and influencer marketing ROI"
          },
          {
            "id": "f",
            "texto": "Use case analysis and UML sequence diagrams"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D corresponden a las 4 perspectivas adaptadas del Balanced Scorecard para TI desarrolladas por Van Grembergen e ISACA.\n\nE y F no forman parte de las perspectivas formales de evaluación de gobernanza de TI.",
        "justificacionEn": "A, B, C, and D correspond to the four standard IT Balanced Scorecard perspectives developed by Van Grembergen and ISACA.\n\nE and F are not part of formal IT governance scorecard perspectives."
      },
      {
        "id": 15,
        "tipo": "multiple",
        "pregunta": "En la gobernanza de datos según las directrices de ISACA, ¿qué afirmaciones sobre roles son CORRECTAS?",
        "preguntaEn": "In data governance according to ISACA guidelines, which statements regarding roles are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Dueño del Dato (Data Owner) clasifica la información y autoriza formalmente los privilegios de acceso."
          },
          {
            "id": "b",
            "texto": "El Custodio del Dato (Data Custodian) implementa la protección técnica, almacenamiento y copias de seguridad."
          },
          {
            "id": "c",
            "texto": "El Administrador de Base de Datos (DBA) actúa como custodio técnico y no como propietario del negocio."
          },
          {
            "id": "d",
            "texto": "Los programadores son los dueños de los datos transaccionales por haber codificado las tablas."
          },
          {
            "id": "e",
            "texto": "El Oficial de Seguridad o Privacidad recomienda y supervisa las directrices de protección de datos."
          },
          {
            "id": "f",
            "texto": "El Custodio del Dato decide de forma autónoma qué registros financieros deben eliminarse."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Data Owner classifies information and formally authorizes user access privileges."
          },
          {
            "id": "b",
            "texto": "The Data Custodian implements technical safeguards, storage, and backup protection."
          },
          {
            "id": "c",
            "texto": "The Database Administrator (DBA) acts as a technical custodian rather than a business data owner."
          },
          {
            "id": "d",
            "texto": "Application developers are the business owners of transaction data because they coded the tables."
          },
          {
            "id": "e",
            "texto": "The Information Security/Privacy Officer recommends and oversees data protection guidelines."
          },
          {
            "id": "f",
            "texto": "The Data Custodian autonomously decides which historical financial records should be purged."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "e"
        ],
        "justificacion": "A, B, C y E reflejan la distribución de responsabilidades sobre la información: el negocio (owner) clasifica y autoriza; TI (custodian) administra la infraestructura; Seguridad supervisa.\n\nD es incorrecto: los desarrolladores no tienen propiedad sobre la información corporativa.\n\nF es falso: las decisiones de retención y purga de información pertenecen al Data Owner.",
        "justificacionEn": "A, B, C, and E reflect ISACA data stewardship roles: the business data owner classifies and grants access; IT custodians manage technical storage and backups; Security oversees compliance.\n\nD is incorrect: developers do not own enterprise business data.\n\nF is false: retention and disposal decisions belong strictly to the Data Owner."
      },
      {
        "id": 16,
        "tipo": "multiple",
        "pregunta": "Dentro de la Gestión de Riesgos Empresariales de TI (IT Risk Management), ¿cuáles son estrategias válidas de TRATAMIENTO del riesgo?",
        "preguntaEn": "Within IT Enterprise Risk Management, which are valid risk TREATMENT strategies?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Mitigación / Reducción (aplicación de controles para disminuir impacto o probabilidad)"
          },
          {
            "id": "b",
            "texto": "Transferencia / Compartición (adquisición de pólizas de seguro cibernético o tercerización)"
          },
          {
            "id": "c",
            "texto": "Aceptación (asunción informada y formal del riesgo residual dentro de la tolerancia de la gerencia)"
          },
          {
            "id": "d",
            "texto": "Evitación / Evasión (cancelación del servicio, proyecto o actividad que originaba el riesgo)"
          },
          {
            "id": "e",
            "texto": "Ocultamiento deliberado (eliminar reportes de vulnerabilidades para evitar llamadas de atención)"
          },
          {
            "id": "f",
            "texto": "Supresión absoluta (garantizar la erradicación del 100% de cualquier riesgo en todos los sistemas)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Mitigation / Reduction (applying controls to lower risk impact or probability)"
          },
          {
            "id": "b",
            "texto": "Transfer / Sharing (purchasing cyber insurance policies or outsourcing)"
          },
          {
            "id": "c",
            "texto": "Acceptance (informed and formal assumption of residual risk within management tolerance)"
          },
          {
            "id": "d",
            "texto": "Avoidance (terminating the activity, project, or process that creates the risk)"
          },
          {
            "id": "e",
            "texto": "Deliberate concealment (deleting vulnerability reports to avoid management scrutiny)"
          },
          {
            "id": "f",
            "texto": "Absolute suppression (guaranteeing 100% total eradication of any risk across all systems)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son las 4 respuestas estándar al riesgo reconocidas por ISO 31000 y COSO ERM.\n\nE constituye una falta ética gravísima.\n\nF es técnicamente imposible: el riesgo cero no existe en sistemas de información.",
        "justificacionEn": "A, B, C, and D are the four standard risk treatment responses recognized by ISO 31000 and COSO ERM.\n\nE constitutes severe professional misconduct.\n\nF is technically unfeasible: zero risk does not exist in information systems."
      },
      {
        "id": 17,
        "tipo": "multiple",
        "pregunta": "Al auditar la contratación de proveedores y servicios en la nube, ¿cuáles prácticas de control son RECOMENDADAS?",
        "preguntaEn": "When auditing third-party vendors and cloud service contracts, which control practices are RECOMMENDED?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Evaluar informes de aseguramiento emitidos por terceros independientes (como SOC 2 o ISO 27001)."
          },
          {
            "id": "b",
            "texto": "Incluir cláusulas contractuales con derecho explícito de auditoría (right-to-audit)."
          },
          {
            "id": "c",
            "texto": "Definir Acuerdos de Nivel de Servicio (SLA) con penalidades económicas por indisponibilidad."
          },
          {
            "id": "d",
            "texto": "Establecer contratos de depósito en custodia de código fuente (Software Escrow) para aplicativos críticos."
          },
          {
            "id": "e",
            "texto": "Permitir al proveedor modificar de forma discrecional las medidas de seguridad pactadas."
          },
          {
            "id": "f",
            "texto": "Considerar que la contratación en la nube exime a la gerencia de toda responsabilidad legal y de gobierno."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Reviewing independent third-party assurance audit reports (such as SOC 2 or ISO 27001)."
          },
          {
            "id": "b",
            "texto": "Including explicit contractual right-to-audit clauses."
          },
          {
            "id": "c",
            "texto": "Defining Service Level Agreements (SLAs) with financial penalties for service downtime."
          },
          {
            "id": "d",
            "texto": "Establishing software escrow agreements for proprietary critical applications."
          },
          {
            "id": "e",
            "texto": "Allowing the vendor to unilaterally modify agreed-upon security safeguards at their discretion."
          },
          {
            "id": "f",
            "texto": "Assuming that outsourcing to the cloud absolves corporate management of all governance and legal accountability."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son controles para mitigar el riesgo de terceros: aseguramiento externo, facultades de inspección, métricas de servicio (SLA) y garantía de acceso al código (escrow).\n\nE rompe la gobernanza contractual.\n\nF es falso: la responsabilidad final ante reguladores y clientes nunca es transferible al proveedor.",
        "justificacionEn": "A, B, C, and D are essential third-party vendor risk controls: independent audit assurance, right-to-audit clauses, performance SLAs, and source code escrow.\n\nE compromises contract governance.\n\nF is false: ultimate governance and legal accountability can never be outsourced to a vendor."
      },
      {
        "id": 18,
        "tipo": "multiple",
        "pregunta": "Sobre la jerarquía de los documentos normativos de TI, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the hierarchy of IT governance documentation, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Las Políticas son directrices obligatorias de alto nivel aprobadas por la gerencia y el Directorio."
          },
          {
            "id": "b",
            "texto": "Los Estándares establecen requisitos y configuraciones tecnológicas de carácter mandatorio."
          },
          {
            "id": "c",
            "texto": "Los Procedimientos detallan de forma secuencial y operativa los pasos para realizar una tarea."
          },
          {
            "id": "d",
            "texto": "Las Directrices (Guidelines) contienen recomendaciones y mejores prácticas cuyo uso es discrecional."
          },
          {
            "id": "e",
            "texto": "Las Políticas deben actualizarse diariamente e incluir fragmentos específicos de código fuente."
          },
          {
            "id": "f",
            "texto": "Las Guías operativas anulan de forma automática a los estándares si el personal decide utilizarlas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Policies are high-level mandatory directives approved by executive management and the Board."
          },
          {
            "id": "b",
            "texto": "Standards establish specific mandatory technical configurations and baseline requirements."
          },
          {
            "id": "c",
            "texto": "Procedures detail the step-by-step operational instructions to accomplish a specific task."
          },
          {
            "id": "d",
            "texto": "Guidelines contain recommendations and best-practice advice that are discretionary."
          },
          {
            "id": "e",
            "texto": "Policies must be updated daily and include specific code implementation snippets."
          },
          {
            "id": "f",
            "texto": "Operational guidelines automatically supersede standards whenever staff chooses to use them."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D presentan la pirámide documental clásica: Políticas (obligatorias y abstractas), Estándares (obligatorios y técnicos), Procedimientos (paso a paso) y Directrices (orientativas y opcionales).\n\nE es falso: las políticas son estables y de alto nivel.\n\nF es incorrecto: una directriz opcional jamás subordina a un estándar mandatorio.",
        "justificacionEn": "A, B, C, and D represent the classic documentation pyramid: Policies (mandatory and overarching), Standards (mandatory and technical), Procedures (step-by-step execution), and Guidelines (discretionary recommendations).\n\nE is false: policies are high-level and stable.\n\nF is incorrect: discretionary guidelines can never override mandatory standards."
      },
      {
        "id": 19,
        "tipo": "multiple",
        "pregunta": "En la planificación de la continuidad del negocio (BCP) y la resiliencia operativa, ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "In business continuity planning (BCP) and operational resilience, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Análisis de Impacto en el Negocio (BIA) identifica procesos críticos, el RTO y el RPO."
          },
          {
            "id": "b",
            "texto": "La Junta Directiva y la alta gerencia son los máximos responsables de la efectividad del plan de continuidad."
          },
          {
            "id": "c",
            "texto": "El departamento de TI define de manera aislada qué líneas comerciales deben salvarse en una crisis."
          },
          {
            "id": "d",
            "texto": "El Plan de Recuperación ante Desastres (DRP) se enfoca en restaurar la infraestructura y datos tecnológicos."
          },
          {
            "id": "e",
            "texto": "Los ejercicios y simulacros periódicos son esenciales para verificar la viabilidad real del plan."
          },
          {
            "id": "f",
            "texto": "Una vez documentado el BCP, se prohíbe realizar modificaciones para no invalidar las firmas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Business Impact Analysis (BIA) identifies critical business processes, RTO, and RPO."
          },
          {
            "id": "b",
            "texto": "The Board of Directors and senior management bear ultimate responsibility for business continuity effectiveness."
          },
          {
            "id": "c",
            "texto": "The IT department unilaterally determines which business operational lines should be recovered during a crisis."
          },
          {
            "id": "d",
            "texto": "The Disaster Recovery Plan (DRP) focuses on technical IT infrastructure and data recovery."
          },
          {
            "id": "e",
            "texto": "Periodic drills, walkthroughs, and simulations are essential to validate plan viability."
          },
          {
            "id": "f",
            "texto": "Once a BCP is approved, further modifications are prohibited to prevent invalidating signatures."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E son pilares de la continuidad operativa: análisis de criticidad (BIA), responsabilidad directiva, enfoque tecnológico del DRP y validación mediante pruebas y simulacros.\n\nC es falso: son los dueños de negocio quienes definen las prioridades comerciales.\n\nF es incorrecto: el BCP exige actualización continua ante cambios en el entorno.",
        "justificacionEn": "A, B, D, and E are cornerstones of operational continuity: business impact analysis (BIA), executive accountability, technological focus of the DRP, and ongoing simulation testing.\n\nC is false: business unit leaders determine commercial recovery priorities.\n\nF is incorrect: continuity plans require continuous revision to address changing operational environments."
      },
      {
        "id": 20,
        "tipo": "multiple",
        "pregunta": "En relación con los marcos y modelos de madurez de procesos de TI, identifique las afirmaciones CORRECTAS:",
        "preguntaEn": "Regarding IT process maturity models and governance frameworks, identify the CORRECT statements:",
        "alternativas": [
          {
            "id": "a",
            "texto": "CMMI permite medir y clasificar la capacidad de los procesos de software en niveles evolutivos (1 a 5)."
          },
          {
            "id": "b",
            "texto": "COBIT distingue formalmente los objetivos de Gobierno (EDM) frente a los objetivos de Gestión (PBRM)."
          },
          {
            "id": "c",
            "texto": "Un nivel de madurez inicial denota procesos caóticos, no documentados y altamente dependientes de individuos."
          },
          {
            "id": "d",
            "texto": "ITIL se centra en las mejores prácticas para la Gestión y Entrega de Servicios de TI (ITSM)."
          },
          {
            "id": "e",
            "texto": "Un nivel 5 de madurez en CMMI certifica que una empresa jamás sufrirá incidentes ni errores de software."
          },
          {
            "id": "f",
            "texto": "Scrum es un estándar internacional de certificación para la gobernanza del Directorio corporativo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "CMMI measures and classifies software process maturity across evolutionary tiers (1 to 5)."
          },
          {
            "id": "b",
            "texto": "COBIT formally distinguishes Governance objectives (EDM) from Management objectives (APO, BAI, DSS, MEA)."
          },
          {
            "id": "c",
            "texto": "An initial maturity level denotes chaotic, ad-hoc, and individual-dependent processes."
          },
          {
            "id": "d",
            "texto": "ITIL focuses on best-practice guidance for IT Service Management (ITSM)."
          },
          {
            "id": "e",
            "texto": "Level 5 CMMI certification guarantees that an enterprise will never experience defects or outages."
          },
          {
            "id": "f",
            "texto": "Scrum is an international standard for corporate board of directors governance."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D describen adecuadamente los marcos del Dominio 2: niveles de CMMI, separación EDM/PBRM en COBIT, características de madurez básica y enfoque de servicios de ITIL.\n\nE es falso: la madurez optimizada no otorga inmunidad absoluta frente a fallos.\n\nF es falso: Scrum es un marco ágil para desarrollo de proyectos a nivel de equipo técnico.",
        "justificacionEn": "A, B, C, and D accurately represent Domain 2 frameworks: CMMI levels, COBIT governance vs management separation, basic maturity characteristics, and ITIL service management focus.\n\nE is false: optimizing maturity does not confer absolute immunity from software errors.\n\nF is false: Scrum is an agile project team methodology, not a board governance framework."
      }
    ],
    "3": [
      {
        "id": 1,
        "tipo": "multiple",
        "pregunta": "Respecto al Estatuto de Auditoría (Audit Charter) según las directrices de ISACA, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the Audit Charter according to ISACA guidelines, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Define la autoridad, alcance global y responsabilidades del auditor de SI."
          },
          {
            "id": "b",
            "texto": "Debe ser aprobado formalmente por el Comité de Auditoría o la Junta Directiva."
          },
          {
            "id": "c",
            "texto": "Establece la rendición de cuentas (accountability) e independencia de la función de auditoría."
          },
          {
            "id": "d",
            "texto": "Debe redactarse nuevamente para cada encargo de auditoría individual."
          },
          {
            "id": "e",
            "texto": "Reemplaza la necesidad de realizar un plan de auditoría basado en riesgos."
          },
          {
            "id": "f",
            "texto": "Otorga el derecho de acceso a la información y sistemas necesarios para cumplir con su mandato."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Defines the authority, overall scope, and responsibilities of the IS auditor."
          },
          {
            "id": "b",
            "texto": "Must be formally approved by the Audit Committee or the Board of Directors."
          },
          {
            "id": "c",
            "texto": "Establishes accountability and independence of the audit function."
          },
          {
            "id": "d",
            "texto": "Must be drafted anew for each individual audit engagement."
          },
          {
            "id": "e",
            "texto": "Replaces the requirement to perform a risk-based audit plan."
          },
          {
            "id": "f",
            "texto": "Grants the right of access to information and systems necessary to fulfill its mandate."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B, C y F definen la naturaleza del Audit Charter: fija el mandato supremo, independencia, responsabilidad, acceso institucional y aprobación por el máximo órgano de gobierno.\n\nD es incorrecto: el estatuto es un documento marco de gobernanza permanente, no se elabora por auditoría individual.\n\nE es falso: el estatuto autoriza la función, pero la planificación basada en riesgos sigue siendo obligatoria.",
        "justificacionEn": "A, B, C, and F define the nature of the Audit Charter: it sets the supreme mandate, independence, accountability, institutional access, and approval by the highest governing body.\n\nD is incorrect: the charter is an enduring governance framework document, not drafted per audit engagement.\n\nE is false: the charter authorizes the function, but risk-based planning remains mandatory."
      },
      {
        "id": 2,
        "tipo": "multiple",
        "pregunta": "Sobre las pruebas de auditoría y su metodología técnica, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding audit testing and its technical methodology, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Las pruebas de cumplimiento verifican si los controles internos operan de forma efectiva y consistente."
          },
          {
            "id": "b",
            "texto": "Las pruebas sustantivas evalúan directamente la validez, exactitud e integridad de los datos y transacciones."
          },
          {
            "id": "c",
            "texto": "Si las pruebas de cumplimiento demuestran controles deficientes, se debe aumentar la extensión de las pruebas sustantivas."
          },
          {
            "id": "d",
            "texto": "Las pruebas de cumplimiento utilizan exclusivamente muestreo por variables monetarias."
          },
          {
            "id": "e",
            "texto": "Las pruebas sustantivas se eliminan si la empresa cuenta con un marco COBIT implementado."
          },
          {
            "id": "f",
            "texto": "El recálculo de intereses bancarios y el cotejo de saldos contra registros de base de datos son pruebas sustantivas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Compliance tests verify whether internal controls operate effectively and consistently."
          },
          {
            "id": "b",
            "texto": "Substantive tests directly evaluate the validity, accuracy, and completeness of data and transactions."
          },
          {
            "id": "c",
            "texto": "If compliance tests reveal deficient controls, the extent of substantive testing must be increased."
          },
          {
            "id": "d",
            "texto": "Compliance tests exclusively use monetary unit sampling (variable sampling)."
          },
          {
            "id": "e",
            "texto": "Substantive tests are eliminated if the enterprise has a COBIT framework implemented."
          },
          {
            "id": "f",
            "texto": "Recalculating bank interest and cross-checking ledger balances against database records are substantive tests."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B y F corresponden a las definiciones exactas de pruebas de cumplimiento (de controles) y pruebas sustantivas (de saldos y datos).\n\nC es la regla de auditoría inversa: a menor efectividad del control, mayor prueba sustantiva para reducir el riesgo de detección.\n\nD es falso: las pruebas de cumplimiento usan muestreo de atributos.\n\nE es incorrecto: ningún marco de gobierno elimina las pruebas sustantivas.",
        "justificacionEn": "A, B, and F correspond to the exact definitions of compliance testing (controls) and substantive testing (balances and data).\n\nC is the inverse audit relationship: lower control effectiveness requires greater substantive testing to reduce detection risk.\n\nD is false: compliance testing uses attribute sampling.\n\nE is incorrect: no governance framework eliminates substantive tests."
      },
      {
        "id": 3,
        "tipo": "multiple",
        "pregunta": "En relación con las técnicas de muestreo de auditoría en sistemas de información, identifique las opciones CORRECTAS:",
        "preguntaEn": "Regarding audit sampling techniques in information systems, identify the CORRECT statements:",
        "alternativas": [
          {
            "id": "a",
            "texto": "El muestreo de atributos se utiliza principalmente en pruebas de cumplimiento para evaluar tasas de ocurrencia."
          },
          {
            "id": "b",
            "texto": "El muestreo por variables se emplea para estimar magnitudes numéricas o valores monetarios en pruebas sustantivas."
          },
          {
            "id": "c",
            "texto": "El muestreo de descubrimiento (discovery sampling) es aplicable cuando se sospecha fraude o incumplimientos graves."
          },
          {
            "id": "d",
            "texto": "El riesgo de muestreo es la probabilidad de que la muestra seleccionada no represente las características de la población."
          },
          {
            "id": "e",
            "texto": "El muestreo no estadístico permite calcular de forma matemática y exacta el intervalo de confianza."
          },
          {
            "id": "f",
            "texto": "En un muestreo de descubrimiento, encontrar un solo error certifica que el control opera con normalidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Attribute sampling is primarily used in compliance testing to evaluate occurrence rates."
          },
          {
            "id": "b",
            "texto": "Variable sampling is used to estimate numerical amounts or monetary values in substantive tests."
          },
          {
            "id": "c",
            "texto": "Discovery sampling is applicable when fraud or severe non-compliance is suspected."
          },
          {
            "id": "d",
            "texto": "Sampling risk is the probability that the chosen sample does not represent population characteristics."
          },
          {
            "id": "e",
            "texto": "Non-statistical sampling allows for mathematical and exact calculation of the confidence interval."
          },
          {
            "id": "f",
            "texto": "In discovery sampling, finding a single error confirms that the control operates normally."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son principios matemáticos y metodológicos del muestreo de auditoría de ISACA.\n\nE es falso: solo el muestreo estadístico permite la medición matemática objetiva del riesgo de muestreo.\n\nF es falso: en descubrimiento, si se detecta un solo fallo, se presume comprometida toda la población.",
        "justificacionEn": "A, B, C, and D are mathematical and methodological principles of ISACA audit sampling.\n\nE is false: only statistical sampling allows objective mathematical measurement of sampling risk.\n\nF is false: in discovery sampling, if a single flaw is found, the entire population is presumed compromised."
      },
      {
        "id": 4,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de las siguientes son herramientas o técnicas aplicables en Técnicas de Auditoría Asistidas por Computadora (CAATs) y aseguramiento continuo?",
        "preguntaEn": "Which of the following are tools or techniques applicable to Computer-Assisted Audit Techniques (CAATs) and continuous assurance?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Software de Auditoría Generalizado (GAS como ACL o IDEA)"
          },
          {
            "id": "b",
            "texto": "Módulos de auditoría embebidos (como SCARF o EAM)"
          },
          {
            "id": "c",
            "texto": "Entornos de desarrollo integrados (IDE como Visual Studio o Eclipse)"
          },
          {
            "id": "d",
            "texto": "Sistemas integrados de compilación continua (Jenkins o GitHub Actions)"
          },
          {
            "id": "e",
            "texto": "Archivos o datos de prueba procesados en el sistema (Test Data)"
          },
          {
            "id": "f",
            "texto": "Monitoreo continuo automatizado de transacciones y controles (Continuous Auditing)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Generalized Audit Software (GAS such as ACL or IDEA)"
          },
          {
            "id": "b",
            "texto": "Embedded audit modules (such as SCARF or EAM)"
          },
          {
            "id": "c",
            "texto": "Integrated development environments (IDEs such as Visual Studio or Eclipse)"
          },
          {
            "id": "d",
            "texto": "Continuous integration/build systems (such as Jenkins or GitHub Actions)"
          },
          {
            "id": "e",
            "texto": "Test data files processed through the system (Test Data)"
          },
          {
            "id": "f",
            "texto": "Automated continuous transaction and control monitoring (Continuous Auditing)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "e",
          "f"
        ],
        "justificacion": "A, B, E y F corresponden a técnicas de CAATs para extracción, análisis de datos y monitoreo de transacciones.\n\nC y D son herramientas exclusivas de desarrollo de software y DevOps, no técnicas de auditoría asistida.",
        "justificacionEn": "A, B, E, and F are CAATs techniques for data extraction, analytics, and transaction monitoring.\n\nC and D are software engineering and DevOps tools, not computer-assisted audit techniques."
      },
      {
        "id": 5,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes son ejemplos de controles DETECTIVOS en sistemas de información?",
        "preguntaEn": "Which of the following are examples of DETECTIVE controls in information systems?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Revisión y análisis periódico de bitácoras (audit trails)"
          },
          {
            "id": "b",
            "texto": "Conciliaciones bancarias y de saldos transaccionales a fin de mes"
          },
          {
            "id": "c",
            "texto": "Cifrado robusto de bases de datos en reposo mediante AES-256"
          },
          {
            "id": "d",
            "texto": "Sistemas de detección de intrusiones en red (NIDS)"
          },
          {
            "id": "e",
            "texto": "Restauración de datos a partir de copias de seguridad en cinta"
          },
          {
            "id": "f",
            "texto": "Verificación de totales de control (hash totals) al cierre de lotes"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Periodic review and analysis of audit logs/trails"
          },
          {
            "id": "b",
            "texto": "Month-end bank and transactional balance reconciliations"
          },
          {
            "id": "c",
            "texto": "Strong database encryption at rest using AES-256"
          },
          {
            "id": "d",
            "texto": "Network intrusion detection systems (NIDS)"
          },
          {
            "id": "e",
            "texto": "Data restoration from tape backup copies"
          },
          {
            "id": "f",
            "texto": "Verification of control totals (hash totals) at batch closing"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "f"
        ],
        "justificacion": "A, B, D y F alertan o descubren la ocurrencia de una anomalía o error una vez que ha sucedido.\n\nC es un control preventivo (impide la lectura ilegítima).\n\nE es un control correctivo (repara el daño tras un fallo).",
        "justificacionEn": "A, B, D, and F alert or discover anomalies and errors after they have occurred.\n\nC is a preventive control (prevents illegitimate access).\n\nE is a corrective control (repairs damage following an outage or disruption)."
      },
      {
        "id": 6,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes son ejemplos de controles CORRECTIVOS en auditoría de sistemas?",
        "preguntaEn": "Which of the following are examples of CORRECTIVE controls in systems auditing?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Procedimientos de conmutación por error automatizada (failover)"
          },
          {
            "id": "b",
            "texto": "Políticas de contraseñas robustas y bloqueo automático por intentos fallidos"
          },
          {
            "id": "c",
            "texto": "Restauración de bases de datos a partir de respaldos (backups)"
          },
          {
            "id": "d",
            "texto": "Activación del Plan de Recuperación ante Desastres (DRP) tras un corte"
          },
          {
            "id": "e",
            "texto": "Listas de control de acceso (ACL) configuradas en el firewall perimetral"
          },
          {
            "id": "f",
            "texto": "Aislamiento, limpieza y reinstalación de un servidor infectado con malware"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Automated failover procedures"
          },
          {
            "id": "b",
            "texto": "Strong password policies and automatic lockout upon failed attempts"
          },
          {
            "id": "c",
            "texto": "Database restoration from backups"
          },
          {
            "id": "d",
            "texto": "Disaster Recovery Plan (DRP) activation following an outage"
          },
          {
            "id": "e",
            "texto": "Access control lists (ACLs) configured on the perimeter firewall"
          },
          {
            "id": "f",
            "texto": "Isolation, remediation, and reinstallation of a malware-infected server"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "c",
          "d",
          "f"
        ],
        "justificacion": "A, C, D y F entran en acción después del incidente para restaurar la operatividad y mitigar el daño.\n\nB y E son controles preventivos que bloquean incidentes antes de que ocurran.",
        "justificacionEn": "A, C, D, and F take action after an incident to restore normal operations and mitigate damage.\n\nB and E are preventive controls designed to block incidents before they occur."
      },
      {
        "id": 7,
        "tipo": "multiple",
        "pregunta": "Respecto a la evidencia de auditoría y los papeles de trabajo (audit workpapers), ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding audit evidence and audit workpapers, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "La evidencia obtenida directamente por el auditor es más confiable que la entregada por el personal auditado."
          },
          {
            "id": "b",
            "texto": "La evidencia debe satisfacer los atributos de ser suficiente y apropiada/competente."
          },
          {
            "id": "c",
            "texto": "Las declaraciones verbales de la gerencia poseen mayor jerarquía probatoria que las bitácoras del sistema."
          },
          {
            "id": "d",
            "texto": "Los papeles de trabajo documentan la planificación, las pruebas ejecutadas, la evidencia y las conclusiones."
          },
          {
            "id": "e",
            "texto": "Confirmaciones escritas de terceros independientes ofrecen mayor confiabilidad que reportes internos."
          },
          {
            "id": "f",
            "texto": "Los papeles de trabajo deben ser destruidos inmediatamente tras entregar el informe por confidencialidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Evidence obtained directly by the auditor is more reliable than evidence supplied by auditee personnel."
          },
          {
            "id": "b",
            "texto": "Evidence must satisfy the criteria of being sufficient and appropriate/competent."
          },
          {
            "id": "c",
            "texto": "Oral statements from management carry higher evidentiary weight than automated system logs."
          },
          {
            "id": "d",
            "texto": "Workpapers document the planning, audit procedures performed, evidence gathered, and conclusions reached."
          },
          {
            "id": "e",
            "texto": "Written confirmations from independent third parties offer greater reliability than internal reports."
          },
          {
            "id": "f",
            "texto": "Workpapers must be destroyed immediately upon report delivery to preserve confidentiality."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E reflejan la jerarquía y requisitos de la evidencia según ITAF: la evidencia directa y de terceros externos siempre tiene mayor peso probatorio, y los papeles de trabajo respaldan las conclusiones.\n\nC es falso: el testimonio oral es la evidencia menos confiable.\n\nF es incorrecto: los papeles de trabajo deben custodiarse según las políticas de retención de la organización.",
        "justificacionEn": "A, B, D, and E reflect ITAF evidence hierarchy and standards: direct and third-party external evidence holds higher evidentiary value, and workpapers substantiate audit findings.\n\nC is false: oral testimony is the least reliable form of evidence.\n\nF is incorrect: workpapers must be retained according to corporate record retention policies."
      },
      {
        "id": 8,
        "tipo": "multiple",
        "pregunta": "Al documentar un hallazgo formal de auditoría según los estándares de ISACA, ¿cuáles elementos constituyen su estructura obligatoria?",
        "preguntaEn": "When documenting a formal audit finding according to ISACA standards, which elements constitute its mandatory structure?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Condición (la situación real observada en el examen)"
          },
          {
            "id": "b",
            "texto": "Criterio (la norma, estándar, ley o política que debe cumplirse)"
          },
          {
            "id": "c",
            "texto": "Causa (la razón de fondo por la cual ocurrió la desviación)"
          },
          {
            "id": "d",
            "texto": "Efecto o Impacto (el riesgo o consecuencia material de la falla)"
          },
          {
            "id": "e",
            "texto": "Asignación de puntos de historia y diagramas de casos de uso"
          },
          {
            "id": "f",
            "texto": "Recomendación (la acción constructiva propuesta para subsanar la causa)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Condition (the factual situation observed during the review)"
          },
          {
            "id": "b",
            "texto": "Criteria (the standard, policy, regulation, or law being measured against)"
          },
          {
            "id": "c",
            "texto": "Cause (the underlying reason why the deviation occurred)"
          },
          {
            "id": "d",
            "texto": "Effect or Impact (the risk exposure or material consequence of the deficiency)"
          },
          {
            "id": "e",
            "texto": "Story point estimation and UML use-case diagrams"
          },
          {
            "id": "f",
            "texto": "Recommendation (the constructive action proposed to remediate the root cause)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d",
          "f"
        ],
        "justificacion": "A, B, C, D y F conforman la estructura clásica del hallazgo: Condición, Criterio, Causa, Efecto y Recomendación.\n\nE pertenece a metodologías de desarrollo de software (Scrum/UML), ajenas a la redacción del hallazgo.",
        "justificacionEn": "A, B, C, D, and F constitute the classic audit finding structure: Condition, Criteria, Cause, Effect, and Recommendation.\n\nE belongs to software engineering methodologies (Scrum/UML) and is unrelated to audit findings."
      },
      {
        "id": 9,
        "tipo": "multiple",
        "pregunta": "En relación con la etapa de reporte y seguimiento (follow-up) de la auditoría de SI, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the reporting and follow-up phase of an IS audit, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El borrador del informe debe discutirse con los directores de área en una reunión de cierre previa."
          },
          {
            "id": "b",
            "texto": "El auditor de SI es el encargado de implementar materialmente los parches y cambios recomendados."
          },
          {
            "id": "c",
            "texto": "El proceso de seguimiento evalúa si la administración adoptó medidas correctivas oportunas."
          },
          {
            "id": "d",
            "texto": "Si la gerencia decide aceptar un riesgo residual importante, dicha decisión debe informarse al Directorio."
          },
          {
            "id": "e",
            "texto": "Las recomendaciones deben ser prácticas, realizables y orientadas a la causa raíz."
          },
          {
            "id": "f",
            "texto": "Las actividades de seguimiento se anulan si el personal auditado firma acuerdos de confidencialidad."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The draft report should be discussed with area management during an exit/closing conference."
          },
          {
            "id": "b",
            "texto": "The IS auditor is responsible for hands-on operational implementation of recommended patches and changes."
          },
          {
            "id": "c",
            "texto": "The follow-up process evaluates whether management took timely and appropriate corrective actions."
          },
          {
            "id": "d",
            "texto": "If management decides to accept significant residual risk, this decision must be reported to the Board."
          },
          {
            "id": "e",
            "texto": "Recommendations must be practical, achievable, and addressed to the root cause."
          },
          {
            "id": "f",
            "texto": "Follow-up activities are cancelled if auditee personnel sign non-disclosure agreements."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "c",
          "d",
          "e"
        ],
        "justificacion": "A, C, D y E cumplen el proceso de cierre y monitoreo de compromisos según ITAF: se socializan hallazgos, se hace seguimiento y la aceptación de riesgos altos se escala al gobierno corporativo.\n\nB es falso: el auditor pierde independencia si ejecuta la remediación operativa.\n\nF es falso: los acuerdos de confidencialidad no eximen el seguimiento de debilidades de control.",
        "justificacionEn": "A, C, D, and E adhere to ITAF closing and monitoring standards: findings are vetted with management, follow-up assesses remediation, and significant risk acceptance is escalated to the governing board.\n\nB is false: the auditor compromises independence by executing operational remediation.\n\nF is false: NDAs do not waive control remediation follow-up."
      },
      {
        "id": 10,
        "tipo": "multiple",
        "pregunta": "¿Cuáles de los siguientes corresponden a controles FÍSICOS o AMBIENTALES en un centro de cómputo?",
        "preguntaEn": "Which of the following correspond to PHYSICAL or ENVIRONMENTAL controls in a data center?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Sistemas de supresión de incendios mediante agentes limpios (FM-200 o Novec)"
          },
          {
            "id": "b",
            "texto": "Dispositivos de autenticación biométrica en la puerta de la sala de servidores"
          },
          {
            "id": "c",
            "texto": "Sistemas de Alimentación Ininterrumpida (UPS) y motogeneradores eléctricos"
          },
          {
            "id": "d",
            "texto": "Filtrado de paquetes mediante inspección con estado en el firewall"
          },
          {
            "id": "e",
            "texto": "Sensores de detección de aniego y monitoreo de temperatura/humedad relativa"
          },
          {
            "id": "f",
            "texto": "Cifrado de enlaces punto a punto con IPsec en modo transporte"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Clean-agent fire suppression systems (such as FM-200 or Novec)"
          },
          {
            "id": "b",
            "texto": "Biometric authentication access devices on the server room door"
          },
          {
            "id": "c",
            "texto": "Uninterruptible Power Supply (UPS) systems and diesel generators"
          },
          {
            "id": "d",
            "texto": "Packet filtering through stateful inspection firewalls"
          },
          {
            "id": "e",
            "texto": "Water leakage detection sensors and temperature/relative humidity monitoring"
          },
          {
            "id": "f",
            "texto": "Point-to-point link encryption using IPsec in transport mode"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "e"
        ],
        "justificacion": "A, B, C y E resguardan las instalaciones físicas y condiciones ambientales frente a intrusiones y desastres naturales.\n\nD y F son controles lógicos o técnicos aplicados a la red de datos.",
        "justificacionEn": "A, B, C, and E safeguard physical facilities and environmental parameters against intrusion and physical disasters.\n\nD and F are logical and technical network security controls."
      },
      {
        "id": 11,
        "tipo": "multiple",
        "pregunta": "Sobre las estructuras organizacionales de gobernanza y alineación de TI, ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding IT governance organizational structures and business alignment, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Comité de Estrategia de TI a nivel del Directorio supervisa la dirección general y las grandes inversiones."
          },
          {
            "id": "b",
            "texto": "El Comité de Dirección de TI (IT Steering Committee) prioriza proyectos y supervisa la entrega operativa."
          },
          {
            "id": "c",
            "texto": "El departamento de TI debe reportar formalmente al CFO para garantizar la reducción de costos."
          },
          {
            "id": "d",
            "texto": "El plan estratégico de TI debe elaborarse en concordancia con los objetivos de negocio de la empresa."
          },
          {
            "id": "e",
            "texto": "Los programadores deben formar parte obligatoria del Comité de Auditoría del Directorio."
          },
          {
            "id": "f",
            "texto": "La falta de documentos estratégicos dificulta la definición de acuerdos de nivel de servicio (SLA)."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The IT Strategy Committee at the Board level oversees overall direction and major investments."
          },
          {
            "id": "b",
            "texto": "The IT Steering Committee prioritizes projects and oversees operational service delivery."
          },
          {
            "id": "c",
            "texto": "The IT department must formally report to the CFO to guarantee cost reduction."
          },
          {
            "id": "d",
            "texto": "The IT strategic plan must be developed in alignment with corporate business objectives."
          },
          {
            "id": "e",
            "texto": "Programmers must be mandatory members of the Board's Audit Committee."
          },
          {
            "id": "f",
            "texto": "The absence of strategic documents impairs the effective definition of Service Level Agreements (SLAs)."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "f"
        ],
        "justificacion": "A, B, D y F corresponden a las buenas prácticas de gobernanza: distinción entre comité estratégico y directivo, alineación con el negocio y derivación de SLAs a partir de la estrategia.\n\nC es incorrecto: reportar al CFO genera conflicto de interés al supeditar la seguridad y calidad al gasto financiero.\n\nE es incorrecto: los desarrolladores son parte de la operación, no del órgano de supervisión del Directorio.",
        "justificacionEn": "A, B, D, and F align with governance best practices: distinction between strategy and steering committees, business alignment, and SLA derivation from strategy.\n\nC is incorrect: reporting directly to the CFO creates a conflict of interest by subordinating security and quality to cost reduction.\n\nE is incorrect: developers are operational staff, not members of board oversight committees."
      },
      {
        "id": 12,
        "tipo": "multiple",
        "pregunta": "En el modelo de gobernanza de las Tres Líneas, ¿cuáles asignaciones de responsabilidades son CORRECTAS?",
        "preguntaEn": "In the Three Lines Governance Model, which responsibility assignments are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Primera Línea: La gestión operativa y los líderes de proceso que poseen y gestionan el riesgo diario."
          },
          {
            "id": "b",
            "texto": "Segunda Línea: Funciones de soporte y supervisión especializada como Gestión de Riesgos y Cumplimiento."
          },
          {
            "id": "c",
            "texto": "Tercera Línea: La Auditoría Interna, brindando aseguramiento independiente y objetivo a la Junta."
          },
          {
            "id": "d",
            "texto": "Primera Línea: El auditor externo emitiendo la opinión de cumplimiento legal."
          },
          {
            "id": "e",
            "texto": "Segunda Línea: Los auditores de SI ejecutando auditorías sorpresa a los desarrolladores."
          },
          {
            "id": "f",
            "texto": "El Órgano de Gobierno (Junta Directiva) supervisa y recibe reportes directos de la tercera línea."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "First Line: Operational management and process owners who own and manage day-to-day risk."
          },
          {
            "id": "b",
            "texto": "Second Line: Support and specialized oversight functions such as Risk Management and Compliance."
          },
          {
            "id": "c",
            "texto": "Third Line: Internal Audit, providing independent and objective assurance to the Board."
          },
          {
            "id": "d",
            "texto": "First Line: The external auditor issuing the legal compliance opinion."
          },
          {
            "id": "e",
            "texto": "Second Line: IS auditors performing surprise audit inspections on developers."
          },
          {
            "id": "f",
            "texto": "The Governing Body (Board of Directors) oversees and receives direct reporting from the third line."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "f"
        ],
        "justificacion": "A, B, C y F describen con precisión el Modelo de las Tres Líneas: 1.ª línea opera y controla, 2.ª línea monitorea y asesora, 3.ª línea asegura de forma independiente y la Junta gobierna.\n\nD es falso: auditoría externa es un asegurador externo al modelo de tres líneas internas.\n\nE es falso: la auditoría es tercera línea, nunca segunda.",
        "justificacionEn": "A, B, C, and F accurately depict the Three Lines Model: 1st line operates and controls, 2nd line oversees and advises, 3rd line provides independent assurance, and the Board governs.\n\nD is false: external audit is an external assurance provider outside the internal three lines. E is false: audit is strictly the third line, never the second."
      },
      {
        "id": 13,
        "tipo": "multiple",
        "pregunta": "En un centro de procesamiento de información, ¿cuáles de las siguientes combinaciones de funciones representan un CONFLICTO de segregación de funciones (SoD)?",
        "preguntaEn": "In an information processing facility, which of the following job role combinations represent a Segregation of Duties (SoD) CONFLICT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Administrador de seguridad informática y responsable del control de cambios a producción"
          },
          {
            "id": "b",
            "texto": "Programador de aplicaciones y operador de consola en el entorno de producción"
          },
          {
            "id": "c",
            "texto": "Desarrollador de sistemas y personal encargado del mantenimiento en entorno de desarrollo"
          },
          {
            "id": "d",
            "texto": "Administrador de bases de datos (DBA) con autoridad para aprobar modificaciones a saldos contables"
          },
          {
            "id": "e",
            "texto": "Usuario que registra la creación de proveedores y a su vez aprueba los pagos de facturas"
          },
          {
            "id": "f",
            "texto": "Administrador de red que reporta al Oficial de Seguridad de la Información"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "IT security administrator and production change control coordinator"
          },
          {
            "id": "b",
            "texto": "Application programmer and computer console operator in the production environment"
          },
          {
            "id": "c",
            "texto": "Systems developer and software maintenance staff in the development environment"
          },
          {
            "id": "d",
            "texto": "Database administrator (DBA) with authority to approve changes to financial ledger balances"
          },
          {
            "id": "e",
            "texto": "User who enters vendor master records and also approves invoice disbursement payments"
          },
          {
            "id": "f",
            "texto": "Network administrator reporting to the Chief Information Security Officer (CISO)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E violan la segregación de funciones: permiten a una misma persona alterar parámetros, migrar código, manipular saldos o autorizar compras sin supervisión.\n\nC es una práctica habitual y permitida en desarrollo.\n\nF es una relación de reporte válida que no mezcla ejecución con autorización transaccional.",
        "justificacionEn": "A, B, D, and E violate segregation of duties: they allow a single individual to alter security settings, deploy unvetted code, manipulate ledger data, or approve fraudulent vendor disbursements.\n\nC is standard practice in development environments.\n\nF is an acceptable reporting relationship that does not compromise transactional checks."
      },
      {
        "id": 14,
        "tipo": "multiple",
        "pregunta": "En el diseño de un Cuadro de Mando Integral de TI (IT Balanced Scorecard), ¿cuáles son las cuatro perspectivas estándar?",
        "preguntaEn": "In the design of an IT Balanced Scorecard, which are the four standard perspectives?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Contribución corporativa / empresarial (Valor aportado al negocio)"
          },
          {
            "id": "b",
            "texto": "Orientación al usuario / cliente (Satisfacción del cliente interno y externo)"
          },
          {
            "id": "c",
            "texto": "Excelencia operacional (Eficiencia de los procesos de TI y entrega de servicios)"
          },
          {
            "id": "d",
            "texto": "Orientación al futuro (Capacidad de aprendizaje, innovación y capital humano)"
          },
          {
            "id": "e",
            "texto": "Rentabilidad de las campañas en redes sociales y marketing de influencers"
          },
          {
            "id": "f",
            "texto": "Análisis de casos de uso y diagramas de secuencia en UML"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Corporate / Business contribution (Value delivered to the enterprise)"
          },
          {
            "id": "b",
            "texto": "User / Customer orientation (Internal and external customer satisfaction)"
          },
          {
            "id": "c",
            "texto": "Operational excellence (Efficiency of IT processes and service delivery)"
          },
          {
            "id": "d",
            "texto": "Future orientation (Capacity for learning, innovation, and human capital)"
          },
          {
            "id": "e",
            "texto": "Social media advertising profitability and influencer marketing ROI"
          },
          {
            "id": "f",
            "texto": "Use case analysis and UML sequence diagrams"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D corresponden a las 4 perspectivas adaptadas del Balanced Scorecard para TI desarrolladas por Van Grembergen e ISACA.\n\nE y F no forman parte de las perspectivas formales de evaluación de gobernanza de TI.",
        "justificacionEn": "A, B, C, and D correspond to the four standard IT Balanced Scorecard perspectives developed by Van Grembergen and ISACA.\n\nE and F are not part of formal IT governance scorecard perspectives."
      },
      {
        "id": 15,
        "tipo": "multiple",
        "pregunta": "En la gobernanza de datos según las directrices de ISACA, ¿qué afirmaciones sobre roles son CORRECTAS?",
        "preguntaEn": "In data governance according to ISACA guidelines, which statements regarding roles are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Dueño del Dato (Data Owner) clasifica la información y autoriza formalmente los privilegios de acceso."
          },
          {
            "id": "b",
            "texto": "El Custodio del Dato (Data Custodian) implementa la protección técnica, almacenamiento y copias de seguridad."
          },
          {
            "id": "c",
            "texto": "El Administrador de Base de Datos (DBA) actúa como custodio técnico y no como propietario del negocio."
          },
          {
            "id": "d",
            "texto": "Los programadores son los dueños de los datos transaccionales por haber codificado las tablas."
          },
          {
            "id": "e",
            "texto": "El Oficial de Seguridad o Privacidad recomienda y supervisa las directrices de protección de datos."
          },
          {
            "id": "f",
            "texto": "El Custodio del Dato decide de forma autónoma qué registros financieros deben eliminarse."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Data Owner classifies information and formally authorizes user access privileges."
          },
          {
            "id": "b",
            "texto": "The Data Custodian implements technical safeguards, storage, and backup protection."
          },
          {
            "id": "c",
            "texto": "The Database Administrator (DBA) acts as a technical custodian rather than a business data owner."
          },
          {
            "id": "d",
            "texto": "Application developers are the business owners of transaction data because they coded the tables."
          },
          {
            "id": "e",
            "texto": "The Information Security/Privacy Officer recommends and oversees data protection guidelines."
          },
          {
            "id": "f",
            "texto": "The Data Custodian autonomously decides which historical financial records should be purged."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "e"
        ],
        "justificacion": "A, B, C y E reflejan la distribución de responsabilidades sobre la información: el negocio (owner) clasifica y autoriza; TI (custodian) administra la infraestructura; Seguridad supervisa.\n\nD es incorrecto: los desarrolladores no tienen propiedad sobre la información corporativa.\n\nF es falso: las decisiones de retención y purga de información pertenecen al Data Owner.",
        "justificacionEn": "A, B, C, and E reflect ISACA data stewardship roles: the business data owner classifies and grants access; IT custodians manage technical storage and backups; Security oversees compliance.\n\nD is incorrect: developers do not own enterprise business data.\n\nF is false: retention and disposal decisions belong strictly to the Data Owner."
      },
      {
        "id": 16,
        "tipo": "multiple",
        "pregunta": "Dentro de la Gestión de Riesgos Empresariales de TI (IT Risk Management), ¿cuáles son estrategias válidas de TRATAMIENTO del riesgo?",
        "preguntaEn": "Within IT Enterprise Risk Management, which are valid risk TREATMENT strategies?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Mitigación / Reducción (aplicación de controles para disminuir impacto o probabilidad)"
          },
          {
            "id": "b",
            "texto": "Transferencia / Compartición (adquisición de pólizas de seguro cibernético o tercerización)"
          },
          {
            "id": "c",
            "texto": "Aceptación (asunción informada y formal del riesgo residual dentro de la tolerancia de la gerencia)"
          },
          {
            "id": "d",
            "texto": "Evitación / Evasión (cancelación del servicio, proyecto o actividad que originaba el riesgo)"
          },
          {
            "id": "e",
            "texto": "Ocultamiento deliberado (eliminar reportes de vulnerabilidades para evitar llamadas de atención)"
          },
          {
            "id": "f",
            "texto": "Supresión absoluta (garantizar la erradicación del 100% de cualquier riesgo en todos los sistemas)"
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Mitigation / Reduction (applying controls to lower risk impact or probability)"
          },
          {
            "id": "b",
            "texto": "Transfer / Sharing (purchasing cyber insurance policies or outsourcing)"
          },
          {
            "id": "c",
            "texto": "Acceptance (informed and formal assumption of residual risk within management tolerance)"
          },
          {
            "id": "d",
            "texto": "Avoidance (terminating the activity, project, or process that creates the risk)"
          },
          {
            "id": "e",
            "texto": "Deliberate concealment (deleting vulnerability reports to avoid management scrutiny)"
          },
          {
            "id": "f",
            "texto": "Absolute suppression (guaranteeing 100% total eradication of any risk across all systems)"
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son las 4 respuestas estándar al riesgo reconocidas por ISO 31000 y COSO ERM.\n\nE constituye una falta ética gravísima.\n\nF es técnicamente imposible: el riesgo cero no existe en sistemas de información.",
        "justificacionEn": "A, B, C, and D are the four standard risk treatment responses recognized by ISO 31000 and COSO ERM.\n\nE constitutes severe professional misconduct.\n\nF is technically unfeasible: zero risk does not exist in information systems."
      },
      {
        "id": 17,
        "tipo": "multiple",
        "pregunta": "Al auditar la contratación de proveedores y servicios en la nube, ¿cuáles prácticas de control son RECOMENDADAS?",
        "preguntaEn": "When auditing third-party vendors and cloud service contracts, which control practices are RECOMMENDED?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Evaluar informes de aseguramiento emitidos por terceros independientes (como SOC 2 o ISO 27001)."
          },
          {
            "id": "b",
            "texto": "Incluir cláusulas contractuales con derecho explícito de auditoría (right-to-audit)."
          },
          {
            "id": "c",
            "texto": "Definir Acuerdos de Nivel de Servicio (SLA) con penalidades económicas por indisponibilidad."
          },
          {
            "id": "d",
            "texto": "Establecer contratos de depósito en custodia de código fuente (Software Escrow) para aplicativos críticos."
          },
          {
            "id": "e",
            "texto": "Permitir al proveedor modificar de forma discrecional las medidas de seguridad pactadas."
          },
          {
            "id": "f",
            "texto": "Considerar que la contratación en la nube exime a la gerencia de toda responsabilidad legal y de gobierno."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Reviewing independent third-party assurance audit reports (such as SOC 2 or ISO 27001)."
          },
          {
            "id": "b",
            "texto": "Including explicit contractual right-to-audit clauses."
          },
          {
            "id": "c",
            "texto": "Defining Service Level Agreements (SLAs) with financial penalties for service downtime."
          },
          {
            "id": "d",
            "texto": "Establishing software escrow agreements for proprietary critical applications."
          },
          {
            "id": "e",
            "texto": "Allowing the vendor to unilaterally modify agreed-upon security safeguards at their discretion."
          },
          {
            "id": "f",
            "texto": "Assuming that outsourcing to the cloud absolves corporate management of all governance and legal accountability."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D son controles para mitigar el riesgo de terceros: aseguramiento externo, facultades de inspección, métricas de servicio (SLA) y garantía de acceso al código (escrow).\n\nE rompe la gobernanza contractual.\n\nF es falso: la responsabilidad final ante reguladores y clientes nunca es transferible al proveedor.",
        "justificacionEn": "A, B, C, and D are essential third-party vendor risk controls: independent audit assurance, right-to-audit clauses, performance SLAs, and source code escrow.\n\nE compromises contract governance.\n\nF is false: ultimate governance and legal accountability can never be outsourced to a vendor."
      },
      {
        "id": 18,
        "tipo": "multiple",
        "pregunta": "Sobre la jerarquía de los documentos normativos de TI, ¿cuáles afirmaciones son CORRECTAS?",
        "preguntaEn": "Regarding the hierarchy of IT governance documentation, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "Las Políticas son directrices obligatorias de alto nivel aprobadas por la gerencia y el Directorio."
          },
          {
            "id": "b",
            "texto": "Los Estándares establecen requisitos y configuraciones tecnológicas de carácter mandatorio."
          },
          {
            "id": "c",
            "texto": "Los Procedimientos detallan de forma secuencial y operativa los pasos para realizar una tarea."
          },
          {
            "id": "d",
            "texto": "Las Directrices (Guidelines) contienen recomendaciones y mejores prácticas cuyo uso es discrecional."
          },
          {
            "id": "e",
            "texto": "Las Políticas deben actualizarse diariamente e incluir fragmentos específicos de código fuente."
          },
          {
            "id": "f",
            "texto": "Las Guías operativas anulan de forma automática a los estándares si el personal decide utilizarlas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "Policies are high-level mandatory directives approved by executive management and the Board."
          },
          {
            "id": "b",
            "texto": "Standards establish specific mandatory technical configurations and baseline requirements."
          },
          {
            "id": "c",
            "texto": "Procedures detail the step-by-step operational instructions to accomplish a specific task."
          },
          {
            "id": "d",
            "texto": "Guidelines contain recommendations and best-practice advice that are discretionary."
          },
          {
            "id": "e",
            "texto": "Policies must be updated daily and include specific code implementation snippets."
          },
          {
            "id": "f",
            "texto": "Operational guidelines automatically supersede standards whenever staff chooses to use them."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D presentan la pirámide documental clásica: Políticas (obligatorias y abstractas), Estándares (obligatorios y técnicos), Procedimientos (paso a paso) y Directrices (orientativas y opcionales).\n\nE es falso: las políticas son estables y de alto nivel.\n\nF es incorrecto: una directriz opcional jamás subordina a un estándar mandatorio.",
        "justificacionEn": "A, B, C, and D represent the classic documentation pyramid: Policies (mandatory and overarching), Standards (mandatory and technical), Procedures (step-by-step execution), and Guidelines (discretionary recommendations).\n\nE is false: policies are high-level and stable.\n\nF is incorrect: discretionary guidelines can never override mandatory standards."
      },
      {
        "id": 19,
        "tipo": "multiple",
        "pregunta": "En la planificación de la continuidad del negocio (BCP) y la resiliencia operativa, ¿qué afirmaciones son CORRECTAS?",
        "preguntaEn": "In business continuity planning (BCP) and operational resilience, which statements are CORRECT?",
        "alternativas": [
          {
            "id": "a",
            "texto": "El Análisis de Impacto en el Negocio (BIA) identifica procesos críticos, el RTO y el RPO."
          },
          {
            "id": "b",
            "texto": "La Junta Directiva y la alta gerencia son los máximos responsables de la efectividad del plan de continuidad."
          },
          {
            "id": "c",
            "texto": "El departamento de TI define de manera aislada qué líneas comerciales deben salvarse en una crisis."
          },
          {
            "id": "d",
            "texto": "El Plan de Recuperación ante Desastres (DRP) se enfoca en restaurar la infraestructura y datos tecnológicos."
          },
          {
            "id": "e",
            "texto": "Los ejercicios y simulacros periódicos son esenciales para verificar la viabilidad real del plan."
          },
          {
            "id": "f",
            "texto": "Una vez documentado el BCP, se prohíbe realizar modificaciones para no invalidar las firmas."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "The Business Impact Analysis (BIA) identifies critical business processes, RTO, and RPO."
          },
          {
            "id": "b",
            "texto": "The Board of Directors and senior management bear ultimate responsibility for business continuity effectiveness."
          },
          {
            "id": "c",
            "texto": "The IT department unilaterally determines which business operational lines should be recovered during a crisis."
          },
          {
            "id": "d",
            "texto": "The Disaster Recovery Plan (DRP) focuses on technical IT infrastructure and data recovery."
          },
          {
            "id": "e",
            "texto": "Periodic drills, walkthroughs, and simulations are essential to validate plan viability."
          },
          {
            "id": "f",
            "texto": "Once a BCP is approved, further modifications are prohibited to prevent invalidating signatures."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "d",
          "e"
        ],
        "justificacion": "A, B, D y E son pilares de la continuidad operativa: análisis de criticidad (BIA), responsabilidad directiva, enfoque tecnológico del DRP y validación mediante pruebas y simulacros.\n\nC es falso: son los dueños de negocio quienes definen las prioridades comerciales.\n\nF es incorrecto: el BCP exige actualización continua ante cambios en el entorno.",
        "justificacionEn": "A, B, D, and E are cornerstones of operational continuity: business impact analysis (BIA), executive accountability, technological focus of the DRP, and ongoing simulation testing.\n\nC is false: business unit leaders determine commercial recovery priorities.\n\nF is incorrect: continuity plans require continuous revision to address changing operational environments."
      },
      {
        "id": 20,
        "tipo": "multiple",
        "pregunta": "En relación con los marcos y modelos de madurez de procesos de TI, identifique las afirmaciones CORRECTAS:",
        "preguntaEn": "Regarding IT process maturity models and governance frameworks, identify the CORRECT statements:",
        "alternativas": [
          {
            "id": "a",
            "texto": "CMMI permite medir y clasificar la capacidad de los procesos de software en niveles evolutivos (1 a 5)."
          },
          {
            "id": "b",
            "texto": "COBIT distingue formalmente los objetivos de Gobierno (EDM) frente a los objetivos de Gestión (PBRM)."
          },
          {
            "id": "c",
            "texto": "Un nivel de madurez inicial denota procesos caóticos, no documentados y altamente dependientes de individuos."
          },
          {
            "id": "d",
            "texto": "ITIL se centra en las mejores prácticas para la Gestión y Entrega de Servicios de TI (ITSM)."
          },
          {
            "id": "e",
            "texto": "Un nivel 5 de madurez en CMMI certifica que una empresa jamás sufrirá incidentes ni errores de software."
          },
          {
            "id": "f",
            "texto": "Scrum es un estándar internacional de certificación para la gobernanza del Directorio corporativo."
          }
        ],
        "alternativasEn": [
          {
            "id": "a",
            "texto": "CMMI measures and classifies software process maturity across evolutionary tiers (1 to 5)."
          },
          {
            "id": "b",
            "texto": "COBIT formally distinguishes Governance objectives (EDM) from Management objectives (APO, BAI, DSS, MEA)."
          },
          {
            "id": "c",
            "texto": "An initial maturity level denotes chaotic, ad-hoc, and individual-dependent processes."
          },
          {
            "id": "d",
            "texto": "ITIL focuses on best-practice guidance for IT Service Management (ITSM)."
          },
          {
            "id": "e",
            "texto": "Level 5 CMMI certification guarantees that an enterprise will never experience defects or outages."
          },
          {
            "id": "f",
            "texto": "Scrum is an international standard for corporate board of directors governance."
          }
        ],
        "respuestasCorrectasIds": [
          "a",
          "b",
          "c",
          "d"
        ],
        "justificacion": "A, B, C y D describen adecuadamente los marcos del Dominio 2: niveles de CMMI, separación EDM/PBRM en COBIT, características de madurez básica y enfoque de servicios de ITIL.\n\nE es falso: la madurez optimizada no otorga inmunidad absoluta frente a fallos.\n\nF es falso: Scrum es un marco ágil para desarrollo de proyectos a nivel de equipo técnico.",
        "justificacionEn": "A, B, C, and D accurately represent Domain 2 frameworks: CMMI levels, COBIT governance vs management separation, basic maturity characteristics, and ITIL service management focus.\n\nE is false: optimizing maturity does not confer absolute immunity from software errors.\n\nF is false: Scrum is an agile project team methodology, not a board governance framework."
      }
    ]
  },
  "multiples2": {
      "1": [
        {
          "id": 1,
          "tipo": "multiple",
          "pregunta": "En relación con las fases del ciclo de vida de desarrollo de sistemas (SDLC) tradicional, ¿cuáles son CORRECTAS?",
          "preguntaEn": "Regarding the phases of the traditional systems development life cycle (SDLC), which are CORRECT?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Estudio de factibilidad"
            },
            {
              "id": "b",
              "texto": "Auditoría fiscal anual de la empresa"
            },
            {
              "id": "c",
              "texto": "Definición de requerimientos"
            },
            {
              "id": "d",
              "texto": "Capacitación del personal de ventas"
            },
            {
              "id": "e",
              "texto": "Diseño"
            },
            {
              "id": "f",
              "texto": "Revisión posimplementación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Feasibility study"
            },
            {
              "id": "b",
              "texto": "Annual enterprise financial tax audit"
            },
            {
              "id": "c",
              "texto": "Requirements definition"
            },
            {
              "id": "d",
              "texto": "Sales force training program"
            },
            {
              "id": "e",
              "texto": "Design"
            },
            {
              "id": "f",
              "texto": "Post-implementation review"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F son fases del SDLC tradicional: factibilidad, requerimientos, diseño (o selección, si el sistema se adquiere), desarrollo/configuración, pruebas e implementación finales y revisión posimplementación.\n\nB y D no son fases del SDLC; son actividades ajenas al proceso de desarrollo.",
          "justificacionEn": "A, C, E, and F are phases of the traditional SDLC: feasibility study, requirements definition, design (or software selection), development/configuration, testing and final implementation, and post-implementation review.\n\nB and D are not SDLC phases; they are unrelated operational business activities."
        },
        {
          "id": 2,
          "tipo": "multiple",
          "pregunta": "¿Cuáles de las siguientes son técnicas de programación y control del cronograma de un proyecto?",
          "preguntaEn": "Which of the following are project scheduling and timeline control techniques?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Diagrama de Gantt"
            },
            {
              "id": "b",
              "texto": "Análisis FODA"
            },
            {
              "id": "c",
              "texto": "PERT"
            },
            {
              "id": "d",
              "texto": "Diagramas de casos de uso UML"
            },
            {
              "id": "e",
              "texto": "Método de la ruta crítica (CPM)"
            },
            {
              "id": "f",
              "texto": "Matriz de clasificación de datos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Gantt chart"
            },
            {
              "id": "b",
              "texto": "SWOT analysis"
            },
            {
              "id": "c",
              "texto": "PERT (Program Evaluation and Review Technique)"
            },
            {
              "id": "d",
              "texto": "UML use-case diagrams"
            },
            {
              "id": "e",
              "texto": "Critical Path Method (CPM)"
            },
            {
              "id": "f",
              "texto": "Data classification matrix"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "Gantt, PERT y CPM son técnicas clásicas de planificación y seguimiento del tiempo en la gestión de proyectos.\n\nB es una herramienta de análisis estratégico; D es una técnica de modelado de requisitos; F pertenece a la gobernanza de datos.",
          "justificacionEn": "Gantt, PERT, and CPM are classic project management scheduling and timeline tracking techniques.\n\nB is a strategic management tool; D is a requirements modeling technique; F belongs to data governance."
        },
        {
          "id": 3,
          "tipo": "multiple",
          "pregunta": "Respecto a las metodologías de desarrollo ágil, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding agile software development methodologies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Trabaja con iteraciones cortas y entregas incrementales"
            },
            {
              "id": "b",
              "texto": "Depende de documentación detallada y exhaustiva antes de programar"
            },
            {
              "id": "c",
              "texto": "Requiere colaboración continua con el usuario"
            },
            {
              "id": "d",
              "texto": "Se caracteriza por la ausencia total de requisitos de usuario"
            },
            {
              "id": "e",
              "texto": "Tiene una fuerte dependencia del conocimiento tácito del equipo"
            },
            {
              "id": "f",
              "texto": "Congela todos los requisitos antes de escribir la primera línea de código"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Works with short iterations and incremental deliverables"
            },
            {
              "id": "b",
              "texto": "Relies heavily on exhaustive and detailed documentation prior to coding"
            },
            {
              "id": "c",
              "texto": "Requires continuous and close collaboration with the user"
            },
            {
              "id": "d",
              "texto": "Is characterized by a complete absence of user requirements"
            },
            {
              "id": "e",
              "texto": "Relies significantly on the team's tacit knowledge"
            },
            {
              "id": "f",
              "texto": "Freezes all system requirements before writing the first line of code"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E describen el enfoque ágil: iteraciones, involucramiento permanente del usuario y apoyo en el conocimiento tácito.\n\nB y F son rasgos del enfoque en cascada (waterfall), no del ágil.\n\nD es falso: el ágil sí trabaja con requisitos, pero los refina de forma continua.",
          "justificacionEn": "A, C, and E describe the agile approach: short iterations, continuous user involvement, and reliance on tacit team knowledge.\n\nB and F are hallmarks of the waterfall model, not agile.\n\nD is false: agile does work with requirements, refining them continuously through user stories."
        },
        {
          "id": 4,
          "tipo": "multiple",
          "pregunta": "¿Cuáles de las siguientes pruebas se consideran parte de las pruebas del sistema (system testing)?",
          "preguntaEn": "Which of the following test types are considered part of system testing?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Pruebas de recuperación"
            },
            {
              "id": "b",
              "texto": "Pruebas de aceptación del usuario (UAT)"
            },
            {
              "id": "c",
              "texto": "Pruebas de seguridad"
            },
            {
              "id": "d",
              "texto": "Pruebas de carga"
            },
            {
              "id": "e",
              "texto": "Pruebas de volumen"
            },
            {
              "id": "f",
              "texto": "Pruebas de estrés"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Recovery testing"
            },
            {
              "id": "b",
              "texto": "User Acceptance Testing (UAT)"
            },
            {
              "id": "c",
              "texto": "Security testing"
            },
            {
              "id": "d",
              "texto": "Load testing"
            },
            {
              "id": "e",
              "texto": "Volume testing"
            },
            {
              "id": "f",
              "texto": "Stress testing"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e",
            "f"
          ],
          "justificacion": "Recuperación, seguridad, carga, volumen y estrés son pruebas específicas del sistema (junto con las de rendimiento).\n\nB es la prueba de aceptación final, que se realiza después de que las pruebas del sistema resultan satisfactorias.",
          "justificacionEn": "Recovery, security, load, volume, and stress are specific forms of system testing (along with performance testing).\n\nB is final acceptance testing, conducted only after system testing is completed successfully."
        },
        {
          "id": 5,
          "tipo": "multiple",
          "pregunta": "Sobre los distintos tipos de pruebas de software, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding the various types of software testing, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Las pruebas de regresión repiten parte del plan de pruebas para confirmar que los cambios no introdujeron nuevos errores"
            },
            {
              "id": "b",
              "texto": "Las pruebas de caja negra requieren conocer la estructura interna del código"
            },
            {
              "id": "c",
              "texto": "Las pruebas de sociabilidad verifican que el sistema opere en su entorno sin afectar a los sistemas existentes"
            },
            {
              "id": "d",
              "texto": "Las pruebas alfa son ejecutadas por clientes externos"
            },
            {
              "id": "e",
              "texto": "Las pruebas de caja blanca evalúan la lógica interna del programa"
            },
            {
              "id": "f",
              "texto": "Las pruebas paralelas alimentan los mismos datos al sistema modificado y a uno alterno para comparar resultados"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Regression testing reruns previous test cases to confirm changes did not introduce new defects"
            },
            {
              "id": "b",
              "texto": "Black-box testing requires knowledge of internal code structure"
            },
            {
              "id": "c",
              "texto": "Sociability testing confirms the system operates in its environment without adversely impacting existing systems"
            },
            {
              "id": "d",
              "texto": "Alpha testing is performed by external public clients"
            },
            {
              "id": "e",
              "texto": "White-box testing assesses the internal programmatic logic of the software"
            },
            {
              "id": "f",
              "texto": "Parallel testing feeds identical data into the new and existing systems to compare outputs"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F corresponden a las definiciones del manual.\n\nB es falso: la caja negra prueba el funcionamiento sin considerar la estructura interna del programa.\n\nD es falso: las pruebas alfa las realizan usuarios dentro de la organización que desarrolla; las beta involucran a un grupo limitado de usuarios externos.",
          "justificacionEn": "A, C, E, and F correspond to CISA manual definitions.\n\nB is false: black-box testing evaluates functional behavior without looking at internal source code.\n\nD is false: alpha testing is performed internally by development organization users; beta testing involves external users."
        },
        {
          "id": 6,
          "tipo": "multiple",
          "pregunta": "En las pruebas de aceptación final (QAT y UAT), ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "Regarding final acceptance testing (QAT and UAT), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La UAT debe ejecutarse idealmente en un entorno de prueba o staging seguro"
            },
            {
              "id": "b",
              "texto": "La UAT la realizan exclusivamente los desarrolladores"
            },
            {
              "id": "c",
              "texto": "Si el proveedor probó el paquete adquirido, no se requieren pruebas del usuario ni del personal de mantenimiento"
            },
            {
              "id": "d",
              "texto": "La QAT se enfoca en los aspectos técnicos y la realiza principalmente el área de TI"
            },
            {
              "id": "e",
              "texto": "Los criterios de aceptación se definen después de ejecutar las pruebas"
            },
            {
              "id": "f",
              "texto": "El auditor debe emitir una opinión sobre si el sistema cumple los requisitos, tiene controles adecuados y está listo para migrar a producción"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "UAT should ideally be executed in a dedicated, secure test or staging environment"
            },
            {
              "id": "b",
              "texto": "UAT is performed exclusively by the software developers"
            },
            {
              "id": "c",
              "texto": "If the vendor tested an acquired software package, testing by business users and maintenance staff is unnecessary"
            },
            {
              "id": "d",
              "texto": "QAT focuses on technical and quality aspects and is conducted primarily by IT staff"
            },
            {
              "id": "e",
              "texto": "Acceptance criteria are established only after test execution is completed"
            },
            {
              "id": "f",
              "texto": "The auditor should express an opinion on whether the system satisfies requirements, controls, and is ready for production"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "d",
            "f"
          ],
          "justificacion": "A, D y F coinciden con el manual: entorno seguro para evitar cambios no autorizados, QAT técnica a cargo de TI y opinión final del auditor.\n\nB es falso: la UAT se ejecuta desde la perspectiva del usuario.\n\nC es falso: los sistemas adquiridos también deben ser probados por el usuario final y el personal de mantenimiento.\n\nE es falso: los criterios de aceptación se definen antes de las pruebas.",
          "justificacionEn": "A, D, and F align with CISA standards: secure environment to avoid unauthorized changes, technical QAT by IT, and final auditor opinion.\n\nB is false: UAT is conducted from the perspective of end users.\n\nC is false: acquired software packages must still be tested by end users and maintenance personnel.\n\nE is false: acceptance criteria must be defined prior to test execution."
        },
        {
          "id": 7,
          "tipo": "multiple",
          "pregunta": "Sobre las técnicas de cambio al nuevo sistema (changeover / go-live), ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding system changeover / go-live conversion strategies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "En el cambio paralelo, el sistema antiguo y el nuevo funcionan simultáneamente durante un periodo de traslape"
            },
            {
              "id": "b",
              "texto": "En el cambio abrupto, el sistema antiguo se descontinúa en una fecha y hora de corte"
            },
            {
              "id": "c",
              "texto": "En el cambio paralelo, los usuarios utilizan únicamente el sistema nuevo"
            },
            {
              "id": "d",
              "texto": "En el cambio por fases, la migración se hace módulo por módulo según un calendario preestablecido"
            },
            {
              "id": "e",
              "texto": "El cambio por fases evita tener que mantener dos entornos a la vez"
            },
            {
              "id": "f",
              "texto": "El cambio paralelo es el más económico de las tres técnicas"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "In parallel changeover, the legacy and new systems operate concurrently during an overlap period"
            },
            {
              "id": "b",
              "texto": "In direct cutover (abrupt changeover), the legacy system is discontinued at a scheduled cutoff time"
            },
            {
              "id": "c",
              "texto": "In parallel changeover, users exclusively utilize the new system"
            },
            {
              "id": "d",
              "texto": "In phased changeover, migration occurs module by module according to a planned schedule"
            },
            {
              "id": "e",
              "texto": "Phased changeover eliminates the need to maintain dual environments concurrently"
            },
            {
              "id": "f",
              "texto": "Parallel changeover is the most economical of the three migration strategies"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d"
          ],
          "justificacion": "A, B y D describen correctamente las tres técnicas.\n\nC es falso: en el paralelo los usuarios deben usar ambos sistemas durante el traslape.\n\nE es falso: el cambio por fases exige sostener dos entornos y extiende el ciclo de vida del proyecto.\n\nF es falso: operar dos sistemas al mismo tiempo implica mayores costos y esfuerzo.",
          "justificacionEn": "A, B, and D accurately characterize the primary changeover strategies.\n\nC is false: parallel changeover requires operating and feeding both systems concurrently.\n\nE is false: phased cutovers require dual environment support and interfaces, extending project overhead.\n\nF is false: running parallel systems is the most costly and resource-intensive strategy."
        },
        {
          "id": 8,
          "tipo": "multiple",
          "pregunta": "En un proceso de conversión y migración de datos, ¿qué actividades son adecuadas?",
          "preguntaEn": "During a data conversion and migration process, which activities are appropriate?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Depurar los datos antes de convertirlos"
            },
            {
              "id": "b",
              "texto": "Verificar la conversión con conteos de registros y totales de control"
            },
            {
              "id": "c",
              "texto": "Ejecutar la migración sin plan de reversa (fallback)"
            },
            {
              "id": "d",
              "texto": "Definir responsables de verificar y aprobar cada paso de la conversión"
            },
            {
              "id": "e",
              "texto": "Diseñar reportes de excepción para los datos que no puedan convertirse automáticamente"
            },
            {
              "id": "f",
              "texto": "Omitir los ensayos de conversión para ahorrar tiempo"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Cleanse and scrub data prior to conversion"
            },
            {
              "id": "b",
              "texto": "Verify conversion accuracy using record counts and control totals"
            },
            {
              "id": "c",
              "texto": "Execute the migration without a fallback/rollback plan"
            },
            {
              "id": "d",
              "texto": "Designate authorized individuals to verify and sign off on each conversion stage"
            },
            {
              "id": "e",
              "texto": "Develop exception reports for data records that cannot be converted automatically"
            },
            {
              "id": "f",
              "texto": "Skip conversion dress rehearsals to accelerate the timeline"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E son pasos recomendados: limpieza previa, verificación de exactitud y completitud, aprobación formal y reportes de excepciones.\n\nC es incorrecto: antes del corte debe existir un escenario de reversa para restaurar los datos si el nuevo sistema falla.\n\nF es incorrecto: los ensayos (dress rehearsals) familiarizan al personal y prueban el proceso de extremo a extremo.",
          "justificacionEn": "A, B, D, and E are recommended data migration practices: upfront data cleansing, validation via control totals, formal sign-offs, and exception reporting.\n\nC is incorrect: a fallback/rollback plan is mandatory in case the cutover fails.\n\nF is incorrect: dress rehearsals are essential to validate timing and end-to-end execution."
        },
        {
          "id": 9,
          "tipo": "multiple",
          "pregunta": "Respecto a los controles de validación de datos de entrada, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding input data validation controls, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El dígito verificador detecta errores de transposición y transcripción"
            },
            {
              "id": "b",
              "texto": "La verificación de rango detecta errores de transposición"
            },
            {
              "id": "c",
              "texto": "Los totales de lote garantizan la confidencialidad de los datos"
            },
            {
              "id": "d",
              "texto": "La verificación de duplicados detecta transacciones ingresadas más de una vez"
            },
            {
              "id": "e",
              "texto": "Los controles de entrada solo se aplican a datos digitados manualmente"
            },
            {
              "id": "f",
              "texto": "La verificación de rango confirma que el dato corresponde a un cliente existente"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A check digit detects transposition and transcription errors"
            },
            {
              "id": "b",
              "texto": "Range checking detects transposition errors"
            },
            {
              "id": "c",
              "texto": "Batch totals ensure data confidentiality"
            },
            {
              "id": "d",
              "texto": "Duplicate checking detects transactions submitted more than once"
            },
            {
              "id": "e",
              "texto": "Input validation controls only apply to manually keyed data"
            },
            {
              "id": "f",
              "texto": "Range checking verifies that an input corresponds to an existing customer record"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "d"
          ],
          "justificacion": "A y D son correctas: el dígito verificador detecta transposición y transcripción; la verificación de duplicados evita registros repetidos.\n\nB y F confunden la función de la verificación de rango (valores dentro de límites definidos).\n\nC es falso: los totales de lote controlan integridad y completitud, no confidencialidad.\n\nE es falso: la validación debe aplicarse a toda fuente de entrada, incluidas interfaces y cargas automáticas.",
          "justificacionEn": "A and D are correct: check digits catch transposition and transcription mistakes; duplicate checks prevent re-entry of processed items.\n\nB and F confuse range checks (boundaries) with validity/reasonableness checks.\n\nC is false: batch totals ensure completeness and integrity, not confidentiality.\n\nE is false: input controls must validate all ingestion channels, including APIs and automated batch feeds."
        },
        {
          "id": 10,
          "tipo": "multiple",
          "pregunta": "Sobre la revisión posimplementación, ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "Regarding post-implementation reviews (PIR), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Se realiza antes de la puesta en producción para autorizar el pase"
            },
            {
              "id": "b",
              "texto": "Evalúa si se alcanzaron los objetivos y entregables del proyecto"
            },
            {
              "id": "c",
              "texto": "Es innecesaria si la UAT fue satisfactoria"
            },
            {
              "id": "d",
              "texto": "Permite identificar lecciones aprendidas aplicables a proyectos futuros"
            },
            {
              "id": "e",
              "texto": "Verifica si los controles y requisitos se cumplen en el sistema implementado"
            },
            {
              "id": "f",
              "texto": "Se limita a revisar los costos de hardware"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "It is conducted prior to go-live to authorize release into production"
            },
            {
              "id": "b",
              "texto": "It assesses whether project business objectives and deliverables were achieved"
            },
            {
              "id": "c",
              "texto": "It is rendered unnecessary if user acceptance testing was successful"
            },
            {
              "id": "d",
              "texto": "It identifies lessons learned that can benefit future enterprise initiatives"
            },
            {
              "id": "e",
              "texto": "It verifies that internal controls and business requirements are operating as designed"
            },
            {
              "id": "f",
              "texto": "Its scope is strictly limited to evaluating hardware capital expenses"
            }
          ],
          "respuestasCorrectasIds": [
            "b",
            "d",
            "e"
          ],
          "justificacion": "B, D y E son propósitos de la revisión posimplementación: verificar entregables, controles y requisitos, y capturar lecciones aprendidas.\n\nA es falso: ocurre después de la implementación.\n\nC es falso: la UAT y la revisión posimplementación cumplen objetivos distintos.\n\nF es falso: su alcance incluye objetivos, controles, requisitos y satisfacción de los usuarios, no solo costos.",
          "justificacionEn": "B, D, and E represent core goals of a PIR: verifying deliverables, auditing operating controls, and documenting lessons learned.\n\nA is false: it occurs after production stabilization (e.g., 30-90 days).\n\nC is false: UAT and PIR serve distinct assurance purposes.\n\nF is false: scope encompasses business case benefits, controls, and user satisfaction."
        }
      ],
      "2": [
        {
          "id": 11,
          "tipo": "multiple",
          "pregunta": "Sobre el RTO y el RPO, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding RTO (Recovery Time Objective) and RPO (Recovery Point Objective), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El RTO es el tiempo máximo aceptable de inactividad tras una interrupción"
            },
            {
              "id": "b",
              "texto": "Un RTO alto implica que el sistema debe estar disponible de inmediato"
            },
            {
              "id": "c",
              "texto": "El RPO es la máxima pérdida de datos aceptable, medida en tiempo"
            },
            {
              "id": "d",
              "texto": "El RTO y el RPO se fijan antes de realizar el análisis de impacto al negocio (BIA)"
            },
            {
              "id": "e",
              "texto": "Un RPO de minutos requiere replicación de datos en tiempo real o espejo"
            },
            {
              "id": "f",
              "texto": "Cuanto más cercanos a cero son el RTO y el RPO, menor es el costo de la estrategia de recuperación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "RTO is the maximum acceptable outage duration following a disruption"
            },
            {
              "id": "b",
              "texto": "A high RTO implies the system must be restored immediately"
            },
            {
              "id": "c",
              "texto": "RPO is the maximum allowable data loss measured in time"
            },
            {
              "id": "d",
              "texto": "RTO and RPO are established before conducting the Business Impact Analysis (BIA)"
            },
            {
              "id": "e",
              "texto": "An RPO of minutes demands real-time data replication or mirroring"
            },
            {
              "id": "f",
              "texto": "The closer RTO and RPO are to zero, the lower the disaster recovery cost"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E son correctas: el RTO mide el tiempo de recuperación aceptable; el RPO, la pérdida de datos aceptable; y un RPO muy bajo exige replicación en tiempo real.\n\nB es falso: un RTO alto significa que el sistema puede recuperarse más tarde.\n\nD es falso: el BIA es precisamente el que permite determinar RTO y RPO.\n\nF es falso: a menor tiempo requerido, mayor costo.",
          "justificacionEn": "A, C, and E are correct: RTO specifies allowable downtime; RPO specifies acceptable data loss; near-zero RPO requires synchronous data replication.\n\nB is false: a high RTO means restoration can wait.\n\nD is false: the BIA is the formal vehicle used to determine RTO and RPO targets.\n\nF is false: shrinking RTO and RPO toward zero increases recovery costs exponentially."
        },
        {
          "id": 12,
          "tipo": "multiple",
          "pregunta": "En cuanto a las alternativas de recuperación ante desastres, ¿cuáles son correctas?",
          "preguntaEn": "Regarding disaster recovery alternative site strategies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El sitio frío cuenta con espacio e infraestructura básica, pero sin equipos de TI ni datos"
            },
            {
              "id": "b",
              "texto": "El sitio tibio tiene infraestructura parcialmente configurada con TI, redes y periféricos esenciales"
            },
            {
              "id": "c",
              "texto": "Los acuerdos recíprocos son la alternativa más viable por su fácil compatibilidad"
            },
            {
              "id": "d",
              "texto": "El sitio caliente cuenta con toda la infraestructura y los equipos de TI y comunicaciones necesarios"
            },
            {
              "id": "e",
              "texto": "El sitio espejo replica los datos en tiempo real y asume el procesamiento sin interrupción perceptible"
            },
            {
              "id": "f",
              "texto": "El sitio frío ofrece el menor tiempo de recuperación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A cold site provides basic space and electrical/cooling utilities, but no IT hardware or data"
            },
            {
              "id": "b",
              "texto": "A warm site has partially configured hardware, network links, and essential peripherals"
            },
            {
              "id": "c",
              "texto": "Reciprocal agreements are the most viable alternative due to ease of technical compatibility"
            },
            {
              "id": "d",
              "texto": "A hot site possesses complete infrastructure, active equipment, and communications ready to run"
            },
            {
              "id": "e",
              "texto": "A mirrored site replicates data synchronously and assumes processing with near-zero disruption"
            },
            {
              "id": "f",
              "texto": "A cold site provides the shortest recovery time objective"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E corresponden a las definiciones del manual.\n\nC es falso: los acuerdos recíprocos no se consideran una opción viable por la dificultad de mantener compatibilidad y cumplimiento.\n\nF es falso: el sitio frío es el más barato pero el de mayor tiempo de recuperación.",
          "justificacionEn": "A, B, D, and E accurately reflect CISA recovery site definitions.\n\nC is false: reciprocal agreements are rarely viable due to ongoing technical configuration drift and confidentiality conflicts.\n\nF is false: cold sites have the longest recovery time (days or weeks)."
        },
        {
          "id": 13,
          "tipo": "multiple",
          "pregunta": "Sobre los esquemas de respaldo, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding data backup schemes and methodologies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El respaldo completo copia todos los archivos y carpetas"
            },
            {
              "id": "b",
              "texto": "El respaldo incremental copia lo que cambió desde el último respaldo incremental o completo"
            },
            {
              "id": "c",
              "texto": "En un esquema completo más incrementales, basta restaurar el último completo y el último incremental"
            },
            {
              "id": "d",
              "texto": "El respaldo diferencial copia lo que cambió desde el último respaldo completo"
            },
            {
              "id": "e",
              "texto": "El respaldo diferencial requiere menos tiempo de restauración que el incremental"
            },
            {
              "id": "f",
              "texto": "El respaldo completo es el más rápido y el que requiere menos capacidad de medios"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A full backup duplicates all specified files and directories"
            },
            {
              "id": "b",
              "texto": "An incremental backup copies only files modified since the last full or incremental backup"
            },
            {
              "id": "c",
              "texto": "In a full plus incremental scheme, restoration only requires the last full and the most recent incremental backup"
            },
            {
              "id": "d",
              "texto": "A differential backup copies all files that have changed since the last full backup"
            },
            {
              "id": "e",
              "texto": "A differential backup requires less restoration time than an incremental backup scheme"
            },
            {
              "id": "f",
              "texto": "A full backup is the fastest to execute and requires the least storage media"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E son correctas según el manual.\n\nC es falso: para restaurar se necesita el último completo y todos los incrementales posteriores.\n\nF es falso: el completo es el que más tiempo y capacidad de medios requiere.",
          "justificacionEn": "A, B, D, and E are correct according to CISA guidelines.\n\nC is false: restoring incremental backups requires the baseline full backup plus all subsequent incrementals in sequence.\n\nF is false: full backups take the longest time and highest media capacity."
        },
        {
          "id": 14,
          "tipo": "multiple",
          "pregunta": "¿Qué actividades forman parte del análisis de impacto al negocio (BIA)?",
          "preguntaEn": "Which activities form an integral part of a Business Impact Analysis (BIA)?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Identificar los procesos críticos y los recursos que los soportan"
            },
            {
              "id": "b",
              "texto": "Definir el presupuesto de ventas del siguiente año"
            },
            {
              "id": "c",
              "texto": "Evaluar el impacto de la interrupción a lo largo del tiempo"
            },
            {
              "id": "d",
              "texto": "Seleccionar el sitio alterno antes de analizar los impactos"
            },
            {
              "id": "e",
              "texto": "Determinar el RTO y el RPO"
            },
            {
              "id": "f",
              "texto": "Priorizar el orden de recuperación de los procesos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Identify critical business processes and their supporting dependencies"
            },
            {
              "id": "b",
              "texto": "Formulate next year's corporate commercial sales quota"
            },
            {
              "id": "c",
              "texto": "Evaluate financial and operational outage impacts over time"
            },
            {
              "id": "d",
              "texto": "Contract an alternate recovery site before analyzing business impacts"
            },
            {
              "id": "e",
              "texto": "Determine RTO and RPO objectives for critical functions"
            },
            {
              "id": "f",
              "texto": "Prioritize the sequence of process restoration based on criticality"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F son resultados del BIA y base para elegir las estrategias de recuperación.\n\nB no es parte del BIA.\n\nD es incorrecto: las estrategias y alternativas se seleccionan a partir del BIA, no antes.",
          "justificacionEn": "A, C, E, and F are standard BIA outcomes that guide continuity strategy selection.\n\nB is outside the scope of business continuity.\n\nD is incorrect: recovery solutions are chosen based on BIA findings, not beforehand."
        },
        {
          "id": 15,
          "tipo": "multiple",
          "pregunta": "¿Cuáles son métodos de prueba de un plan de recuperación ante desastres (DRP)?",
          "preguntaEn": "Which of the following are recognized Disaster Recovery Plan (DRP) testing methods?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Revisión de listas de verificación (checklist)"
            },
            {
              "id": "b",
              "texto": "Pruebas de penetración"
            },
            {
              "id": "c",
              "texto": "Recorrido estructurado (structured walk-through)"
            },
            {
              "id": "d",
              "texto": "Simulación"
            },
            {
              "id": "e",
              "texto": "Prueba paralela"
            },
            {
              "id": "f",
              "texto": "Prueba de interrupción completa"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Checklist review"
            },
            {
              "id": "b",
              "texto": "Penetration testing"
            },
            {
              "id": "c",
              "texto": "Structured walk-through"
            },
            {
              "id": "d",
              "texto": "Simulation testing"
            },
            {
              "id": "e",
              "texto": "Parallel testing"
            },
            {
              "id": "f",
              "texto": "Full-interruption testing"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e",
            "f"
          ],
          "justificacion": "Los tipos de prueba del manual son: revisión de checklist, recorrido estructurado, simulación, prueba paralela e interrupción completa (la más rigurosa, costosa y potencialmente disruptiva).\n\nB es una técnica de pruebas de seguridad, no de pruebas de recuperación.",
          "justificacionEn": "Recognized DRP test levels are: checklist review, structured walk-through, simulation, parallel test, and full-interruption test.\n\nB is a technical cybersecurity validation technique, not a disaster recovery exercise."
        },
        {
          "id": 16,
          "tipo": "multiple",
          "pregunta": "¿Qué objetivos debe cumplir una prueba del plan de continuidad o recuperación?",
          "preguntaEn": "What key objectives should a business continuity or disaster recovery exercise accomplish?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Verificar la completitud y precisión del plan"
            },
            {
              "id": "b",
              "texto": "Programarla en horario pico de producción para maximizar la interrupción"
            },
            {
              "id": "c",
              "texto": "Evaluar el desempeño del personal involucrado"
            },
            {
              "id": "d",
              "texto": "Evaluar la coordinación con proveedores y terceros externos"
            },
            {
              "id": "e",
              "texto": "Limitar la participación a los miembros del equipo de recuperación"
            },
            {
              "id": "f",
              "texto": "Concluir que, si todo funciona sin recomendaciones, no hace falta una prueba más exigente"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Verify the completeness, accuracy, and currency of the plan"
            },
            {
              "id": "b",
              "texto": "Schedule during peak operational hours to maximize disruption"
            },
            {
              "id": "c",
              "texto": "Evaluate personnel performance and recovery team readiness"
            },
            {
              "id": "d",
              "texto": "Assess coordination with third-party vendors and critical partners"
            },
            {
              "id": "e",
              "texto": "Restrict participation strictly to formal recovery team members"
            },
            {
              "id": "f",
              "texto": "Conclude that if no defects were found, subsequent testing is unneeded"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son tareas que debe lograr la prueba.\n\nB es falso: se recomienda programarla cuando minimice la interrupción de las operaciones (por ejemplo, fines de semana).\n\nE es falso: también debe evaluarse el nivel de capacitación y conciencia de empleados que no forman parte del equipo.\n\nF es falso: si no surge ninguna recomendación, probablemente debió planificarse una prueba más desafiante.",
          "justificacionEn": "A, C, and D are primary objectives of continuity testing.\n\nB is false: tests should be scheduled to minimize production disruption.\n\nE is false: general staff awareness and coordination should also be validated.\n\nF is false: a test yielding no recommendations usually indicates an insufficiently challenging test scenario."
        },
        {
          "id": 17,
          "tipo": "multiple",
          "pregunta": "Sobre la gestión de incidentes y de problemas, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding incident management and problem management, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La gestión de incidentes busca restablecer el proceso afectado a su estado normal lo antes posible"
            },
            {
              "id": "b",
              "texto": "La base de errores conocidos (KEDB) registra únicamente incidentes de seguridad"
            },
            {
              "id": "c",
              "texto": "La gestión de problemas busca identificar la causa raíz de uno o varios incidentes"
            },
            {
              "id": "d",
              "texto": "Un error conocido es un problema cuya causa raíz fue identificada y para el que se desarrolló una solución temporal (workaround)"
            },
            {
              "id": "e",
              "texto": "Los 5 porqués y el diagrama de Ishikawa son técnicas de análisis de causa raíz"
            },
            {
              "id": "f",
              "texto": "Ambos procesos persiguen exactamente el mismo objetivo"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Incident management aims to restore normal service operation as quickly as possible"
            },
            {
              "id": "b",
              "texto": "The Known Error Database (KEDB) exclusively records information security breaches"
            },
            {
              "id": "c",
              "texto": "Problem management aims to identify the underlying root cause of incidents"
            },
            {
              "id": "d",
              "texto": "A known error is a problem with an identified root cause and a documented workaround"
            },
            {
              "id": "e",
              "texto": "The 5 Whys and Ishikawa (fishbone) diagrams are root-cause analysis techniques"
            },
            {
              "id": "f",
              "texto": "Both disciplines pursue identical operational objectives"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e"
          ],
          "justificacion": "A, C, D y E coinciden con el manual.\n\nB es falso: la KEDB documenta errores conocidos y sus soluciones temporales.\n\nF es falso: incidentes buscan restablecer el servicio; problemas buscan reducir el número y la severidad de los incidentes.",
          "justificacionEn": "A, C, D, and E reflect ITIL/CISA principles.\n\nB is false: KEDB logs all recurring operational errors and workarounds.\n\nF is false: incident management focuses on rapid restoration; problem management focuses on preventing recurring failures."
        },
        {
          "id": 18,
          "tipo": "multiple",
          "pregunta": "En bases de datos, ¿qué afirmaciones sobre integridad y transacciones son correctas?",
          "preguntaEn": "In database systems, which statements regarding integrity and transaction properties (ACID) are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La atomicidad garantiza que una transacción se complete en su totalidad o no se aplique en absoluto"
            },
            {
              "id": "b",
              "texto": "La durabilidad implica que los cambios se revierten al cerrar la sesión"
            },
            {
              "id": "c",
              "texto": "La integridad referencial exige que toda clave foránea sea nula o apunte a un valor existente en otra tabla"
            },
            {
              "id": "d",
              "texto": "La normalización busca maximizar la redundancia de datos"
            },
            {
              "id": "e",
              "texto": "La integridad de entidad exige que la clave primaria sea única y no nula"
            },
            {
              "id": "f",
              "texto": "El aislamiento exige que las transacciones concurrentes vean los estados intermedios de las demás"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Atomicity guarantees that a transaction executes completely or is rolled back entirely"
            },
            {
              "id": "b",
              "texto": "Durability means data updates are reverted as soon as the session closes"
            },
            {
              "id": "c",
              "texto": "Referential integrity requires that foreign key values match an existing primary key or be null"
            },
            {
              "id": "d",
              "texto": "Normalization aims to maximize data redundancy across database tables"
            },
            {
              "id": "e",
              "texto": "Entity integrity mandates that primary keys must be unique and non-null"
            },
            {
              "id": "f",
              "texto": "Isolation requires concurrent transactions to expose intermediate states to each other"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E son correctas.\n\nB es falso: la durabilidad garantiza que los cambios confirmados persistan.\n\nD es falso: la normalización reduce la redundancia.\n\nF es falso: el aislamiento evita que las transacciones concurrentes interfieran entre sí.",
          "justificacionEn": "A, C, and E are correct database integrity concepts.\n\nB is false: durability guarantees committed changes survive system crashes.\n\nD is false: normalization reduces data redundancy and anomalies.\n\nF is false: isolation prevents concurrent transactions from seeing intermediate uncommitted states."
        },
        {
          "id": 19,
          "tipo": "multiple",
          "pregunta": "Respecto a la gestión de niveles de servicio y los SLA, ¿cuáles son correctas?",
          "preguntaEn": "Regarding Service Level Management and SLAs, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Un SLA es un acuerdo entre TI (interna o externa) y el cliente que detalla los servicios a prestar"
            },
            {
              "id": "b",
              "texto": "Los SLA solo aplican a proveedores externos"
            },
            {
              "id": "c",
              "texto": "Describe los servicios en términos no técnicos desde la perspectiva del cliente"
            },
            {
              "id": "d",
              "texto": "Sirve como estándar para medir y ajustar los servicios durante el periodo del acuerdo"
            },
            {
              "id": "e",
              "texto": "La gestión de niveles de servicio incluye el catálogo de servicios y las reuniones de revisión"
            },
            {
              "id": "f",
              "texto": "La gestión de niveles de servicio se limita a redactar el SLA"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "An SLA is an agreement between IT (internal or external) and the customer defining services provided"
            },
            {
              "id": "b",
              "texto": "SLAs apply exclusively to commercial third-party service providers"
            },
            {
              "id": "c",
              "texto": "It describes service terms in non-technical language from the customer's perspective"
            },
            {
              "id": "d",
              "texto": "It serves as a baseline standard to monitor and tune performance over the agreement term"
            },
            {
              "id": "e",
              "texto": "Service Level Management encompasses the service catalog, metrics, and periodic review meetings"
            },
            {
              "id": "f",
              "texto": "Service Level Management is restricted solely to the initial drafting of the SLA contract"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e"
          ],
          "justificacion": "A, C, D y E coinciden con el manual.\n\nB es falso: el área de TI puede ser interna o un proveedor externo.\n\nF es falso: la gestión abarca definición, acuerdo, documentación, catálogo, seguimiento y revisiones.",
          "justificacionEn": "A, C, D, and E represent SLA governance best practices.\n\nB is false: SLAs are established with both internal IT departments and external vendors.\n\nF is false: SLM is an ongoing lifecycle of agreement, monitoring, reporting, and review."
        },
        {
          "id": 20,
          "tipo": "multiple",
          "pregunta": "Sobre la computación de usuario final (EUC) y el Shadow IT, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding End-User Computing (EUC) and Shadow IT, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El EUC permite que usuarios no programadores diseñen sus propias aplicaciones"
            },
            {
              "id": "b",
              "texto": "Las aplicaciones EUC siempre están sujetas a una revisión independiente"
            },
            {
              "id": "c",
              "texto": "La falta de supervisión de TI en el EUC genera riesgos como ausencia de autenticación, de registros de auditoría y de respaldos"
            },
            {
              "id": "d",
              "texto": "El Shadow IT es tecnología usada sin que el departamento de TI lo sepa"
            },
            {
              "id": "e",
              "texto": "Las aplicaciones EUC siempre se desarrollan con una metodología formal"
            },
            {
              "id": "f",
              "texto": "Excel y Access incluyen de forma estándar un registro de auditoría robusto"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "EUC enables non-technical end users to create their own processing applications"
            },
            {
              "id": "b",
              "texto": "EUC applications are always subjected to rigorous independent testing and reviews"
            },
            {
              "id": "c",
              "texto": "Lack of IT oversight in EUC introduces risks such as absent authentication, audit trails, and backups"
            },
            {
              "id": "d",
              "texto": "Shadow IT refers to technology assets used without IT department approval or knowledge"
            },
            {
              "id": "e",
              "texto": "EUC solutions are consistently built following formal SDLC development methodologies"
            },
            {
              "id": "f",
              "texto": "Desktop spreadsheets and databases include robust built-in immutable audit trails by default"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son correctas.\n\nB y E son falsas: justamente la falta de revisión y de metodología formal es uno de los riesgos del EUC.\n\nF es falso: las soluciones estándar de EUC suelen no contar con registro de auditoría adecuado.",
          "justificacionEn": "A, C, and D are correct.\n\nB and E are false: lack of independent review and formal methodology represents the primary risk of EUC.\n\nF is false: desktop end-user tools typically lack native tamper-proof audit trails."
        }
      ],
      "3": [
        {
          "id": 21,
          "tipo": "multiple",
          "pregunta": "En una política de seguridad de la información, ¿qué elementos y características son correctos?",
          "preguntaEn": "In an information security policy, which elements and attributes are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Incluye alcance, enunciado de la política y objetivos"
            },
            {
              "id": "b",
              "texto": "Una vez emitida, no requiere monitoreo"
            },
            {
              "id": "c",
              "texto": "Sus objetivos incluyen confidencialidad, integridad y disponibilidad"
            },
            {
              "id": "d",
              "texto": "Detalla la configuración técnica de cada sistema"
            },
            {
              "id": "e",
              "texto": "Sus objetivos deben ser específicos, medibles, alcanzables, realistas y con plazo (SMART)"
            },
            {
              "id": "f",
              "texto": "Puede emitirse sin aprobación de la alta dirección"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "It includes scope, policy statement, and overarching objectives"
            },
            {
              "id": "b",
              "texto": "Once published, it does not require continuous monitoring or reviews"
            },
            {
              "id": "c",
              "texto": "Its core objectives encompass confidentiality, integrity, and availability (CIA)"
            },
            {
              "id": "d",
              "texto": "It specifies detailed low-level configuration settings for each system"
            },
            {
              "id": "e",
              "texto": "Its objectives should be Specific, Measurable, Achievable, Realistic, and Time-bound (SMART)"
            },
            {
              "id": "f",
              "texto": "It can be formally issued without executive leadership approval"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E corresponden a los elementos clave de una política de seguridad.\n\nB es falso: el monitoreo es uno de sus objetivos.\n\nD es falso: la política se redacta a alto nivel; el detalle técnico va en procedimientos y estándares.\n\nF es falso: la política debe establecer el tono desde la dirección y asignar responsabilidades.",
          "justificacionEn": "A, C, and E are foundational characteristics of security policies.\n\nB is false: compliance monitoring and periodic reviews are mandatory.\n\nD is false: policies are high-level directives; technical details reside in standards and baselines.\n\nF is false: management endorsement is essential to establish authority and accountability."
        },
        {
          "id": 22,
          "tipo": "multiple",
          "pregunta": "Sobre los factores de autenticación, ¿cuáles son correctos?",
          "preguntaEn": "Regarding authentication factors and multi-factor authentication (MFA), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La contraseña es algo que el usuario sabe"
            },
            {
              "id": "b",
              "texto": "Usuario y contraseña constituyen autenticación multifactor"
            },
            {
              "id": "c",
              "texto": "Un token OTP es algo que el usuario tiene"
            },
            {
              "id": "d",
              "texto": "PIN más contraseña constituyen autenticación multifactor"
            },
            {
              "id": "e",
              "texto": "Tarjeta inteligente más PIN constituyen autenticación multifactor"
            },
            {
              "id": "f",
              "texto": "La huella dactilar es algo que el usuario es"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A password represents something the user knows"
            },
            {
              "id": "b",
              "texto": "A username combined with a password constitutes multi-factor authentication"
            },
            {
              "id": "c",
              "texto": "A one-time password (OTP) token represents something the user has"
            },
            {
              "id": "d",
              "texto": "A PIN combined with a password constitutes multi-factor authentication"
            },
            {
              "id": "e",
              "texto": "A smart card combined with a PIN constitutes multi-factor authentication"
            },
            {
              "id": "f",
              "texto": "A fingerprint represents something the user is"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C y F clasifican correctamente los factores (conocimiento, posesión e inherencia).\n\nE combina dos factores distintos (posesión y conocimiento), por lo que es multifactor.\n\nB y D combinan factores de la misma categoría (conocimiento), por lo que no son multifactor.",
          "justificacionEn": "A, C, and F correctly map the factors: knowledge, possession, and inherence.\n\nE combines two distinct factor categories (possession + knowledge), creating valid MFA.\n\nB and D combine items within the same factor category (knowledge), which is not MFA."
        },
        {
          "id": 23,
          "tipo": "multiple",
          "pregunta": "Respecto a las métricas de desempeño de los sistemas biométricos, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding biometric access control system performance metrics, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La tasa de falsa aceptación (FAR) mide la frecuencia con que se acepta a un impostor"
            },
            {
              "id": "b",
              "texto": "La FAR mide la frecuencia con que se rechaza a un usuario legítimo"
            },
            {
              "id": "c",
              "texto": "La tasa de falso rechazo (FRR) mide la frecuencia con que se rechaza a un usuario legítimo"
            },
            {
              "id": "d",
              "texto": "La tasa de error igual (EER) es el punto donde FAR y FRR coinciden; un valor menor indica mayor exactitud"
            },
            {
              "id": "e",
              "texto": "Las plantillas biométricas no requieren protección especial"
            },
            {
              "id": "f",
              "texto": "La biometría es infalible"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "False Acceptance Rate (FAR) measures how frequently an unauthorized impostor is accepted"
            },
            {
              "id": "b",
              "texto": "FAR measures how frequently an authorized legitimate user is rejected"
            },
            {
              "id": "c",
              "texto": "False Rejection Rate (FRR) measures how frequently an authorized legitimate user is rejected"
            },
            {
              "id": "d",
              "texto": "Equal Error Rate (EER) is the point where FAR equals FRR; a lower EER indicates higher overall accuracy"
            },
            {
              "id": "e",
              "texto": "Stored biometric reference templates require no cryptographic protection"
            },
            {
              "id": "f",
              "texto": "Biometric authentication is 100% infallible"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son definiciones correctas.\n\nB invierte el concepto: describe la FRR.\n\nE es falso: las plantillas deben protegerse, ya que no pueden cambiarse como una contraseña.\n\nF es falso: todo sistema biométrico tiene tasas de error.",
          "justificacionEn": "A, C, and D are standard biometric performance metrics.\n\nB incorrectly defines FAR (it describes FRR).\n\nE is false: templates must be encrypted because physiological traits cannot be reset if compromised.\n\nF is false: all biometric systems exhibit statistical false acceptance and rejection rates."
        },
        {
          "id": 24,
          "tipo": "multiple",
          "pregunta": "Sobre los tipos de firewall, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding firewall architectures and capabilities, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El filtrado de paquetes decide con base en los encabezados de los paquetes"
            },
            {
              "id": "b",
              "texto": "La inspección con estado (stateful inspection) mantiene una tabla del estado de las conexiones"
            },
            {
              "id": "c",
              "texto": "Con un firewall ya no se necesita un sistema de detección de intrusiones"
            },
            {
              "id": "d",
              "texto": "Un firewall de aplicaciones web (WAF) protege aplicaciones web de ataques como inyección SQL y XSS"
            },
            {
              "id": "e",
              "texto": "Los firewalls de próxima generación solo filtran por puerto"
            },
            {
              "id": "f",
              "texto": "Los firewalls de aplicación inspeccionan el tráfico en la capa de aplicación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Packet filtering firewalls make decisions based on packet header attributes"
            },
            {
              "id": "b",
              "texto": "Stateful inspection firewalls maintain an internal connection state table"
            },
            {
              "id": "c",
              "texto": "Deploying a firewall eliminates the need for intrusion detection systems"
            },
            {
              "id": "d",
              "texto": "A Web Application Firewall (WAF) protects web apps from attacks such as SQL injection and XSS"
            },
            {
              "id": "e",
              "texto": "Next-Generation Firewalls (NGFW) only filter traffic at Layer 4 by port numbers"
            },
            {
              "id": "f",
              "texto": "Application-level gateway firewalls inspect payload traffic up to the application layer"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "f"
          ],
          "justificacion": "A, B, D y F describen correctamente los tipos de firewall del manual.\n\nC es falso: firewall e IDS/IPS son controles complementarios.\n\nE es falso: los NGFW añaden inspección profunda, identificación de aplicaciones y otras funciones.",
          "justificacionEn": "A, B, D, and F accurately define firewall technologies in the CISA manual.\n\nC is false: firewalls and IDS/IPS provide complementary layered defense.\n\nE is false: NGFWs provide deep packet inspection and Layer 7 application awareness."
        },
        {
          "id": 25,
          "tipo": "multiple",
          "pregunta": "Sobre los sistemas de detección y prevención de intrusiones (IDS/IPS), ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Un IDS de red (NIDS) monitorea el tráfico de la red"
            },
            {
              "id": "b",
              "texto": "Un IDS basado en firmas detecta mejor los ataques desconocidos (zero-day)"
            },
            {
              "id": "c",
              "texto": "Un IDS de host (HIDS) monitorea la actividad en un equipo específico"
            },
            {
              "id": "d",
              "texto": "Un IPS puede bloquear activamente el tráfico malicioso"
            },
            {
              "id": "e",
              "texto": "Un IDS es un control preventivo"
            },
            {
              "id": "f",
              "texto": "Un IDS basado en anomalías elimina por completo los falsos positivos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A Network-based IDS (NIDS) inspects traffic packets across the network segment"
            },
            {
              "id": "b",
              "texto": "A signature-based IDS is best suited for detecting unknown zero-day attacks"
            },
            {
              "id": "c",
              "texto": "A Host-based IDS (HIDS) monitors operating system and log activity on an individual endpoint"
            },
            {
              "id": "d",
              "texto": "An IPS sits inline and can actively block or terminate malicious network traffic"
            },
            {
              "id": "e",
              "texto": "An IDS operates as a preventive security control"
            },
            {
              "id": "f",
              "texto": "An anomaly-based IDS completely eliminates false-positive alerts"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son correctas.\n\nB es falso: las firmas detectan ataques ya conocidos; las anomalías pueden detectar comportamientos nuevos.\n\nE es falso: el IDS es un control detectivo; el IPS agrega capacidad preventiva.\n\nF es falso: los modelos de anomalías tienden a generar falsos positivos.",
          "justificacionEn": "A, C, and D are correct statements.\n\nB is false: signature matching only detects known attack patterns; anomaly detection is needed for novel attacks.\n\nE is false: an IDS is detective, whereas an IPS is preventive.\n\nF is false: anomaly-based detection notoriously generates elevated false-positive rates."
        },
        {
          "id": 26,
          "tipo": "multiple",
          "pregunta": "Sobre cifrado y firmas digitales, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding cryptography and digital signatures, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El cifrado simétrico usa la misma clave para cifrar y descifrar"
            },
            {
              "id": "b",
              "texto": "AES es un algoritmo asimétrico"
            },
            {
              "id": "c",
              "texto": "El cifrado asimétrico usa un par de claves (pública y privada)"
            },
            {
              "id": "d",
              "texto": "La firma digital aporta integridad, autenticación y no repudio"
            },
            {
              "id": "e",
              "texto": "El emisor comparte su clave privada con el receptor para que verifique la firma"
            },
            {
              "id": "f",
              "texto": "Para lograr confidencialidad con cifrado asimétrico, el emisor cifra con la clave pública del receptor"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Symmetric encryption uses the same shared key to encrypt and decrypt data"
            },
            {
              "id": "b",
              "texto": "AES is an asymmetric cryptographic algorithm"
            },
            {
              "id": "c",
              "texto": "Asymmetric cryptography utilizes a mathematically linked key pair (public and private)"
            },
            {
              "id": "d",
              "texto": "A digital signature provides integrity, origin authentication, and non-repudiation"
            },
            {
              "id": "e",
              "texto": "The sender shares their private key with the recipient to enable signature verification"
            },
            {
              "id": "f",
              "texto": "To achieve confidentiality with asymmetric encryption, the sender encrypts with the recipient's public key"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "f"
          ],
          "justificacion": "A, C, D y F son correctas.\n\nB es falso: AES es un algoritmo simétrico.\n\nE es falso: la clave privada nunca se comparte; la firma se verifica con la clave pública del emisor.",
          "justificacionEn": "A, C, D, and F are correct cryptographic principles.\n\nB is false: AES is a symmetric block cipher.\n\nE is false: private keys must remain secret; the recipient verifies the signature using the sender's public key."
        },
        {
          "id": 27,
          "tipo": "multiple",
          "pregunta": "En una infraestructura de clave pública (PKI), ¿qué afirmaciones son correctas?",
          "preguntaEn": "In a Public Key Infrastructure (PKI), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La autoridad certificadora (CA) emite y firma los certificados digitales"
            },
            {
              "id": "b",
              "texto": "La autoridad de registro (RA) genera la clave privada del usuario"
            },
            {
              "id": "c",
              "texto": "La lista de revocación de certificados (CRL) enumera los certificados revocados antes de su vencimiento"
            },
            {
              "id": "d",
              "texto": "El certificado digital contiene la clave privada del titular"
            },
            {
              "id": "e",
              "texto": "La CA distribuye su clave privada a todos los usuarios"
            },
            {
              "id": "f",
              "texto": "La CRL se usa para renovar certificados"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "The Certificate Authority (CA) issues and digitally signs public certificates"
            },
            {
              "id": "b",
              "texto": "The Registration Authority (RA) generates the user's private key"
            },
            {
              "id": "c",
              "texto": "The Certificate Revocation List (CRL) lists certificates revoked prior to scheduled expiration"
            },
            {
              "id": "d",
              "texto": "The digital certificate encapsulates the subject's private key"
            },
            {
              "id": "e",
              "texto": "The CA broadcasts its private key to all relying parties"
            },
            {
              "id": "f",
              "texto": "The CRL is utilized as the primary vehicle to renew certificates"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c"
          ],
          "justificacion": "A y C son funciones propias de la PKI.\n\nB es falso: la RA verifica la identidad del solicitante.\n\nD y E son falsos: las claves privadas nunca se incluyen ni se distribuyen.\n\nF es falso: la CRL informa revocaciones, no renueva certificados.",
          "justificacionEn": "A and C represent fundamental PKI functions.\n\nB is false: the RA verifies subscriber identity before forwarding requests to the CA.\n\nD and E are false: private keys are never placed in public certificates or distributed.\n\nF is false: the CRL publishes revoked certificates; it does not renew them."
        },
        {
          "id": 28,
          "tipo": "multiple",
          "pregunta": "Sobre ataques y acceso físico no autorizado, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding cyber attacks and unauthorized physical entry, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El phishing busca obtener información sensible haciéndose pasar por una entidad confiable"
            },
            {
              "id": "b",
              "texto": "El pharming redirige el tráfico de un sitio web hacia uno falso"
            },
            {
              "id": "c",
              "texto": "El piggybacking consiste en seguir a una persona autorizada a través de una puerta segura"
            },
            {
              "id": "d",
              "texto": "Una trampa de acceso (mantrap) de dos puertas ayuda a mitigar el piggybacking"
            },
            {
              "id": "e",
              "texto": "El phishing solo explota vulnerabilidades de hardware"
            },
            {
              "id": "f",
              "texto": "El piggybacking solo ocurre en entornos virtuales"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Phishing deceives victims to obtain sensitive credentials by impersonating trusted entities"
            },
            {
              "id": "b",
              "texto": "Pharming poisons DNS or host resolution to redirect legitimate traffic to fraudulent sites"
            },
            {
              "id": "c",
              "texto": "Piggybacking/tailgating involves following an authorized individual through a secure door"
            },
            {
              "id": "d",
              "texto": "A dual-door mantrap (access interlocking chamber) mitigates piggybacking"
            },
            {
              "id": "e",
              "texto": "Phishing exclusively targets hardware-level vulnerabilities"
            },
            {
              "id": "f",
              "texto": "Piggybacking occurs solely within virtualized cloud environments"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "c",
            "d"
          ],
          "justificacion": "A, B, C y D corresponden al glosario y a los controles del manual.\n\nE es falso: el phishing explota el factor humano mediante engaño.\n\nF es falso: el piggybacking es físico (y también puede darse en enlaces de telecomunicaciones).",
          "justificacionEn": "A, B, C, and D reflect CISA glossary definitions and physical/social engineering controls.\n\nE is false: phishing targets the human element through deception.\n\nF is false: piggybacking is primarily a physical entry risk (or unauthorized tap on an open link)."
        },
        {
          "id": 29,
          "tipo": "multiple",
          "pregunta": "Sobre los controles ambientales y supresión de incendios en salas de TI, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding environmental controls and fire suppression in IT facilities, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El FM-200 suele considerarse una opción preferida de supresión de incendios"
            },
            {
              "id": "b",
              "texto": "Los rociadores con agua siempre presente son preferibles en salas de servidores porque no pueden tener fugas"
            },
            {
              "id": "c",
              "texto": "En un sistema de tubería seca (dry-pipe), el agua no fluye hasta que se activa la alarma de incendio"
            },
            {
              "id": "d",
              "texto": "Los sistemas con agua siempre presente en las tuberías pueden tener fugas y dañar los equipos"
            },
            {
              "id": "e",
              "texto": "El FM-200 está prohibido en centros de datos"
            },
            {
              "id": "f",
              "texto": "El agua nunca daña los equipos electrónicos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "FM-200 clean agent is widely regarded as a preferred gaseous fire suppression system"
            },
            {
              "id": "b",
              "texto": "Wet-pipe water sprinkler systems are preferred in server rooms because they cannot leak"
            },
            {
              "id": "c",
              "texto": "In a dry-pipe sprinkler system, pipes contain pressurized air until a fire alarm is triggered"
            },
            {
              "id": "d",
              "texto": "Wet-pipe sprinkler systems pose a risk of accidental pipe leakage damaging IT equipment"
            },
            {
              "id": "e",
              "texto": "FM-200 is internationally prohibited in modern data center facilities"
            },
            {
              "id": "f",
              "texto": "Water exposure never causes permanent damage to energized electronic equipment"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D coinciden con el manual.\n\nB y F son falsos: el agua presente en las tuberías puede filtrarse y dañar los equipos.\n\nE es falso: es un agente limpio ampliamente usado para este fin.",
          "justificacionEn": "A, C, and D align with data center best practices.\n\nB and F are false: standing water in pipes can leak or rupture, causing catastrophic equipment damage.\n\nE is false: FM-200 and Novec clean agents are common halon replacements."
        },
        {
          "id": 30,
          "tipo": "multiple",
          "pregunta": "En el modelo de responsabilidad compartida en la nube, ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "In the cloud computing shared responsibility model, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El cliente no puede transferir al proveedor el riesgo de seguridad de sus datos ni de gobierno, riesgo y cumplimiento (GRC)"
            },
            {
              "id": "b",
              "texto": "El proveedor de nube (CSP) asume siempre la seguridad física"
            },
            {
              "id": "c",
              "texto": "El CSP gestiona toda la seguridad, incluidos los datos del cliente"
            },
            {
              "id": "d",
              "texto": "Las responsabilidades compartidas varían según el tipo de servicio contratado"
            },
            {
              "id": "e",
              "texto": "Contratar la nube elimina la necesidad de auditar"
            },
            {
              "id": "f",
              "texto": "La seguridad del hardware, la infraestructura y la virtualización suele estar a cargo del CSP"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "The client customer cannot outsource accountability for data security or governance (GRC)"
            },
            {
              "id": "b",
              "texto": "The Cloud Service Provider (CSP) always assumes physical data center security"
            },
            {
              "id": "c",
              "texto": "The CSP manages all security end-to-end, including customer data classification and access"
            },
            {
              "id": "d",
              "texto": "Shared security obligations vary depending on service model (IaaS, PaaS, SaaS)"
            },
            {
              "id": "e",
              "texto": "Migrating to the cloud eliminates the need for independent IT audit assurance"
            },
            {
              "id": "f",
              "texto": "Physical hardware, underlying infrastructure, and virtualization are typically managed by the CSP"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "f"
          ],
          "justificacion": "A, B, D y F coinciden con el modelo de responsabilidad compartida del manual.\n\nC es falso: el cliente conserva responsabilidad sobre sus datos y configuraciones.\n\nE es falso: el auditor sigue evaluando controles y riesgos en entornos de nube.",
          "justificacionEn": "A, B, D, and F represent core tenets of the cloud shared responsibility model.\n\nC is false: data protection and access authorization remain the customer's duty.\n\nE is false: independent audits (e.g., SOC 2, ISO 27017, internal review) are essential in cloud deployments."
        }
      ],
      "4": [
        {
          "id": 1,
          "tipo": "multiple",
          "pregunta": "En relación con las fases del ciclo de vida de desarrollo de sistemas (SDLC) tradicional, ¿cuáles son CORRECTAS?",
          "preguntaEn": "Regarding the phases of the traditional systems development life cycle (SDLC), which are CORRECT?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Estudio de factibilidad"
            },
            {
              "id": "b",
              "texto": "Auditoría fiscal anual de la empresa"
            },
            {
              "id": "c",
              "texto": "Definición de requerimientos"
            },
            {
              "id": "d",
              "texto": "Capacitación del personal de ventas"
            },
            {
              "id": "e",
              "texto": "Diseño"
            },
            {
              "id": "f",
              "texto": "Revisión posimplementación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Feasibility study"
            },
            {
              "id": "b",
              "texto": "Annual enterprise financial tax audit"
            },
            {
              "id": "c",
              "texto": "Requirements definition"
            },
            {
              "id": "d",
              "texto": "Sales force training program"
            },
            {
              "id": "e",
              "texto": "Design"
            },
            {
              "id": "f",
              "texto": "Post-implementation review"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F son fases del SDLC tradicional: factibilidad, requerimientos, diseño (o selección, si el sistema se adquiere), desarrollo/configuración, pruebas e implementación finales y revisión posimplementación.\n\nB y D no son fases del SDLC; son actividades ajenas al proceso de desarrollo.",
          "justificacionEn": "A, C, E, and F are phases of the traditional SDLC: feasibility study, requirements definition, design (or software selection), development/configuration, testing and final implementation, and post-implementation review.\n\nB and D are not SDLC phases; they are unrelated operational business activities."
        },
        {
          "id": 2,
          "tipo": "multiple",
          "pregunta": "¿Cuáles de las siguientes son técnicas de programación y control del cronograma de un proyecto?",
          "preguntaEn": "Which of the following are project scheduling and timeline control techniques?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Diagrama de Gantt"
            },
            {
              "id": "b",
              "texto": "Análisis FODA"
            },
            {
              "id": "c",
              "texto": "PERT"
            },
            {
              "id": "d",
              "texto": "Diagramas de casos de uso UML"
            },
            {
              "id": "e",
              "texto": "Método de la ruta crítica (CPM)"
            },
            {
              "id": "f",
              "texto": "Matriz de clasificación de datos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Gantt chart"
            },
            {
              "id": "b",
              "texto": "SWOT analysis"
            },
            {
              "id": "c",
              "texto": "PERT (Program Evaluation and Review Technique)"
            },
            {
              "id": "d",
              "texto": "UML use-case diagrams"
            },
            {
              "id": "e",
              "texto": "Critical Path Method (CPM)"
            },
            {
              "id": "f",
              "texto": "Data classification matrix"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "Gantt, PERT y CPM son técnicas clásicas de planificación y seguimiento del tiempo en la gestión de proyectos.\n\nB es una herramienta de análisis estratégico; D es una técnica de modelado de requisitos; F pertenece a la gobernanza de datos.",
          "justificacionEn": "Gantt, PERT, and CPM are classic project management scheduling and timeline tracking techniques.\n\nB is a strategic management tool; D is a requirements modeling technique; F belongs to data governance."
        },
        {
          "id": 3,
          "tipo": "multiple",
          "pregunta": "Respecto a las metodologías de desarrollo ágil, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding agile software development methodologies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Trabaja con iteraciones cortas y entregas incrementales"
            },
            {
              "id": "b",
              "texto": "Depende de documentación detallada y exhaustiva antes de programar"
            },
            {
              "id": "c",
              "texto": "Requiere colaboración continua con el usuario"
            },
            {
              "id": "d",
              "texto": "Se caracteriza por la ausencia total de requisitos de usuario"
            },
            {
              "id": "e",
              "texto": "Tiene una fuerte dependencia del conocimiento tácito del equipo"
            },
            {
              "id": "f",
              "texto": "Congela todos los requisitos antes de escribir la primera línea de código"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Works with short iterations and incremental deliverables"
            },
            {
              "id": "b",
              "texto": "Relies heavily on exhaustive and detailed documentation prior to coding"
            },
            {
              "id": "c",
              "texto": "Requires continuous and close collaboration with the user"
            },
            {
              "id": "d",
              "texto": "Is characterized by a complete absence of user requirements"
            },
            {
              "id": "e",
              "texto": "Relies significantly on the team's tacit knowledge"
            },
            {
              "id": "f",
              "texto": "Freezes all system requirements before writing the first line of code"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E describen el enfoque ágil: iteraciones, involucramiento permanente del usuario y apoyo en el conocimiento tácito.\n\nB y F son rasgos del enfoque en cascada (waterfall), no del ágil.\n\nD es falso: el ágil sí trabaja con requisitos, pero los refina de forma continua.",
          "justificacionEn": "A, C, and E describe the agile approach: short iterations, continuous user involvement, and reliance on tacit team knowledge.\n\nB and F are hallmarks of the waterfall model, not agile.\n\nD is false: agile does work with requirements, refining them continuously through user stories."
        },
        {
          "id": 4,
          "tipo": "multiple",
          "pregunta": "¿Cuáles de las siguientes pruebas se consideran parte de las pruebas del sistema (system testing)?",
          "preguntaEn": "Which of the following test types are considered part of system testing?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Pruebas de recuperación"
            },
            {
              "id": "b",
              "texto": "Pruebas de aceptación del usuario (UAT)"
            },
            {
              "id": "c",
              "texto": "Pruebas de seguridad"
            },
            {
              "id": "d",
              "texto": "Pruebas de carga"
            },
            {
              "id": "e",
              "texto": "Pruebas de volumen"
            },
            {
              "id": "f",
              "texto": "Pruebas de estrés"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Recovery testing"
            },
            {
              "id": "b",
              "texto": "User Acceptance Testing (UAT)"
            },
            {
              "id": "c",
              "texto": "Security testing"
            },
            {
              "id": "d",
              "texto": "Load testing"
            },
            {
              "id": "e",
              "texto": "Volume testing"
            },
            {
              "id": "f",
              "texto": "Stress testing"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e",
            "f"
          ],
          "justificacion": "Recuperación, seguridad, carga, volumen y estrés son pruebas específicas del sistema (junto con las de rendimiento).\n\nB es la prueba de aceptación final, que se realiza después de que las pruebas del sistema resultan satisfactorias.",
          "justificacionEn": "Recovery, security, load, volume, and stress are specific forms of system testing (along with performance testing).\n\nB is final acceptance testing, conducted only after system testing is completed successfully."
        },
        {
          "id": 5,
          "tipo": "multiple",
          "pregunta": "Sobre los distintos tipos de pruebas de software, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding the various types of software testing, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Las pruebas de regresión repiten parte del plan de pruebas para confirmar que los cambios no introdujeron nuevos errores"
            },
            {
              "id": "b",
              "texto": "Las pruebas de caja negra requieren conocer la estructura interna del código"
            },
            {
              "id": "c",
              "texto": "Las pruebas de sociabilidad verifican que el sistema opere en su entorno sin afectar a los sistemas existentes"
            },
            {
              "id": "d",
              "texto": "Las pruebas alfa son ejecutadas por clientes externos"
            },
            {
              "id": "e",
              "texto": "Las pruebas de caja blanca evalúan la lógica interna del programa"
            },
            {
              "id": "f",
              "texto": "Las pruebas paralelas alimentan los mismos datos al sistema modificado y a uno alterno para comparar resultados"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Regression testing reruns previous test cases to confirm changes did not introduce new defects"
            },
            {
              "id": "b",
              "texto": "Black-box testing requires knowledge of internal code structure"
            },
            {
              "id": "c",
              "texto": "Sociability testing confirms the system operates in its environment without adversely impacting existing systems"
            },
            {
              "id": "d",
              "texto": "Alpha testing is performed by external public clients"
            },
            {
              "id": "e",
              "texto": "White-box testing assesses the internal programmatic logic of the software"
            },
            {
              "id": "f",
              "texto": "Parallel testing feeds identical data into the new and existing systems to compare outputs"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F corresponden a las definiciones del manual.\n\nB es falso: la caja negra prueba el funcionamiento sin considerar la estructura interna del programa.\n\nD es falso: las pruebas alfa las realizan usuarios dentro de la organización que desarrolla; las beta involucran a un grupo limitado de usuarios externos.",
          "justificacionEn": "A, C, E, and F correspond to CISA manual definitions.\n\nB is false: black-box testing evaluates functional behavior without looking at internal source code.\n\nD is false: alpha testing is performed internally by development organization users; beta testing involves external users."
        },
        {
          "id": 6,
          "tipo": "multiple",
          "pregunta": "En las pruebas de aceptación final (QAT y UAT), ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "Regarding final acceptance testing (QAT and UAT), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La UAT debe ejecutarse idealmente en un entorno de prueba o staging seguro"
            },
            {
              "id": "b",
              "texto": "La UAT la realizan exclusivamente los desarrolladores"
            },
            {
              "id": "c",
              "texto": "Si el proveedor probó el paquete adquirido, no se requieren pruebas del usuario ni del personal de mantenimiento"
            },
            {
              "id": "d",
              "texto": "La QAT se enfoca en los aspectos técnicos y la realiza principalmente el área de TI"
            },
            {
              "id": "e",
              "texto": "Los criterios de aceptación se definen después de ejecutar las pruebas"
            },
            {
              "id": "f",
              "texto": "El auditor debe emitir una opinión sobre si el sistema cumple los requisitos, tiene controles adecuados y está listo para migrar a producción"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "UAT should ideally be executed in a dedicated, secure test or staging environment"
            },
            {
              "id": "b",
              "texto": "UAT is performed exclusively by the software developers"
            },
            {
              "id": "c",
              "texto": "If the vendor tested an acquired software package, testing by business users and maintenance staff is unnecessary"
            },
            {
              "id": "d",
              "texto": "QAT focuses on technical and quality aspects and is conducted primarily by IT staff"
            },
            {
              "id": "e",
              "texto": "Acceptance criteria are established only after test execution is completed"
            },
            {
              "id": "f",
              "texto": "The auditor should express an opinion on whether the system satisfies requirements, controls, and is ready for production"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "d",
            "f"
          ],
          "justificacion": "A, D y F coinciden con el manual: entorno seguro para evitar cambios no autorizados, QAT técnica a cargo de TI y opinión final del auditor.\n\nB es falso: la UAT se ejecuta desde la perspectiva del usuario.\n\nC es falso: los sistemas adquiridos también deben ser probados por el usuario final y el personal de mantenimiento.\n\nE es falso: los criterios de aceptación se definen antes de las pruebas.",
          "justificacionEn": "A, D, and F align with CISA standards: secure environment to avoid unauthorized changes, technical QAT by IT, and final auditor opinion.\n\nB is false: UAT is conducted from the perspective of end users.\n\nC is false: acquired software packages must still be tested by end users and maintenance personnel.\n\nE is false: acceptance criteria must be defined prior to test execution."
        },
        {
          "id": 7,
          "tipo": "multiple",
          "pregunta": "Sobre las técnicas de cambio al nuevo sistema (changeover / go-live), ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding system changeover / go-live conversion strategies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "En el cambio paralelo, el sistema antiguo y el nuevo funcionan simultáneamente durante un periodo de traslape"
            },
            {
              "id": "b",
              "texto": "En el cambio abrupto, el sistema antiguo se descontinúa en una fecha y hora de corte"
            },
            {
              "id": "c",
              "texto": "En el cambio paralelo, los usuarios utilizan únicamente el sistema nuevo"
            },
            {
              "id": "d",
              "texto": "En el cambio por fases, la migración se hace módulo por módulo según un calendario preestablecido"
            },
            {
              "id": "e",
              "texto": "El cambio por fases evita tener que mantener dos entornos a la vez"
            },
            {
              "id": "f",
              "texto": "El cambio paralelo es el más económico de las tres técnicas"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "In parallel changeover, the legacy and new systems operate concurrently during an overlap period"
            },
            {
              "id": "b",
              "texto": "In direct cutover (abrupt changeover), the legacy system is discontinued at a scheduled cutoff time"
            },
            {
              "id": "c",
              "texto": "In parallel changeover, users exclusively utilize the new system"
            },
            {
              "id": "d",
              "texto": "In phased changeover, migration occurs module by module according to a planned schedule"
            },
            {
              "id": "e",
              "texto": "Phased changeover eliminates the need to maintain dual environments concurrently"
            },
            {
              "id": "f",
              "texto": "Parallel changeover is the most economical of the three migration strategies"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d"
          ],
          "justificacion": "A, B y D describen correctamente las tres técnicas.\n\nC es falso: en el paralelo los usuarios deben usar ambos sistemas durante el traslape.\n\nE es falso: el cambio por fases exige sostener dos entornos y extiende el ciclo de vida del proyecto.\n\nF es falso: operar dos sistemas al mismo tiempo implica mayores costos y esfuerzo.",
          "justificacionEn": "A, B, and D accurately characterize the primary changeover strategies.\n\nC is false: parallel changeover requires operating and feeding both systems concurrently.\n\nE is false: phased cutovers require dual environment support and interfaces, extending project overhead.\n\nF is false: running parallel systems is the most costly and resource-intensive strategy."
        },
        {
          "id": 8,
          "tipo": "multiple",
          "pregunta": "En un proceso de conversión y migración de datos, ¿qué actividades son adecuadas?",
          "preguntaEn": "During a data conversion and migration process, which activities are appropriate?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Depurar los datos antes de convertirlos"
            },
            {
              "id": "b",
              "texto": "Verificar la conversión con conteos de registros y totales de control"
            },
            {
              "id": "c",
              "texto": "Ejecutar la migración sin plan de reversa (fallback)"
            },
            {
              "id": "d",
              "texto": "Definir responsables de verificar y aprobar cada paso de la conversión"
            },
            {
              "id": "e",
              "texto": "Diseñar reportes de excepción para los datos que no puedan convertirse automáticamente"
            },
            {
              "id": "f",
              "texto": "Omitir los ensayos de conversión para ahorrar tiempo"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Cleanse and scrub data prior to conversion"
            },
            {
              "id": "b",
              "texto": "Verify conversion accuracy using record counts and control totals"
            },
            {
              "id": "c",
              "texto": "Execute the migration without a fallback/rollback plan"
            },
            {
              "id": "d",
              "texto": "Designate authorized individuals to verify and sign off on each conversion stage"
            },
            {
              "id": "e",
              "texto": "Develop exception reports for data records that cannot be converted automatically"
            },
            {
              "id": "f",
              "texto": "Skip conversion dress rehearsals to accelerate the timeline"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E son pasos recomendados: limpieza previa, verificación de exactitud y completitud, aprobación formal y reportes de excepciones.\n\nC es incorrecto: antes del corte debe existir un escenario de reversa para restaurar los datos si el nuevo sistema falla.\n\nF es incorrecto: los ensayos (dress rehearsals) familiarizan al personal y prueban el proceso de extremo a extremo.",
          "justificacionEn": "A, B, D, and E are recommended data migration practices: upfront data cleansing, validation via control totals, formal sign-offs, and exception reporting.\n\nC is incorrect: a fallback/rollback plan is mandatory in case the cutover fails.\n\nF is incorrect: dress rehearsals are essential to validate timing and end-to-end execution."
        },
        {
          "id": 9,
          "tipo": "multiple",
          "pregunta": "Respecto a los controles de validación de datos de entrada, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding input data validation controls, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El dígito verificador detecta errores de transposición y transcripción"
            },
            {
              "id": "b",
              "texto": "La verificación de rango detecta errores de transposición"
            },
            {
              "id": "c",
              "texto": "Los totales de lote garantizan la confidencialidad de los datos"
            },
            {
              "id": "d",
              "texto": "La verificación de duplicados detecta transacciones ingresadas más de una vez"
            },
            {
              "id": "e",
              "texto": "Los controles de entrada solo se aplican a datos digitados manualmente"
            },
            {
              "id": "f",
              "texto": "La verificación de rango confirma que el dato corresponde a un cliente existente"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A check digit detects transposition and transcription errors"
            },
            {
              "id": "b",
              "texto": "Range checking detects transposition errors"
            },
            {
              "id": "c",
              "texto": "Batch totals ensure data confidentiality"
            },
            {
              "id": "d",
              "texto": "Duplicate checking detects transactions submitted more than once"
            },
            {
              "id": "e",
              "texto": "Input validation controls only apply to manually keyed data"
            },
            {
              "id": "f",
              "texto": "Range checking verifies that an input corresponds to an existing customer record"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "d"
          ],
          "justificacion": "A y D son correctas: el dígito verificador detecta transposición y transcripción; la verificación de duplicados evita registros repetidos.\n\nB y F confunden la función de la verificación de rango (valores dentro de límites definidos).\n\nC es falso: los totales de lote controlan integridad y completitud, no confidencialidad.\n\nE es falso: la validación debe aplicarse a toda fuente de entrada, incluidas interfaces y cargas automáticas.",
          "justificacionEn": "A and D are correct: check digits catch transposition and transcription mistakes; duplicate checks prevent re-entry of processed items.\n\nB and F confuse range checks (boundaries) with validity/reasonableness checks.\n\nC is false: batch totals ensure completeness and integrity, not confidentiality.\n\nE is false: input controls must validate all ingestion channels, including APIs and automated batch feeds."
        },
        {
          "id": 10,
          "tipo": "multiple",
          "pregunta": "Sobre la revisión posimplementación, ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "Regarding post-implementation reviews (PIR), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Se realiza antes de la puesta en producción para autorizar el pase"
            },
            {
              "id": "b",
              "texto": "Evalúa si se alcanzaron los objetivos y entregables del proyecto"
            },
            {
              "id": "c",
              "texto": "Es innecesaria si la UAT fue satisfactoria"
            },
            {
              "id": "d",
              "texto": "Permite identificar lecciones aprendidas aplicables a proyectos futuros"
            },
            {
              "id": "e",
              "texto": "Verifica si los controles y requisitos se cumplen en el sistema implementado"
            },
            {
              "id": "f",
              "texto": "Se limita a revisar los costos de hardware"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "It is conducted prior to go-live to authorize release into production"
            },
            {
              "id": "b",
              "texto": "It assesses whether project business objectives and deliverables were achieved"
            },
            {
              "id": "c",
              "texto": "It is rendered unnecessary if user acceptance testing was successful"
            },
            {
              "id": "d",
              "texto": "It identifies lessons learned that can benefit future enterprise initiatives"
            },
            {
              "id": "e",
              "texto": "It verifies that internal controls and business requirements are operating as designed"
            },
            {
              "id": "f",
              "texto": "Its scope is strictly limited to evaluating hardware capital expenses"
            }
          ],
          "respuestasCorrectasIds": [
            "b",
            "d",
            "e"
          ],
          "justificacion": "B, D y E son propósitos de la revisión posimplementación: verificar entregables, controles y requisitos, y capturar lecciones aprendidas.\n\nA es falso: ocurre después de la implementación.\n\nC es falso: la UAT y la revisión posimplementación cumplen objetivos distintos.\n\nF es falso: su alcance incluye objetivos, controles, requisitos y satisfacción de los usuarios, no solo costos.",
          "justificacionEn": "B, D, and E represent core goals of a PIR: verifying deliverables, auditing operating controls, and documenting lessons learned.\n\nA is false: it occurs after production stabilization (e.g., 30-90 days).\n\nC is false: UAT and PIR serve distinct assurance purposes.\n\nF is false: scope encompasses business case benefits, controls, and user satisfaction."
        },
        {
          "id": 11,
          "tipo": "multiple",
          "pregunta": "Sobre el RTO y el RPO, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding RTO (Recovery Time Objective) and RPO (Recovery Point Objective), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El RTO es el tiempo máximo aceptable de inactividad tras una interrupción"
            },
            {
              "id": "b",
              "texto": "Un RTO alto implica que el sistema debe estar disponible de inmediato"
            },
            {
              "id": "c",
              "texto": "El RPO es la máxima pérdida de datos aceptable, medida en tiempo"
            },
            {
              "id": "d",
              "texto": "El RTO y el RPO se fijan antes de realizar el análisis de impacto al negocio (BIA)"
            },
            {
              "id": "e",
              "texto": "Un RPO de minutos requiere replicación de datos en tiempo real o espejo"
            },
            {
              "id": "f",
              "texto": "Cuanto más cercanos a cero son el RTO y el RPO, menor es el costo de la estrategia de recuperación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "RTO is the maximum acceptable outage duration following a disruption"
            },
            {
              "id": "b",
              "texto": "A high RTO implies the system must be restored immediately"
            },
            {
              "id": "c",
              "texto": "RPO is the maximum allowable data loss measured in time"
            },
            {
              "id": "d",
              "texto": "RTO and RPO are established before conducting the Business Impact Analysis (BIA)"
            },
            {
              "id": "e",
              "texto": "An RPO of minutes demands real-time data replication or mirroring"
            },
            {
              "id": "f",
              "texto": "The closer RTO and RPO are to zero, the lower the disaster recovery cost"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E son correctas: el RTO mide el tiempo de recuperación aceptable; el RPO, la pérdida de datos aceptable; y un RPO muy bajo exige replicación en tiempo real.\n\nB es falso: un RTO alto significa que el sistema puede recuperarse más tarde.\n\nD es falso: el BIA es precisamente el que permite determinar RTO y RPO.\n\nF es falso: a menor tiempo requerido, mayor costo.",
          "justificacionEn": "A, C, and E are correct: RTO specifies allowable downtime; RPO specifies acceptable data loss; near-zero RPO requires synchronous data replication.\n\nB is false: a high RTO means restoration can wait.\n\nD is false: the BIA is the formal vehicle used to determine RTO and RPO targets.\n\nF is false: shrinking RTO and RPO toward zero increases recovery costs exponentially."
        },
        {
          "id": 12,
          "tipo": "multiple",
          "pregunta": "En cuanto a las alternativas de recuperación ante desastres, ¿cuáles son correctas?",
          "preguntaEn": "Regarding disaster recovery alternative site strategies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El sitio frío cuenta con espacio e infraestructura básica, pero sin equipos de TI ni datos"
            },
            {
              "id": "b",
              "texto": "El sitio tibio tiene infraestructura parcialmente configurada con TI, redes y periféricos esenciales"
            },
            {
              "id": "c",
              "texto": "Los acuerdos recíprocos son la alternativa más viable por su fácil compatibilidad"
            },
            {
              "id": "d",
              "texto": "El sitio caliente cuenta con toda la infraestructura y los equipos de TI y comunicaciones necesarios"
            },
            {
              "id": "e",
              "texto": "El sitio espejo replica los datos en tiempo real y asume el procesamiento sin interrupción perceptible"
            },
            {
              "id": "f",
              "texto": "El sitio frío ofrece el menor tiempo de recuperación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A cold site provides basic space and electrical/cooling utilities, but no IT hardware or data"
            },
            {
              "id": "b",
              "texto": "A warm site has partially configured hardware, network links, and essential peripherals"
            },
            {
              "id": "c",
              "texto": "Reciprocal agreements are the most viable alternative due to ease of technical compatibility"
            },
            {
              "id": "d",
              "texto": "A hot site possesses complete infrastructure, active equipment, and communications ready to run"
            },
            {
              "id": "e",
              "texto": "A mirrored site replicates data synchronously and assumes processing with near-zero disruption"
            },
            {
              "id": "f",
              "texto": "A cold site provides the shortest recovery time objective"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E corresponden a las definiciones del manual.\n\nC es falso: los acuerdos recíprocos no se consideran una opción viable por la dificultad de mantener compatibilidad y cumplimiento.\n\nF es falso: el sitio frío es el más barato pero el de mayor tiempo de recuperación.",
          "justificacionEn": "A, B, D, and E accurately reflect CISA recovery site definitions.\n\nC is false: reciprocal agreements are rarely viable due to ongoing technical configuration drift and confidentiality conflicts.\n\nF is false: cold sites have the longest recovery time (days or weeks)."
        },
        {
          "id": 13,
          "tipo": "multiple",
          "pregunta": "Sobre los esquemas de respaldo, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding data backup schemes and methodologies, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El respaldo completo copia todos los archivos y carpetas"
            },
            {
              "id": "b",
              "texto": "El respaldo incremental copia lo que cambió desde el último respaldo incremental o completo"
            },
            {
              "id": "c",
              "texto": "En un esquema completo más incrementales, basta restaurar el último completo y el último incremental"
            },
            {
              "id": "d",
              "texto": "El respaldo diferencial copia lo que cambió desde el último respaldo completo"
            },
            {
              "id": "e",
              "texto": "El respaldo diferencial requiere menos tiempo de restauración que el incremental"
            },
            {
              "id": "f",
              "texto": "El respaldo completo es el más rápido y el que requiere menos capacidad de medios"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A full backup duplicates all specified files and directories"
            },
            {
              "id": "b",
              "texto": "An incremental backup copies only files modified since the last full or incremental backup"
            },
            {
              "id": "c",
              "texto": "In a full plus incremental scheme, restoration only requires the last full and the most recent incremental backup"
            },
            {
              "id": "d",
              "texto": "A differential backup copies all files that have changed since the last full backup"
            },
            {
              "id": "e",
              "texto": "A differential backup requires less restoration time than an incremental backup scheme"
            },
            {
              "id": "f",
              "texto": "A full backup is the fastest to execute and requires the least storage media"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "e"
          ],
          "justificacion": "A, B, D y E son correctas según el manual.\n\nC es falso: para restaurar se necesita el último completo y todos los incrementales posteriores.\n\nF es falso: el completo es el que más tiempo y capacidad de medios requiere.",
          "justificacionEn": "A, B, D, and E are correct according to CISA guidelines.\n\nC is false: restoring incremental backups requires the baseline full backup plus all subsequent incrementals in sequence.\n\nF is false: full backups take the longest time and highest media capacity."
        },
        {
          "id": 14,
          "tipo": "multiple",
          "pregunta": "¿Qué actividades forman parte del análisis de impacto al negocio (BIA)?",
          "preguntaEn": "Which activities form an integral part of a Business Impact Analysis (BIA)?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Identificar los procesos críticos y los recursos que los soportan"
            },
            {
              "id": "b",
              "texto": "Definir el presupuesto de ventas del siguiente año"
            },
            {
              "id": "c",
              "texto": "Evaluar el impacto de la interrupción a lo largo del tiempo"
            },
            {
              "id": "d",
              "texto": "Seleccionar el sitio alterno antes de analizar los impactos"
            },
            {
              "id": "e",
              "texto": "Determinar el RTO y el RPO"
            },
            {
              "id": "f",
              "texto": "Priorizar el orden de recuperación de los procesos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Identify critical business processes and their supporting dependencies"
            },
            {
              "id": "b",
              "texto": "Formulate next year's corporate commercial sales quota"
            },
            {
              "id": "c",
              "texto": "Evaluate financial and operational outage impacts over time"
            },
            {
              "id": "d",
              "texto": "Contract an alternate recovery site before analyzing business impacts"
            },
            {
              "id": "e",
              "texto": "Determine RTO and RPO objectives for critical functions"
            },
            {
              "id": "f",
              "texto": "Prioritize the sequence of process restoration based on criticality"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C, E y F son resultados del BIA y base para elegir las estrategias de recuperación.\n\nB no es parte del BIA.\n\nD es incorrecto: las estrategias y alternativas se seleccionan a partir del BIA, no antes.",
          "justificacionEn": "A, C, E, and F are standard BIA outcomes that guide continuity strategy selection.\n\nB is outside the scope of business continuity.\n\nD is incorrect: recovery solutions are chosen based on BIA findings, not beforehand."
        },
        {
          "id": 15,
          "tipo": "multiple",
          "pregunta": "¿Cuáles son métodos de prueba de un plan de recuperación ante desastres (DRP)?",
          "preguntaEn": "Which of the following are recognized Disaster Recovery Plan (DRP) testing methods?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Revisión de listas de verificación (checklist)"
            },
            {
              "id": "b",
              "texto": "Pruebas de penetración"
            },
            {
              "id": "c",
              "texto": "Recorrido estructurado (structured walk-through)"
            },
            {
              "id": "d",
              "texto": "Simulación"
            },
            {
              "id": "e",
              "texto": "Prueba paralela"
            },
            {
              "id": "f",
              "texto": "Prueba de interrupción completa"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Checklist review"
            },
            {
              "id": "b",
              "texto": "Penetration testing"
            },
            {
              "id": "c",
              "texto": "Structured walk-through"
            },
            {
              "id": "d",
              "texto": "Simulation testing"
            },
            {
              "id": "e",
              "texto": "Parallel testing"
            },
            {
              "id": "f",
              "texto": "Full-interruption testing"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e",
            "f"
          ],
          "justificacion": "Los tipos de prueba del manual son: revisión de checklist, recorrido estructurado, simulación, prueba paralela e interrupción completa (la más rigurosa, costosa y potencialmente disruptiva).\n\nB es una técnica de pruebas de seguridad, no de pruebas de recuperación.",
          "justificacionEn": "Recognized DRP test levels are: checklist review, structured walk-through, simulation, parallel test, and full-interruption test.\n\nB is a technical cybersecurity validation technique, not a disaster recovery exercise."
        },
        {
          "id": 16,
          "tipo": "multiple",
          "pregunta": "¿Qué objetivos debe cumplir una prueba del plan de continuidad o recuperación?",
          "preguntaEn": "What key objectives should a business continuity or disaster recovery exercise accomplish?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Verificar la completitud y precisión del plan"
            },
            {
              "id": "b",
              "texto": "Programarla en horario pico de producción para maximizar la interrupción"
            },
            {
              "id": "c",
              "texto": "Evaluar el desempeño del personal involucrado"
            },
            {
              "id": "d",
              "texto": "Evaluar la coordinación con proveedores y terceros externos"
            },
            {
              "id": "e",
              "texto": "Limitar la participación a los miembros del equipo de recuperación"
            },
            {
              "id": "f",
              "texto": "Concluir que, si todo funciona sin recomendaciones, no hace falta una prueba más exigente"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Verify the completeness, accuracy, and currency of the plan"
            },
            {
              "id": "b",
              "texto": "Schedule during peak operational hours to maximize disruption"
            },
            {
              "id": "c",
              "texto": "Evaluate personnel performance and recovery team readiness"
            },
            {
              "id": "d",
              "texto": "Assess coordination with third-party vendors and critical partners"
            },
            {
              "id": "e",
              "texto": "Restrict participation strictly to formal recovery team members"
            },
            {
              "id": "f",
              "texto": "Conclude that if no defects were found, subsequent testing is unneeded"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son tareas que debe lograr la prueba.\n\nB es falso: se recomienda programarla cuando minimice la interrupción de las operaciones (por ejemplo, fines de semana).\n\nE es falso: también debe evaluarse el nivel de capacitación y conciencia de empleados que no forman parte del equipo.\n\nF es falso: si no surge ninguna recomendación, probablemente debió planificarse una prueba más desafiante.",
          "justificacionEn": "A, C, and D are primary objectives of continuity testing.\n\nB is false: tests should be scheduled to minimize production disruption.\n\nE is false: general staff awareness and coordination should also be validated.\n\nF is false: a test yielding no recommendations usually indicates an insufficiently challenging test scenario."
        },
        {
          "id": 17,
          "tipo": "multiple",
          "pregunta": "Sobre la gestión de incidentes y de problemas, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding incident management and problem management, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La gestión de incidentes busca restablecer el proceso afectado a su estado normal lo antes posible"
            },
            {
              "id": "b",
              "texto": "La base de errores conocidos (KEDB) registra únicamente incidentes de seguridad"
            },
            {
              "id": "c",
              "texto": "La gestión de problemas busca identificar la causa raíz de uno o varios incidentes"
            },
            {
              "id": "d",
              "texto": "Un error conocido es un problema cuya causa raíz fue identificada y para el que se desarrolló una solución temporal (workaround)"
            },
            {
              "id": "e",
              "texto": "Los 5 porqués y el diagrama de Ishikawa son técnicas de análisis de causa raíz"
            },
            {
              "id": "f",
              "texto": "Ambos procesos persiguen exactamente el mismo objetivo"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Incident management aims to restore normal service operation as quickly as possible"
            },
            {
              "id": "b",
              "texto": "The Known Error Database (KEDB) exclusively records information security breaches"
            },
            {
              "id": "c",
              "texto": "Problem management aims to identify the underlying root cause of incidents"
            },
            {
              "id": "d",
              "texto": "A known error is a problem with an identified root cause and a documented workaround"
            },
            {
              "id": "e",
              "texto": "The 5 Whys and Ishikawa (fishbone) diagrams are root-cause analysis techniques"
            },
            {
              "id": "f",
              "texto": "Both disciplines pursue identical operational objectives"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e"
          ],
          "justificacion": "A, C, D y E coinciden con el manual.\n\nB es falso: la KEDB documenta errores conocidos y sus soluciones temporales.\n\nF es falso: incidentes buscan restablecer el servicio; problemas buscan reducir el número y la severidad de los incidentes.",
          "justificacionEn": "A, C, D, and E reflect ITIL/CISA principles.\n\nB is false: KEDB logs all recurring operational errors and workarounds.\n\nF is false: incident management focuses on rapid restoration; problem management focuses on preventing recurring failures."
        },
        {
          "id": 18,
          "tipo": "multiple",
          "pregunta": "En bases de datos, ¿qué afirmaciones sobre integridad y transacciones son correctas?",
          "preguntaEn": "In database systems, which statements regarding integrity and transaction properties (ACID) are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La atomicidad garantiza que una transacción se complete en su totalidad o no se aplique en absoluto"
            },
            {
              "id": "b",
              "texto": "La durabilidad implica que los cambios se revierten al cerrar la sesión"
            },
            {
              "id": "c",
              "texto": "La integridad referencial exige que toda clave foránea sea nula o apunte a un valor existente en otra tabla"
            },
            {
              "id": "d",
              "texto": "La normalización busca maximizar la redundancia de datos"
            },
            {
              "id": "e",
              "texto": "La integridad de entidad exige que la clave primaria sea única y no nula"
            },
            {
              "id": "f",
              "texto": "El aislamiento exige que las transacciones concurrentes vean los estados intermedios de las demás"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Atomicity guarantees that a transaction executes completely or is rolled back entirely"
            },
            {
              "id": "b",
              "texto": "Durability means data updates are reverted as soon as the session closes"
            },
            {
              "id": "c",
              "texto": "Referential integrity requires that foreign key values match an existing primary key or be null"
            },
            {
              "id": "d",
              "texto": "Normalization aims to maximize data redundancy across database tables"
            },
            {
              "id": "e",
              "texto": "Entity integrity mandates that primary keys must be unique and non-null"
            },
            {
              "id": "f",
              "texto": "Isolation requires concurrent transactions to expose intermediate states to each other"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E son correctas.\n\nB es falso: la durabilidad garantiza que los cambios confirmados persistan.\n\nD es falso: la normalización reduce la redundancia.\n\nF es falso: el aislamiento evita que las transacciones concurrentes interfieran entre sí.",
          "justificacionEn": "A, C, and E are correct database integrity concepts.\n\nB is false: durability guarantees committed changes survive system crashes.\n\nD is false: normalization reduces data redundancy and anomalies.\n\nF is false: isolation prevents concurrent transactions from seeing intermediate uncommitted states."
        },
        {
          "id": 19,
          "tipo": "multiple",
          "pregunta": "Respecto a la gestión de niveles de servicio y los SLA, ¿cuáles son correctas?",
          "preguntaEn": "Regarding Service Level Management and SLAs, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Un SLA es un acuerdo entre TI (interna o externa) y el cliente que detalla los servicios a prestar"
            },
            {
              "id": "b",
              "texto": "Los SLA solo aplican a proveedores externos"
            },
            {
              "id": "c",
              "texto": "Describe los servicios en términos no técnicos desde la perspectiva del cliente"
            },
            {
              "id": "d",
              "texto": "Sirve como estándar para medir y ajustar los servicios durante el periodo del acuerdo"
            },
            {
              "id": "e",
              "texto": "La gestión de niveles de servicio incluye el catálogo de servicios y las reuniones de revisión"
            },
            {
              "id": "f",
              "texto": "La gestión de niveles de servicio se limita a redactar el SLA"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "An SLA is an agreement between IT (internal or external) and the customer defining services provided"
            },
            {
              "id": "b",
              "texto": "SLAs apply exclusively to commercial third-party service providers"
            },
            {
              "id": "c",
              "texto": "It describes service terms in non-technical language from the customer's perspective"
            },
            {
              "id": "d",
              "texto": "It serves as a baseline standard to monitor and tune performance over the agreement term"
            },
            {
              "id": "e",
              "texto": "Service Level Management encompasses the service catalog, metrics, and periodic review meetings"
            },
            {
              "id": "f",
              "texto": "Service Level Management is restricted solely to the initial drafting of the SLA contract"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "e"
          ],
          "justificacion": "A, C, D y E coinciden con el manual.\n\nB es falso: el área de TI puede ser interna o un proveedor externo.\n\nF es falso: la gestión abarca definición, acuerdo, documentación, catálogo, seguimiento y revisiones.",
          "justificacionEn": "A, C, D, and E represent SLA governance best practices.\n\nB is false: SLAs are established with both internal IT departments and external vendors.\n\nF is false: SLM is an ongoing lifecycle of agreement, monitoring, reporting, and review."
        },
        {
          "id": 20,
          "tipo": "multiple",
          "pregunta": "Sobre la computación de usuario final (EUC) y el Shadow IT, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding End-User Computing (EUC) and Shadow IT, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El EUC permite que usuarios no programadores diseñen sus propias aplicaciones"
            },
            {
              "id": "b",
              "texto": "Las aplicaciones EUC siempre están sujetas a una revisión independiente"
            },
            {
              "id": "c",
              "texto": "La falta de supervisión de TI en el EUC genera riesgos como ausencia de autenticación, de registros de auditoría y de respaldos"
            },
            {
              "id": "d",
              "texto": "El Shadow IT es tecnología usada sin que el departamento de TI lo sepa"
            },
            {
              "id": "e",
              "texto": "Las aplicaciones EUC siempre se desarrollan con una metodología formal"
            },
            {
              "id": "f",
              "texto": "Excel y Access incluyen de forma estándar un registro de auditoría robusto"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "EUC enables non-technical end users to create their own processing applications"
            },
            {
              "id": "b",
              "texto": "EUC applications are always subjected to rigorous independent testing and reviews"
            },
            {
              "id": "c",
              "texto": "Lack of IT oversight in EUC introduces risks such as absent authentication, audit trails, and backups"
            },
            {
              "id": "d",
              "texto": "Shadow IT refers to technology assets used without IT department approval or knowledge"
            },
            {
              "id": "e",
              "texto": "EUC solutions are consistently built following formal SDLC development methodologies"
            },
            {
              "id": "f",
              "texto": "Desktop spreadsheets and databases include robust built-in immutable audit trails by default"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son correctas.\n\nB y E son falsas: justamente la falta de revisión y de metodología formal es uno de los riesgos del EUC.\n\nF es falso: las soluciones estándar de EUC suelen no contar con registro de auditoría adecuado.",
          "justificacionEn": "A, C, and D are correct.\n\nB and E are false: lack of independent review and formal methodology represents the primary risk of EUC.\n\nF is false: desktop end-user tools typically lack native tamper-proof audit trails."
        },
        {
          "id": 21,
          "tipo": "multiple",
          "pregunta": "En una política de seguridad de la información, ¿qué elementos y características son correctos?",
          "preguntaEn": "In an information security policy, which elements and attributes are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Incluye alcance, enunciado de la política y objetivos"
            },
            {
              "id": "b",
              "texto": "Una vez emitida, no requiere monitoreo"
            },
            {
              "id": "c",
              "texto": "Sus objetivos incluyen confidencialidad, integridad y disponibilidad"
            },
            {
              "id": "d",
              "texto": "Detalla la configuración técnica de cada sistema"
            },
            {
              "id": "e",
              "texto": "Sus objetivos deben ser específicos, medibles, alcanzables, realistas y con plazo (SMART)"
            },
            {
              "id": "f",
              "texto": "Puede emitirse sin aprobación de la alta dirección"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "It includes scope, policy statement, and overarching objectives"
            },
            {
              "id": "b",
              "texto": "Once published, it does not require continuous monitoring or reviews"
            },
            {
              "id": "c",
              "texto": "Its core objectives encompass confidentiality, integrity, and availability (CIA)"
            },
            {
              "id": "d",
              "texto": "It specifies detailed low-level configuration settings for each system"
            },
            {
              "id": "e",
              "texto": "Its objectives should be Specific, Measurable, Achievable, Realistic, and Time-bound (SMART)"
            },
            {
              "id": "f",
              "texto": "It can be formally issued without executive leadership approval"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e"
          ],
          "justificacion": "A, C y E corresponden a los elementos clave de una política de seguridad.\n\nB es falso: el monitoreo es uno de sus objetivos.\n\nD es falso: la política se redacta a alto nivel; el detalle técnico va en procedimientos y estándares.\n\nF es falso: la política debe establecer el tono desde la dirección y asignar responsabilidades.",
          "justificacionEn": "A, C, and E are foundational characteristics of security policies.\n\nB is false: compliance monitoring and periodic reviews are mandatory.\n\nD is false: policies are high-level directives; technical details reside in standards and baselines.\n\nF is false: management endorsement is essential to establish authority and accountability."
        },
        {
          "id": 22,
          "tipo": "multiple",
          "pregunta": "Sobre los factores de autenticación, ¿cuáles son correctos?",
          "preguntaEn": "Regarding authentication factors and multi-factor authentication (MFA), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La contraseña es algo que el usuario sabe"
            },
            {
              "id": "b",
              "texto": "Usuario y contraseña constituyen autenticación multifactor"
            },
            {
              "id": "c",
              "texto": "Un token OTP es algo que el usuario tiene"
            },
            {
              "id": "d",
              "texto": "PIN más contraseña constituyen autenticación multifactor"
            },
            {
              "id": "e",
              "texto": "Tarjeta inteligente más PIN constituyen autenticación multifactor"
            },
            {
              "id": "f",
              "texto": "La huella dactilar es algo que el usuario es"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A password represents something the user knows"
            },
            {
              "id": "b",
              "texto": "A username combined with a password constitutes multi-factor authentication"
            },
            {
              "id": "c",
              "texto": "A one-time password (OTP) token represents something the user has"
            },
            {
              "id": "d",
              "texto": "A PIN combined with a password constitutes multi-factor authentication"
            },
            {
              "id": "e",
              "texto": "A smart card combined with a PIN constitutes multi-factor authentication"
            },
            {
              "id": "f",
              "texto": "A fingerprint represents something the user is"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "e",
            "f"
          ],
          "justificacion": "A, C y F clasifican correctamente los factores (conocimiento, posesión e inherencia).\n\nE combina dos factores distintos (posesión y conocimiento), por lo que es multifactor.\n\nB y D combinan factores de la misma categoría (conocimiento), por lo que no son multifactor.",
          "justificacionEn": "A, C, and F correctly map the factors: knowledge, possession, and inherence.\n\nE combines two distinct factor categories (possession + knowledge), creating valid MFA.\n\nB and D combine items within the same factor category (knowledge), which is not MFA."
        },
        {
          "id": 23,
          "tipo": "multiple",
          "pregunta": "Respecto a las métricas de desempeño de los sistemas biométricos, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding biometric access control system performance metrics, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La tasa de falsa aceptación (FAR) mide la frecuencia con que se acepta a un impostor"
            },
            {
              "id": "b",
              "texto": "La FAR mide la frecuencia con que se rechaza a un usuario legítimo"
            },
            {
              "id": "c",
              "texto": "La tasa de falso rechazo (FRR) mide la frecuencia con que se rechaza a un usuario legítimo"
            },
            {
              "id": "d",
              "texto": "La tasa de error igual (EER) es el punto donde FAR y FRR coinciden; un valor menor indica mayor exactitud"
            },
            {
              "id": "e",
              "texto": "Las plantillas biométricas no requieren protección especial"
            },
            {
              "id": "f",
              "texto": "La biometría es infalible"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "False Acceptance Rate (FAR) measures how frequently an unauthorized impostor is accepted"
            },
            {
              "id": "b",
              "texto": "FAR measures how frequently an authorized legitimate user is rejected"
            },
            {
              "id": "c",
              "texto": "False Rejection Rate (FRR) measures how frequently an authorized legitimate user is rejected"
            },
            {
              "id": "d",
              "texto": "Equal Error Rate (EER) is the point where FAR equals FRR; a lower EER indicates higher overall accuracy"
            },
            {
              "id": "e",
              "texto": "Stored biometric reference templates require no cryptographic protection"
            },
            {
              "id": "f",
              "texto": "Biometric authentication is 100% infallible"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son definiciones correctas.\n\nB invierte el concepto: describe la FRR.\n\nE es falso: las plantillas deben protegerse, ya que no pueden cambiarse como una contraseña.\n\nF es falso: todo sistema biométrico tiene tasas de error.",
          "justificacionEn": "A, C, and D are standard biometric performance metrics.\n\nB incorrectly defines FAR (it describes FRR).\n\nE is false: templates must be encrypted because physiological traits cannot be reset if compromised.\n\nF is false: all biometric systems exhibit statistical false acceptance and rejection rates."
        },
        {
          "id": 24,
          "tipo": "multiple",
          "pregunta": "Sobre los tipos de firewall, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding firewall architectures and capabilities, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El filtrado de paquetes decide con base en los encabezados de los paquetes"
            },
            {
              "id": "b",
              "texto": "La inspección con estado (stateful inspection) mantiene una tabla del estado de las conexiones"
            },
            {
              "id": "c",
              "texto": "Con un firewall ya no se necesita un sistema de detección de intrusiones"
            },
            {
              "id": "d",
              "texto": "Un firewall de aplicaciones web (WAF) protege aplicaciones web de ataques como inyección SQL y XSS"
            },
            {
              "id": "e",
              "texto": "Los firewalls de próxima generación solo filtran por puerto"
            },
            {
              "id": "f",
              "texto": "Los firewalls de aplicación inspeccionan el tráfico en la capa de aplicación"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Packet filtering firewalls make decisions based on packet header attributes"
            },
            {
              "id": "b",
              "texto": "Stateful inspection firewalls maintain an internal connection state table"
            },
            {
              "id": "c",
              "texto": "Deploying a firewall eliminates the need for intrusion detection systems"
            },
            {
              "id": "d",
              "texto": "A Web Application Firewall (WAF) protects web apps from attacks such as SQL injection and XSS"
            },
            {
              "id": "e",
              "texto": "Next-Generation Firewalls (NGFW) only filter traffic at Layer 4 by port numbers"
            },
            {
              "id": "f",
              "texto": "Application-level gateway firewalls inspect payload traffic up to the application layer"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "f"
          ],
          "justificacion": "A, B, D y F describen correctamente los tipos de firewall del manual.\n\nC es falso: firewall e IDS/IPS son controles complementarios.\n\nE es falso: los NGFW añaden inspección profunda, identificación de aplicaciones y otras funciones.",
          "justificacionEn": "A, B, D, and F accurately define firewall technologies in the CISA manual.\n\nC is false: firewalls and IDS/IPS provide complementary layered defense.\n\nE is false: NGFWs provide deep packet inspection and Layer 7 application awareness."
        },
        {
          "id": 25,
          "tipo": "multiple",
          "pregunta": "Sobre los sistemas de detección y prevención de intrusiones (IDS/IPS), ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "Un IDS de red (NIDS) monitorea el tráfico de la red"
            },
            {
              "id": "b",
              "texto": "Un IDS basado en firmas detecta mejor los ataques desconocidos (zero-day)"
            },
            {
              "id": "c",
              "texto": "Un IDS de host (HIDS) monitorea la actividad en un equipo específico"
            },
            {
              "id": "d",
              "texto": "Un IPS puede bloquear activamente el tráfico malicioso"
            },
            {
              "id": "e",
              "texto": "Un IDS es un control preventivo"
            },
            {
              "id": "f",
              "texto": "Un IDS basado en anomalías elimina por completo los falsos positivos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "A Network-based IDS (NIDS) inspects traffic packets across the network segment"
            },
            {
              "id": "b",
              "texto": "A signature-based IDS is best suited for detecting unknown zero-day attacks"
            },
            {
              "id": "c",
              "texto": "A Host-based IDS (HIDS) monitors operating system and log activity on an individual endpoint"
            },
            {
              "id": "d",
              "texto": "An IPS sits inline and can actively block or terminate malicious network traffic"
            },
            {
              "id": "e",
              "texto": "An IDS operates as a preventive security control"
            },
            {
              "id": "f",
              "texto": "An anomaly-based IDS completely eliminates false-positive alerts"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D son correctas.\n\nB es falso: las firmas detectan ataques ya conocidos; las anomalías pueden detectar comportamientos nuevos.\n\nE es falso: el IDS es un control detectivo; el IPS agrega capacidad preventiva.\n\nF es falso: los modelos de anomalías tienden a generar falsos positivos.",
          "justificacionEn": "A, C, and D are correct statements.\n\nB is false: signature matching only detects known attack patterns; anomaly detection is needed for novel attacks.\n\nE is false: an IDS is detective, whereas an IPS is preventive.\n\nF is false: anomaly-based detection notoriously generates elevated false-positive rates."
        },
        {
          "id": 26,
          "tipo": "multiple",
          "pregunta": "Sobre cifrado y firmas digitales, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding cryptography and digital signatures, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El cifrado simétrico usa la misma clave para cifrar y descifrar"
            },
            {
              "id": "b",
              "texto": "AES es un algoritmo asimétrico"
            },
            {
              "id": "c",
              "texto": "El cifrado asimétrico usa un par de claves (pública y privada)"
            },
            {
              "id": "d",
              "texto": "La firma digital aporta integridad, autenticación y no repudio"
            },
            {
              "id": "e",
              "texto": "El emisor comparte su clave privada con el receptor para que verifique la firma"
            },
            {
              "id": "f",
              "texto": "Para lograr confidencialidad con cifrado asimétrico, el emisor cifra con la clave pública del receptor"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Symmetric encryption uses the same shared key to encrypt and decrypt data"
            },
            {
              "id": "b",
              "texto": "AES is an asymmetric cryptographic algorithm"
            },
            {
              "id": "c",
              "texto": "Asymmetric cryptography utilizes a mathematically linked key pair (public and private)"
            },
            {
              "id": "d",
              "texto": "A digital signature provides integrity, origin authentication, and non-repudiation"
            },
            {
              "id": "e",
              "texto": "The sender shares their private key with the recipient to enable signature verification"
            },
            {
              "id": "f",
              "texto": "To achieve confidentiality with asymmetric encryption, the sender encrypts with the recipient's public key"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d",
            "f"
          ],
          "justificacion": "A, C, D y F son correctas.\n\nB es falso: AES es un algoritmo simétrico.\n\nE es falso: la clave privada nunca se comparte; la firma se verifica con la clave pública del emisor.",
          "justificacionEn": "A, C, D, and F are correct cryptographic principles.\n\nB is false: AES is a symmetric block cipher.\n\nE is false: private keys must remain secret; the recipient verifies the signature using the sender's public key."
        },
        {
          "id": 27,
          "tipo": "multiple",
          "pregunta": "En una infraestructura de clave pública (PKI), ¿qué afirmaciones son correctas?",
          "preguntaEn": "In a Public Key Infrastructure (PKI), which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "La autoridad certificadora (CA) emite y firma los certificados digitales"
            },
            {
              "id": "b",
              "texto": "La autoridad de registro (RA) genera la clave privada del usuario"
            },
            {
              "id": "c",
              "texto": "La lista de revocación de certificados (CRL) enumera los certificados revocados antes de su vencimiento"
            },
            {
              "id": "d",
              "texto": "El certificado digital contiene la clave privada del titular"
            },
            {
              "id": "e",
              "texto": "La CA distribuye su clave privada a todos los usuarios"
            },
            {
              "id": "f",
              "texto": "La CRL se usa para renovar certificados"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "The Certificate Authority (CA) issues and digitally signs public certificates"
            },
            {
              "id": "b",
              "texto": "The Registration Authority (RA) generates the user's private key"
            },
            {
              "id": "c",
              "texto": "The Certificate Revocation List (CRL) lists certificates revoked prior to scheduled expiration"
            },
            {
              "id": "d",
              "texto": "The digital certificate encapsulates the subject's private key"
            },
            {
              "id": "e",
              "texto": "The CA broadcasts its private key to all relying parties"
            },
            {
              "id": "f",
              "texto": "The CRL is utilized as the primary vehicle to renew certificates"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c"
          ],
          "justificacion": "A y C son funciones propias de la PKI.\n\nB es falso: la RA verifica la identidad del solicitante.\n\nD y E son falsos: las claves privadas nunca se incluyen ni se distribuyen.\n\nF es falso: la CRL informa revocaciones, no renueva certificados.",
          "justificacionEn": "A and C represent fundamental PKI functions.\n\nB is false: the RA verifies subscriber identity before forwarding requests to the CA.\n\nD and E are false: private keys are never placed in public certificates or distributed.\n\nF is false: the CRL publishes revoked certificates; it does not renew them."
        },
        {
          "id": 28,
          "tipo": "multiple",
          "pregunta": "Sobre ataques y acceso físico no autorizado, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding cyber attacks and unauthorized physical entry, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El phishing busca obtener información sensible haciéndose pasar por una entidad confiable"
            },
            {
              "id": "b",
              "texto": "El pharming redirige el tráfico de un sitio web hacia uno falso"
            },
            {
              "id": "c",
              "texto": "El piggybacking consiste en seguir a una persona autorizada a través de una puerta segura"
            },
            {
              "id": "d",
              "texto": "Una trampa de acceso (mantrap) de dos puertas ayuda a mitigar el piggybacking"
            },
            {
              "id": "e",
              "texto": "El phishing solo explota vulnerabilidades de hardware"
            },
            {
              "id": "f",
              "texto": "El piggybacking solo ocurre en entornos virtuales"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "Phishing deceives victims to obtain sensitive credentials by impersonating trusted entities"
            },
            {
              "id": "b",
              "texto": "Pharming poisons DNS or host resolution to redirect legitimate traffic to fraudulent sites"
            },
            {
              "id": "c",
              "texto": "Piggybacking/tailgating involves following an authorized individual through a secure door"
            },
            {
              "id": "d",
              "texto": "A dual-door mantrap (access interlocking chamber) mitigates piggybacking"
            },
            {
              "id": "e",
              "texto": "Phishing exclusively targets hardware-level vulnerabilities"
            },
            {
              "id": "f",
              "texto": "Piggybacking occurs solely within virtualized cloud environments"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "c",
            "d"
          ],
          "justificacion": "A, B, C y D corresponden al glosario y a los controles del manual.\n\nE es falso: el phishing explota el factor humano mediante engaño.\n\nF es falso: el piggybacking es físico (y también puede darse en enlaces de telecomunicaciones).",
          "justificacionEn": "A, B, C, and D reflect CISA glossary definitions and physical/social engineering controls.\n\nE is false: phishing targets the human element through deception.\n\nF is false: piggybacking is primarily a physical entry risk (or unauthorized tap on an open link)."
        },
        {
          "id": 29,
          "tipo": "multiple",
          "pregunta": "Sobre los controles ambientales y supresión de incendios en salas de TI, ¿qué afirmaciones son correctas?",
          "preguntaEn": "Regarding environmental controls and fire suppression in IT facilities, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El FM-200 suele considerarse una opción preferida de supresión de incendios"
            },
            {
              "id": "b",
              "texto": "Los rociadores con agua siempre presente son preferibles en salas de servidores porque no pueden tener fugas"
            },
            {
              "id": "c",
              "texto": "En un sistema de tubería seca (dry-pipe), el agua no fluye hasta que se activa la alarma de incendio"
            },
            {
              "id": "d",
              "texto": "Los sistemas con agua siempre presente en las tuberías pueden tener fugas y dañar los equipos"
            },
            {
              "id": "e",
              "texto": "El FM-200 está prohibido en centros de datos"
            },
            {
              "id": "f",
              "texto": "El agua nunca daña los equipos electrónicos"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "FM-200 clean agent is widely regarded as a preferred gaseous fire suppression system"
            },
            {
              "id": "b",
              "texto": "Wet-pipe water sprinkler systems are preferred in server rooms because they cannot leak"
            },
            {
              "id": "c",
              "texto": "In a dry-pipe sprinkler system, pipes contain pressurized air until a fire alarm is triggered"
            },
            {
              "id": "d",
              "texto": "Wet-pipe sprinkler systems pose a risk of accidental pipe leakage damaging IT equipment"
            },
            {
              "id": "e",
              "texto": "FM-200 is internationally prohibited in modern data center facilities"
            },
            {
              "id": "f",
              "texto": "Water exposure never causes permanent damage to energized electronic equipment"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "c",
            "d"
          ],
          "justificacion": "A, C y D coinciden con el manual.\n\nB y F son falsos: el agua presente en las tuberías puede filtrarse y dañar los equipos.\n\nE es falso: es un agente limpio ampliamente usado para este fin.",
          "justificacionEn": "A, C, and D align with data center best practices.\n\nB and F are false: standing water in pipes can leak or rupture, causing catastrophic equipment damage.\n\nE is false: FM-200 and Novec clean agents are common halon replacements."
        },
        {
          "id": 30,
          "tipo": "multiple",
          "pregunta": "En el modelo de responsabilidad compartida en la nube, ¿cuáles son afirmaciones correctas?",
          "preguntaEn": "In the cloud computing shared responsibility model, which statements are correct?",
          "alternativas": [
            {
              "id": "a",
              "texto": "El cliente no puede transferir al proveedor el riesgo de seguridad de sus datos ni de gobierno, riesgo y cumplimiento (GRC)"
            },
            {
              "id": "b",
              "texto": "El proveedor de nube (CSP) asume siempre la seguridad física"
            },
            {
              "id": "c",
              "texto": "El CSP gestiona toda la seguridad, incluidos los datos del cliente"
            },
            {
              "id": "d",
              "texto": "Las responsabilidades compartidas varían según el tipo de servicio contratado"
            },
            {
              "id": "e",
              "texto": "Contratar la nube elimina la necesidad de auditar"
            },
            {
              "id": "f",
              "texto": "La seguridad del hardware, la infraestructura y la virtualización suele estar a cargo del CSP"
            }
          ],
          "alternativasEn": [
            {
              "id": "a",
              "texto": "The client customer cannot outsource accountability for data security or governance (GRC)"
            },
            {
              "id": "b",
              "texto": "The Cloud Service Provider (CSP) always assumes physical data center security"
            },
            {
              "id": "c",
              "texto": "The CSP manages all security end-to-end, including customer data classification and access"
            },
            {
              "id": "d",
              "texto": "Shared security obligations vary depending on service model (IaaS, PaaS, SaaS)"
            },
            {
              "id": "e",
              "texto": "Migrating to the cloud eliminates the need for independent IT audit assurance"
            },
            {
              "id": "f",
              "texto": "Physical hardware, underlying infrastructure, and virtualization are typically managed by the CSP"
            }
          ],
          "respuestasCorrectasIds": [
            "a",
            "b",
            "d",
            "f"
          ],
          "justificacion": "A, B, D y F coinciden con el modelo de responsabilidad compartida del manual.\n\nC es falso: el cliente conserva responsabilidad sobre sus datos y configuraciones.\n\nE es falso: el auditor sigue evaluando controles y riesgos en entornos de nube.",
          "justificacionEn": "A, B, D, and F represent core tenets of the cloud shared responsibility model.\n\nC is false: data protection and access authorization remain the customer's duty.\n\nE is false: independent audits (e.g., SOC 2, ISO 27017, internal review) are essential in cloud deployments."
        }
      ]
    }
};

/* ----------------------------------------------------------
   Metadatos de secciones para la UI
   ---------------------------------------------------------- */
function getSectionMeta(seccion) {
  return t('sectionMeta')[seccion];
}

/* ----------------------------------------------------------
   2. ESTADO DE LA APLICACIÓN
   ---------------------------------------------------------- */
const state = {
  seccionActual:             null,
  subseccionActual:          null,
  preguntas:                 [],
  indiceActual:              0,
  correctas:                 0,
  incorrectas:               0,
  respondida:                false,
  modoAleatorio:             false,
  ordenAlternativasActuales: ['a', 'b', 'c', 'd'],
  opcionesSeleccionadas:     [],
};

/* ----------------------------------------------------------
   3. REFERENCIAS AL DOM
   ---------------------------------------------------------- */
const DOM = {
  screenStart:           document.getElementById('screen-start'),
  screenSubsections:     document.getElementById('screen-subsections'),
  screenQuestion:        document.getElementById('screen-question'),
  screenResults:         document.getElementById('screen-results'),
  btnTeoria:             document.getElementById('btn-seccion-teoria'),
  btnCasos:              document.getElementById('btn-seccion-casos'),
  btnDeepseek:           document.getElementById('btn-seccion-deepseek'),
  btnGemini:             document.getElementById('btn-seccion-gemini'),
  btnGpt:                document.getElementById('btn-seccion-gpt'),
  btnMultiples:          document.getElementById('btn-seccion-multiples'),
  btnMultiples2:         document.getElementById('btn-seccion-multiples2'),
  multiChoiceBanner:     document.getElementById('multi-choice-banner'),
  multiChoiceInstruction:document.getElementById('multi-choice-instruction'),
  multiChoiceCounter:    document.getElementById('multi-choice-counter'),
  btnSubmitMulti:        document.getElementById('btn-submit-multi'),
  btnSubmitMultiText:    document.getElementById('btn-submit-multi-text'),
  subsectionTitle:       document.getElementById('subsection-title'),
  subsectionGrid:        document.getElementById('subsection-grid'),
  btnBackToStart:        document.getElementById('btn-back-to-start'),
  toggleRandomMode:      document.getElementById('toggle-random-mode'),
  badgeRandomMode:       document.getElementById('badge-random-mode'),
  questionCurrent:       document.getElementById('question-current'),
  questionTotal:         document.getElementById('question-total'),
  liveScore:             document.getElementById('live-score'),
  progressFill:          document.getElementById('progress-fill'),
  progressBar:           document.querySelector('.progress-bar'),
  questionNumber:        document.getElementById('question-number-label'),
  questionText:          document.getElementById('question-text'),
  alternativesList:      document.getElementById('alternatives-list'),
  feedbackCard:          document.getElementById('feedback-card'),
  feedbackIcon:          document.getElementById('feedback-icon'),
  feedbackStatus:        document.getElementById('feedback-status'),
  feedbackReorderNotice: document.getElementById('feedback-reorder-notice'),
  feedbackJust:          document.getElementById('feedback-justification'),
  btnNext:               document.getElementById('btn-next'),
  resultsTrophy:         document.getElementById('results-trophy'),
  resultsTitle:          document.getElementById('results-title'),
  resultsSubtitle:       document.getElementById('results-subtitle'),
  ringFill:              document.getElementById('ring-fill'),
  ringScore:             document.getElementById('ring-score'),
  ringTotal:             document.getElementById('ring-total'),
  resultsStats:          document.getElementById('results-stats'),
  btnRestart:            document.getElementById('btn-restart'),
};

function showScreen(screen) {
  [DOM.screenStart, DOM.screenSubsections, DOM.screenQuestion, DOM.screenResults]
    .forEach(s => s.classList.remove('screen--active'));
  screen.classList.add('screen--active');
  requestAnimationFrame(() => {
    const focusable = screen.querySelector('button, [tabindex="0"], h1, h2');
    if (focusable) focusable.focus({ preventScroll: true });
  });
}

function mostrarSubsecciones(seccion) {
  state.seccionActual = seccion;
  const meta = getSectionMeta(seccion);
  DOM.subsectionTitle.textContent = `${meta.emoji} ${meta.label}`;
  DOM.subsectionGrid.innerHTML = '';

  const subsecciones = Object.keys(BANCO_PREGUNTAS[seccion] || {}).sort((a, b) => Number(a) - Number(b));
  subsecciones.forEach(n => {
    const preguntas = BANCO_PREGUNTAS[seccion][n];
    const disponible = preguntas && preguntas.length > 0;
    const btn = document.createElement('button');
    btn.className = `subsection-btn${disponible ? '' : ' subsection-btn--empty'}`;
    btn.disabled  = !disponible;

    const labelSub = (meta.subLabels && meta.subLabels[n]) ? meta.subLabels[n] : `${meta.label} ${n}`;

    btn.setAttribute('aria-label', `${labelSub}${disponible ? '' : ' ('+t('comingSoon')+')'}`);
    btn.innerHTML = `
      <span class="subsection-num">${n}</span>
      <span class="subsection-label">${labelSub}</span>
      <span class="subsection-count">${disponible ? preguntas.length + ' ' + t('preguntas') : t('comingSoon')}</span>
    `;
    if (disponible) {
      btn.addEventListener('click', () => iniciarCuestionario(seccion, Number(n)));
    }
    DOM.subsectionGrid.appendChild(btn);
  });
  showScreen(DOM.screenSubsections);
}

function iniciarCuestionario(seccion, subseccion) {
  state.seccionActual         = seccion;
  state.subseccionActual      = subseccion;
  state.preguntas             = [...BANCO_PREGUNTAS[seccion][subseccion]];
  state.indiceActual          = 0;
  state.correctas             = 0;
  state.incorrectas           = 0;
  state.respondida            = false;
  state.opcionesSeleccionadas = [];

  // Bloquear el modo aleatorio seleccionado antes de iniciar el cuestionario
  state.modoAleatorio = DOM.toggleRandomMode ? DOM.toggleRandomMode.checked : false;
  if (DOM.badgeRandomMode) {
    DOM.badgeRandomMode.hidden = !state.modoAleatorio;
  }

  DOM.questionTotal.textContent = state.preguntas.length;
  DOM.liveScore.textContent     = 0;
  actualizarProgreso();
  mostrarPregunta();
  showScreen(DOM.screenQuestion);
}

function mostrarPregunta() {
  state.respondida = false;
  state.opcionesSeleccionadas = [];
  const pregunta   = state.preguntas[state.indiceActual];
  const numHumano  = state.indiceActual + 1;
  const esMultiple = pregunta.tipo === 'multiple' || Array.isArray(pregunta.respuestasCorrectasIds);

  const baseIds = pregunta.alternativas.map(a => a.id);
  // Si está activo el modo aleatorio, mezclar el orden de las alternativas
  if (state.modoAleatorio) {
    state.ordenAlternativasActuales = shuffleAlts(baseIds);
  } else {
    state.ordenAlternativasActuales = [...baseIds];
  }

  const useEn         = currentLang === 'en' && pregunta.preguntaEn;
  const textoPregunta = useEn ? pregunta.preguntaEn : pregunta.pregunta;
  const allAlts       = useEn ? pregunta.alternativasEn : pregunta.alternativas;

  DOM.questionCurrent.textContent = numHumano;
  DOM.questionNumber.textContent  = `P.${numHumano}`;
  DOM.questionText.textContent    = textoPregunta;
  actualizarProgreso();

  ocultarFeedback();
  DOM.btnNext.hidden = true;

  if (esMultiple) {
    if (DOM.multiChoiceBanner) DOM.multiChoiceBanner.hidden = false;
    actualizarContadorMultiple();
    if (DOM.btnSubmitMulti) {
      DOM.btnSubmitMulti.hidden = false;
      DOM.btnSubmitMulti.disabled = true;
    }
  } else {
    if (DOM.multiChoiceBanner) DOM.multiChoiceBanner.hidden = true;
    if (DOM.btnSubmitMulti) DOM.btnSubmitMulti.hidden = true;
  }

  // Renderizar alternativas según el orden actual
  DOM.alternativesList.innerHTML = '';
  state.ordenAlternativasActuales.forEach((altId, idx) => {
    const alt = allAlts.find(a => a.id === altId);
    if (!alt) return;

    const displayLetter = String.fromCharCode(65 + idx); // A, B, C, D, E, F...

    const li  = document.createElement('li');
    li.setAttribute('role', 'listitem');

    const btn = document.createElement('button');
    btn.className      = 'alternative-btn';
    btn.dataset.id     = alt.id;
    btn.dataset.letter = displayLetter;
    btn.setAttribute('aria-label', `${currentLang === 'en' ? 'Option' : 'Opción'} ${displayLetter}: ${alt.texto}`);

    const span = document.createElement('span');
    span.className   = 'alternative-text';
    span.textContent = alt.texto;

    btn.appendChild(span);

    if (esMultiple) {
      btn.addEventListener('click', () => toggleSeleccionMultiple(alt.id, btn));
    } else {
      btn.addEventListener('click', () => manejarRespuesta(alt.id, pregunta));
    }

    li.appendChild(btn);
    DOM.alternativesList.appendChild(li);
  });
}

function toggleSeleccionMultiple(altId, btn) {
  if (state.respondida) return;

  const idx = state.opcionesSeleccionadas.indexOf(altId);
  if (idx > -1) {
    state.opcionesSeleccionadas.splice(idx, 1);
    btn.classList.remove('alternative-btn--selected');
  } else {
    if (state.opcionesSeleccionadas.length >= 5) {
      return; // Máximo 5 opciones permitidas según instrucciones
    }
    state.opcionesSeleccionadas.push(altId);
    btn.classList.add('alternative-btn--selected');
  }

  actualizarContadorMultiple();
}

function actualizarContadorMultiple() {
  const count = state.opcionesSeleccionadas.length;
  if (DOM.multiChoiceCounter) {
    DOM.multiChoiceCounter.textContent = `${count} / 5`;
    DOM.multiChoiceCounter.classList.toggle('multi-choice-counter--ready', count >= 2 && count <= 5);
    DOM.multiChoiceCounter.classList.toggle('multi-choice-counter--limit', count === 5);
  }
  if (DOM.btnSubmitMulti) {
    DOM.btnSubmitMulti.disabled = (count < 2 || count > 5);
  }
}

function confirmarRespuestaMultiple() {
  if (state.respondida) return;
  const pregunta = state.preguntas[state.indiceActual];
  if (!pregunta) return;

  const count = state.opcionesSeleccionadas.length;
  if (count < 2 || count > 5) return;

  state.respondida = true;
  if (DOM.btnSubmitMulti) DOM.btnSubmitMulti.hidden = true;

  const seleccionadas = [...state.opcionesSeleccionadas];
  const correctas = pregunta.respuestasCorrectasIds || [];

  const todasCorrectasMarcadas = correctas.every(id => seleccionadas.includes(id));
  const ningunaIncorrectaMarcada = seleccionadas.every(id => correctas.includes(id));
  const esCorrecta = todasCorrectasMarcadas && ningunaIncorrectaMarcada;

  if (esCorrecta) {
    state.correctas++;
  } else {
    state.incorrectas++;
  }
  DOM.liveScore.textContent = state.correctas;

  const baseIds = pregunta.alternativas.map(a => a.id);
  const useEn   = currentLang === 'en' && pregunta.preguntaEn;
  const allAlts = useEn ? pregunta.alternativasEn : pregunta.alternativas;

  if (state.modoAleatorio) {
    state.ordenAlternativasActuales = [...baseIds];
    DOM.alternativesList.innerHTML = '';

    state.ordenAlternativasActuales.forEach((altId, idx) => {
      const alt = allAlts.find(a => a.id === altId);
      if (!alt) return;

      const displayLetter = String.fromCharCode(65 + idx);
      const li  = document.createElement('li');
      li.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.className      = 'alternative-btn';
      btn.dataset.id     = alt.id;
      btn.dataset.letter = displayLetter;
      btn.disabled       = true;
      btn.setAttribute('aria-label', `${currentLang === 'en' ? 'Option' : 'Opción'} ${displayLetter}: ${alt.texto}`);

      const esEstaCorrecta = correctas.includes(alt.id);
      const fueSeleccionada = seleccionadas.includes(alt.id);

      if (esEstaCorrecta && fueSeleccionada) {
        btn.classList.add('alternative-btn--correct');
      } else if (esEstaCorrecta && !fueSeleccionada) {
        btn.classList.add('alternative-btn--missed');
      } else if (!esEstaCorrecta && fueSeleccionada) {
        btn.classList.add('alternative-btn--wrong');
      }

      const span = document.createElement('span');
      span.className   = 'alternative-text';
      span.textContent = alt.texto;

      if (esEstaCorrecta && !fueSeleccionada) {
        const tag = document.createElement('span');
        tag.className   = 'alt-tag-missed';
        tag.textContent = t('missedOptionTag') || '(Correcta omitida)';
        span.appendChild(tag);
      }

      btn.appendChild(span);
      li.appendChild(btn);
      DOM.alternativesList.appendChild(li);
    });
  } else {
    const botones = DOM.alternativesList.querySelectorAll('.alternative-btn');
    botones.forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('alternative-btn--selected');
      const altId = btn.dataset.id;
      const esEstaCorrecta = correctas.includes(altId);
      const fueSeleccionada = seleccionadas.includes(altId);

      if (esEstaCorrecta && fueSeleccionada) {
        btn.classList.add('alternative-btn--correct');
      } else if (esEstaCorrecta && !fueSeleccionada) {
        btn.classList.add('alternative-btn--missed');
        const span = btn.querySelector('.alternative-text');
        if (span) {
          const tag = document.createElement('span');
          tag.className   = 'alt-tag-missed';
          tag.textContent = t('missedOptionTag') || '(Correcta omitida)';
          span.appendChild(tag);
        }
      } else if (!esEstaCorrecta && fueSeleccionada) {
        btn.classList.add('alternative-btn--wrong');
      }
    });
  }

  const useEnJust = currentLang === 'en' && pregunta.justificacionEn;
  const just      = useEnJust ? pregunta.justificacionEn : pregunta.justificacion;
  mostrarFeedback(esCorrecta, just);

  if (DOM.feedbackReorderNotice) {
    DOM.feedbackReorderNotice.hidden = !state.modoAleatorio;
    if (state.modoAleatorio) {
      DOM.feedbackReorderNotice.textContent = t('reorderNotice');
    }
  }

  const esUltima = state.indiceActual >= state.preguntas.length - 1;
  DOM.btnNext.hidden = false;
  const nextText = DOM.btnNext.querySelector('#btn-next-text') || DOM.btnNext;
  nextText.textContent = esUltima ? t('finishBtn') : t('nextBtn');
  const prevArrow = DOM.btnNext.querySelector('.btn-arrow');
  if (prevArrow) prevArrow.remove();
  const arrow = document.createElement('span');
  arrow.className   = 'btn-arrow';
  arrow.textContent = esUltima ? ' ↗' : ' →';
  arrow.setAttribute('aria-hidden', 'true');
  DOM.btnNext.appendChild(arrow);
  DOM.feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

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

  // Si estamos en modo aleatorio, reordenar las alternativas a su orden original
  // para que coincidan 100% con la justificación
  if (state.modoAleatorio) {
    const baseIds = pregunta.alternativas.map(a => a.id);
    state.ordenAlternativasActuales = [...baseIds];
    const useEn   = currentLang === 'en' && pregunta.preguntaEn;
    const allAlts = useEn ? pregunta.alternativasEn : pregunta.alternativas;

    DOM.alternativesList.innerHTML = '';
    state.ordenAlternativasActuales.forEach((altId, idx) => {
      const alt = allAlts.find(a => a.id === altId);
      if (!alt) return;

      const displayLetter = String.fromCharCode(65 + idx);

      const li  = document.createElement('li');
      li.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.className      = 'alternative-btn';
      btn.dataset.id     = alt.id;
      btn.dataset.letter = displayLetter;
      btn.disabled       = true;
      btn.setAttribute('aria-label', `${currentLang === 'en' ? 'Option' : 'Opción'} ${displayLetter}: ${alt.texto}`);

      // Marcar correcta y/o incorrecta
      if (alt.id === pregunta.respuestaCorrectaId) {
        btn.classList.add('alternative-btn--correct');
      } else if (alt.id === idSeleccionado && !esCorrecta) {
        btn.classList.add('alternative-btn--wrong');
      }

      const span = document.createElement('span');
      span.className   = 'alternative-text';
      span.textContent = alt.texto;

      btn.appendChild(span);
      li.appendChild(btn);
      DOM.alternativesList.appendChild(li);
    });
  } else {
    // Modo normal: deshabilitar y marcar botones en su posición
    const botones = DOM.alternativesList.querySelectorAll('.alternative-btn');
    botones.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.id === pregunta.respuestaCorrectaId) {
        btn.classList.add('alternative-btn--correct');
      } else if (btn.dataset.id === idSeleccionado && !esCorrecta) {
        btn.classList.add('alternative-btn--wrong');
      }
    });
  }

  const useEn = currentLang === 'en' && pregunta.justificacionEn;
  const just  = useEn ? pregunta.justificacionEn : pregunta.justificacion;
  mostrarFeedback(esCorrecta, just);

  // Mostrar aviso de reordenamiento sincronizado si aplica
  if (DOM.feedbackReorderNotice) {
    DOM.feedbackReorderNotice.hidden = !state.modoAleatorio;
    if (state.modoAleatorio) {
      DOM.feedbackReorderNotice.textContent = t('reorderNotice');
    }
  }

  const esUltima = state.indiceActual >= state.preguntas.length - 1;
  DOM.btnNext.hidden = false;
  const nextText = DOM.btnNext.querySelector('#btn-next-text') || DOM.btnNext;
  nextText.textContent = esUltima ? t('finishBtn') : t('nextBtn');
  const prevArrow = DOM.btnNext.querySelector('.btn-arrow');
  if (prevArrow) prevArrow.remove();
  const arrow = document.createElement('span');
  arrow.className   = 'btn-arrow';
  arrow.textContent = esUltima ? ' ↗' : ' →';
  arrow.setAttribute('aria-hidden', 'true');
  DOM.btnNext.appendChild(arrow);
  DOM.feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function mostrarFeedback(esCorrecta, justificacion) {
  DOM.feedbackCard.hidden    = false;
  DOM.feedbackCard.className = `feedback-card feedback-card--${esCorrecta ? 'correct' : 'wrong'}`;
  DOM.feedbackIcon.textContent   = esCorrecta ? '✅' : '❌';
  DOM.feedbackStatus.textContent = esCorrecta ? t('correct') : t('incorrect');
  if (justificacion && justificacion.trim() !== '') {
    let formatted = justificacion;
    if (!formatted.includes('\n')) {
      formatted = formatted.replace(/\s([B-F])\.\s/g, '\n$1. ');
    }
    DOM.feedbackJust.textContent = formatted;
    DOM.feedbackJust.hidden      = false;
  } else {
    DOM.feedbackJust.hidden = true;
  }
}

function ocultarFeedback() {
  DOM.feedbackCard.hidden    = true;
  DOM.feedbackCard.className = 'feedback-card';
  if (DOM.feedbackReorderNotice) {
    DOM.feedbackReorderNotice.hidden = true;
  }
}

function actualizarProgreso() {
  const total      = state.preguntas.length;
  const respondidas = state.indiceActual;
  const pct        = total > 0 ? Math.round((respondidas / total) * 100) : 0;
  DOM.progressFill.style.width = `${pct}%`;
  DOM.progressBar.setAttribute('aria-valuenow', pct);
}

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

function mostrarResultados() {
  const total = state.preguntas.length;
  const score = state.correctas;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;
  let msgKey = 'score100';
  if      (pct < 40)  msgKey = 'score0';
  else if (pct < 70)  msgKey = 'score40';
  else if (pct < 100) msgKey = 'score70';
  const [trophy, titulo, subtitulo] = t(msgKey);
  DOM.resultsTrophy.textContent   = trophy;
  DOM.resultsTitle.textContent    = titulo;
  DOM.resultsSubtitle.textContent = subtitulo;
  DOM.ringScore.textContent       = score;
  DOM.ringTotal.textContent       = `/ ${total}`;
  const circunferencia = 314.16;
  const offset = circunferencia - (circunferencia * pct) / 100;
  requestAnimationFrame(() => {
    setTimeout(() => { DOM.ringFill.style.strokeDashoffset = offset; }, 300);
  });
  const meta = getSectionMeta(state.seccionActual);
  const subLabelResult = (meta.subLabels && meta.subLabels[state.subseccionActual])
    ? meta.subLabels[state.subseccionActual]
    : `${meta.label} ${state.subseccionActual}`;
  DOM.resultsStats.innerHTML = `
    <div class="stat-item stat-item--correct">
      <span class="stat-value">${state.correctas}</span>
      <span class="stat-label">${t('statCorrect')}</span>
    </div>
    <div class="stat-item stat-item--wrong">
      <span class="stat-value">${state.incorrectas}</span>
      <span class="stat-label">${t('statIncorrect')}</span>
    </div>
    <div class="stat-item stat-item--total">
      <span class="stat-value">${pct}%</span>
      <span class="stat-label">${t('statAccuracy')}</span>
    </div>
    <div class="stat-item stat-item--section" style="grid-column: 1 / -1;">
      <span class="stat-value" style="font-size: var(--font-size-base);">${meta.emoji} ${subLabelResult}</span>
      <span class="stat-label">${t('statSection')}</span>
    </div>
  `;
  showScreen(DOM.screenResults);
}

function reiniciarCuestionario() {
  DOM.ringFill.style.strokeDashoffset = 314.16;
  showScreen(DOM.screenStart);
}

function init() {
  DOM.btnTeoria.addEventListener('click',   () => mostrarSubsecciones('teoria'));
  DOM.btnCasos.addEventListener('click',    () => mostrarSubsecciones('casos'));
  if (DOM.btnDeepseek)    DOM.btnDeepseek.addEventListener('click',    () => mostrarSubsecciones('deepseek'));
  if (DOM.btnGemini)      DOM.btnGemini.addEventListener('click',      () => mostrarSubsecciones('gemini'));
  if (DOM.btnGpt)         DOM.btnGpt.addEventListener('click',         () => mostrarSubsecciones('gpt'));
  if (DOM.btnMultiples)   DOM.btnMultiples.addEventListener('click',   () => mostrarSubsecciones('multiples'));
  if (DOM.btnMultiples2)  DOM.btnMultiples2.addEventListener('click',  () => mostrarSubsecciones('multiples2'));
  if (DOM.btnSubmitMulti) DOM.btnSubmitMulti.addEventListener('click', confirmarRespuestaMultiple);
  DOM.btnBackToStart.addEventListener('click', () => showScreen(DOM.screenStart));
  DOM.btnNext.addEventListener('click', siguientePregunta);
  DOM.btnRestart.addEventListener('click', reiniciarCuestionario);
  document.getElementById('btn-lang').addEventListener('click', toggleLanguage);

  // Inicializar estado del modo aleatorio con memoria local
  if (DOM.toggleRandomMode) {
    try {
      const saved = localStorage.getItem('cisa_random_mode');
      if (saved !== null) {
        DOM.toggleRandomMode.checked = saved === 'true';
      }
      DOM.toggleRandomMode.addEventListener('change', (e) => {
        localStorage.setItem('cisa_random_mode', e.target.checked);
      });
    } catch (e) {
      // Ignorar si localStorage no está habilitado
    }
  }

  showScreen(DOM.screenStart);
}

document.addEventListener('DOMContentLoaded', init);
