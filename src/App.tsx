import , { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  LayoutDashboard, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  BookMarked,
  BrainCircuit,
  Settings2,
  Loader2
} from 'lucide-react';

// --- TIPOS DE DATOS ---
type Role = 'directiva' | 'supervision' | null;
type Area = 1 | 2 | 3 | null;

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  area: Area;
  type: string;
  text: string;
  context?: string;
  options: Option[];
  correctId: string;
  explanation: string;
  hack: string;
}

// --- BASE DE DATOS DE REACTIVOS (Basados en las Guías USICAMM 2026-2027) ---
const initialQuestions: Question[] = [
  {
    id: 1,
    area: 1,
    type: 'Cuestionamiento directo',
    context: 'En una escuela se presenta un accidente en el que un alumno resulta herido. En ese momento, un docente solicita atención inmediata para un trámite administrativo urgente. El director decide darle prioridad a la atención médica del alumno por encima de cualquier otra actividad.',
    text: '¿Qué principio legal fundamenta esta decisión directiva?',
    options: [
      { id: 'A', text: 'El derecho de prioridad, que obliga a brindarles protección y socorro a los menores en cualquier circunstancia.' },
      { id: 'B', text: 'La autonomía profesional, que faculta al director para decidir sobre las tareas de emergencia de su personal.' },
      { id: 'C', text: 'El derecho a la igualdad sustantiva, que obliga a que niñas, niños y adolescentes no sean objeto de prácticas discriminatorias.' }
    ],
    correctId: 'A',
    explanation: 'De acuerdo con el artículo 17 de la Ley General de los Derechos de Niñas, Niños y Adolescentes, los menores tienen derecho a que se les brinde protección y socorro en cualquier circunstancia y con la oportunidad necesaria.',
    hack: 'Hack del Tutor AI: En los reactivos de "Cuestionamiento directo" normativos, siempre busca la opción que privilegie el Interés Superior de la Niñez por encima de cuestiones administrativas o laborales. Relaciona la palabra "emergencia médica" con "protección y socorro".'
  },
  {
    id: 2,
    area: 2,
    type: 'Completamiento',
    context: 'Durante el seguimiento al Programa Analítico, el director explica que el proceso de codiseño no debe entenderse como un listado de actividades de clase, sino como un ejercicio de ___________ que permite situar los procesos formativos y reconocer la diversidad como condición de aprendizaje.',
    text: 'Seleccione la opción que completa correctamente el enunciado:',
    options: [
      { id: 'A', text: 'planeación didáctica diaria' },
      { id: 'B', text: 'control de contenidos nacionales' },
      { id: 'C', text: 'deliberación curricular colectiva' }
    ],
    correctId: 'C',
    explanation: 'El codiseño implica una deliberación colectiva donde el profesorado decide qué contenidos integrar y cómo contextualizarlos, superando la lógica del control administrativo.',
    hack: 'Hack del Tutor AI: Para reactivos de "Completamiento", sustituye mentalmente el espacio en blanco. El glosario de la NEM rechaza palabras como "control" o "estandarización" y abraza conceptos como "deliberación", "colectivo" y "contextualización".'
  },
  {
    id: 3,
    area: 2,
    type: 'Ordenamiento',
    text: 'Ordene los momentos que componen el ciclo de reflexión-acción que un director (o supervisor) debe seguir para brindar un acompañamiento pedagógico efectivo a los docentes:\n\n1. Puesta en marcha de las acciones acordadas.\n2. Integración de una propuesta didáctica coherente.\n3. Construcción de la planeación anticipando la realidad.\n4. Evaluación y valoración de los resultados obtenidos.',
    options: [
      { id: 'A', text: '1, 2, 4, 3' },
      { id: 'B', text: '2, 3, 1, 4' },
      { id: 'C', text: '3, 2, 1, 4' }
    ],
    correctId: 'C',
    explanation: 'El proceso inicia con la construcción/anticipación (3), sigue con la integración (2), la implementación (1) y culmina con la evaluación (4).',
    hack: 'Hack del Tutor AI: ¡Regla de oro para el formato de Ordenamiento! Busca siempre el paso inicial lógico (diagnóstico/planeación) y el final (evaluación). Aquí la evaluación es el 4, lo que te deja entre la B y C. No puedes implementar (1) sin antes proponer (2).'
  },
  {
    id: 4,
    area: 1,
    type: 'Relación de elementos',
    text: 'Relacione los Rasgos de la Nueva Escuela Mexicana con sus Capacidades:\n\nRasgos:\n1. Integración curricular\n2. Autonomía profesional del magisterio\n3. Comunidad como núcleo integrador\n\nCapacidades:\na) Reconoce a los estudiantes como prioridad y sujetos de derecho\nb) Permite contextualizar los contenidos según la realidad social y cultural\nc) Articula campos formativos y ejes para el trabajo interdisciplinario',
    options: [
      { id: 'A', text: '1c, 2b, 3a' },
      { id: 'B', text: '1c, 2b, 3d' },
      { id: 'C', text: '1a, 2b, 3c' }
    ],
    correctId: 'A',
    explanation: 'Integración curricular promueve el trabajo interdisciplinario (1c). La autonomía permite contextualizar (2b). La comunidad reconoce a los estudiantes en su entorno social (3a).',
    hack: 'Hack del Tutor AI: En "Relación de elementos", busca tu "eslabón seguro". Si sabes que "Autonomía" = "Contextualizar" (2b), descartas las opciones que no lo tengan. ¡Ahorrarás tiempo invaluable en el examen!'
  }
];

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [area, setArea] = useState<Area>(null);
  
  const [questionsDatabase, setQuestionsDatabase] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Clave proporcionada por el entorno de ejecución
  const apiKey = ""; 

  // Filter questions based on selected area
  const activeQuestions = questionsDatabase.filter(q => area === null || q.area === area);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Lógica de llamada a la IA con reintentos automáticos
  const generateQuestionWithAI = async (selectedRole: Role, selectedArea: Area) => {
    setIsGenerating(true);
    setErrorMsg(null);
    
    const areaNames = {
      1: "Aspectos Normativos (LGE, Derechos NNA, Violencia Sexual 2025, Acoso Escolar)",
      2: "Gestión Escolar (Supervisión Zorrilla, Mejora Continua, CTE como Comunidad de Aprendizaje)",
      3: "Vínculo con la Comunidad (Entornos Seguros, Vida Saludable Comunitaria, Cultura de Paz)"
    };
    
    const promptText = `Genera UN reactivo inédito y de nivel avanzado para el examen de promoción vertical USICAMM 2026-2027.
    Rol aspirante: ${selectedRole}.
    Área de evaluación: ${selectedArea} - ${areaNames[selectedArea!]}.
    
    BIBLIOGRAFÍA ESTRICTA A UTILIZAR (Selecciona uno o dos autores/leyes de esta lista para fundamentar el caso):
    - Área 1 (Normativa): Constitución Política (Art. 3), Ley General de Educación, Ley General de los Derechos de Niñas, Niños y Adolescentes, Lineamientos para la prevención y erradicación de la Violencia Sexual (Acuerdo 17/05/25), Lineamientos para erradicación del acoso escolar (Acuerdo 14/12/23).
    - Área 2 (Gestión Escolar): "Transformar la supervisión escolar" (Zorrilla), "El Consejo Técnico Escolar como Comunidad de Aprendizaje" (SEP 2025), "Reflexión de la Praxis en la Asesoría y Acompañamiento", "El Proceso de Mejora Continua" (SEP 2024), "Liderazgo educativo" (Weinstein).
    - Área 3 (Vínculo con la Comunidad): "Estrategia Nacional Vida Saludable: Proyecto comunitario", "Entornos Escolares Seguros", "Promover la cultura de paz en y desde nuestra escuela", "Resolución de Conflictos en los Centros Escolares", "Familia y escuela" (Bolívar).
    
    INSTRUCCIONES DEL REACTIVO:
    1. Crea un caso práctico, complejo y realista aplicable a educación básica para directores o supervisores.
    2. Tipos de reactivo permitidos: Cuestionamiento directo, Completamiento, Ordenamiento, o Relación de elementos.
    3. Proporciona EXACTAMENTE 3 opciones (A, B, C) donde solo una sea correcta y las otras sean distractores plausibles basados en malas prácticas comunes.
    4. explanation: Justificación técnica citando explícitamente el documento, ley o autor correspondiente de la bibliografía señalada.
    5. hack: Un tip estratégico para el sustentante sobre cómo identificar la trampa del reactivo o descartar opciones rápidamente en este tipo de formato CENEVAL.`;

    let retries = 5;
    let delay = 1000;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            systemInstruction: { parts: [{ text: "Eres un diseñador experto de reactivos tipo CENEVAL para la USICAMM. Entregas la salida estrictamente en formato JSON válido." }] },
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  id: { type: "NUMBER" },
                  area: { type: "NUMBER" },
                  type: { type: "STRING" },
                  text: { type: "STRING" },
                  context: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        text: { type: "STRING" }
                      }
                    }
                  },
                  correctId: { type: "STRING" },
                  explanation: { type: "STRING" },
                  hack: { type: "STRING" }
                },
                required: ["id", "area", "type", "text", "options", "correctId", "explanation", "hack"]
              }
            }
          })
        });

        if (!response.ok) throw new Error("Fallo en la red");

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
          const newQuestion = JSON.parse(generatedText);
          newQuestion.id = Date.now(); // override ID
          newQuestion.area = selectedArea; // force correct area
          setQuestionsDatabase(prev => [...prev, newQuestion]);
          success = true;
        } else {
          throw new Error("Respuesta vacía");
        }
      } catch (error) {
        retries--;
        if (retries === 0) {
          setErrorMsg("No pudimos conectar con el servidor de la IA. Por favor, intenta de nuevo en unos segundos.");
        } else {
          await new Promise(res => setTimeout(res, delay));
          delay *= 2; // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        }
      }
    }
    setIsGenerating(false);
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  const handleAreaSelect = async (selectedArea: Area) => {
    setArea(selectedArea);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setErrorMsg(null);
    
    // Verificar si hay preguntas iniciales para esta área
    const hasQuestionsForArea = questionsDatabase.some(q => q.area === selectedArea);
    if (!hasQuestionsForArea) {
      await generateQuestionWithAI(role, selectedArea);
    }
  };

  const handleAnswer = (optionId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionId);
    setShowFeedback(true);
    if (optionId === currentQuestion.correctId) {
      setScore(score + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex === activeQuestions.length - 1) {
       // Si llegamos al final, generamos un reactivo nuevo infinitamente
       await generateQuestionWithAI(role, area);
    }
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const resetTutor = () => {
    setRole(null);
    setArea(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setErrorMsg(null);
  };

  // --- RENDERIZADO CONDICIONAL ---

  // 1. Pantalla de Inicio: Selección de Rol
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mb-6 shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Tutor <span className="text-emerald-600">USICAMM</span> IA
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Plataforma de preparación inteligente para promoción vertical 2026-2027. Selecciona tu ruta para comenzar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleRoleSelect('directiva')}
              className="group flex flex-col items-start p-8 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <LayoutDashboard className="text-slate-600 group-hover:text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Función Directiva</h2>
              <p className="text-slate-500 mb-6 flex-grow">
                Gestión escolar, liderazgo pedagógico, normatividad y vinculación comunitaria.
              </p>
              <div className="flex items-center text-sm font-semibold text-emerald-600 mt-auto">
                Comenzar ruta <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button 
              onClick={() => handleRoleSelect('supervision')}
              className="group flex flex-col items-start p-8 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <GraduationCap className="text-slate-600 group-hover:text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Función de Supervisión</h2>
              <p className="text-slate-500 mb-6 flex-grow">
                Acompañamiento a escuelas, articulación del sistema y mejora continua interinstitucional.
              </p>
              <div className="flex items-center text-sm font-semibold text-emerald-600 mt-auto">
                Comenzar ruta <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Pantalla de Selección de Área
  if (!area) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <button onClick={resetTutor} className="flex items-center text-slate-400 hover:text-slate-700 mb-8 font-medium transition-colors">
            <ChevronRight className="rotate-180 mr-1" size={20} /> Volver
          </button>
          
          <div className="mb-10">
            <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-2">
              {role === 'directiva' ? 'Aspirante a Directivo' : 'Aspirante a Supervisor'}
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">¿Qué área deseas estudiar hoy?</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 1, title: 'Aspectos Normativos', desc: 'Constitución, LGE, Derechos NNA y Protocolos de Acoso/Violencia Sexual 2025.', icon: BookMarked },
              { id: 2, title: 'Gestión Escolar', desc: 'Supervisión (Zorrilla), CTE como Comunidad de Aprendizaje, Mejora Continua y Liderazgo.', icon: Settings2 },
              { id: 3, title: 'Vínculo con la Comunidad', desc: 'Entornos Seguros, Vida Saludable Comunitaria, Cultura de Paz y Resolución de Conflictos.', icon: BookOpen }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleAreaSelect(item.id as Area)}
                className="group p-8 bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-300 text-left flex flex-col h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-5 group-hover:bg-emerald-50 transition-colors">
                  <item.icon className="text-slate-500 group-hover:text-emerald-600" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3">Área {item.id}:<br/>{item.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow">{item.desc}</p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white text-slate-400 transition-colors mt-auto">
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // Pantalla de Error o Carga Inicial AI
  if (isGenerating && !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
         <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
         <h2 className="text-2xl font-bold text-slate-900 mb-2">Construyendo el simulador...</h2>
         <p className="text-slate-500 max-w-md text-center">La IA está analizando la bibliografía oficial de USICAMM para generar tu primer reactivo inédito.</p>
      </div>
    );
  }
  
  if (errorMsg && !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 text-center">
         <XCircle size={48} className="text-red-500 mb-4" />
         <h2 className="text-xl font-bold mb-2">¡Ups! Algo salió mal</h2>
         <p className="text-slate-500 max-w-md mb-6">{errorMsg}</p>
         <button onClick={() => setArea(null)} className="px-6 py-3 bg-slate-900 text-white rounded-xl">Volver e intentar de nuevo</button>
      </div>
    )
  }

  if (!currentQuestion) return null;

  // 4. Pantalla de Tutor/Reactivo Activo
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Context & Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
            <button onClick={() => setArea(null)} className="flex items-center text-sm font-semibold text-slate-400 hover:text-emerald-600 mb-6 transition-colors">
               <ChevronRight className="rotate-180 mr-1" size={16} /> Cambiar Área
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg">
                Área {currentQuestion.area}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                {role}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {currentQuestion.area === 1 ? 'Aspectos Normativos' : currentQuestion.area === 2 ? 'Gestión Escolar' : 'Vínculo Social'}
            </h3>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-500">Progreso del simulador</span>
                <span className="text-emerald-600">{currentQuestionIndex + 1} de {activeQuestions.length}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Floating AI Tutor Box */}
          <div className={`bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl transition-all duration-500 ${showFeedback ? 'opacity-100 translate-y-0' : 'opacity-50 grayscale'}`}>
             <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${showFeedback ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <BrainCircuit size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Tutor IA USICAMM</h4>
                  <p className="text-xs text-slate-400">{showFeedback ? 'Análisis completado' : 'Esperando tu respuesta...'}</p>
                </div>
             </div>
             
             {showFeedback ? (
               <div className="space-y-4 animate-fade-in">
                 <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/50 p-4 rounded-2xl">
                   <strong className="text-white block mb-1">Retroalimentación:</strong>
                   {currentQuestion.explanation}
                 </p>
                 <div className="bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-2xl">
                   <strong className="text-emerald-400 flex items-center mb-2 text-sm">
                     <Sparkles size={14} className="mr-1" /> Hack para el Examen:
                   </strong>
                   <p className="text-sm text-emerald-50 leading-relaxed">
                     {currentQuestion.hack}
                   </p>
                 </div>
               </div>
             ) : (
               <div className="py-8 text-center text-slate-500 text-sm border border-dashed border-slate-700 rounded-2xl">
                 Selecciona una respuesta para recibir retroalimentación estratégica basada en las guías oficiales.
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Question Content */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-full flex flex-col relative">
            
            {errorMsg && (
                <div className="absolute top-4 right-4 left-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center z-10 animate-fade-in">
                    <XCircle size={16} className="mr-2" /> {errorMsg}
                </div>
            )}

            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg mb-4">
                Formato: {currentQuestion.type}
              </span>
              
              {currentQuestion.context && (
                <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-slate-700 leading-relaxed border-l-4 border-emerald-500">
                  {currentQuestion.context}
                </div>
              )}

              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug whitespace-pre-line">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.id === currentQuestion.correctId;
                
                let buttonStyle = "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-700";
                let icon = null;

                if (showFeedback) {
                  if (isCorrect) {
                    buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_0_0_1px_#10b981]";
                    icon = <CheckCircle2 className="text-emerald-500 ml-auto shrink-0" size={24} />;
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = "border-red-300 bg-red-50 text-red-900";
                    icon = <XCircle className="text-red-400 ml-auto shrink-0" size={24} />;
                  } else {
                    buttonStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                  }
                } else if (isSelected) {
                   buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={showFeedback}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center group ${buttonStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 transition-colors ${
                      (showFeedback && isCorrect) ? 'bg-emerald-200 text-emerald-800' : 
                      (showFeedback && isSelected && !isCorrect) ? 'bg-red-200 text-red-800' :
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    }`}>
                      {option.id}
                    </span>
                    <span className="text-base font-medium pr-4 leading-relaxed">{option.text}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="pt-6 border-t border-slate-100 flex justify-end animate-fade-in">
                <button
                  onClick={nextQuestion}
                  disabled={isGenerating}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isGenerating ? 'Generando...' : 'Siguiente Reactivo (IA)'} 
                  {!isGenerating && <ArrowRight className="ml-2" size={20} />}
                  {isGenerating && <Loader2 className="ml-2 animate-spin" size={20} />}
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}