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
        justificacion: "A. El alcance de la auditoría es específico para una sola auditoría y no otorga la autoridad para realizar una auditoría. B. Una solicitud de la gerencia para realizar una auditoría no es suficiente porque se refiere a una auditoría específica. C. La carta de auditoría (audit charter) aprobada describe la responsabilidad, autoridad y rendición de cuentas (accountability) del auditor. D. El cronograma de auditoría aprobado no otorga la autoridad para realizar una auditoría."
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
        justificacion: "A. El objetivo de la autoevaluación de control (CSA) es lograr que los gerentes de negocio sean más conscientes de la importancia del control interno y de su responsabilidad en términos de gobierno corporativo. B. Reducir los gastos de auditoría no es un beneficio clave de la CSA. C. Mejorar la detección de fraude es importante, pero no tanto como la apropiación del control (control ownership). No es un objetivo principal de la CSA. D. La CSA puede brindar más información a los auditores internos, permitiéndoles asumir un rol más consultivo; sin embargo, este es un beneficio adicional, no el beneficio clave."
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
        justificacion: "A. Un enfoque de auditoría basado en riesgos se centra en comprender la naturaleza del negocio y en ser capaz de identificar y categorizar el riesgo. El riesgo de negocio impacta la viabilidad a largo plazo de un negocio específico. Por lo tanto, un auditor de SI que utiliza un enfoque de auditoría basado en riesgos debe ser capaz de comprender los procesos de negocio. B. Los controles administrativos, aunque son un subconjunto importante de controles, no son el foco principal necesario para comprender los procesos de negocio dentro del alcance de una auditoría. C. Al igual que los controles administrativos, los controles ambientales son un subconjunto de control importante; sin embargo, no abordan los procesos de negocio generales de alto nivel bajo revisión. D. Las estrategias de negocio son las impulsoras de los procesos de negocio; sin embargo, en este caso, el auditor de SI se enfoca en los procesos de negocio que se implementaron para permitir a la organización ejecutar sus estrategias."
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
        justificacion: "A. El riesgo de control es el riesgo de que exista un error material que no sea prevenido o detectado de manera oportuna por el sistema de controles internos. B. El riesgo de detección es el riesgo de que una incorrección material con una afirmación de la gerencia no sea detectada por las pruebas sustantivas de un profesional de auditoría y aseguramiento. Consta de dos componentes: riesgo de muestreo y riesgo de no muestreo. C. El riesgo inherente es el nivel de riesgo o exposición evaluado sin considerar las acciones que la gerencia ha tomado o podría tomar. D. El riesgo de muestreo es el riesgo de que se hagan suposiciones incorrectas sobre las características de una población de la cual se toma una muestra. El riesgo de no muestreo es el riesgo de detección no relacionado con el muestreo; puede deberse a una variedad de razones, incluido el error humano."
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
        justificacion: "A. No se espera que un auditor de SI ignore las debilidades de control solo porque estén fuera del alcance de la revisión actual. B. Llevar a cabo una revisión detallada del software de sistemas puede obstaculizar el cronograma de la auditoría, y es posible que un auditor de SI no sea técnicamente competente para realizar dicha revisión en el momento de la auditoría. C. Si hay debilidades de control descubiertas por un auditor de SI, deben ser reveladas. Al emitir una exención de responsabilidad (disclaimer), se renunciaría a esta responsabilidad. D. La opción adecuada sería revisar el software de sistemas relevante y recomendar una revisión detallada del software de sistemas para la cual se puedan recomendar recursos adicionales."
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
        justificacion: "A. El despliegue de los recursos de auditoría disponibles está determinado por las asignaciones de auditoría, las cuales están influenciadas por el proceso de planificación. B. Los asuntos a corto y largo plazo que impulsan la planificación de la auditoría pueden verse fuertemente afectados por cambios en el entorno de riesgo, las tecnologías y los procesos de negocio de la empresa. C. La carta de auditoría refleja el mandato de la alta gerencia hacia la función de auditoría y reside en un nivel más abstracto. D. La aplicabilidad de los estándares, directrices y procedimientos de auditoría de SI es universal para cualquier encargo de auditoría y no está influenciada por problemas a corto y largo plazo."
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
        justificacion: "A. Los hallazgos de una auditoría anterior son de interés para el auditor, pero no son el paso más crítico. El paso más crítico implica encontrar los problemas actuales o las áreas de alto riesgo, no revisar la resolución de problemas anteriores. B. No se requiere que la gerencia ejecutiva apruebe el plan de auditoría. Por lo general, es aprobado por el comité de auditoría o la junta directiva. La gerencia podría recomendar áreas a auditar. C. La revisión de las políticas y procedimientos de seguridad de la información normalmente se lleva a cabo durante el trabajo de campo, no en la planificación. D. De todos los pasos enumerados, realizar una evaluación de riesgos es el más crítico. La evaluación de riesgos es obligatoria según el Estándar 1201 de ISACA: los profesionales de auditoría y aseguramiento de TI deben identificar y evaluar el riesgo relevante para el área bajo revisión al planificar compromisos individuales. Si no se realiza una evaluación de riesgos, es posible que las áreas de alto riesgo no se identifiquen para su evaluación."
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
        justificacion: "A. La planificación de la auditoría requiere un enfoque basado en riesgos. B. La materialidad se refiere a debilidades potenciales o ausencias de controles al planificar un encargo específico, y si tales debilidades podrían resultar en una deficiencia significativa o una debilidad material. C. El monitoreo del fraude se refiere a la identificación de transacciones y patrones relacionados con el fraude y puede desempeñar un papel en la planificación de la auditoría, pero solo en la medida en que se relacione con el riesgo organizacional. D. La suficiencia de la evidencia de auditoría se refiere a la evaluación de la suficiencia de la evidencia obtenida para respaldar las conclusiones y alcanzar los objetivos específicos del encargo."
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
        justificacion: "A. Los controles preventivos son aquellos que evitan los problemas antes de que surjan. Los medios de respaldo no se pueden usar para prevenir daños a los archivos y, por lo tanto, no se pueden clasificar como controles preventivos. B. Los controles de gestión modifican los sistemas de procesamiento para minimizar las recurrencias del problema. Los medios de respaldo no modifican los sistemas de procesamiento. C. Un control correctivo ayuda a corregir o minimizar el impacto de un problema. Los medios de respaldo se pueden utilizar para restaurar los archivos en caso de daño a los mismos, reduciendo así el impacto de una interrupción. D. Los controles detectivos ayudan a detectar e informar problemas a medida que ocurren. Los medios de respaldo no ayudan a detectar errores."
      }
    ],
    2: [
      {
        id: 1,
        pregunta: "Para que la gerencia monitoree eficazmente el cumplimiento de procesos y aplicaciones, ¿qué sería lo MÁS ideal?",
        alternativas: [
          { id: "a", texto: "Repositorio central de documentos" },
          { id: "b", texto: "Sistema de gestión del conocimiento" },
          { id: "c", texto: "Un tablero (dashboard)" },
          { id: "d", texto: "Benchmarking" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Un repositorio central de documentos alberga una gran cantidad de datos, pero no necesariamente la información específica que sería útil para el monitoreo y el cumplimiento. B. Un sistema de gestión del conocimiento proporciona información valiosa, pero por lo general la gerencia no lo utiliza para fines de cumplimiento. C. Un panel de control (dashboard) proporciona información que ilustra el cumplimiento de los procesos, aplicaciones y elementos configurables, y mantiene a la empresa en el rumbo correcto. D. El benchmarking proporciona información para ayudar a los gerentes a adaptar la empresa rápidamente, de acuerdo con las tendencias y el entorno."
      },
      {
        id: 2,
        pregunta: "¿Qué se incluiría en un plan estratégico de SI?",
        alternativas: [
          { id: "a", texto: "Especificaciones de compras de hardware" },
          { id: "b", texto: "Análisis de objetivos de negocio futuros" },
          { id: "c", texto: "Fechas objetivo de proyectos de desarrollo" },
          { id: "d", texto: "Metas presupuestarias anuales de TI" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Las especificaciones para las compras de hardware planificadas no son elementos estratégicos. B. Los planes estratégicos de SI deben abordar las necesidades del negocio y cumplir con los objetivos comerciales futuros. Las compras de hardware pueden delinearse a grandes rasgos, pero no especificarse, y ni las metas presupuestarias ni los proyectos de desarrollo son opciones apropiadas. C. Las fechas objetivo para proyectos de desarrollo no son elementos estratégicos. D. Las metas presupuestarias anuales para el departamento de TI no son elementos estratégicos."
      },
      {
        id: 3,
        pregunta: "¿Cuál describe MEJOR el proceso de planificación estratégica del departamento de TI?",
        alternativas: [
          { id: "a", texto: "Tendrá planes de corto o largo plazo según los planes de la organización" },
          { id: "b", texto: "El plan no necesita ser tan detallado que ayude a priorizar" },
          { id: "c", texto: "La planificación de largo plazo debe reconocer las metas empresariales, avances tecnológicos y requisitos regulatorios" },
          { id: "d", texto: "La planificación de corto plazo no necesita integrarse con la de la empresa" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Por lo general, el departamento de TI tendrá planes a corto o a largo plazo que sean consistentes e integrados con los planes de la organización. B. Los planes deben estar orientados al tiempo y a los proyectos, y abordar los planes más amplios de la empresa orientados a alcanzar sus metas. C. La planificación a largo plazo para el departamento de TI debe reconocer las metas de la empresa, los avances tecnológicos y los requisitos regulatorios. D. La planificación a corto plazo para el departamento de TI debe integrarse en los planes a corto plazo de la empresa para permitir que el departamento de TI sea más ágil y receptivo a los avances tecnológicos necesarios."
      },
      {
        id: 4,
        pregunta: "¿Cuál es la responsabilidad MÁS importante de un oficial de seguridad de datos?",
        alternativas: [
          { id: "a", texto: "Recomendar y monitorear las políticas de seguridad de datos" },
          { id: "b", texto: "Promover la concienciación de seguridad" },
          { id: "c", texto: "Establecer procedimientos de políticas de seguridad de TI" },
          { id: "d", texto: "Administrar controles de acceso físico y lógico" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La principal responsabilidad de un oficial de seguridad de datos es recomendar y monitorear las políticas de seguridad de datos. B. Promover la concientización sobre seguridad dentro de la empresa es una de las responsabilidades de un oficial de seguridad de datos; sin embargo, es menos importante que recomendar y monitorear las políticas de seguridad de datos. C. El departamento de TI, y no el oficial de seguridad de datos, es responsable de establecer los procedimientos para las políticas de seguridad de TI recomendadas por el oficial de seguridad de datos. D. El departamento de TI, y no el oficial de seguridad de datos, es responsable de la administración de los controles de acceso físico y lógico."
      },
      {
        id: 5,
        pregunta: "¿Qué se considera el elemento MÁS crítico para implementar con éxito un programa de seguridad de la información?",
        alternativas: [
          { id: "a", texto: "Un marco de ERM efectivo" },
          { id: "b", texto: "El compromiso de la alta gerencia" },
          { id: "c", texto: "Un proceso de presupuestación adecuado" },
          { id: "d", texto: "Una planificación meticulosa del programa" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Un marco eficaz de gestión de riesgos empresariales (ERM) no es un factor clave de éxito para un programa de seguridad de la información. B. El compromiso de la alta gerencia proporciona la base indispensable para lograr el éxito en la implementación de un programa de seguridad de la información. C. Aunque un proceso eficaz de presupuestación de la seguridad de la información contribuirá al éxito, el compromiso de la alta gerencia es el elemento clave. D. La planificación del programa es importante, pero no será suficiente sin el compromiso de la alta gerencia."
      },
      {
        id: 6,
        pregunta: "Un auditor de SI debe asegurar que las medidas de desempeño de gobierno de TI:",
        alternativas: [
          { id: "a", texto: "Evalúen las actividades de los comités de supervisión de TI" },
          { id: "b", texto: "Provean impulsores estratégicos de TI" },
          { id: "c", texto: "Cumplan estándares regulatorios de reporte" },
          { id: "d", texto: "Evalúen al departamento de TI" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Evaluar las actividades de las juntas y comités que ejercen la supervisión es un aspecto importante del gobierno y debe medirse. B. Proporcionar impulsores estratégicos de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI. C. Adherirse a los estándares y definiciones de informes regulatorios es irrelevante para evaluar las medidas de desempeño del gobierno de TI. D. Evaluar al departamento de TI es irrelevante para evaluar las medidas de desempeño del gobierno de TI."
      },
      {
        id: 7,
        pregunta: "¿Qué tareas pueden realizarse por la misma persona en un centro de procesamiento bien controlado?",
        alternativas: [
          { id: "a", texto: "Administración de seguridad y gestión de cambios" },
          { id: "b", texto: "Operaciones de cómputo y desarrollo de sistemas" },
          { id: "c", texto: "Desarrollo de sistemas y gestión de cambios" },
          { id: "d", texto: "Desarrollo de sistemas y mantenimiento de sistemas" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Las funciones de administración de seguridad y gestión de cambios son incompatibles; el nivel de derechos de acceso de la administración de seguridad podría permitir que los cambios pasen desapercibidos. B. Operaciones de cómputo y desarrollo de sistemas es la opción incorrecta porque esto haría posible que un operador ejecute un programa que él mismo haya modificado. C. La combinación de desarrollo de sistemas y control de cambios permitiría que las modificaciones de programas eludan las aprobaciones de control de cambios. D. Es común que el desarrollo y el mantenimiento de sistemas sean asumidos por la misma persona; en ambos, el programador requiere acceso al código fuente en el entorno de desarrollo, pero no se le debe permitir el acceso en el entorno de producción."
      },
      {
        id: 8,
        pregunta: "¿Cuál es el control MÁS crítico sobre la administración de bases de datos (DBA)?",
        alternativas: [
          { id: "a", texto: "Aprobación de actividades del DBA" },
          { id: "b", texto: "Separación de funciones respecto al otorgamiento/revocación de derechos de acceso" },
          { id: "c", texto: "Revisión de logs de acceso" },
          { id: "d", texto: "Revisión del uso de herramientas de base de datos" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. La aprobación de las actividades de administración de bases de datos (DBA) no evita la combinación de funciones incompatibles; la revisión de registros de acceso y actividades es un control de detección. B. La segregación de funciones (SoD) evitará la combinación de funciones incompatibles; este es un control preventivo y es el control más crítico sobre el DBA. C. Revisar los registros de acceso y las actividades puede no reducir el riesgo si las actividades del DBA se aprueban de forma inadecuada. D. Revisar el uso de herramientas de base de datos no reduce el riesgo porque esto es únicamente un control detectivo y no previene la combinación de funciones incompatibles."
      },
      {
        id: 9,
        pregunta: "Cuando no se puede lograr una separación de funciones completa en un entorno en línea, ¿qué función debe separarse de las demás?",
        alternativas: [
          { id: "a", texto: "Origen" },
          { id: "b", texto: "Autorización" },
          { id: "c", texto: "Registro" },
          { id: "d", texto: "Corrección" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. La originación, en conjunto con el registro y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. B. La autorización debe separarse de todos los aspectos del mantenimiento de registros (originación, registro y corrección); dicha separación mejora la capacidad de detectar el registro de transacciones no autorizadas. C. El registro, en conjunto con la originación y la corrección, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro. D. La corrección, en conjunto con la originación y el registro, no habilita que la transacción sea autorizada para su procesamiento y asentada dentro del sistema de registro."
      },
      {
        id: 10,
        pregunta: "En una pequeña empresa donde un mismo empleado es operador de cómputo y programador de aplicaciones, ¿qué control debe recomendar el auditor?",
        alternativas: [
          { id: "a", texto: "Registro automatizado de cambios en bibliotecas de desarrollo" },
          { id: "b", texto: "Personal adicional para lograr SoD" },
          { id: "c", texto: "Procedimientos que verifiquen que solo se implementan cambios de programa aprobados" },
          { id: "d", texto: "Controles de acceso que impidan al operador modificar programas" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El registro automatizado de cambios en las bibliotecas de desarrollo no detectaría los cambios realizados en las bibliotecas de producción. B. En empresas más pequeñas, por lo general no es apropiado contratar personal adicional para lograr una separación estricta de funciones; el auditor de SI debe buscar alternativas. C. El auditor de SI debe recomendar procesos que detecten cambios en el código fuente y objeto de producción, como comparaciones de código, para que los cambios puedan ser revisados periódicamente por un tercero; este sería un proceso de control compensatorio. D. Los controles de acceso para evitar que el operador realice modificaciones a los programas requieren que un tercero realice los cambios, lo cual puede no ser práctico en una empresa pequeña."
      }
    ],
    3: [
      {
        id: 1,
        pregunta: "Para probar un sistema bancario esencial que se está adquiriendo, la empresa entregó al proveedor datos sensibles de producción. La preocupación PRIMARIA del auditor es que los datos sean:",
        alternativas: [
          { id: "a", texto: "Anonimizados/saneados (sanitized)" },
          { id: "b", texto: "Completos" },
          { id: "c", texto: "Representativos" },
          { id: "d", texto: "Actuales" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Los datos de prueba deben ser saneados (sanitized) para evitar que los datos sensibles se filtren a personas no autorizadas. B. Aunque es importante que el conjunto de datos esté completo, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. C. Aunque es importante abarcar una representación de los datos transaccionales, la preocupación principal es que los datos de prueba deben ser saneados para evitar filtraciones. D. Aunque es importante que el conjunto de datos represente los datos actuales que se están procesando, la preocupación principal sigue siendo la sanitización para evitar que los datos sensibles se filtren a personas no autorizadas."
      },
      {
        id: 2,
        pregunta: "¿Cuál es el propósito PRIMARIO de realizar pruebas en paralelo?",
        alternativas: [
          { id: "a", texto: "Determinar si el sistema es costo-efectivo" },
          { id: "b", texto: "Permitir pruebas exhaustivas de unidad y sistema" },
          { id: "c", texto: "Resaltar errores en interfaces de programa con archivos" },
          { id: "d", texto: "Asegurar que el nuevo sistema cumpla los requisitos del usuario" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Las pruebas en paralelo pueden mostrar que el sistema anterior es más rentable (cost-effective) que el nuevo sistema, pero esta no es la razón principal. B. Las pruebas unitarias y de sistema se completan antes de las pruebas en paralelo. C. Las interfaces del programa con los archivos se prueban en busca de errores durante las pruebas del sistema. D. El propósito de las pruebas en paralelo es asegurar que la implementación de un nuevo sistema cumplirá con los requisitos del usuario."
      },
      {
        id: 3,
        pregunta: "Al revisar una reingeniería de procesos de negocio (BPR), el auditor encuentra que se eliminó un control preventivo importante. Debe:",
        alternativas: [
          { id: "a", texto: "Informar a la gerencia y determinar si acepta el riesgo material potencial" },
          { id: "b", texto: "Determinar si un control detectivo lo reemplazó y, si no, reportarlo" },
          { id: "c", texto: "Recomendar reincorporar todos los controles previos" },
          { id: "d", texto: "Desarrollar un enfoque de auditoría continua" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La gerencia debe ser informada inmediatamente para determinar si está dispuesta a aceptar el riesgo material potencial de no tener implementado ese control preventivo. B. La existencia de un control detectivo en lugar de un control preventivo generalmente incrementa el riesgo de que ocurra un problema material. C. A menudo, durante una reingeniería de procesos de negocio (BPR), se eliminan muchos controles que no agregan valor. Esto es bueno, a menos que los controles incrementen el riesgo comercial y financiero. D. Un auditor de SI puede querer recomendar que la gerencia monitoree el nuevo proceso, pero esto debe hacerse solo después de que la gerencia haya sido informada y acepte el riesgo."
      },
      {
        id: 4,
        pregunta: "¿Qué edición de validación de datos es eficaz para detectar errores de transposición y transcripción?",
        alternativas: [
          { id: "a", texto: "Rango (range check)" },
          { id: "b", texto: "Dígito de control (check digit)" },
          { id: "c", texto: "Validez" },
          { id: "d", texto: "Duplicados" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Una verificación de rango comprueba datos que coinciden con un rango de valores predeterminado. B. Un dígito de control es un valor numérico que se calcula matemáticamente y se añade a los datos para asegurar que los datos originales no hayan sido alterados. Este control es eficaz para detectar errores de transposición y transcripción. C. Una verificación de validez es una comprobación programada de la validez de los datos de acuerdo con criterios predeterminados. D. En una verificación de duplicados, las transacciones nuevas o recientes se cotejan con las ingresadas anteriormente para asegurar que no estén ya en el sistema."
      },
      {
        id: 5,
        pregunta: "¿Qué debilidad sería la MÁS significativa en un ERP usado por una entidad financiera?",
        alternativas: [
          { id: "a", texto: "No se han revisado los controles de acceso" },
          { id: "b", texto: "Documentación limitada" },
          { id: "c", texto: "Medios de respaldo de dos años sin reemplazar" },
          { id: "d", texto: "Respaldos de base de datos una vez al día" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La falta de revisión de los controles de acceso en una empresa financiera puede tener graves consecuencias dados los tipos de datos y activos a los que se puede acceder. B. La falta de documentación puede no ser tan grave como no tener los controles de acceso debidamente revisados. C. Es posible que no se puedan recuperar datos de medios de respaldo de dos años de antigüedad. D. Para el negocio puede ser aceptable realizar respaldos de la base de datos una vez al día, dependiendo del volumen de transacciones."
      },
      {
        id: 6,
        pregunta: "Al auditar la fase de requisitos de una adquisición de software, el auditor debe:",
        alternativas: [
          { id: "a", texto: "Evaluar la razonabilidad del cronograma" },
          { id: "b", texto: "Evaluar los procesos de calidad del proveedor" },
          { id: "c", texto: "Asegurar que se adquiera el mejor paquete" },
          { id: "d", texto: "Revisar la completitud de las especificaciones" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Normalmente, el cronograma de un proyecto no se encuentra en un documento de requisitos. B. La evaluación de los procesos de calidad del proveedor se realiza después de que se han completado los requisitos. C. La decisión de adquirir un paquete comercial de un proveedor se toma después de que se han completado los requisitos. D. El propósito de la fase de requisitos es especificar la funcionalidad del sistema propuesto; por lo tanto, un auditor de SI se concentraría en la completitud de las especificaciones."
      },
      {
        id: 7,
        pregunta: "Al comprar un paquete de software en vez de desarrollarlo, las fases de diseño y desarrollo del SDLC tradicional se reemplazan por:",
        alternativas: [
          { id: "a", texto: "Fases de selección y configuración" },
          { id: "b", texto: "Factibilidad y requisitos" },
          { id: "c", texto: "Implementación y pruebas" },
          { id: "d", texto: "No se requiere reemplazo" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Con un paquete comprado, las fases de diseño y desarrollo del ciclo de vida tradicional se reemplazan con las fases de selección y configuración. Se solicita una propuesta al proveedor de sistemas empaquetados y se evalúa contra criterios predefinidos para la selección, antes de tomar la decisión de comprar el software. Después de que se adquiere el software, se configura para satisfacer los requisitos de la empresa. B. Las otras fases del SDLC, tales como el estudio de factibilidad, la definición de requisitos, la implementación y la postimplementación, permanecen inalteradas. C. Las otras fases del SDLC permanecen inalteradas. D. En este escenario, las fases de diseño y desarrollo del ciclo de vida tradicional sí son reemplazables por las fases de selección y configuración."
      },
      {
        id: 8,
        pregunta: "Las especificaciones de usuario no se cumplieron en un proyecto con metodología waterfall. ¿Cuál es la fuente MÁS probable de la causa?",
        alternativas: [
          { id: "a", texto: "Aseguramiento de calidad (QA)" },
          { id: "b", texto: "Requisitos" },
          { id: "c", texto: "Desarrollo" },
          { id: "d", texto: "Capacitación de usuarios" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. El aseguramiento de calidad (QA) se enfoca en aspectos formales del desarrollo de software, tales como adherirse a estándares de codificación o a una metodología de desarrollo específica. B. Fallar en las especificaciones de usuario implica que la ingeniería de requisitos se ha realizado para describir las demandas de los usuarios; de lo contrario, no habría una línea base de especificaciones contra la cual verificar. C. La gestión del proyecto falló al no establecer o no verificar los controles que aseguran que el software en desarrollo se apegue a esas especificaciones de usuario. D. Una falla en cumplir las especificaciones de usuario podría manifestarse durante la capacitación del usuario o en las pruebas de aceptación, pero no es la causa."
      },
      {
        id: 9,
        pregunta: "Al introducir una arquitectura de cliente ligero (thin client), ¿qué tipo de riesgo de servidores aumenta significativamente?",
        alternativas: [
          { id: "a", texto: "Integridad" },
          { id: "b", texto: "Concurrencia" },
          { id: "c", texto: "Confidencialidad" },
          { id: "d", texto: "Disponibilidad" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Debido a que los otros elementos no necesitan cambiar, el riesgo de integridad no se incrementa. B. Debido a que los otros elementos no necesitan cambiar, el riesgo de concurrencia no se incrementa. C. Debido a que los otros elementos no necesitan cambiar, el riesgo de confidencialidad no se incrementa. D. El cambio principal al usar una arquitectura de cliente ligero es hacer que los servidores sean críticos para la operación. Por lo tanto, la probabilidad de que uno de ellos falle se incrementa y, como resultado, el riesgo de disponibilidad aumenta."
      },
      {
        id: 10,
        pregunta: "¿Qué se asocia MÁS comúnmente con una metodología de desarrollo ágil?",
        alternativas: [
          { id: "a", texto: "Dependencia de documentación detallada" },
          { id: "b", texto: "Dependencia de procedimientos operativos estrictos" },
          { id: "c", texto: "Falta de requisitos de usuario" },
          { id: "d", texto: "Fuerte dependencia del conocimiento tácito" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. La documentación del proyecto generalmente queda en segundo plano frente a la funcionalidad real para la metodología de desarrollo ágil. B. Procedimientos operativos estándar estrictos serían perjudiciales para la capacidad del desarrollador de pensar de forma creativa y colaborativa. C. Todas las metodologías de desarrollo requieren alguna forma de definición de requisitos. Ágil se basa en que los requisitos claros se definan por adelantado. D. El conocimiento tácito (es decir, el conocimiento implícito adquirido por la experiencia y difícil de documentar) es aprovechado enormemente por los métodos ágiles para aumentar la colaboración y la creatividad de los equipos de desarrollo."
      }
    ],
    4: [
      {
        id: 1,
        pregunta: "¿Cuál es el MEJOR método para determinar el nivel de desempeño de instalaciones de procesamiento de información (IPF) similares?",
        alternativas: [
          { id: "a", texto: "Satisfacción del usuario" },
          { id: "b", texto: "Logro de metas" },
          { id: "c", texto: "Benchmarking" },
          { id: "d", texto: "Planificación de capacidad y crecimiento" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. La satisfacción del usuario es la medida para asegurar que una operación eficaz de procesamiento de información cumpla con los requisitos del usuario. B. El cumplimiento de metas evalúa la efectividad implicada al comparar el desempeño con metas predefinidas. C. La evaluación comparativa (benchmarking) proporciona un medio para determinar el nivel de desempeño ofrecido por entornos similares de centros de procesamiento de información (IPF). D. La planificación de capacidad y crecimiento es esencial debido a la importancia de TI en las organizaciones y al cambio tecnológico constante."
      },
      {
        id: 2,
        pregunta: "Para sistemas de misión crítica con baja tolerancia a interrupciones y alto costo de recuperación, ¿qué opción de recuperación se recomienda en principio?",
        alternativas: [
          { id: "a", texto: "Sitio móvil" },
          { id: "b", texto: "Sitio cálido (warm)" },
          { id: "c", texto: "Sitio frío (cold)" },
          { id: "d", texto: "Sitio caliente (hot site)" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Los sitios móviles son tráileres especialmente diseñados que pueden transportarse rápidamente a una ubicación de la empresa o a un sitio alterno para proporcionar un centro de procesamiento de información (IPF) previamente acondicionado. B. Los sitios templados (warm sites) están parcialmente configurados, por lo general con conexiones de red y equipos periféricos seleccionados, pero sin la computadora principal. C. Los sitios en frío (cold sites) solo cuentan con el entorno básico para operar un IPF. Están listos para recibir equipo, pero no ofrecen ningún componente en el sitio antes de presentarse la necesidad. D. Los sitios en caliente (hot sites) están completamente configurados y listos para operar en unas pocas horas o, en algunos casos, incluso minutos."
      },
      {
        id: 3,
        pregunta: "¿Cuál es el método MÁS eficaz para probar el proceso de gestión de cambios de programas?",
        alternativas: [
          { id: "a", texto: "Rastrear desde información generada por el sistema hacia la documentación de gestión de cambios" },
          { id: "b", texto: "Examinar la documentación en busca de evidencia de exactitud" },
          { id: "c", texto: "Rastrear desde la documentación hacia una pista de auditoría del sistema" },
          { id: "d", texto: "Examinar la documentación en busca de evidencia de completitud" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Al probar la gestión de cambios, el auditor de SI debe comenzar con la información generada por el sistema, que contiene la fecha y la hora en que un módulo se actualizó por última vez, y rastrear desde allí hacia la documentación que autoriza el cambio. B. Enfocarse exclusivamente en la exactitud de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados. C. Rastrear en la dirección opuesta correría el riesgo de no detectar cambios indocumentados. D. Enfocarse exclusivamente en la exhaustividad (completeness) de la documentación examinada no asegura que todos los cambios hayan sido, de hecho, documentados."
      },
      {
        id: 4,
        pregunta: "¿Qué permitiría a una empresa extender su intranet a través de Internet hacia sus socios de negocio?",
        alternativas: [
          { id: "a", texto: "Red privada virtual (VPN)" },
          { id: "b", texto: "Cliente-servidor" },
          { id: "c", texto: "Acceso dial-up" },
          { id: "d", texto: "Proveedor de servicios de red (NSP)" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La tecnología de red privada virtual (VPN) permite a los socios externos participar de forma segura en la extranet utilizando redes públicas como transporte. Las VPN se basan en técnicas de tunelización/encapsulamiento, las cuales permiten que el Protocolo de Internet (IP) transporte una variedad de protocolos diferentes. B. Cliente-servidor se refiere a un grupo de computadoras dentro de una organización conectadas por una red interna donde el cliente es la máquina solicitante y el servidor es la máquina proveedora; no aborda la extensión de la red hacia los socios comerciales. C. Aunque técnicamente sea posible extender la intranet mediante acceso telefónico (dial-up), no sería práctico ni rentable hacerlo. D. Un proveedor de servicios de red puede brindar servicios a una red privada compartida al proporcionar servicios de Internet, pero no extiende la intranet de una organización."
      },
      {
        id: 5,
        pregunta: "La clasificación por criticidad de una aplicación en un plan de continuidad del negocio se determina por:",
        alternativas: [
          { id: "a", texto: "La naturaleza del negocio y el valor de la aplicación para el negocio" },
          { id: "b", texto: "El costo de reemplazo" },
          { id: "c", texto: "El soporte del proveedor disponible" },
          { id: "d", texto: "Las amenazas y vulnerabilidades asociadas" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La clasificación de criticidad está determinada por el rol del sistema de aplicación en el respaldo de la estrategia de la organización. B. El costo de reposición de la aplicación no refleja el valor relativo de la aplicación para el negocio. C. El soporte del proveedor no es un factor relevante para determinar la clasificación de criticidad. D. Las amenazas y vulnerabilidades asociadas se evaluarán únicamente si la aplicación es crítica para el negocio."
      },
      {
        id: 6,
        pregunta: "Al auditar la seguridad de bases de datos cliente-servidor, la MAYOR preocupación es la disponibilidad de:",
        alternativas: [
          { id: "a", texto: "Utilidades del sistema" },
          { id: "b", texto: "Generadores de programas de aplicación" },
          { id: "c", texto: "Documentación de seguridad de sistemas" },
          { id: "d", texto: "Acceso a procedimientos almacenados" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Las utilidades del sistema pueden permitir que se realicen cambios no autorizados en los datos de la base de datos cliente-servidor. En una auditoría de seguridad de bases de datos, los controles sobre tales utilidades serían la principal preocupación del auditor de SI. B. Los generadores de programas de aplicación son una parte intrínseca de la tecnología cliente-servidor, y el auditor de SI evaluaría los controles sobre los derechos de acceso del generador a la base de datos en lugar de su disponibilidad. C. La documentación de seguridad debe restringirse al personal de seguridad autorizado, pero esta no es una preocupación principal. D. El acceso a los procedimientos almacenados no es una preocupación principal."
      },
      {
        id: 7,
        pregunta: "Al revisar una red usada para comunicaciones por Internet, el auditor PRIMERO examinará:",
        alternativas: [
          { id: "a", texto: "La validez de los cambios de contraseña" },
          { id: "b", texto: "La arquitectura de la aplicación cliente-servidor" },
          { id: "c", texto: "La arquitectura y diseño de la red" },
          { id: "d", texto: "La protección de firewall y servidores proxy" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. La revisión de la validez de los cambios de contraseñas se realizaría como parte de las pruebas sustantivas. B. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas de información y la arquitectura de acceso, incluyendo las aplicaciones cliente-servidor. C. El primer paso al auditar una red es comprender la arquitectura y el diseño de la red. Esto proporciona una imagen general de la red y su conectividad. D. Comprender la arquitectura y el diseño de la red es el punto de partida para identificar las distintas capas, tales como servidores proxy y firewalls."
      },
      {
        id: 8,
        pregunta: "El auditor de SI debe involucrarse en:",
        alternativas: [
          { id: "a", texto: "Observar las pruebas del plan de recuperación ante desastres (DRP)" },
          { id: "b", texto: "Desarrollar el DRP" },
          { id: "c", texto: "Mantener el DRP" },
          { id: "d", texto: "Revisar los requisitos de recuperación de contratos de proveedores" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El auditor de SI siempre debe estar presente cuando se prueban los planes de recuperación ante desastres (DRP) para asegurar que los procedimientos de recuperación probados alcancen los objetivos requeridos de restauración, que los procedimientos de recuperación sean efectivos y eficientes, y para informar sobre los resultados según corresponda. B. Los auditores de SI pueden participar en la supervisión del desarrollo del plan, pero es poco probable que participen en el proceso de desarrollo en sí. C. Se puede llevar a cabo una auditoría de los procedimientos de mantenimiento del plan, pero el auditor de SI normalmente no tendría ninguna responsabilidad sobre el mantenimiento en sí. D. A un auditor de SI se le puede pedir que comente sobre varios elementos de un contrato de proveedor, pero este no siempre es el caso."
      },
      {
        id: 9,
        pregunta: "La duplicación (mirroring) de datos debe implementarse como estrategia de recuperación cuando:",
        alternativas: [
          { id: "a", texto: "El RPO es bajo" },
          { id: "b", texto: "El RPO es alto" },
          { id: "c", texto: "El RTO es alto" },
          { id: "d", texto: "La tolerancia al desastre es alta" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El objetivo de punto de recuperación (RPO) indica la antigüedad de los datos recuperados. Si el RPO es muy bajo, como minutos, significa que la organización no puede darse el lujo de perder siquiera unos pocos minutos de datos. En tales casos, la duplicación de datos (replicación sincrónica) debe utilizarse como estrategia de recuperación. B. Si el RPO es alto, como horas, entonces se podrían utilizar otros procedimientos de respaldo. C. Un objetivo de tiempo de recuperación (RTO) alto significa que el sistema de TI puede no ser necesario inmediatamente después de la interrupción; puede recuperarse más tarde. D. El RTO es el tiempo a partir de la interrupción durante el cual el negocio puede tolerar la indisponibilidad de las instalaciones de TI. Si el RTO es alto, se pueden utilizar estrategias de recuperación más lentas."
      },
      {
        id: 10,
        pregunta: "¿Qué componente de un BCP es PRINCIPALMENTE responsabilidad del departamento de TI de la organización?",
        alternativas: [
          { id: "a", texto: "Desarrollar el BCP" },
          { id: "b", texto: "Seleccionar y aprobar las estrategias de recuperación" },
          { id: "c", texto: "Declarar un desastre" },
          { id: "d", texto: "Restaurar los sistemas y datos de TI después de un desastre" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Los miembros de la alta gerencia de la organización son los principales responsables de supervisar el desarrollo del plan de continuidad del negocio (BCP) y son responsables de los resultados (accountable). B. La gerencia también es responsable de seleccionar y aprobar las estrategias utilizadas para la recuperación ante desastres. C. TI puede estar involucrado en la declaración de un desastre, pero no es el responsable principal. D. El departamento de TI de una organización es el principal responsable de restaurar los sistemas y datos de TI después de un desastre dentro de los plazos designados."
      }
    ],
    5: [
      {
        id: 1,
        pregunta: "Al revisar la configuración de un sistema de detección de intrusos (IDS) basado en firmas, ¿qué preocuparía MÁS al auditor?",
        alternativas: [
          { id: "a", texto: "La autoactualización está desactivada" },
          { id: "b", texto: "El escaneo de vulnerabilidades de aplicación está desactivado" },
          { id: "c", texto: "El análisis de paquetes cifrados está desactivado" },
          { id: "d", texto: "El IDS está ubicado entre la DMZ y el firewall" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El aspecto más importante de un sistema de detección de intrusos (IDS) basado en firmas es su capacidad para proteger contra patrones de intrusión conocidos (firmas); dichas firmas son provistas por el proveedor y son fundamentales para proteger a la empresa frente a ataques externos. B. Una de las desventajas clave de un IDS es su incapacidad inherente para escanear en busca de vulnerabilidades a nivel de aplicación. C. Un IDS no puede descifrar paquetes de datos cifrados para identificar el origen del tráfico entrante. D. Una zona desmilitarizada (DMZ) es un segmento de red interno en el que se alojan los sistemas accesibles al público; para proporcionar la mayor seguridad y eficiencia, un IDS debe colocarse detrás del firewall para que detecte solo aquellos ataques/intrusos que logran entrar a través del firewall."
      },
      {
        id: 2,
        pregunta: "¿Qué provee MEJOR el control de acceso a datos de nómina procesados en un servidor local?",
        alternativas: [
          { id: "a", texto: "Registrar el acceso a información personal" },
          { id: "b", texto: "Usar contraseñas separadas para transacciones sensibles" },
          { id: "c", texto: "Usar software que restrinja las reglas de acceso al personal autorizado" },
          { id: "d", texto: "Restringir el acceso del sistema al horario laboral" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Registrar el acceso a la información personal es un buen control ya que permitirá analizar el acceso en caso de preocupación sobre accesos no autorizados; sin embargo, no prevendrá el acceso. B. Restringir el acceso a transacciones sensibles solo restringirá el acceso a una parte de los datos; no prevendrá el acceso a los demás datos. C. La seguridad del servidor y del sistema debe definirse para permitir únicamente que los miembros del personal autorizados accedan a la información sobre el personal cuyos registros gestionan en el día a día. D. Restringir el acceso al sistema al horario comercial solo afectaría el momento en que podría ocurrir un acceso no autorizado y no prevendría dicho acceso en otros momentos."
      },
      {
        id: 3,
        pregunta: "En una organización con un mainframe y dos servidores de base de datos donde residen todos los datos de producción, ¿qué debilidad sería la MÁS seria?",
        alternativas: [
          { id: "a", texto: "El oficial de seguridad también es el DBA" },
          { id: "b", texto: "No hay controles de contraseña en los dos servidores de base de datos" },
          { id: "c", texto: "No hay BCP para aplicaciones no críticas del mainframe" },
          { id: "d", texto: "Las LAN no respaldan regularmente los discos de servidor de archivos" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Que el oficial de seguridad se desempeñe también como administrador de base de datos, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. B. La ausencia de controles de contraseñas en los dos servidores de bases de datos, donde residen los datos de producción, es la debilidad más crítica. C. No tener un plan de continuidad de negocio (BCP) para las aplicaciones no críticas del sistema mainframe, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas. D. Que las redes de área local (LAN) no realicen copias de seguridad de los discos fijos de los servidores de archivos con regularidad, aunque es una debilidad de control, no conlleva el mismo impacto desastroso que la ausencia de controles de contraseñas."
      },
      {
        id: 4,
        pregunta: "Al implementar inicio de sesión único (SSO) en todos los sistemas, la organización debe saber que:",
        alternativas: [
          { id: "a", texto: "El acceso no autorizado máximo sería posible si se divulga una contraseña" },
          { id: "b", texto: "Los derechos de acceso se restringirían por parámetros de seguridad adicionales" },
          { id: "c", texto: "La carga del administrador de seguridad aumentaría" },
          { id: "d", texto: "Los derechos de acceso del usuario aumentarían" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Si se revela una contraseña cuando el inicio de sesión único (SSO) está habilitado, existe el riesgo de que sea posible el acceso no autorizado a todos los sistemas. B. Los derechos de acceso de los usuarios deben permanecer sin cambios con el SSO, ya que es posible que no se implementen parámetros de seguridad adicionales. C. Uno de los beneficios previstos del SSO es la simplificación de la administración de la seguridad. D. Uno de los beneficios previstos del SSO es la improbabilidad de un incremento en la carga de trabajo."
      },
      {
        id: 5,
        pregunta: "Al revisar una implementación de VoIP en una WAN corporativa, el auditor debería esperar encontrar:",
        alternativas: [
          { id: "a", texto: "Ingeniería de tráfico" },
          { id: "b", texto: "Un enlace de datos ISDN" },
          { id: "c", texto: "Cifrado WEP de los datos" },
          { id: "d", texto: "Terminales telefónicos analógicos" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Para garantizar que se cumplan los requisitos de calidad de servicio (QoS), el servicio de VoIP a través de la WAN debe protegerse frente a pérdidas de paquetes, latencia o fluctuación (jitter); para alcanzar este objetivo, el rendimiento de la red se puede gestionar a fin de proporcionar QoS mediante el uso de técnicas estadísticas, como la ingeniería de tráfico (traffic engineering). B. El ancho de banda estándar de un enlace de datos de red digital de servicios integrados (ISDN) no proporcionaría la QoS requerida para los servicios corporativos de VoIP. C. WEP (Wired Equivalent Privacy) es un esquema de cifrado relacionado con redes inalámbricas. D. Los teléfonos VoIP generalmente están conectados a una red de área local (LAN) corporativa y no son analógicos."
      },
      {
        id: 6,
        pregunta: "Una aseguradora usa nube pública para una aplicación crítica para reducir costos. ¿Qué preocuparía MÁS al auditor?",
        alternativas: [
          { id: "a", texto: "Incapacidad de recuperar el servicio ante una falla técnica mayor" },
          { id: "b", texto: "Que los datos en el entorno compartido sean accedidos por otras empresas" },
          { id: "c", texto: "Que el proveedor no incluya soporte investigativo para incidentes" },
          { id: "d", texto: "La viabilidad a largo plazo del proveedor" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los beneficios de la computación en la nube son la redundancia y la capacidad de acceder a los sistemas y datos en caso de una falla técnica. B. Considerando que una compañía de seguros debe preservar la privacidad y la confidencialidad de la información del cliente, el acceso no autorizado a la información y las fugas de datos son las principales preocupaciones. C. La capacidad de investigar un incidente es importante, pero lo más importante es abordar el riesgo de un incidente: la exposición de datos confidenciales. D. Si un proveedor de servicios en la nube quiebra, los datos aún deberían estar disponibles a partir de las copias de seguridad."
      },
      {
        id: 7,
        pregunta: "¿Qué determina MEJOR si existen protocolos completos de cifrado y autenticación para proteger la información en tránsito?",
        alternativas: [
          { id: "a", texto: "Firma digital con RSA" },
          { id: "b", texto: "Trabajo en modo túnel con los servicios anidados de AH y ESP" },
          { id: "c", texto: "Certificados digitales con RSA" },
          { id: "d", texto: "Trabajo en modo transporte con AH y ESP anidados" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Una firma digital proporciona autenticación e integridad. B. El modo túnel (tunnel mode) proporciona cifrado y autenticación del paquete completo del Protocolo de Internet (IP); para lograr esto, los servicios de cabecera de autenticación (AH) y de carga útil de seguridad encapsuladora (ESP) se pueden anidar. C. Un certificado digital proporciona autenticación e integridad. D. El modo de transporte proporciona protección primaria para las capas superiores de los protocolos (es decir, la protección se extiende al campo de datos [carga útil o payload] de un paquete IP)."
      },
      {
        id: 8,
        pregunta: "¿Qué preocupación de seguridad de un mensaje electrónico abordan las firmas digitales?",
        alternativas: [
          { id: "a", texto: "Alteración" },
          { id: "b", texto: "Lectura no autorizada" },
          { id: "c", texto: "Robo" },
          { id: "d", texto: "Copia no autorizada" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Una firma digital incluye un total hash cifrado del tamaño del mensaje tal como fue transmitido por su originador; este hash ya no sería exacto si el mensaje se alterara posteriormente, indicando así que la alteración ha ocurrido. B. Las firmas digitales no identificarán, evitarán ni disuadirán la lectura no autorizada. C. Las firmas digitales no identificarán, evitarán ni disuadirán el robo. D. Las firmas digitales no identificarán, evitarán ni disuadirán la copia no autorizada."
      },
      {
        id: 9,
        pregunta: "¿Qué caracteriza un ataque de denegación de servicio distribuido (DDoS)?",
        alternativas: [
          { id: "a", texto: "Iniciación central de computadoras intermediarias para dirigir tráfico espurio simultáneo a un sitio objetivo específico" },
          { id: "b", texto: "Iniciación local de computadoras intermediarias hacia múltiples sitios" },
          { id: "c", texto: "Iniciación central de una computadora primaria hacia múltiples sitios objetivo" },
          { id: "d", texto: "Iniciación local con tráfico escalonado" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Esto describe de la mejor manera un ataque de denegación de servicio distribuido (DDoS); tales ataques se inician de forma centralizada e involucran el uso de múltiples computadoras comprometidas, operando mediante la inundación del sitio objetivo con tráfico de mensajes espurios para sobrecargar la red; para lograr este objetivo, los ataques deben dirigirse a un objetivo específico y ocurrir simultáneamente. B. Los ataques DDoS no se inician localmente. C. Los ataques DDoS no se inician utilizando una computadora primaria única. D. Los ataques DDoS no son escalonados (staggered)."
      },
      {
        id: 10,
        pregunta: "¿Cuál es el control antivirus preventivo MÁS eficaz?",
        alternativas: [
          { id: "a", texto: "Escanear los adjuntos de correo en el servidor de correo" },
          { id: "b", texto: "Restaurar sistemas desde copias limpias" },
          { id: "c", texto: "Deshabilitar los puertos USB" },
          { id: "d", texto: "Escaneo antivirus en línea con definiciones actualizadas" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. El escaneo de archivos adjuntos de correo electrónico en el servidor de correo es un control preventivo; evitará que los destinatarios abran archivos de correo electrónico infectados, lo que causaría la infección de sus equipos. B. Restaurar los sistemas a partir de copias limpias garantizará que no se introduzcan virus provenientes de copias o respaldos infectados. C. Deshabilitar los puertos USB evita que se copien archivos infectados desde una unidad USB hacia un equipo. D. El software antivirus se puede utilizar para prevenir ataques de virus; la ejecución de análisis regulares es útil para detectar infecciones por virus que ya han ocurrido; se requieren actualizaciones regulares del software para garantizar que pueda detectar y tratar los virus a medida que surgen."
      }
    ]
  },
  casos: {
    1: [
      {
        id: 1,
        pregunta: "¿Qué debe hacer el auditor de SI PRIMERO?",
        alternativas: [
          { id: "a", texto: "Auditoría de encuesta de controles de acceso lógico" },
          { id: "b", texto: "Revisar el plan de auditoría hacia un enfoque basado en riesgo" },
          { id: "c", texto: "Realizar una evaluación de riesgo de TI" },
          { id: "d", texto: "Comenzar a probar los controles que considere más críticos" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Realizar una auditoría de encuesta de controles de acceso lógico ocurriría después de una evaluación de riesgos de TI. B. Revisar el plan de auditoría para enfocarse en una auditoría basada en riesgos ocurriría después de una evaluación de riesgos de TI. C. Se debe realizar primero una evaluación de riesgos de TI para determinar qué áreas presentan el mayor riesgo y qué controles mitigan ese riesgo. Aunque se han creado narrativas y flujos de procesos, la organización aún no ha evaluado cuáles controles son críticos. D. Probar los controles que el auditor de SI considere más críticos ocurriría después de una evaluación de riesgos de TI."
      },
      {
        id: 2,
        pregunta: "Al auditar la seguridad lógica, ¿qué preocupa MÁS al auditor?",
        alternativas: [
          { id: "a", texto: "Que la cuenta de administrador del sistema sea conocida por todos" },
          { id: "b", texto: "Que las contraseñas no cambien con frecuencia" },
          { id: "c", texto: "Que el administrador de red tenga permisos excesivos" },
          { id: "d", texto: "Ausencia de política escrita de gestión de privilegios" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Que la cuenta de administrador del sistema sea conocida por todos es lo más peligroso. En ese caso, cualquier usuario podría realizar cualquier acción en el sistema, incluido el acceso a archivos y ajustes de permisos y parámetros. B. El cambio poco frecuente de contraseñas presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. C. Que se le otorguen permisos excesivos al administrador de red presentaría una preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema. D. La ausencia de una política de gestión de privilegios sería motivo de preocupación, pero no sería tan grave como que todos conozcan la cuenta de administrador del sistema."
      },
      {
        id: 3,
        pregunta: "Al probar la gestión de cambios de programas, ¿cómo debe seleccionarse la muestra?",
        alternativas: [
          { id: "a", texto: "Documentos de gestión de cambios al azar" },
          { id: "b", texto: "Cambios en el código de producción, rastreados hasta la documentación de autorización" },
          { id: "c", texto: "Documentos según criticidad del sistema" },
          { id: "d", texto: "Cambios en producción rastreados a logs del sistema" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. B. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación adecuada. En consecuencia, los cambios en el código de producción proporcionan la base más apropiada para seleccionar una muestra. C. Cuando se elige una muestra a partir de un conjunto de documentos de control, no hay forma de asegurar que cada cambio esté acompañado por la documentación de control adecuada. D. Al probar un control, es recomendable rastrear desde el elemento que está siendo controlado hacia la documentación de control correspondiente."
      },
      {
        id: 4,
        pregunta: "La PRIMERA prioridad del auditor en el año uno debe ser estudiar:",
        alternativas: [
          { id: "a", texto: "Informes de auditorías previas" },
          { id: "b", texto: "La carta de auditoría, para planificar el cronograma" },
          { id: "c", texto: "El impacto de la rotación de empleados" },
          { id: "d", texto: "El impacto de la implementación de un nuevo ERP" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los informes previos de auditoría de SI se revisarán para evitar trabajo redundante y para usarlos como referencia al realizar el trabajo de auditoría de SI. B. La carta de auditoría (audit charter) define el propósito, la autoridad y la responsabilidad de las actividades de auditoría de SI. También sienta las bases para las próximas actividades. C. El impacto de la rotación de empleados se abordaría al negociar actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar. D. El impacto de la implementación de un nuevo ERP se abordaría al negociar las actividades de seguimiento para las áreas respectivas si existe alguna brecha que cerrar."
      },
      {
        id: 5,
        pregunta: "¿Cómo debe evaluar el auditor el respaldo y procesamiento por lotes en operaciones de cómputo?",
        alternativas: [
          { id: "a", texto: "Confiar en el informe del auditor de servicio" },
          { id: "b", texto: "Estudiar el contrato con el proveedor" },
          { id: "c", texto: "Comparar el informe de entrega de servicio con el SLA" },
          { id: "d", texto: "Planificar y ejecutar una revisión independiente de las operaciones de cómputo" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. El informe del auditor de servicio no puede asegurar el descubrimiento de ineficiencias de control. B. La revisión del contrato no puede asegurar el descubrimiento de ineficiencias de control. C. Comparar el informe de entrega de servicios con el acuerdo de nivel de servicio (SLA) no puede asegurar el descubrimiento de ineficiencias de control. D. La auditoría de SI debe realizar una revisión independiente del respaldo y del procesamiento por lotes. Todas las demás opciones no pueden asegurar el descubrimiento de ineficiencias de control en el proceso."
      },
      {
        id: 6,
        pregunta: "Durante el trabajo diario, el auditor advierte que la revisión de logs puede no detectar errores a tiempo. ¿A qué tipo de riesgo corresponde esto?",
        alternativas: [
          { id: "a", texto: "Riesgo inherente" },
          { id: "b", texto: "Riesgo residual" },
          { id: "c", texto: "Riesgo de control" },
          { id: "d", texto: "Riesgo material" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Este no es un ejemplo de riesgo inherente. El riesgo inherente es el nivel de riesgo o exposición sin considerar las acciones que la gerencia ha tomado o podría tomar (por ejemplo, implementar controles). B. Este no es un ejemplo de riesgo residual. El riesgo residual es el riesgo restante después de que la gerencia ha implementado una respuesta al riesgo. C. El riesgo de control existe cuando un riesgo no puede ser prevenido o detectado de manera oportuna por el sistema de controles de SI, lo cual se describe en este caso. D. Este no es un ejemplo de riesgo material. El riesgo material es cualquier riesgo lo suficientemente grande como para amenazar el éxito general del negocio de manera material."
      }
    ],
    2: [
      {
        id: 1,
        pregunta: "¿Qué debería preocupar MÁS al auditor sobre la estrategia de negocio de TI de Accenco?",
        alternativas: [
          { id: "a", texto: "Los documentos de estrategia son informales e incompletos" },
          { id: "b", texto: "El comité de riesgo casi no se reúne y no deja actas" },
          { id: "c", texto: "Los presupuestos no parecen adecuados" },
          { id: "d", texto: "No hay CIO de tiempo completo" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. TI pierde de vista la dirección de la empresa sin documentos de estrategia explícitos, lo que dificulta la selección de proyectos y complica la definición de los niveles de servicio; en general, TI se vuelve subóptima en la entrega y en la obtención de valor. B. El hecho de que el comité de gestión de riesgos no celebre reuniones periódicas ni elabore una documentación adecuada implica una falta de buen gobierno del riesgo; el riesgo viene después de establecer los objetivos del negocio y de TI. C. Aunque un presupuesto inadecuado para futuras inversiones de TI genera preocupación, esto es menos importante que una estrategia incompleta. D. La falta de un CIO a tiempo completo puede ser motivo de preocupación, pero no es tan importante como una estrategia incompleta."
      },
      {
        id: 2,
        pregunta: "¿Cuál sería el problema MÁS significativo relacionado con la estrategia de negocio de TI de Accenco?",
        alternativas: [
          { id: "a", texto: "El comportamiento de acceso y migración de código de los programadores" },
          { id: "b", texto: "La falta de políticas y procedimientos de TI" },
          { id: "c", texto: "Las prácticas de gestión de riesgo comparadas con pares" },
          { id: "d", texto: "La estructura de reporte de TI" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. El comportamiento relacionado con el acceso y la migración de código por parte de los programadores de aplicaciones representa una falta de políticas y procedimientos de TI. B. La falta de políticas y procedimientos de TI provoca que el trabajo relacionado con TI se entregue de forma inconsistente; la política refleja las intenciones de la gerencia y las normas fijadas por la estrategia, mientras que los procedimientos son fundamentales para la entrega diaria de TI. C. Las prácticas de gestión de riesgos no tienen por qué compararse con las de empresas homólogas (peers). D. Aunque la estructura de reporte para TI es importante, no es tan crítica como las políticas y procedimientos de TI."
      },
      {
        id: 3,
        pregunta: "Desde la perspectiva de gobierno de TI, ¿qué sería de MAYOR preocupación?",
        alternativas: [
          { id: "a", texto: "No hay CIO de tiempo completo" },
          { id: "b", texto: "No hay comité directivo de TI" },
          { id: "c", texto: "La junta juega un rol importante en el monitoreo de TI" },
          { id: "d", texto: "El gerente de SI reporta al CFO" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. No tener un CIO a tiempo completo puede ser una preocupación, pero no resulta tan preocupante como que el gerente de SI reporte al CFO. B. La falta de un comité directivo de TI puede causar problemas, pero no es una preocupación tan grande como que el gerente de SI reporte al CFO. C. Que la junta directiva desempeñe un rol principal en las iniciativas de TI no constituye una preocupación importante. D. Idealmente, el gerente de SI debería reportar a la junta directiva o al CEO para proporcionar suficiente independencia; la estructura de reporte que exige que el gerente de SI reporte al CFO no es deseable y podría comprometer ciertos controles."
      },
      {
        id: 4,
        pregunta: "Desde la perspectiva de SoD, ¿qué sería de MAYOR preocupación?",
        alternativas: [
          { id: "a", texto: "Los programadores solo necesitan aprobación del DBA para acceso de escritura directa a datos" },
          { id: "b", texto: "Entrega de código al bibliotecario" },
          { id: "c", texto: "Auditoría interna reporta al CFO" },
          { id: "d", texto: "Los reportes de desempeño solo son firmados por gerentes de negocio" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Los programadores de aplicaciones deben obtener la aprobación de los dueños del negocio (business owners) antes de acceder a los datos; los DBAs son únicamente custodios de los datos y solo deben proporcionar el acceso autorizado por el dueño de los datos (data owner). B. Aunque esto puede ser un problema, no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. C. Que el departamento de auditoría interna reporte al CFO no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa. D. Esto no es una preocupación de SoD tan grande como que el DBA apruebe el acceso de escritura directa."
      },
      {
        id: 5,
        pregunta: "¿Qué control mitigaría MEJOR la integridad de datos?",
        alternativas: [
          { id: "a", texto: "Separación de funciones técnica" },
          { id: "b", texto: "Políticas de desarrollo" },
          { id: "c", texto: "Reportes de auditoría" },
          { id: "d", texto: "Que los resultados de desempeño del negocio sean revisados y firmados por los gerentes de negocio" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Esto no es lo que mejor mitiga la manipulación de datos. B. Entregar el código de programa al bibliotecario no es lo que mejor mitiga la manipulación de datos. C. La estructura de reporte no mitiga la manipulación de datos. D. La aprobación y firma (sign-off) de los datos contenidos en los resultados financieros por parte de los gerentes de negocio al final del mes detectaría cualquier discrepancia significativa que pudiera resultar de la alteración de datos mediante un acceso directo inapropiado obtenido sin la aprobación o el conocimiento de los gerentes de negocio."
      }
    ],
    3: [
      {
        id: 1,
        pregunta: "¿Cuál presenta el riesgo MÁS significativo para el minorista?",
        alternativas: [
          { id: "a", texto: "Parches de base de datos muy desactualizados" },
          { id: "b", texto: "Los registros POS inalámbricos usan cifrado WEP" },
          { id: "c", texto: "Los datos de tarjetahabientes se envían por Internet" },
          { id: "d", texto: "Los datos agregados de ventas se envían por correo a un tercero" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Los servidores de bases de datos sin parches están ubicados en una subred filtrada (screened subnet); esto mitiga el riesgo para la empresa. B. El uso del cifrado WEP presenta el riesgo más significativo porque WEP utiliza una clave secreta fija que es fácil de vulnerar. La transmisión de información de los titulares de tarjetas de crédito por medio de cajas registradoras inalámbricas es susceptible de intercepción y representa un riesgo muy grave. C. El envío de datos de titulares de tarjetas de crédito a través de Internet representa un riesgo menor debido a que se está utilizando un cifrado robusto. D. Debido a que los datos de ventas enviados al tercero son datos agregados, no debería incluirse información de titulares de tarjetas."
      },
      {
        id: 2,
        pregunta: "Según el caso, ¿qué control es el MÁS importante de implementar?",
        alternativas: [
          { id: "a", texto: "Autenticación de dos factores en los POS" },
          { id: "b", texto: "Filtrado MAC en los puntos de acceso inalámbricos" },
          { id: "c", texto: "Parchear el ERP para cumplir el RGPD" },
          { id: "d", texto: "Anonimizar y cifrar los datos agregados de ventas antes de distribuirlos" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. De acuerdo con el caso de estudio, no está claro si las cajas registradoras de punto de venta (POS) ya utilizan autenticación de dos factores. Se sabe que los datos agregados de ventas se copian en otros medios tal cual (as-is), sin ningún control, para su distribución externa. B. De acuerdo con el caso de estudio, no está claro si los puntos de acceso inalámbricos utilizan filtrado de direcciones MAC. Se sabe que los datos agregados de ventas se copian sin ningún control para su distribución externa. C. El cumplimiento del GDPR, aunque es importante, no es lo más importante debido a que las operaciones actuales radican únicamente en los Estados Unidos, y la posible expansión hacia la Unión Europea constituye una visión a largo plazo. D. No está claro si los datos de ventas están seguros y libres de información de identificación personal (PII). Esto representa el riesgo más significativo y debe ser abordado."
      },
      {
        id: 3,
        pregunta: "En el informe preliminar sobre la actualización de la base de datos, ¿qué es lo MÁS importante de incluir?",
        alternativas: [
          { id: "a", texto: "Que auditoría interna sea incluida en las aprobaciones del comité directivo" },
          { id: "b", texto: "Posible incompatibilidad de la nueva base de datos con el ERP existente" },
          { id: "c", texto: "Se requiere una actualización/parche del ERP" },
          { id: "d", texto: "Auditoría interna debe poder revisar la base de datos actualizada para PCI DSS" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Si auditoría interna forma parte del comité directivo (steering committee), tendrá voz y voto respecto a los controles de seguridad y cumplimiento normativo que deben incluirse en las versiones de pase a producción. B. Asegurar el cumplimiento de la base de datos es una responsabilidad operativa y no una responsabilidad de auditoría. C. La compatibilidad con la arquitectura existente debe ser una función del equipo de proyecto de implementación de la base de datos en su conjunto, el cual puede incluir a auditoría interna y también comprende a operaciones. D. Aunque es importante que la solución de base de datos actualizada cumpla con todas las regulaciones, dicha revisión no debe limitarse a una sola regulación."
      },
      {
        id: 4,
        pregunta: "Para contribuir directamente a resolver los problemas de la actualización de base de datos, el auditor debe:",
        alternativas: [
          { id: "a", texto: "Revisar la validez de las especificaciones funcionales" },
          { id: "b", texto: "Proponerse como consultor de control de calidad del proyecto" },
          { id: "c", texto: "Investigar más a fondo para identificar causas raíz y definir contramedidas apropiadas" },
          { id: "d", texto: "Contactar al líder de proyecto y recomendar redefinir el cronograma con PERT" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. Las especificaciones funcionales del proyecto deben ser ejecutadas por los usuarios y analistas de sistemas, no por el auditor. B. Proponer ser consultor de calidad del proyecto no aportaría una contribución esencial, ya que la calidad es una característica formal; mientras que, en el caso actual, el problema es una inestabilidad sustancial del sistema. C. La única acción apropiada es realizar una investigación adicional, incluso si la naturaleza aparentemente técnica del problema hace improbable que el auditor pueda resolverlo por sí solo. D. Contactar al líder del proyecto y rediseñar el cronograma de entregas no resolvería el problema. Además, la definición de las causas reales puede alterar de forma sustancial el entorno del proyecto."
      }
    ],
    4: [
      {
        id: 1,
        pregunta: "¿Cuál sería la preocupación MÁS importante sobre el uso de sistemas de radio por microondas?",
        alternativas: [
          { id: "a", texto: "Susceptibilidad a la interceptación de datos transmitidos" },
          { id: "b", texto: "Falta de soluciones de cifrado disponibles" },
          { id: "c", texto: "Probabilidad de interrupción del servicio" },
          { id: "d", texto: "Sobrecostos de implementación" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. La falta de cifrado es la preocupación más importante, dado que los sistemas de radio por microondas son fáciles de intervenir (tap). B. La falta de escalabilidad es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. C. La probabilidad de una interrupción del servicio es importante, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes. D. Los sobrecostos en la implementación son importantes, pero no tanto como garantizar la confidencialidad y la integridad de los datos de los clientes."
      },
      {
        id: 2,
        pregunta: "¿Qué reduciría MEJOR la probabilidad de que los sistemas de negocio sean atacados desde Internet a través de la red inalámbrica?",
        alternativas: [
          { id: "a", texto: "Escanear todos los dispositivos conectados en busca de malware" },
          { id: "b", texto: "Segmentar la red interna y el acceso a Internet público mediante una subred con firewall" },
          { id: "c", texto: "Registrar todos los accesos y alertar sobre intentos fallidos" },
          { id: "d", texto: "Limitar el acceso a horario laboral y protocolos estándar" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. El escaneo en busca de malware no detectaría el uso de herramientas de investigación diseñadas para recolectar contraseñas o revelar vulnerabilidades de la red. B. Aislar la red inalámbrica ubicándola en una subred protegida por firewall reduciría de la mejor manera la probabilidad de un ataque. C. Registrar el acceso (logging access) no evitaría un ataque exitoso. D. Limitar el acceso al horario laboral normal no evitaría un ataque exitoso."
      },
      {
        id: 3,
        pregunta: "Al negociar nuevos contratos con el proveedor, ¿qué debe recomendar el auditor sobre el hot site?",
        alternativas: [
          { id: "a", texto: "Aumentar los escritorios a 750" },
          { id: "b", texto: "Añadir 35 servidores adicionales al contrato" },
          { id: "c", texto: "Almacenar todos los medios de respaldo en el hot site" },
          { id: "d", texto: "Revisar trimestralmente los requisitos de equipo de escritorio y servidores" }
        ],
        respuestaCorrectaId: "d",
        justificacion: "A. Debido a que no todas las funciones laborales de los empleados son críticas durante un desastre, no es necesario contratar en una instalación de recuperación el mismo número de computadoras de escritorio que el número de empleados. B. Del mismo modo, no todos los servidores son críticos para la operación continua del negocio; solo se requerirá un subconjunto de ellos. C. Debido a que no existe certeza de que el sitio en caliente no esté ya ocupado, no sería aconsejable almacenar los medios de respaldo en dicha instalación. Por lo general, estas instalaciones no están diseñadas para proporcionar un almacenamiento extenso de medios, y las pruebas frecuentes realizadas por otros clientes podrían comprometer la seguridad de dichos soportes. D. Como las necesidades de equipamiento en una empresa de rápido crecimiento están sujetas a cambios frecuentes, las revisiones trimestrales son necesarias para asegurar que la capacidad de recuperación se mantenga al ritmo de la organización."
      },
      {
        id: 4,
        pregunta: "¿Qué debe recomendar el auditor sobre la recuperación de las oficinas de sucursal?",
        alternativas: [
          { id: "a", texto: "Añadir cada sucursal al contrato de hot site existente" },
          { id: "b", texto: "Asegurar que las sucursales tengan capacidad suficiente para respaldarse entre sí" },
          { id: "c", texto: "Reubicar todos los servidores de sucursal al centro de datos" },
          { id: "d", texto: "Añadir capacidad al hot site equivalente a la sucursal más grande" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Agregar cada sucursal al contrato del sitio en caliente resultaría mucho más costoso. B. La solución más rentable (cost-effective) consiste en recomendar que las sucursales tengan capacidad suficiente para albergar al personal crítico proveniente de otra sucursal. Debido a que las funciones laborales críticas representarían solo quizás un 20 por ciento del personal de la sucursal afectada, únicamente se necesitaría espacio para entre cuatro y siete miembros clave del personal. C. Reubicar los servidores de las sucursales en el centro de datos principal podría generar problemas de rendimiento; asimismo, no resolvería la cuestión de dónde ubicar físicamente a los empleados desplazados. D. Agregar capacidad al contrato del sitio en caliente no brindaría cobertura, ya que los contratos de sitios en caliente basan su precio individualmente en cada ubicación cubierta."
      }
    ],
    5: [
      {
        id: 1,
        pregunta: "[Caso Spectertainment] ¿Qué preocuparía MÁS a un auditor de SI al revisar una implementación de VPN? Las computadoras de la red ubicadas:",
        alternativas: [
          { id: "a", texto: "En la red interna de la empresa" },
          { id: "b", texto: "En el sitio de respaldo" },
          { id: "c", texto: "En los hogares de los empleados" },
          { id: "d", texto: "En las oficinas remotas de la empresa" }
        ],
        respuestaCorrectaId: "c",
        justificacion: "A. En la red interna de la empresa, las políticas y controles de seguridad deben estar implementados para detectar y detener un ataque externo que utilice una máquina interna como plataforma de lanzamiento; por lo tanto, esta no sería la mayor preocupación. B. Las computadoras en el sitio de respaldo están sujetas a la política de seguridad corporativa y, por lo tanto, no son computadoras de alto riesgo. C. La VPN ofrece una conexión segura entre la PC remota y la red corporativa. Sin embargo, la VPN no protege a la PC remota de ataques externos (como desde Internet). Si la PC remota se ve comprometida, un actor malicioso puede usar el punto de entrada de la PC remota comprometida para ingresar a la red corporativa (movimiento lateral). D. Las computadoras en las oficinas remotas de la empresa son más riesgosas que las computadoras en la oficina principal o en el sitio de respaldo, pero obviamente son menos riesgosas que las computadoras domésticas."
      },
      {
        id: 2,
        pregunta: "[Caso Spectertainment] ¿Qué nivel provee un MAYOR grado de protección al aplicar software de control de acceso contra riesgo de acceso no autorizado?",
        alternativas: [
          { id: "a", texto: "Nivel de red y sistema operativo" },
          { id: "b", texto: "Nivel de aplicación" },
          { id: "c", texto: "Nivel de base de datos" },
          { id: "d", texto: "Nivel de archivo de log" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. El mayor grado de protección al aplicar software de control de acceso contra el acceso no autorizado de usuarios internos y externos se encuentra en los niveles de red y de plataforma/SO. Estos sistemas también se denominan sistemas de soporte general y constituyen la infraestructura principal sobre la que residirán los sistemas de aplicaciones y bases de datos. B. El nivel de aplicación es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. C. El nivel de base de datos es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO. D. El nivel de archivos de registro (log files) es parte de la infraestructura constituida por los sistemas de soporte general, sustentada por el nivel de red y del SO."
      },
      {
        id: 3,
        pregunta: "[Caso Spectertainment] Cuando un empleado reporta el olvido de su contraseña, ¿qué debe hacer PRIMERO el administrador de seguridad?",
        alternativas: [
          { id: "a", texto: "Permitir que el sistema genere aleatoriamente una nueva contraseña" },
          { id: "b", texto: "Verificar la identidad del usuario mediante un sistema de desafío/respuesta" },
          { id: "c", texto: "Proveer la contraseña por defecto y explicar que debe cambiarse" },
          { id: "d", texto: "Pedir al empleado que use la terminal del administrador" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Cuando un empleado informa una contraseña olvidada, el administrador de seguridad debe iniciar un procedimiento de generación de contraseña solo después de verificar la identificación del usuario mediante un sistema de desafío/respuesta (challenge/response) o un procedimiento similar. B. Un sistema de desafío/respuesta o un procedimiento similar debe ser el primer paso para verificar la identidad del usuario. Para verificar, se aconseja que el administrador de seguridad devuelva la llamada al usuario después de verificar su extensión o llamar a su supervisor. C. Antes de proporcionarle a un empleado una contraseña predeterminada, la identidad de la persona debe verificarse mediante un sistema de desafío/respuesta o un procedimiento similar. D. Antes de tomar cualquier otra medida, se debe verificar la identidad del usuario. No se debe generar una nueva contraseña hasta que se confirme, independientemente de la seguridad de la terminal."
      },
      {
        id: 4,
        pregunta: "[Caso Spectertainment] ¿Qué política debe asegurar Spectertainment que esté vigente ante el hallazgo de dispositivos personales conectados a la VPN?",
        alternativas: [
          { id: "a", texto: "Política de acceso remoto (ya existe, pero no cubre dispositivos personales)" },
          { id: "b", texto: "Política de uso aceptable" },
          { id: "c", texto: "Política de control de cambios" },
          { id: "d", texto: "Política de control de acceso" }
        ],
        respuestaCorrectaId: "b",
        justificacion: "A. Spectertainment cuenta con una política de acceso remoto que describe los métodos aprobados para conectarse de forma remota a los recursos internos, pero no aborda el uso de dispositivos personales. B. Una política de uso aceptable describe lo que los empleados aceptan al utilizar y acceder a los activos de la organización. Confirmaría si se permite el uso de dispositivos personales y también puede incluir una política de Traiga Su Propio Dispositivo (BYOD) para codificar aún más su uso. C. Las políticas de control de cambios son necesarias al realizar cambios en los sistemas de TI, pero no son el control más importante en este contexto. D. Las políticas de control de acceso son necesarias para garantizar que los empleados comprendan cómo acceder a los sistemas, pero no son el control más importante ante este hallazgo."
      },
      {
        id: 5,
        pregunta: "[Caso Spectertainment] ¿Por qué elegiría Spectertainment apoyar el uso de dispositivos personales en lugar de prohibirlo?",
        alternativas: [
          { id: "a", texto: "Mayor productividad del empleado" },
          { id: "b", texto: "No facilita la terminación de accesos" },
          { id: "c", texto: "Mayor ahorro de costos" },
          { id: "d", texto: "No implica mayor concienciación de seguridad" }
        ],
        respuestaCorrectaId: "a",
        justificacion: "A. Las políticas de BYOD han demostrado un aumento en la productividad y la satisfacción de los empleados. B. El uso de BYOD puede hacer que sea más difícil dar por terminado el acceso de un empleado. C. Dado que los empleados utilizan sus propios dispositivos, BYOD puede ayudar a las organizaciones a aumentar su ahorro de costos. D. El uso de BYOD no indica que los empleados tengan una mayor conciencia del riesgo de seguridad que representa el uso de sus dispositivos personales para el trabajo."
      }
    ]
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
  showScreen(DOM.screenStart);
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
