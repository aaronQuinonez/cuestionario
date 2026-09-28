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
    reorderNotice:     '🔄 Opciones reordenadas (A-D) sincronizadas con la justificación',
    score0:  ['📚', '¡Sigue estudiando!',  'No te rindas, cada intento te acerca más al dominio del tema.'],
    score40: ['👍', '¡Buen esfuerzo!',     'Vas por buen camino. Repasa las preguntas que fallaste.'],
    score70: ['🌟', '¡Muy bien!',          'Casi perfecto. Revisa las respuestas incorrectas para alcanzar el 100%.'],
    score100:['🏆', '¡Excelente trabajo!', 'Obtuviste una puntuación perfecta. ¡Sigue así!'],
    sectionMeta: {
      teoria: { label: 'Dominio Teoría',   emoji: '📖' },
      casos:  { label: 'Casos de Estudio', emoji: '🔍' }
    }
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
    reorderNotice:     '🔄 Options reordered (A-D) synchronized with justification',
    score0:  ['📚', 'Keep studying!',    "Don't give up, each attempt brings you closer to mastering the topic."],
    score40: ['👍', 'Good effort!',      "You're on the right track. Review the questions you got wrong."],
    score70: ['🌟', 'Well done!',        'Almost perfect. Review incorrect answers to reach 100%.'],
    score100:['🏆', 'Excellent work!',   'You got a perfect score. Keep it up!'],
    sectionMeta: {
      teoria: { label: 'Theory Domain', emoji: '📖' },
      casos:  { label: 'Case Studies',  emoji: '🔍' }
    }
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
          if (span) span.textContent = alt.texto;
          btn.setAttribute('aria-label', `${currentLang === 'en' ? 'Option' : 'Opción'} ${alt.id.toUpperCase()}: ${alt.texto}`);
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
  teoria: {

    1: [
      {
        id: 1,
        pregunta: "¿Cuál de las siguientes opciones describe la autoridad general para realizar una auditoría de SI?",
        preguntaEn: "Which of the following best describes the general authority to perform an IS audit?",
        alternativas: [
          { id: "a", texto: "El alcance de la auditoría con metas y objetivos" },
          { id: "b", texto: "Una solicitud de la gerencia para realizar una auditoría" },
          { id: "c", texto: "La carta de auditoría (audit charter) aprobada" },
          { id: "d", texto: "El cronograma de auditoría aprobado" }
        ],
        alternativasEn: [
          { id: "a", texto: "The audit scope with goals and objectives" },
          { id: "b", texto: "A request from management to perform an audit" },
          { id: "c", texto: "The approved audit charter" },
          { id: "d", texto: "The approved audit schedule" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El alcance de la auditoría es específico para una sola auditoría y no otorga la autoridad para realizar una auditoría. B. Una solicitud de la gerencia para realizar una auditoría no es suficiente porque se refiere a una auditoría específica. C. La carta de auditoría (audit charter) aprobada describe la responsabilidad, autoridad y rendición de cuentas (accountability) del auditor. D. El cronograma de auditoría aprobado no otorga la autoridad para realizar una auditoría.",
        justificacionEn: "A. The audit scope is specific to a single audit and does not grant authority to perform an audit. B. A request from management to perform an audit is not sufficient because it relates to a specific audit. C. The approved audit charter outlines the auditor's responsibility, authority and accountability. D. The approved audit schedule does not grant authority to perform an audit."
      },
      {
        id: 2,
        pregunta: "¿Cuál es el beneficio clave de una autoevaluación de control (CSA)?",
        preguntaEn: "What is the key benefit of a control self-assessment (CSA)?",
        alternativas: [
          { id: "a", texto: "Se refuerza la apropiación por parte de la gerencia de los controles internos" },
          { id: "b", texto: "Se reducen los gastos de auditoría" },
          { id: "c", texto: "Mejora la detección de fraude" },
          { id: "d", texto: "Los auditores internos pueden adoptar un enfoque consultivo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Management ownership of internal controls is reinforced" },
          { id: "b", texto: "Audit expenses are reduced" },
          { id: "c", texto: "Fraud detection is improved" },
          { id: "d", texto: "Internal auditors can take a more consultative role" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El objetivo de la autoevaluación de control (CSA) es lograr que los gerentes de negocio sean más conscientes de la importancia del control interno y de su responsabilidad en términos de gobierno corporativo. B. Reducir los gastos de auditoría no es un beneficio clave de la CSA. C. Mejorar la detección de fraude es importante, pero no tanto como la apropiación del control (control ownership). No es un objetivo principal de la CSA. D. La CSA puede brindar más información a los auditores internos, permitiéndoles asumir un rol más consultivo; sin embargo, este es un beneficio adicional, no el beneficio clave.",
        justificacionEn: "A. The objective of control self-assessment (CSA) is to have business managers become more aware of the importance of internal control and their responsibility in terms of corporate governance. B. Reducing audit expenses is not a key benefit of CSA. C. Improved fraud detection is important but not as important as control ownership. It is not a principal objective of CSA. D. CSA may give more insights to internal auditors, allowing them to take a more consultative role; however, this is an additional benefit, not the key benefit."
      },
      {
        id: 3,
        pregunta: "¿En qué se enfocaría MÁS un auditor de SI al desarrollar un programa de auditoría basado en riesgo?",
        preguntaEn: "What would an IS auditor MOST focus on when developing a risk-based audit program?",
        alternativas: [
          { id: "a", texto: "Procesos de negocio" },
          { id: "b", texto: "Controles administrativos" },
          { id: "c", texto: "Controles ambientales" },
          { id: "d", texto: "Estrategias de negocio" }
        ],
        alternativasEn: [
          { id: "a", texto: "Business processes" },
          { id: "b", texto: "Administrative controls" },
          { id: "c", texto: "Environmental controls" },
          { id: "d", texto: "Business strategies" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Un enfoque de auditoría basado en riesgos se centra en comprender la naturaleza del negocio y en ser capaz de identificar y categorizar el riesgo. El riesgo de negocio impacta la viabilidad a largo plazo de un negocio específico. Por lo tanto, un auditor de SI que utiliza un enfoque de auditoría basado en riesgos debe ser capaz de comprender los procesos de negocio. B. Los controles administrativos, aunque son un subconjunto importante de controles, no son el foco principal necesario para comprender los procesos de negocio dentro del alcance de una auditoría. C. Al igual que los controles administrativos, los controles ambientales son un subconjunto de control importante; sin embargo, no abordan los procesos de negocio generales de alto nivel bajo revisión. D. Las estrategias de negocio son las impulsoras de los procesos de negocio; sin embargo, en este caso, el auditor de SI se enfoca en los procesos de negocio que se implementaron para permitir a la organización ejecutar sus estrategias.",
        justificacionEn: "A. A risk-based audit approach focuses on understanding the nature of the business and being able to identify and categorize risk. Business risk impacts the long-term viability of a specific business. Thus, an IS auditor using a risk-based audit approach must be able to understand business processes. B. Administrative controls, while an important subset of controls, are not the primary focus needed to understand the business processes within the scope of an audit. C. Like administrative controls, environmental controls are an important control subset; however, they do not address high-level overarching business processes under review. D. Business strategies are the drivers for business processes; however, in this case, an IS auditor is focusing on the business processes that were put in place to enable the organization to implement its strategies."
      },
      {
        id: 4,
        pregunta: "¿Qué tipo de riesgo de auditoría asume la ausencia de controles compensatorios en el área revisada?",
        preguntaEn: "Which type of audit risk is assumed when there are no compensating controls in the area under review?",
        alternativas: [
          { id: "a", texto: "Riesgo de control" },
          { id: "b", texto: "Riesgo de detección" },
          { id: "c", texto: "Riesgo inherente" },
          { id: "d", texto: "Riesgo de muestreo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Control risk" },
          { id: "b", texto: "Detection risk" },
          { id: "c", texto: "Inherent risk" },
          { id: "d", texto: "Sampling risk" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El riesgo de control es el riesgo de que exista un error material que no sea prevenido o detectado de manera oportuna por el sistema de controles internos. B. El riesgo de detección es el riesgo de que una incorrección material con una afirmación de la gerencia no sea detectada por las pruebas sustantivas de un profesional de auditoría y aseguramiento. Consta de dos componentes: riesgo de muestreo y riesgo de no muestreo. C. El riesgo inherente es el nivel de riesgo o exposición evaluado sin considerar las acciones que la gerencia ha tomado o podría tomar. D. El riesgo de muestreo es el riesgo de que se hagan suposiciones incorrectas sobre las características de una población de la cual se toma una muestra. El riesgo de no muestreo es el riesgo de detección no relacionado con el muestreo; puede deberse a una variedad de razones, incluido el error humano.",
        justificacionEn: "A. Control risk is the risk that a material error exists that will not be prevented or detected in a timely manner by the system of internal controls. B. Detection risk is the risk that a material misstatement with a management assertion will not be detected by an audit and assurance professional's substantive tests. It consists of two components: sampling risk and non-sampling risk. C. Inherent risk is the risk level or exposure assessed without considering the actions that management has taken or might take. D. Sampling risk is the risk that incorrect assumptions are made about the characteristics of a population from which a sample is taken. Non-sampling risk is detection risk that is unrelated to sampling; it can be due to a variety of reasons, including human error."
      },
      {
        id: 5,
        pregunta: "Un auditor de SI que revisa los controles de una aplicación encuentra una debilidad en el software de sistema que podría afectar materialmente la aplicación. ¿Qué debe hacer?",
        preguntaEn: "An IS auditor reviewing application controls discovers a weakness in the systems software that could materially affect the application. What should the auditor do?",
        alternativas: [
          { id: "a", texto: "Ignorarla por estar fuera de alcance" },
          { id: "b", texto: "Realizar una revisión detallada del software de sistema y reportarla" },
          { id: "c", texto: "Incluir una declaración de que la auditoría se limitó a la aplicación" },
          { id: "d", texto: "Revisar los controles relevantes del software de sistema y recomendar una revisión detallada" }
        ],
        alternativasEn: [
          { id: "a", texto: "Ignore it because it is outside the scope of the review" },
          { id: "b", texto: "Perform a detailed systems software review and report it" },
          { id: "c", texto: "Include a disclaimer that the audit was limited to the application" },
          { id: "d", texto: "Review relevant systems software controls and recommend a detailed review" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. No se espera que un auditor de SI ignore las debilidades de control solo porque estén fuera del alcance de la revisión actual. B. Llevar a cabo una revisión detallada del software de sistemas puede obstaculizar el cronograma de la auditoría, y es posible que un auditor de SI no sea técnicamente competente para realizar dicha revisión en el momento de la auditoría. C. Si hay debilidades de control descubiertas por un auditor de SI, deben ser reveladas. Al emitir una exención de responsabilidad (disclaimer), se renunciaría a esta responsabilidad. D. La opción adecuada sería revisar el software de sistemas relevante y recomendar una revisión detallada del software de sistemas para la cual se puedan recomendar recursos adicionales.",
        justificacionEn: "A. An information systems (IS) auditor is not expected to ignore control weaknesses just because they are outside the scope of a current review. B. The conduct of a detailed systems software review may hamper the audit's schedule, and an IS auditor may not be technically competent to do such a review at the time of the audit. C. If there are control weaknesses that have been discovered by an IS auditor, they should be disclosed. By issuing a disclaimer, this responsibility would be waived. D. The appropriate option would be to review the relevant systems software and recommend a detailed systems software review for which additional resources may be recommended."
      },
      {
        id: 6,
        pregunta: "¿Cuál es la razón MÁS importante para revisar periódicamente el proceso de planificación de auditoría?",
        preguntaEn: "What is the MOST important reason for periodically reviewing the audit planning process?",
        alternativas: [
          { id: "a", texto: "Planificar el despliegue de recursos" },
          { id: "b", texto: "Considerar cambios en el entorno de riesgo" },
          { id: "c", texto: "Aportar insumos para la carta de auditoría" },
          { id: "d", texto: "Identificar los estándares de auditoría aplicables" }
        ],
        alternativasEn: [
          { id: "a", texto: "Plan the deployment of audit resources" },
          { id: "b", texto: "Consider changes in the risk environment" },
          { id: "c", texto: "Provide input for the audit charter" },
          { id: "d", texto: "Identify applicable audit standards" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. El despliegue de los recursos de auditoría disponibles está determinado por las asignaciones de auditoría, las cuales están influenciadas por el proceso de planificación. B. Los asuntos a corto y largo plazo que impulsan la planificación de la auditoría pueden verse fuertemente afectados por cambios en el entorno de riesgo, las tecnologías y los procesos de negocio de la empresa. C. La carta de auditoría refleja el mandato de la alta gerencia hacia la función de auditoría y reside en un nivel más abstracto. D. La aplicabilidad de los estándares, directrices y procedimientos de auditoría de SI es universal para cualquier encargo de auditoría y no está influenciada por problemas a corto y largo plazo.",
        justificacionEn: "A. Deployment of available audit resources is determined by the audit assignments, which are influenced by the planning process. B. Short- and long-term issues that drive audit planning can be heavily impacted by changes to the risk environment, technologies and business processes of the enterprise. C. The audit charter reflects the mandate of top management to the audit function and resides at a more abstract level. D. Applicability of information systems (IS) audit standards, guidelines and procedures is universal to any audit engagement and is not influenced by short- and long-term issues."
      },
      {
        id: 7,
        pregunta: "¿Cuál es el paso MÁS crítico al planificar una auditoría de SI?",
        preguntaEn: "What is the MOST critical step when planning an IS audit?",
        alternativas: [
          { id: "a", texto: "Revisión de hallazgos de auditorías previas" },
          { id: "b", texto: "Aprobación del plan por la alta gerencia" },
          { id: "c", texto: "Revisión de políticas de seguridad de la información" },
          { id: "d", texto: "Realizar una evaluación de riesgo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Review of findings from previous audits" },
          { id: "b", texto: "Approval of the plan by senior management" },
          { id: "c", texto: "Review of information security policies" },
          { id: "d", texto: "Performing a risk assessment" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Los hallazgos de una auditoría anterior son de interés para el auditor, pero no son el paso más crítico. El paso más crítico implica encontrar los problemas actuales o las áreas de alto riesgo, no revisar la resolución de problemas anteriores. B. No se requiere que la gerencia ejecutiva apruebe el plan de auditoría. Por lo general, es aprobado por el comité de auditoría o la junta directiva. La gerencia podría recomendar áreas a auditar. C. La revisión de las políticas y procedimientos de seguridad de la información normalmente se lleva a cabo durante el trabajo de campo, no en la planificación. D. De todos los pasos enumerados, realizar una evaluación de riesgos es el más crítico. La evaluación de riesgos es obligatoria según el Estándar 1201 de ISACA: los profesionales de auditoría y aseguramiento de TI deben identificar y evaluar el riesgo relevante para el área bajo revisión al planificar compromisos individuales. Si no se realiza una evaluación de riesgos, es posible que las áreas de alto riesgo no se identifiquen para su evaluación.",
        justificacionEn: "A. The findings of a previous audit are of interest to the auditor, but they are not the most critical step. The most critical step involves finding the current issues or high-risk areas, not reviewing the resolution of older issues. A review of historical audit findings could indicate that management is not resolving the risk items identified or that the recommendations were ineffective. B. Executive management is not required to approve the audit plan. It is typically approved by the audit committee or board of directors. Management could recommend areas to audit. C. Reviewing information security policies and procedures is normally conducted during fieldwork, not planning. D. Of all the steps listed, performing a risk assessment is the most critical. Risk assessment is required by ISACA IS Audit and Assurance Standard 1201: IT audit and assurance practitioners shall identify and assess risk relevant to the area under review when planning individual engagements. If a risk assessment is not performed, then high-risk areas may not be identified for evaluation."
      },
      {
        id: 8,
        pregunta: "El enfoque para planificar la cobertura de auditoría de SI debe basarse en:",
        preguntaEn: "The approach to planning IS audit coverage should be based on:",
        alternativas: [
          { id: "a", texto: "Riesgo" },
          { id: "b", texto: "Materialidad" },
          { id: "c", texto: "Monitoreo de fraude" },
          { id: "d", texto: "Suficiencia de la evidencia" }
        ],
        alternativasEn: [
          { id: "a", texto: "Risk" },
          { id: "b", texto: "Materiality" },
          { id: "c", texto: "Fraud monitoring" },
          { id: "d", texto: "Sufficiency of audit evidence" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La planificación de la auditoría requiere un enfoque basado en riesgos. B. La materialidad se refiere a debilidades potenciales o ausencias de controles al planificar un encargo específico, y si tales debilidades podrían resultar en una deficiencia significativa o una debilidad material. C. El monitoreo del fraude se refiere a la identificación de transacciones y patrones relacionados con el fraude y puede desempeñar un papel en la planificación de la auditoría, pero solo en la medida en que se relacione con el riesgo organizacional. D. La suficiencia de la evidencia de auditoría se refiere a la evaluación de la suficiencia de la evidencia obtenida para respaldar las conclusiones y alcanzar los objetivos específicos del encargo.",
        justificacionEn: "A. Audit planning requires a risk-based approach. B. Materiality pertains to potential weaknesses or absences of controls while planning a specific engagement, and whether such weaknesses or absences of controls could result in a significant deficiency or a material weakness. C. Fraud monitoring pertains to the identification of fraud-related transactions and patterns and may play a part in audit planning but only as it pertains to organizational risk. D. Sufficiency of audit evidence pertains to the evaluation of the sufficiency of evidence obtained to support conclusions and achieve specific engagement objectives."
      },
      {
        id: 9,
        pregunta: "Una organización respalda diariamente datos y software críticos y almacena los medios fuera del sitio para restaurar archivos ante una interrupción. Esto es un ejemplo de un control:",
        preguntaEn: "An organization backs up critical data and software daily and stores the media off-site to restore files in the event of a disruption. This is an example of a:",
        alternativas: [
          { id: "a", texto: "Preventivo" },
          { id: "b", texto: "De gestión" },
          { id: "c", texto: "Correctivo" },
          { id: "d", texto: "Detective" }
        ],
        alternativasEn: [
          { id: "a", texto: "Preventive control" },
          { id: "b", texto: "Management control" },
          { id: "c", texto: "Corrective control" },
          { id: "d", texto: "Detective control" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Los controles preventivos son aquellos que evitan los problemas antes de que surjan. Los medios de respaldo no se pueden usar para prevenir daños a los archivos y, por lo tanto, no se pueden clasificar como controles preventivos. B. Los controles de gestión modifican los sistemas de procesamiento para minimizar las recurrencias del problema. Los medios de respaldo no modifican los sistemas de procesamiento. C. Un control correctivo ayuda a corregir o minimizar el impacto de un problema. Los medios de respaldo se pueden utilizar para restaurar los archivos en caso de daño a los mismos, reduciendo así el impacto de una interrupción. D. Los controles detectivos ayudan a detectar e informar problemas a medida que ocurren. Los medios de respaldo no ayudan a detectar errores.",
        justificacionEn: "A. Preventive controls are those that avert problems before they arise. Backup media cannot be used to prevent damage to files and, therefore, cannot be classified as preventive controls. B. Management controls modify processing systems to minimize repeat occurrences of the problem. Backup media do not modify processing systems and, therefore, do not fit the definition of management controls. C. A corrective control helps to correct or minimize the impact of a problem. Backup media can be used for restoring the files in case of damage to the files, thereby reducing the impact of a disruption. D. Detective controls help to detect and report problems as they occur. Backup media do not aid in detecting errors."
      }
    ],

    2: [
      {
        id: 1,
        pregunta: "Para que la gerencia monitoree eficazmente el cumplimiento de procesos y aplicaciones, ¿qué sería lo MÁS ideal?",
        preguntaEn: "To most effectively monitor compliance with processes and applications, which tool would be MOST ideal for management?",
        alternativas: [
          { id: "a", texto: "Repositorio central de documentos" },
          { id: "b", texto: "Sistema de gestión del conocimiento" },
          { id: "c", texto: "Un tablero (dashboard)" },
          { id: "d", texto: "Benchmarking" }
        ],
        alternativasEn: [
          { id: "a", texto: "A central document repository" },
          { id: "b", texto: "A knowledge management system" },
          { id: "c", texto: "A dashboard" },
          { id: "d", texto: "Benchmarking" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Un repositorio central de documentos alberga una gran cantidad de datos, pero no necesariamente la información específica que sería útil para el monitoreo y el cumplimiento. B. Un sistema de gestión del conocimiento proporciona información valiosa, pero por lo general la gerencia no lo utiliza para fines de cumplimiento. C. Un panel de control (dashboard) proporciona información que ilustra el cumplimiento de los procesos, aplicaciones y elementos configurables, y mantiene a la empresa en el rumbo correcto. D. El benchmarking proporciona información para ayudar a los gerentes a adaptar la empresa rápidamente, de acuerdo con las tendencias y el entorno.",
        justificacionEn: "A. A central document repository hosts a great deal of data but not necessarily the specific information that would be useful for monitoring and compliance. B. A knowledge management system provides valuable information but generally is not used by management for compliance purposes. C. A dashboard provides information that illustrates compliance with the processes, applications and configurable elements and keeps the enterprise on course. D. Benchmarking provides information to help managers adapt the enterprise promptly, according to trends and environment."
      },
      {
        id: 2,
        pregunta: "¿Qué se incluiría en un plan estratégico de SI?",
        preguntaEn: "Which of the following would be included in an IS strategic plan?",
        alternativas: [
          { id: "a", texto: "Especificaciones de compras de hardware" },
          { id: "b", texto: "Análisis de objetivos de negocio futuros" },
          { id: "c", texto: "Fechas objetivo de proyectos de desarrollo" },
          { id: "d", texto: "Metas presupuestarias anuales de TI" }
        ],
        alternativasEn: [
          { id: "a", texto: "Specifications for planned hardware purchases" },
          { id: "b", texto: "Analysis of future business objectives" },
          { id: "c", texto: "Target dates for development projects" },
          { id: "d", texto: "Annual budgetary targets for the IT department" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Las especificaciones para las compras de hardware planificadas no son elementos estratégicos. B. Los planes estratégicos de SI deben abordar las necesidades del negocio y cumplir con los objetivos comerciales futuros. Las compras de hardware pueden delinearse a grandes rasgos, pero no especificarse, y ni las metas presupuestarias ni los proyectos de desarrollo son opciones apropiadas. C. Las fechas objetivo para proyectos de desarrollo no son elementos estratégicos. D. Las metas presupuestarias anuales para el departamento de TI no son elementos estratégicos.",
        justificacionEn: "A. Specifications for planned hardware purchases are not strategic items. B. Information systems (IS) strategic plans must address the needs of the business and meet future business objectives. Hardware purchases may be outlined, but not specified, and neither budget targets nor development projects are appropriate choices. C. Target dates for development projects are not strategic items. D. Annual budgetary targets for the IT department are not strategic items."
      },
      {
        id: 3,
        pregunta: "¿Cuál describe MEJOR el proceso de planificación estratégica del departamento de TI?",
        preguntaEn: "Which BEST describes the IT department's strategic planning process?",
        alternativas: [
          { id: "a", texto: "Tendrá planes de corto o largo plazo según los planes de la organización" },
          { id: "b", texto: "El plan no necesita ser tan detallado que ayude a priorizar" },
          { id: "c", texto: "La planificación de largo plazo debe reconocer las metas empresariales, avances tecnológicos y requisitos regulatorios" },
          { id: "d", texto: "La planificación de corto plazo no necesita integrarse con la de la empresa" }
        ],
        alternativasEn: [
          { id: "a", texto: "It will have short- or long-range plans consistent with the organization's plans" },
          { id: "b", texto: "Plans do not need to be detailed enough to help prioritize" },
          { id: "c", texto: "Long-range planning must recognize enterprise goals, technological advances and regulatory requirements" },
          { id: "d", texto: "Short-range planning does not need to be integrated with the enterprise's plans" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Por lo general, el departamento de TI tendrá planes a corto o a largo plazo que sean consistentes e integrados con los planes de la organización. B. Los planes deben estar orientados al tiempo y a los proyectos, y abordar los planes más amplios de la empresa orientados a alcanzar sus metas. C. La planificación a largo plazo para el departamento de TI debe reconocer las metas de la empresa, los avances tecnológicos y los requisitos regulatorios. D. La planificación a corto plazo para el departamento de TI debe integrarse en los planes a corto plazo de la empresa para permitir que el departamento de TI sea más ágil y receptivo a los avances tecnológicos necesarios.",
        justificacionEn: "A. Typically, the IT department will have short- or long-range plans that are consistent and integrated with the organization's plans. B. Plans must be time- and project-oriented and address the enterprise's broader plans toward attaining its goals. C. Long-range planning for the IT department should recognize enterprise goals, technological advances and regulatory requirements. D. Short-range planning for the IT department should be integrated into the short-range plans of the enterprise to better enable the IT department to be agile and responsive to needed technological advances that align with enterprise goals and objectives."
      },
      {
        id: 4,
        pregunta: "¿Cuál es la responsabilidad MÁS importante de un oficial de seguridad de datos?",
        preguntaEn: "What is the MOST important responsibility of a data security officer?",
        alternativas: [
          { id: "a", texto: "Recomendar y monitorear las políticas de seguridad de datos" },
          { id: "b", texto: "Promover la concienciación de seguridad" },
          { id: "c", texto: "Establecer procedimientos de políticas de seguridad de TI" },
          { id: "d", texto: "Administrar controles de acceso físico y lógico" }
        ],
        alternativasEn: [
          { id: "a", texto: "Recommend and monitor data security policies" },
          { id: "b", texto: "Promote security awareness within the enterprise" },
          { id: "c", texto: "Establish procedures for IT security policies" },
          { id: "d", texto: "Administer physical and logical access controls" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La principal responsabilidad de un oficial de seguridad de datos es recomendar y monitorear las políticas de seguridad de datos. B. Promover la concientización sobre seguridad dentro de la empresa es una de las responsabilidades de un oficial de seguridad de datos; sin embargo, es menos importante que recomendar y monitorear las políticas de seguridad de datos. C. El departamento de TI, y no el oficial de seguridad de datos, es responsable de establecer los procedimientos para las políticas de seguridad de TI recomendadas por el oficial de seguridad de datos. D. El departamento de TI, y no el oficial de seguridad de datos, es responsable de la administración de los controles de acceso físico y lógico.",
        justificacionEn: "A. A data security officer's prime responsibility is recommending and monitoring data security policies. B. Promoting security awareness within the enterprise is one of the responsibilities of a data security officer. However, it is less important than recommending and monitoring data security policies. C. The IT department, not the data security officer, is responsible for establishing procedures for IT security policies recommended by the data security officer. D. The IT department, not the data security officer, is responsible for the administration of physical and logical access controls."
      },
      {
        id: 5,
        pregunta: "¿Qué se considera el elemento MÁS crítico para implementar con éxito un programa de seguridad de la información?",
        preguntaEn: "What is considered the MOST critical element for successfully implementing an information security program?",
        alternativas: [
          { id: "a", texto: "Un marco de ERM efectivo" },
          { id: "b", texto: "El compromiso de la alta gerencia" },
          { id: "c", texto: "Un proceso de presupuestación adecuado" },
          { id: "d", texto: "Una planificación meticulosa del programa" }
        ],
        alternativasEn: [
          { id: "a", texto: "An effective enterprise risk management (ERM) framework" },
          { id: "b", texto: "Senior management's commitment" },
          { id: "c", texto: "An effective information security budgeting process" },
          { id: "d", texto: "Meticulous program planning" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Un marco eficaz de gestión de riesgos empresariales (ERM) no es un factor clave de éxito para un programa de seguridad de la información. B. El compromiso de la alta gerencia proporciona la base indispensable para lograr el éxito en la implementación de un programa de seguridad de la información. C. Aunque un proceso eficaz de presupuestación de la seguridad de la información contribuirá al éxito, el compromiso de la alta gerencia es el elemento clave. D. La planificación del programa es importante, pero no será suficiente sin el compromiso de la alta gerencia.",
        justificacionEn: "A. An effective enterprise risk management (ERM) framework is not a key success factor for an information security program. B. Senior management's commitment provides the basis for success in implementing an information security program. C. Although an effective information security budgeting process will contribute to success, senior management commitment is the key element. D. Program planning is important but will not be sufficient without senior management commitment."
      },
      {
        id: 6,
        pregunta: "Un auditor de SI debe asegurar que las medidas de desempeño de gobierno de TI:",
        preguntaEn: "An IS auditor should ensure that IT governance performance measures:",
        alternativas: [
          { id: "a", texto: "Evalúen las actividades de los comités de supervisión de TI" },
          { id: "b", texto: "Provean impulsores estratégicos de TI" },
          { id: "c", texto: "Cumplan estándares regulatorios de reporte" },
          { id: "d", texto: "Evalúen al departamento de TI" }
        ],
        alternativasEn: [
          { id: "a", texto: "Evaluate the activities of boards and committees providing oversight" },
          { id: "b", texto: "Provide strategic IT drivers" },
          { id: "c", texto: "Adhere to regulatory reporting standards and definitions" },
          { id: "d", texto: "Evaluate the IT department" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Evaluar las actividades de las juntas y comités que ejercen la supervisión es un aspecto importante del gobierno y debe medirse. B. Proporcionar impulsores estratégicos de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI. C. Adherirse a los estándares y definiciones de informes regulatorios es irrelevante para evaluar las medidas de desempeño del gobierno de TI. D. Evaluar al departamento de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI.",
        justificacionEn: "A. Evaluating the activities of boards and committees providing oversight is an important aspect of governance and should be measured. B. Providing strategic IT drivers is irrelevant to evaluating IT governance performance measures. C. Adhering to regulatory reporting standards and definitions is irrelevant to evaluating IT governance performance measures. D. Evaluating the IT department is irrelevant to evaluating IT governance performance measures."
      },
      {
        id: 7,
        pregunta: "¿Qué tareas pueden realizarse por la misma persona en un centro de procesamiento bien controlado?",
        preguntaEn: "Which tasks can be performed by the same person in a well-controlled processing center?",
        alternativas: [
          { id: "a", texto: "Administración de seguridad y gestión de cambios" },
          { id: "b", texto: "Operaciones de cómputo y desarrollo de sistemas" },
          { id: "c", texto: "Desarrollo de sistemas y gestión de cambios" },
          { id: "d", texto: "Desarrollo de sistemas y mantenimiento de sistemas" }
        ],
        alternativasEn: [
          { id: "a", texto: "Security administration and change management" },
          { id: "b", texto: "Computer operations and system development" },
          { id: "c", texto: "System development and change management" },
          { id: "d", texto: "System development and system maintenance" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Las funciones de administración de seguridad y gestión de cambios son incompatibles; el nivel de derechos de acceso de la administración de seguridad podría permitir que los cambios pasen desapercibidos. B. Operaciones de cómputo y desarrollo de sistemas es la opción incorrecta porque esto haría posible que un operador ejecute un programa que él mismo haya modificado. C. La combinación de desarrollo de sistemas y control de cambios permitiría que las modificaciones de programas eludan las aprobaciones de control de cambios. D. Es común que el desarrollo y el mantenimiento de sistemas sean asumidos por la misma persona; en ambos, el programador requiere acceso al código fuente en el entorno de desarrollo, pero no se le debe permitir el acceso en el entorno de producción.",
        justificacionEn: "A. The roles of security administration and change management are incompatible functions. The level of security administration access rights could allow changes to go undetected. B. Computer operations and system development is the incorrect choice because this would make it possible for an operator to run a program they had amended. C. The combination of system development and change control would allow program modifications to bypass change control approvals. D. It is common for system development and maintenance to be undertaken by the same person. In both, the programmer requires access to the source code in the development environment but should not be allowed access in the production environment."
      },
      {
        id: 8,
        pregunta: "¿Cuál es el control MÁS crítico sobre la administración de bases de datos (DBA)?",
        preguntaEn: "What is the MOST critical control over database administration (DBA)?",
        alternativas: [
          { id: "a", texto: "Aprobación de actividades del DBA" },
          { id: "b", texto: "Separación de funciones respecto al otorgamiento/revocación de derechos de acceso" },
          { id: "c", texto: "Revisión de logs de acceso" },
          { id: "d", texto: "Revisión del uso de herramientas de base de datos" }
        ],
        alternativasEn: [
          { id: "a", texto: "Approval of DBA activities" },
          { id: "b", texto: "Separation of duties regarding granting/revoking access rights" },
          { id: "c", texto: "Review of access logs and activities" },
          { id: "d", texto: "Review of the use of database tools" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. La aprobación de las actividades de administración de bases de datos (DBA) no evita la combinación de funciones incompatibles; la revisión de registros de acceso y actividades es un control de detección. B. La segregación de funciones (SoD) evitará la combinación de funciones incompatibles; este es un control preventivo y es el control más crítico sobre el DBA. C. Revisar los registros de acceso y las actividades puede no reducir el riesgo si las actividades del DBA se aprueban de forma inadecuada. D. Revisar el uso de herramientas de base de datos no reduce el riesgo porque esto es únicamente un control detectivo y no previene la combinación de funciones incompatibles.",
        justificacionEn: "A. Approval of database administration (DBA) activities does not prevent the combination of conflicting functions. Review of access logs and activities is a detective control. B. Separation of duties (SoD) will prevent the combination of conflicting functions. This is a preventive control, and it is the most critical control over DBA. C. Reviewing access logs and activities may not reduce the risk if DBA activities are improperly approved. D. Reviewing the use of database tools does not reduce the risk because this is only a detective control and does not prevent the combination of conflicting functions."
      },
      {
        id: 9,
        pregunta: "Cuando no se puede lograr una separación de funciones completa en un entorno en línea, ¿qué función debe separarse de las demás?",
        preguntaEn: "When complete separation of duties cannot be achieved in an online environment, which function should be separated from the others?",
        alternativas: [
          { id: "a", texto: "Origen" },
          { id: "b", texto: "Autorización" },
          { id: "c", texto: "Registro" },
          { id: "d", texto: "Corrección" }
        ],
        alternativasEn: [
          { id: "a", texto: "Origination" },
          { id: "b", texto: "Authorization" },
          { id: "c", texto: "Recording" },
          { id: "d", texto: "Correction" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. La originación, en conjunto con el registro y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. B. La autorización debe separarse de todos los aspectos del mantenimiento de registros (originación, registro y corrección); dicha separación mejora la capacidad de detectar el registro de transacciones no autorizadas. C. El registro, en conjunto con la originación y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. D. La corrección, en conjunto con la originación y el registro, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro.",
        justificacionEn: "A. Origination, in conjunction with recording and correction, does not enable the transaction to be authorized for processing and committed within the system of record. B. Authorization should be separated from all aspects of record keeping (origination, recording and correction). Such a separation enhances the ability to detect the recording of unauthorized transactions. C. Recording, in conjunction with origination and correction, does not enable the transaction to be authorized for processing and committed within the system of record. D. Correction, in conjunction with origination and recording, does not enable the transaction to be authorized for processing and committed within the system of record."
      },
      {
        id: 10,
        pregunta: "En una pequeña empresa donde un mismo empleado es operador de cómputo y programador de aplicaciones, ¿qué control debe recomendar el auditor?",
        preguntaEn: "In a small enterprise where the same employee is both computer operator and application programmer, what control should the auditor recommend?",
        alternativas: [
          { id: "a", texto: "Registro automatizado de cambios en bibliotecas de desarrollo" },
          { id: "b", texto: "Personal adicional para lograr SoD" },
          { id: "c", texto: "Procedimientos que verifiquen que solo se implementan cambios de programa aprobados" },
          { id: "d", texto: "Controles de acceso que impidan al operador modificar programas" }
        ],
        alternativasEn: [
          { id: "a", texto: "Automated logging of changes to development libraries" },
          { id: "b", texto: "Recruiting additional staff to achieve SoD" },
          { id: "c", texto: "Processes that detect changes to production source and object code" },
          { id: "d", texto: "Access controls to prevent the operator from making program modifications" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El registro automatizado de cambios en las bibliotecas de desarrollo no detectaría los cambios realizados en las bibliotecas de producción. B. En empresas más pequeñas, por lo general no es apropiado contratar personal adicional para lograr una separación estricta de funciones; el auditor de SI debe buscar alternativas. C. El auditor de SI debe recomendar procesos que detecten cambios en el código fuente y objeto de producción, como comparaciones de código, para que los cambios puedan ser revisados periódicamente por un tercero; este sería un proceso de control compensatorio. D. Los controles de acceso para evitar que el operador realice modificaciones a los programas requieren que un tercero realice los cambios, lo cual puede no ser práctico en una empresa pequeña.",
        justificacionEn: "A. Logging changes to development libraries would not detect changes to production libraries. B. In smaller enterprises, it generally is not appropriate to recruit additional staff to achieve a strict separation of duties. The IS auditor must look at alternatives. C. The information systems (IS) auditor should recommend processes that detect changes to production source and object code, such as code comparisons, so that the changes can be reviewed by a third party regularly. This would be a compensating control process. D. Access controls to prevent the operator from making program modifications require a third party to make the changes, which may not be practical in a small enterprise."
      }
    ],

    3: [
      {
        id: 1,
        pregunta: "Para probar un sistema bancario esencial que se está adquiriendo, la empresa entregó al proveedor datos sensibles de producción. La preocupación PRIMARIA del auditor es que los datos sean:",
        preguntaEn: "To test a critical banking system being acquired, the company gave the vendor sensitive production data. The auditor's PRIMARY concern is that the data be:",
        alternativas: [
          { id: "a", texto: "Anonimizados/saneados (sanitized)" },
          { id: "b", texto: "Completos" },
          { id: "c", texto: "Representativos" },
          { id: "d", texto: "Actuales" }
        ],
        alternativasEn: [
          { id: "a", texto: "Sanitized/anonymized" },
          { id: "b", texto: "Complete" },
          { id: "c", texto: "Representative" },
          { id: "d", texto: "Current" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Los datos de prueba deben ser saneados (sanitized) para evitar que los datos sensibles se filtren a personas no autorizadas. B. Aunque es importante que el conjunto de datos esté completo, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. C. Aunque es importante abarcar una representación de los datos transaccionales, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. D. Aunque es importante que el conjunto de datos represente los datos actuales que se están procesando, la preocupación principal sigue siendo la sanitización para evitar que los datos sensibles se filtren a personas no autorizadas.",
        justificacionEn: "A. Test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. B. Although it is important that the data set be complete, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. C. Although it is important to encompass a representation of the transactional data, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons. D. Although it is important that the data set represent current data being processed, the primary concern is that test data should be sanitized to prevent sensitive data from leaking to unauthorized persons."
      },
      {
        id: 2,
        pregunta: "¿Cuál es el propósito PRIMARIO de realizar pruebas en paralelo?",
        preguntaEn: "What is the PRIMARY purpose of parallel testing?",
        alternativas: [
          { id: "a", texto: "Determinar si el sistema es costo-efectivo" },
          { id: "b", texto: "Permitir pruebas exhaustivas de unidad y sistema" },
          { id: "c", texto: "Resaltar errores en interfaces de programa con archivos" },
          { id: "d", texto: "Asegurar que el nuevo sistema cumpla los requisitos del usuario" }
        ],
        alternativasEn: [
          { id: "a", texto: "Determine whether the system is cost-effective" },
          { id: "b", texto: "Allow exhaustive unit and system testing" },
          { id: "c", texto: "Highlight errors in program interfaces with files" },
          { id: "d", texto: "Ensure the new system meets user requirements" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Las pruebas en paralelo pueden mostrar que el sistema anterior es más rentable (cost-effective) que el nuevo sistema, pero esta no es la razón principal. B. Las pruebas unitarias y de sistema se completan antes de las pruebas en paralelo. C. Las interfaces del programa con los archivos se prueban en busca de errores durante las pruebas del sistema. D. El propósito de las pruebas en paralelo es asegurar que la implementación de un nuevo sistema cumplirá con los requisitos del usuario.",
        justificacionEn: "A. Parallel testing may show that the old system is more cost-effective than the new system, but this is not the primary reason. B. Unit and system testing are completed before parallel testing. C. Program interfaces with files are tested for errors during system testing. D. The purpose of parallel testing is to ensure that the implementation of a new system will meet user requirements."
      },
      {
        id: 3,
        pregunta: "Al revisar una reingeniería de procesos de negocio (BPR), el auditor encuentra que se eliminó un control preventivo importante. Debe:",
        preguntaEn: "When reviewing a business process reengineering (BPR) initiative, the auditor finds that an important preventive control was eliminated. The auditor should:",
        alternativas: [
          { id: "a", texto: "Informar a la gerencia y determinar si acepta el riesgo material potencial" },
          { id: "b", texto: "Determinar si un control detectivo lo reemplazó y, si no, reportarlo" },
          { id: "c", texto: "Recomendar reincorporar todos los controles previos" },
          { id: "d", texto: "Desarrollar un enfoque de auditoría continua" }
        ],
        alternativasEn: [
          { id: "a", texto: "Inform management and determine whether they accept the potential material risk" },
          { id: "b", texto: "Determine whether a detective control replaced it and, if not, report it" },
          { id: "c", texto: "Recommend reinstating all previous controls" },
          { id: "d", texto: "Develop a continuous audit approach" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La gerencia debe ser informada inmediatamente para determinar si está dispuesta a aceptar el riesgo material potencial de no tener implementado ese control preventivo. B. La existencia de un control detectivo en lugar de un control preventivo generalmente incrementa el riesgo de que ocurra un problema material. C. A menudo, durante una reingeniería de procesos de negocio (BPR), se eliminan muchos controles que no agregan valor. Esto es bueno, a menos que los controles incrementen el riesgo comercial y financiero. D. Un auditor de SI puede querer recomendar que la gerencia monitoree el nuevo proceso, pero esto debe hacerse solo después de que la gerencia haya sido informada y acepte el riesgo.",
        justificacionEn: "A. Management should be informed immediately to determine whether they are willing to accept the potential material risk of not having that preventive control in place. B. The existence of a detective control instead of a preventive control usually increases the risk that a material problem may occur. C. Often, during business process reengineering (BPR), many nonvalue-added controls are eliminated. This is good, unless the controls increase the business and financial risk. D. An IS auditor may want to monitor, or recommend that management monitor, the new process, but this should be done only after management has been informed and accepts the risk of not having the preventive control in place."
      },
      {
        id: 4,
        pregunta: "¿Qué edición de validación de datos es eficaz para detectar errores de transposición y transcripción?",
        preguntaEn: "Which data validation edit is effective for detecting transposition and transcription errors?",
        alternativas: [
          { id: "a", texto: "Rango (range check)" },
          { id: "b", texto: "Dígito de control (check digit)" },
          { id: "c", texto: "Validez" },
          { id: "d", texto: "Duplicados" }
        ],
        alternativasEn: [
          { id: "a", texto: "Range check" },
          { id: "b", texto: "Check digit" },
          { id: "c", texto: "Availability check" },
          { id: "d", texto: "Duplicate check" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Una verificación de rango comprueba datos que coinciden con un rango de valores predeterminado. B. Un dígito de control es un valor numérico que se calcula matemáticamente y se añade a los datos para asegurar que los datos originales no hayan sido alterados. Este control es eficaz para detectar errores de transposición y transcripción. C. Una verificación de validez es una comprobación programada de la validez de los datos de acuerdo con criterios predeterminados. D. En una verificación de duplicados, las transacciones nuevas o recientes se cotejan con las ingresadas anteriormente para asegurar que no estén ya en el sistema.",
        justificacionEn: "A. A range check is checking data that match a predetermined range of values. B. A check digit is a numeric value that is calculated mathematically and appended to data to ensure that the original data have not been altered. This control is effective in detecting transposition and transcription errors. C. An availability check is programmed checking of the data validity in accordance with predetermined criteria. D. In a duplicate check, new or fresh transactions are matched to those previously entered to ensure that they are not already in the system."
      },
      {
        id: 5,
        pregunta: "¿Qué debilidad sería la MÁS significativa en un ERP usado por una entidad financiera?",
        preguntaEn: "Which weakness would be MOST significant in an ERP used by a financial entity?",
        alternativas: [
          { id: "a", texto: "No se han revisado los controles de acceso" },
          { id: "b", texto: "Documentación limitada" },
          { id: "c", texto: "Medios de respaldo de dos años sin reemplazar" },
          { id: "d", texto: "Respaldos de base de datos una vez al día" }
        ],
        alternativasEn: [
          { id: "a", texto: "Access controls have not been reviewed" },
          { id: "b", texto: "Limited documentation" },
          { id: "c", texto: "Two-year-old backup media not replaced" },
          { id: "d", texto: "Database backups performed once a day" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La falta de revisión de los controles de acceso en una empresa financiera puede tener graves consecuencias dados los tipos de datos y activos a los que se puede acceder. B. La falta de documentación puede no ser tan grave como no tener los controles de acceso debidamente revisados. C. Es posible que no se puedan recuperar datos de medios de respaldo de dos años de antigüedad. D. Para el negocio puede ser aceptable realizar respaldos de la base de datos una vez al día, dependiendo del volumen de transacciones.",
        justificacionEn: "A. A lack of review of access controls in a financial enterprise can have serious consequences given the types of data and assets that can be accessed. B. A lack of documentation may not be as serious as not having properly reviewed access controls. C. It may not be possible to retrieve data from two-year-old backup media. D. It may be acceptable to the business to perform database backups once a day, depending on the volume of transactions."
      },
      {
        id: 6,
        pregunta: "Al auditar la fase de requisitos de una adquisición de software, el auditor debe:",
        preguntaEn: "When auditing the requirements phase of a software acquisition, the auditor should:",
        alternativas: [
          { id: "a", texto: "Evaluar la razonabilidad del cronograma" },
          { id: "b", texto: "Evaluar los procesos de calidad del proveedor" },
          { id: "c", texto: "Asegurar que se adquiera el mejor paquete" },
          { id: "d", texto: "Revisar la completitud de las especificaciones" }
        ],
        alternativasEn: [
          { id: "a", texto: "Evaluate the reasonableness of the project timetable" },
          { id: "b", texto: "Assess vendor quality processes" },
          { id: "c", texto: "Ensure the best package is acquired" },
          { id: "d", texto: "Review the completeness of specifications" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Normalmente, el cronograma de un proyecto no se encuentra en un documento de requisitos. B. La evaluación de los procesos de calidad del proveedor se realiza después de que se han completado los requisitos. C. La decisión de adquirir un paquete comercial de un proveedor se toma después de que se han completado los requisitos. D. El propósito de la fase de requisitos es especificar la funcionalidad del sistema propuesto; por lo tanto, un auditor de SI se concentraría en la completitud de las especificaciones.",
        justificacionEn: "A. A project timetable normally is not found in a requirements document. B. Assessing the vendor quality processes comes after the requirements have been completed. C. The decision to purchase a package from a vendor comes after the requirements have been completed. D. The purpose of the requirements phase is to specify the functionality of the proposed system; therefore, an information systems (IS) auditor would concentrate on the completeness of the specifications."
      },
      {
        id: 7,
        pregunta: "Al comprar un paquete de software en vez de desarrollarlo, las fases de diseño y desarrollo del SDLC tradicional se reemplazan por:",
        preguntaEn: "When purchasing a software package instead of developing it, the design and development phases of the traditional SDLC are replaced by:",
        alternativas: [
          { id: "a", texto: "Fases de selección y configuración" },
          { id: "b", texto: "Factibilidad y requisitos" },
          { id: "c", texto: "Implementación y pruebas" },
          { id: "d", texto: "No se requiere reemplazo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Selection and configuration phases" },
          { id: "b", texto: "Feasibility and requirements phases" },
          { id: "c", texto: "Implementation and testing phases" },
          { id: "d", texto: "No replacement is needed" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Con un paquete comprado, las fases de diseño y desarrollo del ciclo de vida tradicional se reemplazan con las fases de selección y configuración. Se solicita una propuesta al proveedor de sistemas empaquetados y se evalúa contra criterios predefinidos para la selección, antes de tomar la decisión de comprar el software. Después de que se adquiere el software, se configura para satisfacer los requisitos de la empresa. B. Las otras fases del SDLC, tales como el estudio de factibilidad, la definición de requisitos, la implementación y la postimplementación, permanecen inalteradas. C. Las otras fases del SDLC permanecen inalteradas. D. En este escenario, las fases de diseño y desarrollo del ciclo de vida tradicional sí son reemplazables por las fases de selección y configuración.",
        justificacionEn: "A. With a purchased package, the design and development phases of the traditional life cycle are replaced with selection and configuration phases. A proposal from the supplier of packaged systems is requested and evaluated against predefined criteria for selection, before a decision is made to purchase the software. After the software is purchased, it is configured to meet the enterprise's requirements. B. The other phases of the system development life cycle (SDLC), such as feasibility study, requirements definition, implementation and postimplementation, remain unaltered. C. The other phases of the SDLC, such as feasibility study, requirements definition, implementation and postimplementation, remain unaltered. D. In this scenario, the design and development phases of the traditional life cycle are replaceable with selection and configuration phases."
      },
      {
        id: 8,
        pregunta: "Las especificaciones de usuario no se cumplieron en un proyecto con metodología waterfall. ¿Cuál es la fuente MÁS probable de la causa?",
        preguntaEn: "User specifications were not met in a waterfall methodology project. What is the MOST likely source of the problem?",
        alternativas: [
          { id: "a", texto: "Aseguramiento de calidad (QA)" },
          { id: "b", texto: "Requisitos" },
          { id: "c", texto: "Desarrollo" },
          { id: "d", texto: "Capacitación de usuarios" }
        ],
        alternativasEn: [
          { id: "a", texto: "Quality assurance (QA)" },
          { id: "b", texto: "Requirements" },
          { id: "c", texto: "Development" },
          { id: "d", texto: "User training" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El aseguramiento de calidad (QA) se enfoca en aspectos formales del desarrollo de software, tales como adherirse a estándares de codificación o a una metodología de desarrollo específica. B. Fallar en las especificaciones de usuario implica que la ingeniería de requisitos se ha realizado para describir las demandas de los usuarios; de lo contrario, no habría una línea base de especificaciones contra la cual verificar. C. La gestión del proyecto falló al no establecer o no verificar los controles que aseguran que el software en desarrollo se apegue a esas especificaciones de usuario. D. Una falla en cumplir las especificaciones de usuario podría manifestarse durante la capacitación del usuario o en las pruebas de aceptación, pero no es la causa.",
        justificacionEn: "A. Quality assurance (QA) has its focus on formal aspects of software development, such as adhering to coding standards or a specific development methodology. B. To fail at user specifications implies that requirements engineering has been done to describe the users' demands. Otherwise, there would not be a baseline of specifications against which to check. C. Project management failed to either set up or verify controls that provide for software or software modules under development that adhere to those user specifications. D. A failure to meet user specifications might show up during user training or acceptance testing but is not the cause."
      },
      {
        id: 9,
        pregunta: "Al introducir una arquitectura de cliente ligero (thin client), ¿qué tipo de riesgo de servidores aumenta significativamente?",
        preguntaEn: "When introducing a thin client architecture, which type of server risk increases significantly?",
        alternativas: [
          { id: "a", texto: "Integridad" },
          { id: "b", texto: "Concurrencia" },
          { id: "c", texto: "Confidencialidad" },
          { id: "d", texto: "Disponibilidad" }
        ],
        alternativasEn: [
          { id: "a", texto: "Integrity" },
          { id: "b", texto: "Concurrency" },
          { id: "c", texto: "Confidentiality" },
          { id: "d", texto: "Availability" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Debido a que los otros elementos no necesitan cambiar, el riesgo de integridad no se incrementa. B. Debido a que los otros elementos no necesitan cambiar, el riesgo de concurrencia no se incrementa. C. Debido a que los otros elementos no necesitan cambiar, el riesgo de confidencialidad no se incrementa. D. El cambio principal al usar una arquitectura de cliente ligero es hacer que los servidores sean críticos para la operación. Por lo tanto, la probabilidad de que uno de ellos falle se incrementa y, como resultado, el riesgo de disponibilidad aumenta.",
        justificacionEn: "A. Because the other elements do not need to change, the integrity risk is not increased. B. Because the other elements do not need to change, the concurrency risk is not increased. C. Because the other elements do not need to change, the confidentiality risk is not increased. D. The main change when using thin client architecture is making the servers critical to the operation. Therefore, the probability that one of them fails is increased and, as a result, the availability risk is increased."
      },
      {
        id: 10,
        pregunta: "¿Qué se asocia MÁS comúnmente con una metodología de desarrollo ágil?",
        preguntaEn: "What is MOST commonly associated with an agile development methodology?",
        alternativas: [
          { id: "a", texto: "Dependencia de documentación detallada" },
          { id: "b", texto: "Dependencia de procedimientos operativos estrictos" },
          { id: "c", texto: "Falta de requisitos de usuario" },
          { id: "d", texto: "Fuerte dependencia del conocimiento tácito" }
        ],
        alternativasEn: [
          { id: "a", texto: "Reliance on detailed documentation" },
          { id: "b", texto: "Reliance on strict standard operating procedures" },
          { id: "c", texto: "Lack of user requirements" },
          { id: "d", texto: "Strong reliance on tacit knowledge" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. La documentación del proyecto generalmente queda en segundo plano frente a la funcionalidad real para la metodología de desarrollo ágil. B. Procedimientos operativos estándar estrictos serían perjudiciales para la capacidad del desarrollador de pensar de forma creativa y colaborativa. C. Todas las metodologías de desarrollo requieren alguna forma de definición de requisitos. Ágil se basa en que los requisitos claros se definan por adelantado. D. El conocimiento tácito (es decir, el conocimiento implícito adquirido por la experiencia y difícil de documentar) es aprovechado enormemente por los métodos ágiles para aumentar la colaboración y la creatividad de los equipos de desarrollo.",
        justificacionEn: "A. Project documentation is generally second to actual functionality for agile development methodology. B. Strict standard operating procedures would be detrimental to a developer's ability to think creatively and collaboratively. C. All development methodologies require some form of requirements definition. Agile relies on clear requirements being defined up front. D. Tacit knowledge (i.e., implicit knowledge gained from experience and difficult to document) is leveraged greatly by agile methods to increase collaboration and creativity of development teams."
      }
    ],

    4: [
      {
        id: 1,
        pregunta: "¿Cuál es el MEJOR método para determinar el nivel de desempeño de instalaciones de procesamiento de información (IPF) similares?",
        preguntaEn: "What is the BEST method for determining the performance level of similar information processing facilities (IPF)?",
        alternativas: [
          { id: "a", texto: "Satisfacción del usuario" },
          { id: "b", texto: "Logro de metas" },
          { id: "c", texto: "Benchmarking" },
          { id: "d", texto: "Planificación de capacidad y crecimiento" }
        ],
        alternativasEn: [
          { id: "a", texto: "User satisfaction" },
          { id: "b", texto: "Goal accomplishment" },
          { id: "c", texto: "Benchmarking" },
          { id: "d", texto: "Capacity and growth planning" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. La satisfacción del usuario es la medida para asegurar que una operación eficaz de procesamiento de información cumpla con los requisitos del usuario. B. El cumplimiento de metas evalúa la efectividad implicada al comparar el desempeño con metas predefinidas. C. La evaluación comparativa (benchmarking) proporciona un medio para determinar el nivel de desempeño ofrecido por entornos similares de centros de procesamiento de información (IPF). D. La planificación de capacidad y crecimiento es esencial debido a la importancia de TI en las organizaciones y al cambio tecnológico constante.",
        justificacionEn: "A. User satisfaction is the measure to ensure that an effective information processing operation meets user requirements. B. Goal accomplishment evaluates the effectiveness involved in comparing performance with predefined goals. C. Benchmarking provides a means of determining the level of performance offered by similar information processing facility (IPF) environments. D. Capacity and growth planning are essential due to the importance of IT in organizations and the constant technological change."
      },
      {
        id: 2,
        pregunta: "Para sistemas de misión crítica con baja tolerancia a interrupciones y alto costo de recuperación, ¿qué opción de recuperación se recomienda en principio?",
        preguntaEn: "For mission-critical systems with low tolerance for disruption and high recovery cost, which recovery option is principally recommended?",
        alternativas: [
          { id: "a", texto: "Sitio móvil" },
          { id: "b", texto: "Sitio cálido (warm)" },
          { id: "c", texto: "Sitio frío (cold)" },
          { id: "d", texto: "Sitio caliente (hot site)" }
        ],
        alternativasEn: [
          { id: "a", texto: "Mobile site" },
          { id: "b", texto: "Warm site" },
          { id: "c", texto: "Cold site" },
          { id: "d", texto: "Hot site" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Los sitios móviles son tráileres especialmente diseñados que pueden transportarse rápidamente a una ubicación de la empresa o a un sitio alterno para proporcionar un centro de procesamiento de información (IPF) previamente acondicionado. B. Los sitios templados (warm sites) están parcialmente configurados, por lo general con conexiones de red y equipos periféricos seleccionados, pero sin la computadora principal. C. Los sitios en frío (cold sites) solo cuentan con el entorno básico para operar un IPF. Están listos para recibir equipo, pero no ofrecen ningún componente en el sitio antes de presentarse la necesidad. D. Los sitios en caliente (hot sites) están completamente configurados y listos para operar en unas pocas horas o, en algunos casos, incluso minutos.",
        justificacionEn: "A. Mobile sites are specially designed trailers that can be quickly transported to a business location or to an alternate site to provide a ready-conditioned information processing facility (IPF). B. Warm sites are partially configured, usually with network connections and selected peripheral equipment—such as disk drives and controllers—but without the main computer. C. Cold sites have only the basic environment to operate an IPF. Cold sites are ready to receive equipment but do not offer any components at the site before the need. D. Hot sites are fully configured and ready to operate within several hours or, in some cases, even minutes."
      },
      {
        id: 3,
        pregunta: "¿Cuál es el método MÁS eficaz para probar el proceso de gestión de cambios de programas?",
        preguntaEn: "What is the MOST effective method for testing the program change management process?",
        alternativas: [
          { id: "a", texto: "Rastrear desde información generada por el sistema hacia la documentación de gestión de cambios" },
          { id: "b", texto: "Examinar la documentación en busca de evidencia de exactitud" },
          { id: "c", texto: "Rastrear desde la documentación hacia una pista de auditoría del sistema" },
          { id: "d", texto: "Examinar la documentación en busca de evidencia de completitud" }
        ],
        alternativasEn: [
          { id: "a", texto: "Trace from system-generated information to change management documentation" },
          { id: "b", texto: "Examine documentation for evidence of accuracy" },
          { id: "c", texto: "Trace from documentation to a system audit trail" },
          { id: "d", texto: "Examine documentation for evidence of completeness" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Al probar la gestión de cambios, el auditor de SI debe comenzar con la información generada por el sistema, que contiene la fecha y la hora en que un módulo se actualizó por última vez, y rastrear desde allí hacia la documentación que autoriza el cambio. B. Enfocarse exclusivamente en la exactitud de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados. C. Rastrear en la dirección opuesta correría el riesgo de no detectar cambios indocumentados. D. Enfocarse exclusivamente en la exhaustividad (completeness) de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados.",
        justificacionEn: "A. When testing change management, the information systems (IS) auditor should start with system-generated information, containing the date and time a module was last updated, and trace from there to the documentation authorizing the change. B. Focusing exclusively on the accuracy of the documentation examined does not ensure that all changes were, in fact, documented. C. To trace in the opposite direction would run the risk of not detecting undocumented changes. D. Focusing exclusively on the completeness of the documentation examined does not ensure that all changes were, in fact, documented."
      },
      {
        id: 4,
        pregunta: "¿Qué permitiría a una empresa extender su intranet a través de Internet hacia sus socios de negocio?",
        preguntaEn: "What would allow an enterprise to extend its intranet through the Internet to its business partners?",
        alternativas: [
          { id: "a", texto: "Red privada virtual (VPN)" },
          { id: "b", texto: "Cliente-servidor" },
          { id: "c", texto: "Acceso dial-up" },
          { id: "d", texto: "Proveedor de servicios de red (NSP)" }
        ],
        alternativasEn: [
          { id: "a", texto: "Virtual private network (VPN)" },
          { id: "b", texto: "Client-server" },
          { id: "c", texto: "Dial-up access" },
          { id: "d", texto: "Network service provider (NSP)" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La tecnología de red privada virtual (VPN) permite a los socios externos participar de forma segura en la extranet utilizando redes públicas como transporte. Las VPN se basan en técnicas de tunelización/encapsulamiento, las cuales permiten que el Protocolo de Internet (IP) transporte una variedad de protocolos diferentes. B. Cliente-servidor se refiere a un grupo de computadoras dentro de una organización conectadas por una red interna donde el cliente es la máquina solicitante y el servidor es la máquina proveedora; no aborda la extensión de la red hacia los socios comerciales. C. Aunque técnicamente sea posible extender la intranet mediante acceso telefónico (dial-up), no sería práctico ni rentable hacerlo. D. Un proveedor de servicios de red puede brindar servicios a una red privada compartida al proporcionar servicios de Internet, pero no extiende la intranet de una organización.",
        justificacionEn: "A. Virtual private network (VPN) technology allows external partners to securely participate in the extranet using public networks as a transport. VPNs rely on tunneling/encapsulation techniques, which allow the Internet Protocol (IP) to carry a variety of different protocols. B. Client-server does not address extending the network to business partners. C. Although it may be technically possible for an enterprise to extend its intranet using dial-up access, it would not be practical or cost effective to do so. D. A network service provider may provide services to a shared private network by providing Internet services, but it does not extend an organization's intranet."
      },
      {
        id: 5,
        pregunta: "La clasificación por criticidad de una aplicación en un plan de continuidad del negocio se determina por:",
        preguntaEn: "The criticality classification of an application in a business continuity plan is determined by:",
        alternativas: [
          { id: "a", texto: "La naturaleza del negocio y el valor de la aplicación para el negocio" },
          { id: "b", texto: "El costo de reemplazo" },
          { id: "c", texto: "El soporte del proveedor disponible" },
          { id: "d", texto: "Las amenazas y vulnerabilidades asociadas" }
        ],
        alternativasEn: [
          { id: "a", texto: "The nature of the business and the value of the application to the business" },
          { id: "b", texto: "The replacement cost of the application" },
          { id: "c", texto: "Available vendor support" },
          { id: "d", texto: "The associated threats and vulnerabilities" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La clasificación de criticidad está determinada por el rol del sistema de aplicación en el respaldo de la estrategia de la organización. B. El costo de reposición de la aplicación no refleja el valor relativo de la aplicación para el negocio. C. El soporte del proveedor no es un factor relevante para determinar la clasificación de criticidad. D. Las amenazas y vulnerabilidades asociadas se evaluarán únicamente si la aplicación es crítica para el negocio.",
        justificacionEn: "A. The criticality classification is determined by the role of the application system in supporting the strategy of the organization. B. The replacement cost of the application does not reflect the relative value of the application to the business. C. Vendor support is not a relevant factor for determining the criticality classification. D. The associated threats and vulnerabilities will be evaluated only if the application is critical to the business."
      },
      {
        id: 6,
        pregunta: "Al auditar la seguridad de bases de datos cliente-servidor, la MAYOR preocupación es la disponibilidad de:",
        preguntaEn: "When auditing client-server database security, the GREATEST concern is the availability of:",
        alternativas: [
          { id: "a", texto: "Utilidades del sistema" },
          { id: "b", texto: "Generadores de programas de aplicación" },
          { id: "c", texto: "Documentación de seguridad de sistemas" },
          { id: "d", texto: "Acceso a procedimientos almacenados" }
        ],
        alternativasEn: [
          { id: "a", texto: "System utilities" },
          { id: "b", texto: "Application program generators" },
          { id: "c", texto: "Security documentation" },
          { id: "d", texto: "Access to stored procedures" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Las utilidades del sistema pueden permitir que se realicen cambios no autorizados en los datos de la base de datos cliente-servidor. En una auditoría de seguridad de bases de datos, los controles sobre tales utilidades serían la principal preocupación del auditor de SI. B. Los generadores de programas de aplicación son una parte intrínseca de la tecnología cliente-servidor, y el auditor de SI evaluaría los controles sobre los derechos de acceso del generador a la base de datos en lugar de su disponibilidad. C. La documentación de seguridad debe restringirse al personal de seguridad autorizado, pero esta no es una preocupación principal. D. El acceso a los procedimientos almacenados no es una preocupación principal.",
        justificacionEn: "A. System utilities may enable unauthorized changes to be made to data on the client-server database. In an audit of database security, the controls over such utilities would be the primary concern of the information systems (IS) auditor. B. Application program generators are an intrinsic part of client-server technology, and the IS auditor would evaluate the controls over the generator's access rights to the database rather than their availability. C. Security documentation should be restricted to authorized security staff, but this is not a primary concern. D. Access to stored procedures is not a primary concern."
      },
      {
        id: 7,
        pregunta: "Al revisar una red usada para comunicaciones por Internet, el auditor PRIMERO examinará:",
        preguntaEn: "When reviewing a network used for Internet communications, the auditor will FIRST examine:",
        alternativas: [
          { id: "a", texto: "La validez de los cambios de contraseña" },
          { id: "b", texto: "La arquitectura de la aplicación cliente-servidor" },
          { id: "c", texto: "La arquitectura y diseño de la red" },
          { id: "d", texto: "La protección de firewall y servidores proxy" }
        ],
        alternativasEn: [
          { id: "a", texto: "The validity of password changes" },
          { id: "b", texto: "The client-server application architecture" },
          { id: "c", texto: "The network architecture and design" },
          { id: "d", texto: "The firewall and proxy server protection" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. La revisión de la validez de los cambios de contraseñas se realizaría como parte de las pruebas sustantivas. B. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas de información y la arquitectura de acceso, incluyendo las aplicaciones cliente-servidor. C. El primer paso al auditar una red es comprender la arquitectura y el diseño de la red. Esto proporciona una imagen general de la red y su conectividad. D. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas, tales como servidores proxy y firewalls.",
        justificacionEn: "A. Reviewing the validity of password changes would be performed as part of substantive testing. B. Understanding the network architecture and design is the starting point for identifying the various layers of information and the access architecture across the various layers, such as client-server applications. C. The first step in auditing a network is to understand the network architecture and design. Understanding the network architecture and design provides an overall picture of the network and its connectivity. D. Understanding the network architecture and design is the starting point for identifying the various layers of information and the access architecture across the various layers, such as proxy servers and firewalls."
      },
      {
        id: 8,
        pregunta: "El auditor de SI debe involucrarse en:",
        preguntaEn: "The IS auditor should be involved in:",
        alternativas: [
          { id: "a", texto: "Observar las pruebas del plan de recuperación ante desastres (DRP)" },
          { id: "b", texto: "Desarrollar el DRP" },
          { id: "c", texto: "Mantener el DRP" },
          { id: "d", texto: "Revisar los requisitos de recuperación de contratos de proveedores" }
        ],
        alternativasEn: [
          { id: "a", texto: "Observing disaster recovery plan (DRP) testing" },
          { id: "b", texto: "Developing the DRP" },
          { id: "c", texto: "Maintaining the DRP" },
          { id: "d", texto: "Reviewing recovery requirements in supplier contracts" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El auditor de SI siempre debe estar presente cuando se prueban los planes de recuperación ante desastres (DRP) para asegurar que los procedimientos de recuperación probados alcancen los objetivos requeridos de restauración, que los procedimientos de recuperación sean efectivos y eficientes, y para informar sobre los resultados según corresponda. B. Los auditores de SI pueden participar en la supervisión del desarrollo del plan, pero es poco probable que participen en el proceso de desarrollo en sí. C. Se puede llevar a cabo una auditoría de los procedimientos de mantenimiento del plan, pero el auditor de SI normalmente no tendría ninguna responsabilidad sobre el mantenimiento en sí. D. A un auditor de SI se le puede pedir que comente sobre varios elementos de un contrato de proveedor, pero este no siempre es el caso.",
        justificacionEn: "A. The information systems (IS) auditor should always be present when disaster recovery plans (DRP) are tested to ensure that the tested recovery procedures meet the required targets for restoration, that recovery procedures are effective and efficient, and to report on the results as appropriate. B. IS auditors may be involved in overseeing plan development, but they are unlikely to be involved in the actual development process. C. Similarly, an audit of plan maintenance procedures may be conducted, but the IS auditor normally would not have any responsibility for the actual maintenance. D. An IS auditor may be asked to comment upon various elements of a supplier contract, but this is not always the case."
      },
      {
        id: 9,
        pregunta: "La duplicación (mirroring) de datos debe implementarse como estrategia de recuperación cuando:",
        preguntaEn: "Data mirroring should be implemented as a recovery strategy when:",
        alternativas: [
          { id: "a", texto: "El RPO es bajo" },
          { id: "b", texto: "El RPO es alto" },
          { id: "c", texto: "El RTO es alto" },
          { id: "d", texto: "La tolerancia al desastre es alta" }
        ],
        alternativasEn: [
          { id: "a", texto: "The RPO is low" },
          { id: "b", texto: "The RPO is high" },
          { id: "c", texto: "The RTO is high" },
          { id: "d", texto: "Disaster tolerance is high" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El objetivo de punto de recuperación (RPO) indica la antigüedad de los datos recuperados. Si el RPO es muy bajo, como minutos, significa que la organización no puede darse el lujo de perder siquiera unos pocos minutos de datos. En tales casos, la duplicación de datos (replicación sincrónica) debe utilizarse como estrategia de recuperación. B. Si el RPO es alto, como horas, entonces se podrían utilizar otros procedimientos de respaldo. C. Un objetivo de tiempo de recuperación (RTO) alto significa que el sistema de TI puede no ser necesario inmediatamente después de la interrupción; puede recuperarse más tarde. D. El RTO es el tiempo a partir de la interrupción durante el cual el negocio puede tolerar la indisponibilidad de las instalaciones de TI. Si el RTO es alto, se pueden utilizar estrategias de recuperación más lentas.",
        justificacionEn: "A. Recovery point objective (RPO) is the earliest point in time at which it is acceptable to recover the data. If RPO is very low, such as minutes, it means that the organization cannot afford to lose even a few minutes of data. In such cases, data mirroring (synchronous data replication) should be used as a recovery strategy. B. If RPO is high, such as hours, then other backup procedures could be used. C. A high recovery time objective (RTO) means that the IT system may not be needed immediately after the disruption/declaration of disaster (i.e., it can be recovered later). D. RTO is the time from the disruption/declaration of disaster during which the business can tolerate the nonavailability of IT facilities. If RTO is high, slower recovery strategies that bring up IT systems and facilities can be used."
      },
      {
        id: 10,
        pregunta: "¿Qué componente de un BCP es PRINCIPALMENTE responsabilidad del departamento de TI de la organización?",
        preguntaEn: "Which component of a BCP is PRIMARILY the responsibility of the organization's IT department?",
        alternativas: [
          { id: "a", texto: "Desarrollar el BCP" },
          { id: "b", texto: "Seleccionar y aprobar las estrategias de recuperación" },
          { id: "c", texto: "Declarar un desastre" },
          { id: "d", texto: "Restaurar los sistemas y datos de TI después de un desastre" }
        ],
        alternativasEn: [
          { id: "a", texto: "Developing the BCP" },
          { id: "b", texto: "Selecting and approving recovery strategies" },
          { id: "c", texto: "Declaring a disaster" },
          { id: "d", texto: "Restoring IT systems and data after a disaster" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Los miembros de la alta gerencia de la organización son los principales responsables de supervisar el desarrollo del plan de continuidad del negocio (BCP) y son responsables de los resultados (accountable). B. La gerencia también es responsable de seleccionar y aprobar las estrategias utilizadas para la recuperación ante desastres. C. TI puede estar involucrado en la declaración de un desastre, pero no es el responsable principal. D. El departamento de TI de una organización es el principal responsable de restaurar los sistemas y datos de TI después de un desastre dentro de los plazos designados.",
        justificacionEn: "A. Members of the organization's senior management are primarily responsible for overseeing the development of the business continuity plan (BCP) and are accountable for the results. B. Management is also accountable for selecting and approving the strategies used for disaster recovery. C. IT may be involved in declaring a disaster but is not primarily responsible. D. The IT department of an organization is primarily responsible for restoring the IT systems and data after a disaster within the designated timeframes."
      }
    ],

    5: [
      {
        id: 1,
        pregunta: "Al revisar la configuración de un sistema de detección de intrusos (IDS) basado en firmas, ¿qué preocuparía MÁS al auditor?",
        preguntaEn: "When reviewing the configuration of a signature-based intrusion detection system (IDS), what would MOST concern the auditor?",
        alternativas: [
          { id: "a", texto: "La autoactualización está desactivada" },
          { id: "b", texto: "El escaneo de vulnerabilidades de aplicación está desactivado" },
          { id: "c", texto: "El análisis de paquetes cifrados está desactivado" },
          { id: "d", texto: "El IDS está ubicado entre la DMZ y el firewall" }
        ],
        alternativasEn: [
          { id: "a", texto: "Automatic signature updates are disabled" },
          { id: "b", texto: "Application vulnerability scanning is disabled" },
          { id: "c", texto: "Encrypted packet analysis is disabled" },
          { id: "d", texto: "The IDS is placed between the DMZ and the firewall" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El aspecto más importante de un sistema de detección de intrusos (IDS) basado en firmas es su capacidad para proteger contra patrones de intrusión conocidos (firmas); dichas firmas son provistas por el proveedor y son fundamentales para proteger a la empresa frente a ataques externos. B. Una de las desventajas clave de un IDS es su incapacidad inherente para escanear en busca de vulnerabilidades a nivel de aplicación. C. Un IDS no puede descifrar paquetes de datos cifrados para identificar el origen del tráfico entrante. D. Una zona desmilitarizada (DMZ) es un segmento de red interno en el que se alojan los sistemas accesibles al público; para proporcionar la mayor seguridad y eficiencia, un IDS debe colocarse detrás del firewall para que detecte solo aquellos ataques/intrusos que logran entrar a través del firewall.",
        justificacionEn: "A. The most important aspect of a signature-based intrusion detection system (IDS) is its ability to protect against known (signature) intrusion patterns. Such signatures are provided by the vendor and are critical to protecting an enterprise from outside attacks. B. One of the key disadvantages of an IDS is its inherent inability to scan for vulnerabilities at the application level. C. An IDS cannot break encrypted data packets to identify the source of the incoming traffic. D. A demilitarized zone (DMZ) is an internal network segment in which systems accessible to the public are housed. An IDS should be placed behind the firewall so that it will detect only those attacks/intruders that enter the firewall."
      },
      {
        id: 2,
        pregunta: "¿Qué provee MEJOR el control de acceso a datos de nómina procesados en un servidor local?",
        preguntaEn: "Which BEST provides access control to payroll data processed on a local server?",
        alternativas: [
          { id: "a", texto: "Registrar el acceso a información personal" },
          { id: "b", texto: "Usar contraseñas separadas para transacciones sensibles" },
          { id: "c", texto: "Usar software que restrinja las reglas de acceso al personal autorizado" },
          { id: "d", texto: "Restringir el acceso del sistema al horario laboral" }
        ],
        alternativasEn: [
          { id: "a", texto: "Logging access to personal information" },
          { id: "b", texto: "Using separate passwords for sensitive transactions" },
          { id: "c", texto: "Using software that restricts access rules to authorized staff" },
          { id: "d", texto: "Restricting system access to business hours" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Registrar el acceso a la información personal es un buen control ya que permitirá analizar el acceso en caso de preocupación sobre accesos no autorizados; sin embargo, no prevendrá el acceso. B. Restringir el acceso a transacciones sensibles solo restringirá el acceso a una parte de los datos; no prevendrá el acceso a los demás datos. C. La seguridad del servidor y del sistema debe definirse para permitir únicamente que los miembros del personal autorizados accedan a la información sobre el personal cuyos registros gestionan en el día a día. D. Restringir el acceso al sistema al horario comercial solo afectaría el momento en que podría ocurrir un acceso no autorizado y no prevendría dicho acceso en otros momentos.",
        justificacionEn: "A. Logging access to personal information is a good control in that it will allow access to be analyzed if there is concern over unauthorized access. However, it will not prevent access. B. Restricting access to sensitive transactions will restrict access only to some of the data. It will not prevent access to other data. C. The server and system security should be defined to allow only authorized staff members access to information about the staff whose records they handle on a day-to-day basis. D. Restricting system access to business hours would only affect when unauthorized access could occur and would not prevent such access at other times."
      },
      {
        id: 3,
        pregunta: "En una organización con un mainframe y dos servidores de base de datos donde residen todos los datos de producción, ¿qué debilidad sería la MÁS seria?",
        preguntaEn: "In an organization with a mainframe and two database servers where all production data resides, which weakness would be MOST serious?",
        alternativas: [
          { id: "a", texto: "El oficial de seguridad también es el DBA" },
          { id: "b", texto: "No hay controles de contraseña en los dos servidores de base de datos" },
          { id: "c", texto: "No hay BCP para aplicaciones no críticas del mainframe" },
          { id: "d", texto: "Las LAN no respaldan regularmente los discos de servidor de archivos" }
        ],
        alternativasEn: [
          { id: "a", texto: "The security officer is also the DBA" },
          { id: "b", texto: "No password controls exist on the two database servers" },
          { id: "c", texto: "No BCP exists for noncritical mainframe applications" },
          { id: "d", texto: "LANs do not regularly back up file server disks" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Que el oficial de seguridad se desempeñe también como administrador de base de datos, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. B. La ausencia de controles de contraseñas en los dos servidores de bases de datos, donde residen los datos de producción, es la debilidad más crítica. C. No tener un plan de continuidad de negocio (BCP) para las aplicaciones no críticas del sistema mainframe, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. D. Que las redes de área local (LAN) no realicen copias de seguridad de los discos fijos de los servidores de archivos con regularidad, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas.",
        justificacionEn: "A. The security officer serving as the database administrator, while a control weakness, does not carry the same disastrous impact as the absence of password controls. B. The absence of password controls on the two database servers, where production data resides, is the most critical weakness. C. Having no business continuity plan (BCP) for the mainframe system's noncritical applications, while a control weakness, does not carry the same disastrous impact as the absence of password controls. D. Local area networks (LANs) not backing up regularly, while a control weakness, does not carry the same disastrous impact as the absence of password controls."
      },
      {
        id: 4,
        pregunta: "Al implementar inicio de sesión único (SSO) en todos los sistemas, la organización debe saber que:",
        preguntaEn: "When implementing single sign-on (SSO) across all systems, the organization should be aware that:",
        alternativas: [
          { id: "a", texto: "El acceso no autorizado máximo sería posible si se divulga una contraseña" },
          { id: "b", texto: "Los derechos de acceso se restringirían por parámetros de seguridad adicionales" },
          { id: "c", texto: "La carga del administrador de seguridad aumentaría" },
          { id: "d", texto: "Los derechos de acceso del usuario aumentarían" }
        ],
        alternativasEn: [
          { id: "a", texto: "Maximum unauthorized access would be possible if a password is disclosed" },
          { id: "b", texto: "Access rights would be restricted by additional security parameters" },
          { id: "c", texto: "The security administrator workload would increase" },
          { id: "d", texto: "User access rights would increase" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Si se revela una contraseña cuando el inicio de sesión único (SSO) está habilitado, existe el riesgo de que sea posible el acceso no autorizado a todos los sistemas. B. Los derechos de acceso de los usuarios deben permanecer sin cambios con el SSO, ya que es posible que no se implementen parámetros de seguridad adicionales. C. Uno de los beneficios previstos del SSO es la simplificación de la administración de la seguridad. D. Uno de los beneficios previstos del SSO es la improbabilidad de un incremento en la carga de trabajo.",
        justificacionEn: "A. If a password is disclosed when single sign-on (SSO) is enabled, there is a risk that unauthorized access to all systems will be possible. B. User access rights should remain unchanged by SSO, as additional security parameters might not be implemented. C. One of the intended benefits of SSO is the simplification of security administration. D. One of the intended benefits of SSO is the unlikelihood of an increased workload."
      },
      {
        id: 5,
        pregunta: "Al revisar una implementación de VoIP en una WAN corporativa, el auditor debería esperar encontrar:",
        preguntaEn: "When reviewing a VoIP implementation on a corporate WAN, the auditor should expect to find:",
        alternativas: [
          { id: "a", texto: "Ingeniería de tráfico" },
          { id: "b", texto: "Un enlace de datos ISDN" },
          { id: "c", texto: "Cifrado WEP de los datos" },
          { id: "d", texto: "Terminales telefónicos analógicos" }
        ],
        alternativasEn: [
          { id: "a", texto: "Traffic engineering" },
          { id: "b", texto: "An ISDN data link" },
          { id: "c", texto: "WEP encryption of the data" },
          { id: "d", texto: "Analog telephone terminals" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Para garantizar que se cumplan los requisitos de calidad de servicio (QoS), el servicio de VoIP a través de la WAN debe protegerse frente a pérdidas de paquetes, latencia o fluctuación (jitter); para alcanzar este objetivo, el rendimiento de la red se puede gestionar a fin de proporcionar QoS mediante el uso de técnicas estadísticas, como la ingeniería de tráfico (traffic engineering). B. El ancho de banda estándar de un enlace de datos de red digital de servicios integrados (ISDN) no proporcionaría la QoS requerida para los servicios corporativos de VoIP. C. WEP (Wired Equivalent Privacy) es un esquema de cifrado relacionado con redes inalámbricas. D. Los teléfonos VoIP generalmente están conectados a una red de área local (LAN) corporativa y no son analógicos.",
        justificacionEn: "A. To ensure that quality of service (QoS) requirements is achieved, the Voice over Internet Protocol (VoIP) service over the wide area network should be protected from packet losses, latency or jitter. To reach this objective, network performance can be managed to provide QoS and class of service support using statistical techniques, such as traffic engineering. B. The standard bandwidth of an integrated services digital network (ISDN) data link would not provide the QoS required for corporate VoIP services. C. Wired equivalent privacy is an encryption scheme related to wireless networking. D. VoIP phones are usually connected to a corporate local area network (LAN) and are not analog."
      },
      {
        id: 6,
        pregunta: "Una aseguradora usa nube pública para una aplicación crítica para reducir costos. ¿Qué preocuparía MÁS al auditor?",
        preguntaEn: "An insurance company uses a public cloud for a critical application to reduce costs. What would MOST concern the auditor?",
        alternativas: [
          { id: "a", texto: "Incapacidad de recuperar el servicio ante una falla técnica mayor" },
          { id: "b", texto: "Que los datos en el entorno compartido sean accedidos por otras empresas" },
          { id: "c", texto: "Que el proveedor no incluya soporte investigativo para incidentes" },
          { id: "d", texto: "La viabilidad a largo plazo del proveedor" }
        ],
        alternativasEn: [
          { id: "a", texto: "Inability to recover the service after a major technical failure" },
          { id: "b", texto: "Data in the shared environment being accessed by other companies" },
          { id: "c", texto: "The provider not including investigative support for incidents" },
          { id: "d", texto: "The long-term viability of the provider" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los beneficios de la computación en la nube son la redundancia y la capacidad de acceder a los sistemas y datos en caso de una falla técnica. B. Considerando que una compañía de seguros debe preservar la privacidad y la confidencialidad de la información del cliente, el acceso no autorizado a la información y las fugas de datos son las principales preocupaciones. C. La capacidad de investigar un incidente es importante, pero lo más importante es abordar el riesgo de un incidente: la exposición de datos confidenciales. D. Si un proveedor de servicios en la nube quiebra, los datos aún deberían estar disponibles a partir de las copias de seguridad.",
        justificacionEn: "A. Benefits of cloud computing are redundancy and the ability to access systems and data in the event of a technical failure. B. Considering that an insurance company must preserve the privacy/confidentiality of customer information, unauthorized access to information and data leakage are the major concerns. C. The ability to investigate an incident is important, but most important is addressing the risk of an incident: the exposure of sensitive data. D. If a cloud provider goes out of business, the data should still be available from backups."
      },
      {
        id: 7,
        pregunta: "¿Qué determina MEJOR si existen protocolos completos de cifrado y autenticación para proteger la información en tránsito?",
        preguntaEn: "What BEST determines whether complete encryption and authentication protocols exist to protect information in transit?",
        alternativas: [
          { id: "a", texto: "Firma digital con RSA" },
          { id: "b", texto: "Trabajo en modo túnel con los servicios anidados de AH y ESP" },
          { id: "c", texto: "Certificados digitales con RSA" },
          { id: "d", texto: "Trabajo en modo transporte con AH y ESP anidados" }
        ],
        alternativasEn: [
          { id: "a", texto: "A digital signature with RSA" },
          { id: "b", texto: "Tunnel mode with nested AH and ESP services" },
          { id: "c", texto: "A digital certificate with RSA" },
          { id: "d", texto: "Transport mode with nested AH and ESP" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Una firma digital proporciona autenticación e integridad. B. El modo túnel (tunnel mode) proporciona cifrado y autenticación del paquete completo del Protocolo de Internet (IP); para lograr esto, los servicios de cabecera de autenticación (AH) y de carga útil de seguridad encapsuladora (ESP) se pueden anidar. C. Un certificado digital proporciona autenticación e integridad. D. El modo de transporte proporciona protección primaria para las capas superiores de los protocolos (es decir, la protección se extiende al campo de datos [carga útil o payload] de un paquete IP).",
        justificacionEn: "A. A digital signature provides authentication and integrity. B. Tunnel mode provides encryption and authentication of the complete IP package. To accomplish this, the authentication header (AH) and encapsulating security payload (ESP) services can be nested. C. A digital certificate provides authentication and integrity. D. The transport mode provides primary protection for the protocols' higher layers (i.e., protection extends to the data field [payload] of an IP package)."
      },
      {
        id: 8,
        pregunta: "¿Qué preocupación de seguridad de un mensaje electrónico abordan las firmas digitales?",
        preguntaEn: "Which electronic message security concern do digital signatures address?",
        alternativas: [
          { id: "a", texto: "Alteración" },
          { id: "b", texto: "Lectura no autorizada" },
          { id: "c", texto: "Robo" },
          { id: "d", texto: "Copia no autorizada" }
        ],
        alternativasEn: [
          { id: "a", texto: "Alteration" },
          { id: "b", texto: "Unauthorized reading" },
          { id: "c", texto: "Theft" },
          { id: "d", texto: "Unauthorized copying" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Una firma digital incluye un total hash cifrado del tamaño del mensaje tal como fue transmitido por su originador; este hash ya no sería exacto si el mensaje se alterara posteriormente, indicando así que la alteración ha ocurrido. B. Las firmas digitales no identificarán, evitarán ni disuadirán la lectura no autorizada. C. Las firmas digitales no identificarán, evitarán ni disuadirán el robo. D. Las firmas digitales no identificarán, evitarán ni disuadirán la copia no autorizada.",
        justificacionEn: "A. A digital signature includes an encrypted hash total of the size of the message as it was transmitted by its originator. This hash would no longer be accurate if the message were subsequently altered, indicating that the alteration had occurred. B. Digital signatures will not identify, prevent or deter unauthorized reading. C. Digital signatures will not identify, prevent or deter theft. D. Digital signatures will not identify, prevent or deter unauthorized copying."
      },
      {
        id: 9,
        pregunta: "¿Qué caracteriza un ataque de denegación de servicio distribuido (DDoS)?",
        preguntaEn: "What characterizes a distributed denial of service (DDoS) attack?",
        alternativas: [
          { id: "a", texto: "Iniciación central de computadoras intermediarias para dirigir tráfico espurio simultáneo a un sitio objetivo específico" },
          { id: "b", texto: "Iniciación local de computadoras intermediarias hacia múltiples sitios" },
          { id: "c", texto: "Iniciación central de una computadora primaria hacia múltiples sitios objetivo" },
          { id: "d", texto: "Iniciación local con tráfico escalonado" }
        ],
        alternativasEn: [
          { id: "a", texto: "Centrally initiated intermediate computers directing simultaneous spurious traffic at a specific target site" },
          { id: "b", texto: "Locally initiated intermediate computers toward multiple sites" },
          { id: "c", texto: "Centrally initiated primary computer targeting multiple sites" },
          { id: "d", texto: "Locally initiated with staggered traffic" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Esto describe de la mejor manera un ataque de denegación de servicio distribuido (DDoS); tales ataques se inician de forma centralizada e involucran el uso de múltiples computadoras comprometidas, operando mediante la inundación del sitio objetivo con tráfico de mensajes espurios para sobrecargar la red; para lograr este objetivo, los ataques deben dirigirse a un objetivo específico y ocurrir simultáneamente. B. Los ataques DDoS no se inician localmente. C. Los ataques DDoS no se inician utilizando una computadora primaria única. D. Los ataques DDoS no son escalonados (staggered).",
        justificacionEn: "A. This best describes a distributed denial of service (DDoS) attack. Such attacks are centrally initiated and involve the use of multiple compromised computers. The attacks work by flooding the target site with spurious data, thereby overwhelming the network and other related resources. To achieve this objective, the attacks need to be directed at a specific target and occur simultaneously. B. DDoS attacks are not locally initiated. C. DDoS attacks are not initiated using a primary computer. D. DDoS attacks are not staggered."
      },
      {
        id: 10,
        pregunta: "¿Cuál es el control antivirus preventivo MÁS eficaz?",
        preguntaEn: "What is the MOST effective preventive antivirus control?",
        alternativas: [
          { id: "a", texto: "Escanear los adjuntos de correo en el servidor de correo" },
          { id: "b", texto: "Restaurar sistemas desde copias limpias" },
          { id: "c", texto: "Deshabilitar los puertos USB" },
          { id: "d", texto: "Escaneo antivirus en línea con definiciones actualizadas" }
        ],
        alternativasEn: [
          { id: "a", texto: "Scanning email attachments on the mail server" },
          { id: "b", texto: "Restoring systems from clean copies" },
          { id: "c", texto: "Disabling USB ports" },
          { id: "d", texto: "Online antivirus scanning with updated definitions" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. El escaneo de archivos adjuntos de correo electrónico en el servidor de correo es un control preventivo; evitará que los destinatarios abran archivos de correo electrónico infectados, lo que causaría la infección de sus equipos. B. Restaurar los sistemas a partir de copias limpias garantizará que no se introduzcan virus provenientes de copias o respaldos infectados. C. Deshabilitar los puertos USB evita que se copien archivos infectados desde una unidad USB hacia un equipo. D. El software antivirus se puede utilizar para prevenir ataques de virus; la ejecución de análisis regulares es útil para detectar infecciones por virus que ya han ocurrido; se requieren actualizaciones regulares del software para garantizar que pueda detectar y tratar los virus a medida que surgen.",
        justificacionEn: "A. Scanning email attachments on the mail server is a preventive control. It will prevent infected email files from being opened by the recipients, which would cause their machines to become infected. B. Restoring systems from clean copies is a preventive control. It will ensure that viruses are not introduced from infected copies or backups, which would reinfect machines. C. Disabling universal serial bus (USB) ports is a preventive control. It prevents infected files from being copied from a USB drive onto a machine, which would cause the machine to become infected. D. Antivirus software can be used to prevent virus attacks. Running regular scans is useful to detect virus infections that have already occurred. Regular updates of the software are required to ensure it can update, detect and treat viruses as they emerge."
      }
    ]
  },

  casos: {

    1: [
      {
        id: 1,
        pregunta: "¿Qué debe hacer el auditor de SI PRIMERO?",
        preguntaEn: "What should the IS auditor do FIRST?",
        alternativas: [
          { id: "a", texto: "Auditoría de encuesta de controles de acceso lógico" },
          { id: "b", texto: "Revisar el plan de auditoría hacia un enfoque basado en riesgo" },
          { id: "c", texto: "Realizar una evaluación de riesgo de TI" },
          { id: "d", texto: "Comenzar a probar los controles que considere más críticos" }
        ],
        alternativasEn: [
          { id: "a", texto: "Perform a survey audit of logical access controls" },
          { id: "b", texto: "Revise the audit plan to focus on risk-based auditing" },
          { id: "c", texto: "Perform an IT risk assessment" },
          { id: "d", texto: "Begin testing controls the IS auditor feels are most critical" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Realizar una auditoría de encuesta de controles de acceso lógico ocurriría después de una evaluación de riesgos de TI. B. Revisar el plan de auditoría para enfocarse en una auditoría basada en riesgos ocurriría después de una evaluación de riesgos de TI. C. Se debe realizar primero una evaluación de riesgos de TI para determinar qué áreas presentan el mayor riesgo y qué controles mitigan ese riesgo. Aunque se han creado narrativas y flujos de procesos, la organización aún no ha evaluado cuáles controles son críticos. D. Probar los controles que el auditor de SI considere más críticos ocurriría después de una evaluación de riesgos de TI.",
        justificacionEn: "A. Performing a survey audit of logical access controls would occur after an IT risk assessment. B. Revising the audit plan to focus on risk-based auditing would occur after an IT risk assessment. C. An IT risk assessment should be performed first to ascertain which areas present the greatest risk and which controls mitigate that risk. Although narratives and process flows have been created, the organization has not yet assessed which controls are critical. D. Testing controls that the IS auditor feels are most critical would occur after an IT risk assessment."
      },
      {
        id: 2,
        pregunta: "Al auditar la seguridad lógica, ¿qué preocupa MÁS al auditor?",
        preguntaEn: "When auditing logical security, what MOST concerns the auditor?",
        alternativas: [
          { id: "a", texto: "Que la cuenta de administrador del sistema sea conocida por todos" },
          { id: "b", texto: "Que las contraseñas no cambien con frecuencia" },
          { id: "c", texto: "Que el administrador de red tenga permisos excesivos" },
          { id: "d", texto: "Ausencia de política escrita de gestión de privilegios" }
        ],
        alternativasEn: [
          { id: "a", texto: "The system administrator account being known by everybody" },
          { id: "b", texto: "Infrequent password changing" },
          { id: "c", texto: "The network administrator being given excessive permissions" },
          { id: "d", texto: "The absence of a privilege management policy" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Que la cuenta de administrador del sistema sea conocida por todos es lo más peligroso. En ese caso, cualquier usuario podría realizar cualquier acción en el sistema, incluido el acceso a archivos y ajustes de permisos y parámetros. B. El cambio poco frecuente de contraseñas presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. C. Que se le otorguen permisos excesivos al administrador de red presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. D. La ausencia de una política de gestión de privilegios sería motivo de preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema.",
        justificacionEn: "A. The system administrator account being known by everybody is most dangerous. In that case, any user could perform any action in the system, including accessing files and making permission and parameter adjustments. B. Infrequent password changing would present a concern but would not be as serious as everyone knowing the system administrator account. C. The network administrator being given excessive permissions would present a concern, but it would not be as serious as everyone knowing the system administrator account. D. The absence of a privilege management policy would be a concern, but it would not be as serious as everyone knowing the system administrator account."
      },
      {
        id: 3,
        pregunta: "Al probar la gestión de cambios de programas, ¿cómo debe seleccionarse la muestra?",
        preguntaEn: "When testing program change management, how should the sample be selected?",
        alternativas: [
          { id: "a", texto: "Documentos de gestión de cambios al azar" },
          { id: "b", texto: "Cambios en el código de producción, rastreados hasta la documentación de autorización" },
          { id: "c", texto: "Documentos según criticidad del sistema" },
          { id: "d", texto: "Cambios en producción rastreados a logs del sistema" }
        ],
        alternativasEn: [
          { id: "a", texto: "A random sample of change management documents" },
          { id: "b", texto: "Changes to production code, traced to authorization documentation" },
          { id: "c", texto: "Documents based on system criticality" },
          { id: "d", texto: "Production changes traced to system logs" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. B. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación adecuada. En consecuencia, los cambios en el código de producción proporcionan la base más apropiada para seleccionar una muestra. C. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. D. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente.",
        justificacionEn: "A. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. B. When testing a control, it is advisable to trace from the item being controlled to the relevant control documentation. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. Accordingly, changes to production code provide the most appropriate basis for selecting a sample. C. When a sample is chosen from a set of control documents, there is no way to ensure that every change is accompanied by appropriate control documentation. D. When testing a control, it is advisable to trace from the item being controlled to the relevant control documentation."
      },
      {
        id: 4,
        pregunta: "La PRIMERA prioridad del auditor en el año uno debe ser estudiar:",
        preguntaEn: "The IS auditor's FIRST priority in year one should be to study:",
        alternativas: [
          { id: "a", texto: "Informes de auditorías previas" },
          { id: "b", texto: "La carta de auditoría, para planificar el cronograma" },
          { id: "c", texto: "El impacto de la rotación de empleados" },
          { id: "d", texto: "El impacto de la implementación de un nuevo ERP" }
        ],
        alternativasEn: [
          { id: "a", texto: "Previous IS audit reports" },
          { id: "b", texto: "The audit charter, to plan the schedule" },
          { id: "c", texto: "The impact of employee turnover" },
          { id: "d", texto: "The impact of a new ERP implementation" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los informes previos de auditoría de SI se revisarán para evitar trabajo redundante y para usarlos como referencia al realizar el trabajo de auditoría de SI. B. La carta de auditoría (audit charter) define el propósito, la autoridad y la responsabilidad de las actividades de auditoría de SI. También sienta las bases para las próximas actividades. C. El impacto de la rotación de empleados se abordaría al negociar actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar. D. El impacto de la implementación de un nuevo ERP se abordaría al negociar las actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar.",
        justificacionEn: "A. Previous IS audit reports will be revisited to save redundant work and to use as references when doing the IS audit work. B. The audit charter defines the purpose, authority and responsibility of the IS audit activities. It also sets the foundation for upcoming activities. C. Impact of employee turnover would be addressed when negotiating follow-up activities for respective areas if there is any gap to close. D. Impact of the implementation of a new ERP would be addressed when negotiating the follow-up activities for respective areas if there is any gap to close."
      },
      {
        id: 5,
        pregunta: "¿Cómo debe evaluar el auditor el respaldo y procesamiento por lotes en operaciones de cómputo?",
        preguntaEn: "How should the auditor evaluate backup and batch processing in computing operations?",
        alternativas: [
          { id: "a", texto: "Confiar en el informe del auditor de servicio" },
          { id: "b", texto: "Estudiar el contrato con el proveedor" },
          { id: "c", texto: "Comparar el informe de entrega de servicio con el SLA" },
          { id: "d", texto: "Planificar y ejecutar una revisión independiente de las operaciones de cómputo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Rely on the service auditor's report" },
          { id: "b", texto: "Review the contract with the vendor" },
          { id: "c", texto: "Compare the service delivery report with the SLA" },
          { id: "d", texto: "Plan and conduct an independent review of computing operations" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. El informe del auditor de servicio no puede asegurar el descubrimiento de ineficiencias de control. B. La revisión del contrato no puede asegurar el descubrimiento de ineficiencias de control. C. Comparar el informe de entrega de servicios con el acuerdo de nivel de servicio (SLA) no puede asegurar el descubrimiento de ineficiencias de control. D. La auditoría de SI debe realizar una revisión independiente del respaldo y del procesamiento por lotes. Todas las demás opciones no pueden asegurar el descubrimiento de ineficiencias de control en el proceso.",
        justificacionEn: "A. The service auditor's report cannot ensure the discovery of control inefficiencies. B. Review of the contract cannot ensure the discovery of control inefficiencies. C. Comparing the service delivery report and the service level agreement cannot ensure the discovery of control inefficiencies. D. IS audit should conduct an independent review of the backup and batch processing. All other choices cannot ensure the discovery of control inefficiencies in the process."
      },
      {
        id: 6,
        pregunta: "Durante el trabajo diario, el auditor advierte que la revisión de logs puede no detectar errores a tiempo. ¿A qué tipo de riesgo corresponde esto?",
        preguntaEn: "During daily work, the auditor notices that log review may not detect errors in time. What type of risk does this represent?",
        alternativas: [
          { id: "a", texto: "Riesgo inherente" },
          { id: "b", texto: "Riesgo residual" },
          { id: "c", texto: "Riesgo de control" },
          { id: "d", texto: "Riesgo material" }
        ],
        alternativasEn: [
          { id: "a", texto: "Inherent risk" },
          { id: "b", texto: "Residual risk" },
          { id: "c", texto: "Control risk" },
          { id: "d", texto: "Material risk" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Este no es un ejemplo de riesgo inherente. El riesgo inherente es el nivel de riesgo o exposición sin considerar las acciones que la gerencia ha tomado o podría tomar (por ejemplo, implementar controles). B. Este no es un ejemplo de riesgo residual. El riesgo residual es el riesgo restante después de que la gerencia ha implementado una respuesta al riesgo. C. El riesgo de control existe cuando un riesgo no puede ser prevenido o detectado de manera oportuna por el sistema de controles de SI, lo cual se describe en este caso. D. Este no es un ejemplo de riesgo material. El riesgo material es cualquier riesgo lo suficientemente grande como para amenazar el éxito general del negocio de manera material.",
        justificacionEn: "A. This is not an example of inherent risk. Inherent risk is the risk level or exposure without considering the actions that management has taken or might take (e.g., implementing controls). B. This is not an example of residual risk. Residual risk is the remaining risk after management has implemented a risk response. C. Control risk exists when a risk cannot be prevented or detected on a timely basis by the system of IS controls, which is described in this instance. D. This is not an example of material risk. Material risk is any risk large enough to threaten the overall success of the business in a material way."
      }
    ],

    2: [
      {
        id: 1,
        pregunta: "¿Qué debería preocupar MÁS al auditor sobre la estrategia de negocio de TI de Accenco?",
        preguntaEn: "What should MOST concern the auditor about Accenco's IT business strategy?",
        alternativas: [
          { id: "a", texto: "Los documentos de estrategia son informales e incompletos" },
          { id: "b", texto: "El comité de riesgo casi no se reúne y no deja actas" },
          { id: "c", texto: "Los presupuestos no parecen adecuados" },
          { id: "d", texto: "No hay CIO de tiempo completo" }
        ],
        alternativasEn: [
          { id: "a", texto: "Strategy documents are informal and incomplete" },
          { id: "b", texto: "The risk committee barely meets and leaves no minutes" },
          { id: "c", texto: "Budgets do not appear adequate" },
          { id: "d", texto: "There is no full-time CIO" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. TI pierde de vista la dirección de la empresa sin documentos de estrategia explícitos, lo que dificulta la selección de proyectos y complica la definición de los niveles de servicio; en general, TI se vuelve subóptima en la entrega y en la obtención de valor. B. El hecho de que el comité de gestión de riesgos no celebre reuniones periódicas ni elabore una documentación adecuada implica una falta de buen gobierno del riesgo; el riesgo viene después de establecer los objetivos del negocio y de TI. C. Aunque un presupuesto inadecuado para futuras inversiones de TI genera preocupación, esto es menos importante que una estrategia incompleta. D. La falta de un CIO a tiempo completo puede ser motivo de preocupación, pero no es tan importante como una estrategia incompleta.",
        justificacionEn: "A. IT loses sight of the enterprise direction without explicit strategy documents, making project selection harder and service levels difficult to define. Overall, IT becomes suboptimal in delivery and value realization. B. The failure of the risk management committee to hold regular meetings and produce good documentation implies a lack of good risk governance. Risk follows when setting the business and IT objectives. C. Although an inadequate budget for future IT investments raises concern, this is less important than an incomplete strategy. D. The lack of a full-time CIO may be a concern, but it is not as important as an incomplete strategy."
      },
      {
        id: 2,
        pregunta: "¿Cuál sería el problema MÁS significativo relacionado con la estrategia de negocio de TI de Accenco?",
        preguntaEn: "What would be the MOST significant problem related to Accenco's IT business strategy?",
        alternativas: [
          { id: "a", texto: "El comportamiento de acceso y migración de código de los programadores" },
          { id: "b", texto: "La falta de políticas y procedimientos de TI" },
          { id: "c", texto: "Las prácticas de gestión de riesgo comparadas con pares" },
          { id: "d", texto: "La estructura de reporte de TI" }
        ],
        alternativasEn: [
          { id: "a", texto: "Programmer behavior related to access and code migration" },
          { id: "b", texto: "The lack of IT policies and procedures" },
          { id: "c", texto: "Risk management practices compared to peer enterprises" },
          { id: "d", texto: "The IT reporting structure" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. El comportamiento relacionado con el acceso y la migración de código por parte de los programadores de aplicaciones representa una falta de políticas y procedimientos de TI. B. La falta de políticas y procedimientos de TI provoca que el trabajo relacionado con TI se entregue de forma inconsistente; la política refleja las intenciones de la gerencia y las normas fijadas por la estrategia, mientras que los procedimientos son fundamentales para la entrega diaria de TI. C. Las prácticas de gestión de riesgos no tienen por qué compararse con las de empresas homólogas (peers). D. Aunque la estructura de reporte para TI es importante, no es tan crítica como las políticas y procedimientos de TI.",
        justificacionEn: "A. The behavior related to application programmers' access and migration code represents a lack of IT policies and procedures. B. The lack of IT policies and procedures makes IT-related work inconsistently delivered. The policy reflects management intentions and norms set by the strategy. The procedures are instrumental to day-to-day IT delivery. C. Risk management practices do not have to compare to peer enterprises. D. Although the reporting structure for IT is important, it is not as critical as IT policies and procedures."
      },
      {
        id: 3,
        pregunta: "Desde la perspectiva de gobierno de TI, ¿qué sería de MAYOR preocupación?",
        preguntaEn: "From an IT governance perspective, what would be of GREATEST concern?",
        alternativas: [
          { id: "a", texto: "No hay CIO de tiempo completo" },
          { id: "b", texto: "No hay comité directivo de TI" },
          { id: "c", texto: "La junta juega un rol importante en el monitoreo de TI" },
          { id: "d", texto: "El gerente de SI reporta al CFO" }
        ],
        alternativasEn: [
          { id: "a", texto: "There is no full-time CIO" },
          { id: "b", texto: "There is no IT steering committee" },
          { id: "c", texto: "The board plays a major role in IT monitoring" },
          { id: "d", texto: "The IS manager reports to the CFO" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. No tener un CIO a tiempo completo puede ser una preocupación, pero no resulta tan preocupante como que el gerente de SI reporte al CFO. B. La falta de un comité directivo de TI puede causar problemas, pero no es una preocupación tan grande como que el gerente de SI reporte al CFO. C. Que la junta directiva desempeñe un rol principal en las iniciativas de TI no constituye una preocupación importante. D. Idealmente, el gerente de SI debería reportar a la junta directiva o al CEO para proporcionar suficiente independencia; la estructura de reporte que exige que el gerente de SI reporte al CFO no es deseable y podría comprometer ciertos controles.",
        justificacionEn: "A. Not having a full-time CIO may be a concern but is not as concerning as the information systems manager reporting to the CFO. B. The lack of an IT steering committee may cause issues but is not as big a concern as the information systems manager reporting to the CFO. C. The board of directors playing a major role in IT initiatives is not a major concern. D. The IS manager should ideally report to the board of directors or the CEO to provide sufficient independence. The reporting structure that requires the IS manager to report to the CFO is not desirable and could compromise certain controls."
      },
      {
        id: 4,
        pregunta: "Desde la perspectiva de SoD, ¿qué sería de MAYOR preocupación?",
        preguntaEn: "From a SoD perspective, what would be of GREATEST concern?",
        alternativas: [
          { id: "a", texto: "Los programadores solo necesitan aprobación del DBA para acceso de escritura directa a datos" },
          { id: "b", texto: "Entrega de código al bibliotecario" },
          { id: "c", texto: "Auditoría interna reporta al CFO" },
          { id: "d", texto: "Los reportes de desempeño solo son firmados por gerentes de negocio" }
        ],
        alternativasEn: [
          { id: "a", texto: "Programmers only need DBA approval for direct-write data access" },
          { id: "b", texto: "Handing program code to the librarian" },
          { id: "c", texto: "Internal audit reports to the CFO" },
          { id: "d", texto: "Performance reports are only signed by business managers" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Los programadores de aplicaciones deben obtener la aprobación de los dueños del negocio (business owners) antes de acceder a los datos; los DBAs son únicamente custodios de los datos y solo deben proporcionar el acceso autorizado por el dueño de los datos (data owner). B. Aunque esto puede ser un problema, no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. C. Que el departamento de auditoría interna reporte al CFO no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. D. Esto no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa.",
        justificacionEn: "A. Application programmers should obtain approval from the business owners before accessing data. DBAs are only custodians of the data and should provide only the access authorized by the data owner. B. Although this may be an issue, it is not as big a SoD concern as the DBA approving direct-write access. C. The internal audit department reporting to the CFO is not as big a SoD concern as the DBA approving direct-write access. D. This is not as big a SoD concern as the DBA approving direct-write access."
      },
      {
        id: 5,
        pregunta: "¿Qué control mitigaría MEJOR la integridad de datos?",
        preguntaEn: "Which control would BEST mitigate data integrity concerns?",
        alternativas: [
          { id: "a", texto: "Separación de funciones técnica" },
          { id: "b", texto: "Políticas de desarrollo" },
          { id: "c", texto: "Reportes de auditoría" },
          { id: "d", texto: "Que los resultados de desempeño del negocio sean revisados y firmados por los gerentes de negocio" }
        ],
        alternativasEn: [
          { id: "a", texto: "Technical separation of duties" },
          { id: "b", texto: "Development policies" },
          { id: "c", texto: "Audit reports" },
          { id: "d", texto: "Business performance results reviewed and signed off by business managers" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Esto no es lo que mejor mitiga la manipulación de datos. B. Entregar el código de programa al bibliotecario no es lo que mejor mitiga la manipulación de datos. C. La estructura de reporte no mitiga la manipulación de datos. D. La aprobación y firma (sign-off) de los datos contenidos en los resultados financieros por parte de los gerentes de negocio al final del mes detectaría cualquier discrepancia significativa que pudiera resultar de la alteración de datos mediante un acceso directo inapropiado obtenido sin la aprobación o el conocimiento de los gerentes de negocio.",
        justificacionEn: "A. This does not best mitigate tampering with data. B. Handing program code to the librarian does not best mitigate tampering with data. C. The reporting structure does not mitigate data tampering. D. Sign-off on data contained in the financial results by the business managers at the end of the month would detect any significant discrepancies that can result from the tampering of data through inappropriate direct access of the data gained without the approval or knowledge of the business managers."
      }
    ],

    3: [
      {
        id: 1,
        pregunta: "¿Cuál presenta el riesgo MÁS significativo para el minorista?",
        preguntaEn: "Which presents the MOST significant risk to the retailer?",
        alternativas: [
          { id: "a", texto: "Parches de base de datos muy desactualizados" },
          { id: "b", texto: "Los registros POS inalámbricos usan cifrado WEP" },
          { id: "c", texto: "Los datos de tarjetahabientes se envían por Internet" },
          { id: "d", texto: "Los datos agregados de ventas se envían por correo a un tercero" }
        ],
        alternativasEn: [
          { id: "a", texto: "Database patches are very outdated" },
          { id: "b", texto: "Wireless POS registers use WEP encryption" },
          { id: "c", texto: "Cardholder data is sent over the Internet" },
          { id: "d", texto: "Aggregate sales data is mailed to a third party" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los servidores de bases de datos sin parches están ubicados en una subred filtrada (screened subnet); esto mitiga el riesgo para la empresa. B. El uso del cifrado WEP presenta el riesgo más significativo porque WEP utiliza una clave secreta fija que es fácil de vulnerar. La transmisión de información de los titulares de tarjetas de crédito por medio de cajas registradoras inalámbricas es susceptible de intercepción y representa un riesgo muy grave. C. El envío de datos de titulares de tarjetas de crédito a través de Internet representa un riesgo menor debido a que se está utilizando un cifrado robusto. D. Debido a que los datos de ventas enviados al tercero son datos agregados, no debería incluirse información de titulares de tarjetas.",
        justificacionEn: "A. Unpatched database servers are located on a screened subnet; this mitigates the risk to the enterprise. B. Use of WEP encryption presents the most significant risk because WEP uses a fixed secret key that is easy to break. Transmission of credit cardholder information by wireless registers is susceptible to interception and presents a very serious risk. C. Sending credit cardholder data over the Internet is less of a risk because strong encryption is being used. D. Because the sales data being sent to the third party are aggregate data, no cardholder information should be included."
      },
      {
        id: 2,
        pregunta: "Según el caso, ¿qué control es el MÁS importante de implementar?",
        preguntaEn: "According to the case, which control is the MOST important to implement?",
        alternativas: [
          { id: "a", texto: "Autenticación de dos factores en los POS" },
          { id: "b", texto: "Filtrado MAC en los puntos de acceso inalámbricos" },
          { id: "c", texto: "Parchear el ERP para cumplir el RGPD" },
          { id: "d", texto: "Anonimizar y cifrar los datos agregados de ventas antes de distribuirlos" }
        ],
        alternativasEn: [
          { id: "a", texto: "Two-factor authentication on POS registers" },
          { id: "b", texto: "MAC filtering on wireless access points" },
          { id: "c", texto: "Patching the ERP to comply with GDPR" },
          { id: "d", texto: "Anonymizing and encrypting aggregate sales data before distribution" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. De acuerdo con el caso de estudio, no está claro si las cajas registradoras de punto de venta (POS) ya utilizan autenticación de dos factores. Se sabe que los datos agregados de ventas se copian en otros medios tal cual (as-is), sin ningún control, para su distribución externa. B. De acuerdo con el caso de estudio, no está claro si los puntos de acceso inalámbricos utilizan filtrado de direcciones MAC. Se sabe que los datos agregados de ventas se copian sin ningún control para su distribución externa. C. El cumplimiento del GDPR, aunque es importante, no es lo más importante debido a que las operaciones actuales radican únicamente en los Estados Unidos, y la posible expansión hacia la Unión Europea constituye una visión a largo plazo. D. No está claro si los datos de ventas están seguros y libres de información de identificación personal (PII). Esto representa el riesgo más significativo y debe ser abordado.",
        justificacionEn: "A. According to the case study, it is unclear whether the POS registers already use two-factor authentication. It is known that aggregate sales data are copied onto other media as-is, without any controls, for external distribution. B. According to the case study, it is unclear whether the wireless access points use MAC address filtering. It is known that aggregate sales data are copied without any controls for external distribution. C. Compliance with the GDPR, although important, is not the most important due to the current operations being only in the United States, and the potential for expansion into the EU is a long-term vision for the enterprise. D. It is unclear whether sales data are secure and free of personally identifiable information, such as credit card information and Social Security numbers. This presents the most significant risk and should be addressed."
      },
      {
        id: 3,
        pregunta: "En el informe preliminar sobre la actualización de la base de datos, ¿qué es lo MÁS importante de incluir?",
        preguntaEn: "In the preliminary report on the database upgrade, what is MOST important to include?",
        alternativas: [
          { id: "a", texto: "Que auditoría interna sea incluida en las aprobaciones del comité directivo" },
          { id: "b", texto: "Posible incompatibilidad de la nueva base de datos con el ERP existente" },
          { id: "c", texto: "Se requiere una actualización/parche del ERP" },
          { id: "d", texto: "Auditoría interna debe poder revisar la base de datos actualizada para PCI DSS" }
        ],
        alternativasEn: [
          { id: "a", texto: "That internal audit be included in steering committee approvals" },
          { id: "b", texto: "Possible incompatibility of the new database with the existing ERP" },
          { id: "c", texto: "An ERP upgrade/patch is required" },
          { id: "d", texto: "Internal audit must be able to review the upgraded database for PCI DSS" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Si auditoría interna forma parte del comité directivo (steering committee), tendrá voz y voto respecto a los controles de seguridad y cumplimiento normativo que deben incluirse en las versiones de pase a producción. B. Asegurar el cumplimiento de la base de datos es una responsabilidad operativa y no una responsabilidad de auditoría. C. La compatibilidad con la arquitectura existente debe ser una función del equipo de proyecto de implementación de la base de datos en su conjunto, el cual puede incluir a auditoría interna y también comprende a operaciones. D. Aunque es importante que la solución de base de datos actualizada cumpla con todas las regulaciones, dicha revisión no debe limitarse a una sola regulación.",
        justificacionEn: "A. If internal audit is part of the steering committee, then it will have a say in the compliance and security-related controls to be included in production releases. B. Ensuring database compliance is an operational responsibility and not an audit responsibility. C. Compatibility with existing architecture must be a function of the database implementation project team as a whole, which can include internal audit and also includes operations. Therefore, it is not the best answer choice. D. Although it is important that the upgraded database solution be compliant with all regulations affecting the enterprise, such a review should not be limited to one regulation. Therefore, it is not the best choice of those answers provided."
      },
      {
        id: 4,
        pregunta: "Para contribuir directamente a resolver los problemas de la actualización de base de datos, el auditor debe:",
        preguntaEn: "To directly contribute to resolving the database upgrade problems, the auditor should:",
        alternativas: [
          { id: "a", texto: "Revisar la validez de las especificaciones funcionales" },
          { id: "b", texto: "Proponerse como consultor de control de calidad del proyecto" },
          { id: "c", texto: "Investigar más a fondo para identificar causas raíz y definir contramedidas apropiadas" },
          { id: "d", texto: "Contactar al líder de proyecto y recomendar redefinir el cronograma con PERT" }
        ],
        alternativasEn: [
          { id: "a", texto: "Review the validity of functional project specifications" },
          { id: "b", texto: "Propose to be the project quality control consultant" },
          { id: "c", texto: "Conduct further research to identify root causes and define appropriate countermeasures" },
          { id: "d", texto: "Contact the project leader and recommend redesigning the schedule with PERT" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Las especificaciones funcionales del proyecto deben ser ejecutadas por los usuarios y analistas de sistemas, no por el auditor. B. Proponer ser consultor de calidad del proyecto no aportaría una contribución esencial, ya que la calidad es una característica formal; mientras que, en el caso actual, el problema es una inestabilidad sustancial del sistema. C. La única acción apropiada es realizar una investigación adicional, incluso si la naturaleza aparentemente técnica del problema hace improbable que el auditor pueda resolverlo por sí solo. D. Contactar al líder del proyecto y rediseñar el cronograma de entregas no resolvería el problema. Además, la definición de las causas reales puede alterar de forma sustancial el entorno del proyecto.",
        justificacionEn: "A. Functional project specifications should be executed by users and systems analysts, and not by the auditor. B. To propose to be project consultant for quality would not bring about an essential contribution, because quality is a formal characteristic; whereas, in the current case, the problem is substantial system instability. C. The only appropriate action is additional research, even if the apparently technical nature of the problem renders it unlikely that the auditor may find it alone. D. To contact the project leader and redesign the schedule of deliveries would not solve the problem. Furthermore, the definition of real causes may sensibly alter the project environment."
      }
    ],

    4: [
      {
        id: 1,
        pregunta: "¿Cuál sería la preocupación MÁS importante sobre el uso de sistemas de radio por microondas?",
        preguntaEn: "What would be the MOST important concern about the use of microwave radio systems?",
        alternativas: [
          { id: "a", texto: "Susceptibilidad a la interceptación de datos transmitidos" },
          { id: "b", texto: "Falta de soluciones de cifrado disponibles" },
          { id: "c", texto: "Probabilidad de interrupción del servicio" },
          { id: "d", texto: "Sobrecostos de implementación" }
        ],
        alternativasEn: [
          { id: "a", texto: "Susceptibility to interception of transmitted data" },
          { id: "b", texto: "Lack of available encryption solutions" },
          { id: "c", texto: "Likelihood of a service outage" },
          { id: "d", texto: "Cost overruns in implementation" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La falta de cifrado es la preocupación más importante, dado que los sistemas de radio por microondas son fáciles de intervenir (tap). B. La falta de escalabilidad es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. C. La probabilidad de una interrupción del servicio es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. D. Los sobrecostos en la implementación son importantes, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes.",
        justificacionEn: "A. Lack of encryption is the most important concern since microwave radio systems are easy to tap. B. Lack of scalability is important but not as important as ensuring the confidentiality and integrity of customer data. C. The likelihood of a service outage is important but not as important as ensuring the confidentiality and integrity of customer data. D. Cost overruns in implementation are important but not as important as ensuring the confidentiality and integrity of customer data."
      },
      {
        id: 2,
        pregunta: "¿Qué reduciría MEJOR la probabilidad de que los sistemas de negocio sean atacados desde Internet a través de la red inalámbrica?",
        preguntaEn: "What would BEST reduce the likelihood of business systems being attacked from the Internet through the wireless network?",
        alternativas: [
          { id: "a", texto: "Escanear todos los dispositivos conectados en busca de malware" },
          { id: "b", texto: "Segmentar la red interna y el acceso a Internet público mediante una subred con firewall" },
          { id: "c", texto: "Registrar todos los accesos y alertar sobre intentos fallidos" },
          { id: "d", texto: "Limitar el acceso a horario laboral y protocolos estándar" }
        ],
        alternativasEn: [
          { id: "a", texto: "Scanning all connected devices for malware" },
          { id: "b", texto: "Isolating the wireless network by placing it on a firewalled subnet" },
          { id: "c", texto: "Logging all access and alerting on failed attempts" },
          { id: "d", texto: "Limiting access to business hours and standard protocols" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. El escaneo en busca de malware no detectaría el uso de herramientas de investigación diseñadas para recolectar contraseñas o revelar vulnerabilidades de la red. B. Aislar la red inalámbrica ubicándola en una subred protegida por firewall reduciría de la mejor manera la probabilidad de un ataque. C. Registrar el acceso (logging access) no evitaría un ataque exitoso. D. Limitar el acceso al horario laboral normal no evitaría un ataque exitoso.",
        justificacionEn: "A. Scanning for malware would not detect the use of investigative tools designed to harvest passwords or reveal network vulnerabilities. B. Isolating the wireless network by placing it on a firewalled subnet would best reduce the likelihood of attack. C. Logging access would not prevent a successful attack. D. Limiting access to normal business hours would not prevent a successful attack."
      },
      {
        id: 3,
        pregunta: "Al negociar nuevos contratos con el proveedor, ¿qué debe recomendar el auditor sobre el hot site?",
        preguntaEn: "When negotiating new contracts with the vendor, what should the auditor recommend regarding the hot site?",
        alternativas: [
          { id: "a", texto: "Aumentar los escritorios a 750" },
          { id: "b", texto: "Añadir 35 servidores adicionales al contrato" },
          { id: "c", texto: "Almacenar todos los medios de respaldo en el hot site" },
          { id: "d", texto: "Revisar trimestralmente los requisitos de equipo de escritorio y servidores" }
        ],
        alternativasEn: [
          { id: "a", texto: "Increase desktops to 750" },
          { id: "b", texto: "Add 35 additional servers to the contract" },
          { id: "c", texto: "Store all backup media at the hot site" },
          { id: "d", texto: "Conduct quarterly reviews of desktop and server equipment requirements" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Debido a que no todas las funciones laborales de los empleados son críticas durante un desastre, no es necesario contratar en una instalación de recuperación el mismo número de computadoras de escritorio que el número de empleados. B. Del mismo modo, no todos los servidores son críticos para la operación continua del negocio; solo se requerirá un subconjunto de ellos. C. Debido a que no existe certeza de que el sitio en caliente no esté ya ocupado, no sería aconsejable almacenar los medios de respaldo en dicha instalación. Por lo general, estas instalaciones no están diseñadas para proporcionar un almacenamiento extenso de medios, y las pruebas frecuentes realizadas por otros clientes podrían comprometer la seguridad de dichos soportes. D. Como las necesidades de equipamiento en una empresa de rápido crecimiento están sujetas a cambios frecuentes, las revisiones trimestrales son necesarias para asegurar que la capacidad de recuperación se mantenga al ritmo de la organización.",
        justificacionEn: "A. Because not all employee job functions are critical during a disaster, it is not necessary to contract the same number of desktops at a recovery facility as the number of employees. B. Similarly, not every server is critical to the continued operation of the business. Only a subset will be required. C. Because there is no assurance that the hot site will not already be occupied, storing backup media at the facility would not be advisable. These facilities are generally not designed to provide extensive media storage, and frequent testing by other customers could compromise the security of the media. D. As equipment needs in a rapidly growing business are subject to frequent change, quarterly reviews are necessary to ensure that the recovery capability keeps pace with the organization."
      },
      {
        id: 4,
        pregunta: "¿Qué debe recomendar el auditor sobre la recuperación de las oficinas de sucursal?",
        preguntaEn: "What should the auditor recommend regarding recovery of branch offices?",
        alternativas: [
          { id: "a", texto: "Añadir cada sucursal al contrato de hot site existente" },
          { id: "b", texto: "Asegurar que las sucursales tengan capacidad suficiente para respaldarse entre sí" },
          { id: "c", texto: "Reubicar todos los servidores de sucursal al centro de datos" },
          { id: "d", texto: "Añadir capacidad al hot site equivalente a la sucursal más grande" }
        ],
        alternativasEn: [
          { id: "a", texto: "Add each branch to the existing hot site contract" },
          { id: "b", texto: "Ensure that branches have sufficient capacity to accommodate critical personnel from another branch" },
          { id: "c", texto: "Relocate all branch servers to the data center" },
          { id: "d", texto: "Add capacity to the hot site equivalent to the largest branch" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Agregar cada sucursal al contrato del sitio en caliente resultaría mucho más costoso. B. La solución más rentable (cost-effective) consiste en recomendar que las sucursales tengan capacidad suficiente para albergar al personal crítico proveniente de otra sucursal. Debido a que las funciones laborales críticas representarían solo quizás un 20 por ciento del personal de la sucursal afectada, únicamente se necesitaría espacio para entre cuatro y siete miembros clave del personal. C. Reubicar los servidores de las sucursales en el centro de datos principal podría generar problemas de rendimiento; asimismo, no resolvería la cuestión de dónde ubicar físicamente a los empleados desplazados. D. Agregar capacidad al contrato del sitio en caliente no brindaría cobertura, ya que los contratos de sitios en caliente basan su precio individualmente en cada ubicación cubierta.",
        justificacionEn: "A. Adding each branch to the hot site contract would be far more expensive. B. The most cost-effective solution is to recommend that branches have sufficient capacity to accommodate critical personnel from another branch. Because critical job functions would represent only perhaps 20 percent of the staff from the affected branch, accommodations for only four to seven critical staff members would be needed. C. Relocating branch servers to the data center could result in performance issues. It would not address the question of where to locate displaced employees. D. Adding capacity to the hot site contract would not provide coverage, as hot site contracts base their pricing on each location covered."
      }
    ],

    5: [
      {
        id: 1,
        pregunta: "[Caso Spectertainment] ¿Qué preocuparía MÁS a un auditor de SI al revisar una implementación de VPN? Las computadoras de la red ubicadas:",
        preguntaEn: "[Spectertainment Case] What would MOST concern an IS auditor reviewing a VPN implementation? Network computers located:",
        alternativas: [
          { id: "a", texto: "En la red interna de la empresa" },
          { id: "b", texto: "En el sitio de respaldo" },
          { id: "c", texto: "En los hogares de los empleados" },
          { id: "d", texto: "En las oficinas remotas de la empresa" }
        ],
        alternativasEn: [
          { id: "a", texto: "On the enterprise's internal network" },
          { id: "b", texto: "At the backup site" },
          { id: "c", texto: "At employees' homes" },
          { id: "d", texto: "At the enterprise's remote offices" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. En la red interna de la empresa, las políticas y controles de seguridad deben estar implementados para detectar y detener un ataque externo que utilice una máquina interna como plataforma de lanzamiento; por lo tanto, esta no sería la mayor preocupación. B. Las computadoras en el sitio de respaldo están sujetas a la política de seguridad corporativa y, por lo tanto, no son computadoras de alto riesgo. C. La VPN ofrece una conexión segura entre la PC remota y la red corporativa. Sin embargo, la VPN no protege a la PC remota de ataques externos (como desde Internet). Si la PC remota se ve comprometida, un actor malicioso puede usar el punto de entrada de la PC remota comprometida para ingresar a la red corporativa (movimiento lateral). D. Las computadoras en las oficinas remotas de la empresa son más riesgosas que las computadoras en la oficina principal o en el sitio de respaldo, pero obviamente son menos riesgosas que las computadoras domésticas.",
        justificacionEn: "A. On an enterprise's internal network, security policies and controls should be in place to detect and halt an outside attack that uses an internal machine as a staging platform. Therefore, this would not be the biggest concern to the IS audit. B. Computers at the backup site are subject to the corporate security policy and therefore are not high-risk computers. C. VPN offers a secure connection between the remote PC and the corporate network. VPN does not, however, protect the remote PC from outside attack (such as from the Internet). If the remote PC is compromised, a malicious actor can use the entry point of the compromised remote PC to enter the corporate network (lateral movement). D. Computers on the network that are at the enterprise's remote offices, perhaps with IS and security employees who have different ideas about security, are riskier than computers in the main office or backup site, but obviously less risky than home computers."
      },
      {
        id: 2,
        pregunta: "[Caso Spectertainment] ¿Qué nivel provee un MAYOR grado de protección al aplicar software de control de acceso contra riesgo de acceso no autorizado?",
        preguntaEn: "[Spectertainment Case] Which level provides the GREATEST degree of protection when applying access control software against unauthorized access risk?",
        alternativas: [
          { id: "a", texto: "Nivel de red y sistema operativo" },
          { id: "b", texto: "Nivel de aplicación" },
          { id: "c", texto: "Nivel de base de datos" },
          { id: "d", texto: "Nivel de archivo de log" }
        ],
        alternativasEn: [
          { id: "a", texto: "Network and operating system level" },
          { id: "b", texto: "Application level" },
          { id: "c", texto: "Database level" },
          { id: "d", texto: "Log file level" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El mayor grado de protección al aplicar software de control de acceso contra el acceso no autorizado de usuarios internos y externos se encuentra en los niveles de red y de plataforma/SO. Estos sistemas también se denominan sistemas de soporte general y constituyen la infraestructura principal sobre la que residirán los sistemas de aplicaciones y bases de datos. B. El nivel de aplicación es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. C. El nivel de base de datos es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. D. El nivel de archivos de registro (log files) es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO.",
        justificacionEn: "A. The greatest degree of protection in applying access control software against internal and external users' unauthorized access is at the network and platform/OS levels. These systems are also referred to as general support systems, and they make up the primary infrastructure on which applications and database systems will reside. B. The application level is part of the infrastructure made up by the general support systems, supported by the network and OS level. C. The database level is part of the infrastructure made up by the general support systems, supported by the network and OS level. D. The log file level is part of the infrastructure made up by the general support systems, supported by the network and OS level."
      },
      {
        id: 3,
        pregunta: "[Caso Spectertainment] Cuando un empleado reporta el olvido de su contraseña, ¿qué debe hacer PRIMERO el administrador de seguridad?",
        preguntaEn: "[Spectertainment Case] When an employee reports a forgotten password, what should the security administrator do FIRST?",
        alternativas: [
          { id: "a", texto: "Permitir que el sistema genere aleatoriamente una nueva contraseña" },
          { id: "b", texto: "Verificar la identidad del usuario mediante un sistema de desafío/respuesta" },
          { id: "c", texto: "Proveer la contraseña por defecto y explicar que debe cambiarse" },
          { id: "d", texto: "Pedir al empleado que use la terminal del administrador" }
        ],
        alternativasEn: [
          { id: "a", texto: "Allow the system to randomly generate a new password" },
          { id: "b", texto: "Verify the user's identity using a challenge/response system" },
          { id: "c", texto: "Provide a default password and explain it must be changed" },
          { id: "d", texto: "Ask the employee to use the administrator's terminal" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Cuando un empleado informa una contraseña olvidada, el administrador de seguridad debe iniciar un procedimiento de generación de contraseña solo después de verificar la identificación del usuario mediante un sistema de desafío/respuesta (challenge/response) o un procedimiento similar. B. Un sistema de desafío/respuesta o un procedimiento similar debe ser el primer paso para verificar la identidad del usuario. Para verificar, se aconseja que el administrador de seguridad devuelva la llamada al usuario después de verificar su extensión o llamar a su supervisor. C. Antes de proporcionarle a un empleado una contraseña predeterminada, la identidad de la persona debe verificarse mediante un sistema de desafío/respuesta o un procedimiento similar. D. Antes de tomar cualquier otra medida, se debe verificar la identidad del usuario. No se debe generar una nueva contraseña hasta que se confirme, independientemente de la seguridad de la terminal.",
        justificacionEn: "A. When an employee reports a forgotten password, the security administrator should start a password process generation procedure only after verifying the user's identification using a challenge/response system or similar procedure. B. A challenge/response system or similar procedure should be the first step in verifying a user's identity. To verify, it is advised that the security administrator should return the user's call after verifying their extension or calling their supervisor for verification. C. Before an employee is provided with a default password, the individual's identity should be verified using a challenge/response system or similar procedure. D. Before any further action is taken, the user's identity must be verified. A new password should not be generated until it is confirmed, regardless of the security of the terminal."
      },
      {
        id: 4,
        pregunta: "[Caso Spectertainment] ¿Qué política debe asegurar Spectertainment que esté vigente ante el hallazgo de dispositivos personales conectados a la VPN?",
        preguntaEn: "[Spectertainment Case] What policy should Spectertainment ensure is in place upon finding personal devices connected to the VPN?",
        alternativas: [
          { id: "a", texto: "Política de acceso remoto (ya existe, pero no cubre dispositivos personales)" },
          { id: "b", texto: "Política de uso aceptable" },
          { id: "c", texto: "Política de control de cambios" },
          { id: "d", texto: "Política de control de acceso" }
        ],
        alternativasEn: [
          { id: "a", texto: "Remote access policy (already exists but does not cover personal devices)" },
          { id: "b", texto: "Acceptable use policy" },
          { id: "c", texto: "Change control policy" },
          { id: "d", texto: "Access control policy" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Spectertainment cuenta con una política de acceso remoto que describe los métodos aprobados para conectarse de forma remota a los recursos internos, pero no aborda el uso de dispositivos personales. B. Una política de uso aceptable describe lo que los empleados aceptan al utilizar y acceder a los activos de la organización. Confirmaría si se permite el uso de dispositivos personales y también puede incluir una política de Traiga Su Propio Dispositivo (BYOD) para codificar aún más su uso. C. Las políticas de control de cambios son necesarias al realizar cambios en los sistemas de TI, pero no son el control más importante en este contexto. D. Las políticas de control de acceso son necesarias para garantizar que los empleados comprendan cómo acceder a los sistemas, pero no son el control más importante ante este hallazgo.",
        justificacionEn: "A. Spectertainment has a remote access policy in place that outlines the approved methods for remotely connecting to internal resources but does not address the use of personal devices. B. An acceptable use policy outlines what employees agree to when using and accessing organizational assets. It would confirm whether the use of personal devices is allowed and may also include a Bring Your Own Device (BYOD) policy to further codify their use. C. Change control policies are required when making changes to IT systems. While some changes may need to be submitted based on any changes needed to support BYOD, it is not the most important control. D. Access control policies are required to ensure employees understand how to access systems. While changes to the access control policy may need to be made to support BYOD, it is not the most important control."
      },
      {
        id: 5,
        pregunta: "[Caso Spectertainment] ¿Por qué elegiría Spectertainment apoyar el uso de dispositivos personales en lugar de prohibirlo?",
        preguntaEn: "[Spectertainment Case] Why would Spectertainment choose to support the use of personal devices rather than prohibit them?",
        alternativas: [
          { id: "a", texto: "Mayor productividad del empleado" },
          { id: "b", texto: "No facilita la terminación de accesos" },
          { id: "c", texto: "Mayor ahorro de costos" },
          { id: "d", texto: "No implica mayor concienciación de seguridad" }
        ],
        alternativasEn: [
          { id: "a", texto: "Increased employee productivity" },
          { id: "b", texto: "It does not facilitate termination of access" },
          { id: "c", texto: "Increased cost savings" },
          { id: "d", texto: "It does not imply increased security awareness" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Las políticas de BYOD han demostrado un aumento en la productividad y la satisfacción de los empleados. B. El uso de BYOD puede hacer que sea más difícil dar por terminado el acceso de un empleado. C. Dado que los empleados utilizan sus propios dispositivos, BYOD puede ayudar a las organizaciones a aumentar su ahorro de costos. D. El uso de BYOD no indica que los empleados tengan una mayor conciencia del riesgo de seguridad que representa el uso de sus dispositivos personales para el trabajo.",
        justificacionEn: "A. BYOD policies have shown increased productivity and employee satisfaction. B. BYOD use can make it more difficult to terminate employee access. C. Since employees are using their own devices, BYOD can help organizations increase their cost savings. D. The use of BYOD does not indicate that employees have increased awareness of the security risk posed by their use of their personal devices for work."
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
  for (let n = 1; n <= 5; n++) {
    const preguntas = BANCO_PREGUNTAS[seccion][n];
    const disponible = preguntas && preguntas.length > 0;
    const btn = document.createElement('button');
    btn.className = `subsection-btn${disponible ? '' : ' subsection-btn--empty'}`;
    btn.disabled  = !disponible;
    btn.setAttribute('aria-label', `${meta.label} ${n}${disponible ? '' : ' ('+t('comingSoon')+')'}`);
    btn.innerHTML = `
      <span class="subsection-num">${n}</span>
      <span class="subsection-label">${meta.label} ${n}</span>
      <span class="subsection-count">${disponible ? preguntas.length + ' ' + t('preguntas') : t('comingSoon')}</span>
    `;
    if (disponible) {
      btn.addEventListener('click', () => iniciarCuestionario(seccion, n));
    }
    DOM.subsectionGrid.appendChild(btn);
  }
  showScreen(DOM.screenSubsections);
}

function iniciarCuestionario(seccion, subseccion) {
  state.seccionActual    = seccion;
  state.subseccionActual = subseccion;
  state.preguntas        = [...BANCO_PREGUNTAS[seccion][subseccion]];
  state.indiceActual     = 0;
  state.correctas        = 0;
  state.incorrectas      = 0;
  state.respondida       = false;

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
  const pregunta   = state.preguntas[state.indiceActual];
  const numHumano  = state.indiceActual + 1;

  // Si está activo el modo aleatorio, mezclar el orden de las alternativas
  if (state.modoAleatorio) {
    state.ordenAlternativasActuales = shuffleAlts(['a', 'b', 'c', 'd']);
  } else {
    state.ordenAlternativasActuales = ['a', 'b', 'c', 'd'];
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

  // Renderizar alternativas según el orden actual
  DOM.alternativesList.innerHTML = '';
  state.ordenAlternativasActuales.forEach((altId, idx) => {
    const alt = allAlts.find(a => a.id === altId);
    if (!alt) return;

    const displayLetter = String.fromCharCode(65 + idx); // A, B, C, D

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
    btn.addEventListener('click', () => manejarRespuesta(alt.id, pregunta));

    li.appendChild(btn);
    DOM.alternativesList.appendChild(li);
  });
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

  // Si estamos en modo aleatorio, reordenar las alternativas a su orden original (A, B, C, D)
  // para que coincidan 100% con la justificación
  if (state.modoAleatorio) {
    state.ordenAlternativasActuales = ['a', 'b', 'c', 'd'];
    const useEn   = currentLang === 'en' && pregunta.preguntaEn;
    const allAlts = useEn ? pregunta.alternativasEn : pregunta.alternativas;

    DOM.alternativesList.innerHTML = '';
    state.ordenAlternativasActuales.forEach((altId, idx) => {
      const alt = allAlts.find(a => a.id === altId);
      if (!alt) return;

      const displayLetter = String.fromCharCode(65 + idx); // A, B, C, D

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
    const formatted = justificacion.replace(/\s([B-D])\.\s/g, '\n$1. ');
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
      <span class="stat-value" style="font-size: var(--font-size-base);">${meta.emoji} ${meta.label} ${state.subseccionActual}</span>
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
  DOM.btnTeoria.addEventListener('click', () => mostrarSubsecciones('teoria'));
  DOM.btnCasos.addEventListener('click',  () => mostrarSubsecciones('casos'));
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
