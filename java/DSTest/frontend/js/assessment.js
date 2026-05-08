/**
 * BDSM ROLE ASSESSMENT
 * Assessment Logic Module - Standalone Mode
 */

const Assessment = {
  questions: [],
  answers: [],
  currentIndex: 0,
  sessionId: null,
  metadata: {},

  // Preguntas hardcodeadas para modo standalone (fallback si API no está disponible)
  standaloneQuestions: [
    // Validez (20 ítems)
    {id:1,text:"Nunca he dicho una mentira, ni siquiera pequeña.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:2,text:"Siempre trato a todo el mundo con respeto, sin excepción.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:3,text:"Me gusta todo el mundo que conozco.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:4,text:"Nunca me he enfadado tanto como para perder el control.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:5,text:"Siempre admito mis errores inmediatamente.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:6,text:"Nunca he tenido pensamientos que me avergüencen.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:7,text:"Me considero una persona moralmente superior a la mayoría.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:8,text:"Nunca he sentido celos de nadie.",category:"validity",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:9,text:"A veces siento que puedo leer la mente de otras personas.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:10,text:"He visto cosas que otras personas no pueden ver.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:11,text:"Mis sueños siempre se hacen realidad al día siguiente.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:12,text:"Tengo poderes especiales que nadie más conoce.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:13,text:"Las máquinas funcionan mejor cuando yo estoy cerca.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:14,text:"Puedo controlar el clima con mis pensamientos.",category:"validity",targetRoles:[],weight:3,scaleMin:1,scaleMax:5},
    {id:15,text:"Me gusta tomar el control en situaciones íntimas.",category:"power",targetRoles:["dominant","domme"],weight:3,scaleMin:1,scaleMax:5},
    {id:16,text:"Prefiero que otros tomen el control en situaciones íntimas.",category:"power",targetRoles:["submissive","slave"],weight:3,scaleMin:1,scaleMax:5},
    {id:17,text:"El dolor físico me resulta placentero en contexto sexual.",category:"sensation",targetRoles:["masochist"],weight:4,scaleMin:1,scaleMax:5},
    {id:18,text:"El dolor físico me resulta desagradable en cualquier contexto.",category:"sensation",targetRoles:[],weight:4,scaleMin:1,scaleMax:5},
    {id:19,text:"Me identifico con comportamientos de animal doméstico.",category:"pet",targetRoles:["pet","puppy"],weight:3,scaleMin:1,scaleMax:5},
    {id:20,text:"Me identifico con comportamientos de animal salvaje.",category:"primal",targetRoles:["primal_predator","primal_prey"],weight:3,scaleMin:1,scaleMax:5},
    
    // Power Exchange (21-40)
    {id:21,text:"Me siento más cómodo cuando sé quién manda en una relación.",category:"power",targetRoles:["dominant","submissive"],weight:3,scaleMin:1,scaleMax:5},
    {id:22,text:"Dar órdenes claras me resulta natural y satisfactorio.",category:"power",targetRoles:["dominant","domme","owner"],weight:4,scaleMin:1,scaleMax:5},
    {id:23,text:"Obedecer órdenes me produce una sensación de paz interior.",category:"power",targetRoles:["submissive","slave","service_sub"],weight:4,scaleMin:1,scaleMax:5},
    {id:24,text:"La idea de ser 'propiedad' de alguien me excita sexualmente.",category:"power",targetRoles:["slave","property","owned"],weight:4,scaleMin:1,scaleMax:5},
    {id:25,text:"Me gusta negociar los límites antes de cualquier práctica.",category:"power",targetRoles:["switch","dominant","submissive"],weight:2,scaleMin:1,scaleMax:5},
    {id:26,text:"Siento alivio cuando alguien más asume la responsabilidad total.",category:"power",targetRoles:["submissive","little","service_sub"],weight:3,scaleMin:1,scaleMax:5},
    {id:27,text:"Me excita corregir o castigar a alguien que lo merece.",category:"power",targetRoles:["dominant","sadist","disciplinarian"],weight:4,scaleMin:1,scaleMax:5},
    {id:28,text:"Ser corregido o castigado me ayuda a sentirme en mi lugar.",category:"power",targetRoles:["submissive","brat","slave"],weight:4,scaleMin:1,scaleMax:5},
    {id:29,text:"Me arrodillo naturalmente ante personas que respeto o admiro.",category:"power",targetRoles:["submissive","slave","service_sub"],weight:3,scaleMin:1,scaleMax:5},
    {id:30,text:"Espero que las personas me muestren respeto físico (arrodillarse, bajar la mirada).",category:"power",targetRoles:["dominant","domme","owner"],weight:3,scaleMin:1,scaleMax:5},
    {id:31,text:"Me gusta usar títulos formales como 'Sir', 'Ma'am', 'Master', 'Mistress'.",category:"power",targetRoles:["dominant","submissive","lifestyle"],weight:2,scaleMin:1,scaleMax:5},
    {id:32,text:"Los protocolos y reglas formales me resultan atractivos y excitantes.",category:"power",targetRoles:["dominant","submissive","gorean"],weight:3,scaleMin:1,scaleMax:5},
    {id:33,text:"Me siento perdido o ansioso sin una figura de autoridad clara.",category:"power",targetRoles:["submissive","little","dependent"],weight:3,scaleMin:1,scaleMax:5},
    {id:34,text:"Me siento frustrado cuando otros no siguen mis instrucciones.",category:"power",targetRoles:["dominant","control_focused"],weight:3,scaleMin:1,scaleMax:5},
    {id:35,text:"Puedo cambiar entre dominar y ser dominado según la pareja o situación.",category:"power",targetRoles:["switch","versatile"],weight:4,scaleMin:1,scaleMax:5},
    {id:36,text:"He fantaseado con ser comprado/a o vendido/a como propiedad.",category:"power",targetRoles:["slave","property","auction"],weight:4,scaleMin:1,scaleMax:5},
    {id:37,text:"He fantaseado con comprar o vender a una persona como propiedad.",category:"power",targetRoles:["owner","master","mistress"],weight:4,scaleMin:1,scaleMax:5},
    {id:38,text:"La palabra 'No' es difícil de aceptar cuando estoy en rol dominante.",category:"power",targetRoles:["dominant","control_issues"],weight:3,scaleMin:1,scaleMax:5},
    {id:39,text:"La palabra 'No' es difícil de decir cuando estoy en rol sumiso.",category:"power",targetRoles:["submissive","people_pleaser"],weight:3,scaleMin:1,scaleMax:5},
    {id:40,text:"El poder me excita más que el sexo en sí mismo.",category:"power",targetRoles:["dominant","power_exchange"],weight:4,scaleMin:1,scaleMax:5},
    
    // Sensation Seeking (41-60)
    {id:41,text:"El dolor físico me produce excitación sexual clara.",category:"sensation",targetRoles:["masochist","painslut"],weight:5,scaleMin:1,scaleMax:5},
    {id:42,text:"Ver dolor en otros me produce excitación sexual clara.",category:"sensation",targetRoles:["sadist","sadomasochist"],weight:5,scaleMin:1,scaleMax:5},
    {id:43,text:"Busco sensaciones intensas, sean placenteras o dolorosas.",category:"sensation",targetRoles:["hedonist","edge_player","sensation_seeker"],weight:4,scaleMin:1,scaleMax:5},
    {id:44,text:"Las marcas en mi cuerpo (moretones, ronchas) me hacen sentir bien después.",category:"sensation",targetRoles:["masochist","slave","branded"],weight:3,scaleMin:1,scaleMax:5},
    {id:45,text:"El límite entre dolor y placer es difuso o inexistente para mí.",category:"sensation",targetRoles:["masochist","sadomasochist","hedonist"],weight:4,scaleMin:1,scaleMax:5},
    {id:46,text:"Prefiero el placer suave al dolor intenso.",category:"sensation",targetRoles:["vanilla_curious","gentle"],weight:2,scaleMin:1,scaleMax:5},
    {id:47,text:"Me excita el riesgo controlado en prácticas sexuales.",category:"sensation",targetRoles:["edge_player","risk_aware","adventurer"],weight:3,scaleMin:1,scaleMax:5},
    {id:48,text:"La inmovilización total me produce ansiedad, no placer.",category:"sensation",targetRoles:[],weight:2,scaleMin:1,scaleMax:5},
    {id:49,text:"Puedo disociarme del dolor durante escenas intensas.",category:"sensation",targetRoles:["masochist","submissive","experienced"],weight:3,scaleMin:1,scaleMax:5},
    {id:50,text:"Necesito aftercare intenso después de escenas fuertes.",category:"sensation",targetRoles:["masochist","submissive","drop_prone"],weight:3,scaleMin:1,scaleMax:5},
    {id:51,text:"El dolor emocional me afecta más que el dolor físico.",category:"sensation",targetRoles:["emotional_masochist","psychological"],weight:3,scaleMin:1,scaleMax:5},
    {id:52,text:"Me excita humillar o ser humillado verbalmente.",category:"sensation",targetRoles:["sadist","masochist","degradation"],weight:4,scaleMin:1,scaleMax:5},
    {id:53,text:"Prefiero prácticas que no dejen marcas visibles.",category:"sensation",targetRoles:["vanilla","discreet","professional"],weight:2,scaleMin:1,scaleMax:5},
    {id:54,text:"La intensidad física es más importante que la emocional para mí.",category:"sensation",targetRoles:["sensation_focused","physical"],weight:3,scaleMin:1,scaleMax:5},
    {id:55,text:"La conexión emocional es más importante que la intensidad para mí.",category:"sensation",targetRoles:["emotional_focused","intimate"],weight:3,scaleMin:1,scaleMax:5},
    {id:56,text:"He buscado deliberadamente situaciones de dolor extremo.",category:"sensation",targetRoles:["extreme_masochist","edge_player"],weight:4,scaleMin:1,scaleMax:5},
    {id:57,text:"El sangre me excita o me produce fascinación.",category:"sensation",targetRoles:["blood_player","extreme"],weight:3,scaleMin:1,scaleMax:5},
    {id:58,text:"Las agujas, cuchillos u objetos punzantes me resultan atractivos.",category:"sensation",targetRoles:["needle_player","knife_player","sharp_objects"],weight:4,scaleMin:1,scaleMax:5},
    {id:59,text:"Prefiero sesiones largas y agotadoras a sesiones cortas.",category:"sensation",targetRoles:["endurance","marathon"],weight:3,scaleMin:1,scaleMax:5},
    {id:60,text:"El orgasmo es menos importante que la experiencia completa.",category:"sensation",targetRoles:["non_orgasmic","experience_focused"],weight:3,scaleMin:1,scaleMax:5},
    
    // Primal Instinct (61-75)
    {id:61,text:"Siento impulsos animales que no puedo controlar racionalmente.",category:"primal",targetRoles:["primal","primal_predator","primal_prey"],weight:4,scaleMin:1,scaleMax:5},
    {id:62,text:"Me excita perseguir y 'cazar' a mi pareja sexual.",category:"primal",targetRoles:["primal_predator","hunter"],weight:4,scaleMin:1,scaleMax:5},
    {id:63,text:"Fantaseo con ser perseguido, capturado y poseído.",category:"primal",targetRoles:["primal_prey","prey"],weight:4,scaleMin:1,scaleMax:5},
    {id:64,text:"El sexo sin palabras, puro instinto, me excita más que el sexo verbal.",category:"primal",targetRoles:["primal","primal_predator","primal_prey"],weight:4,scaleMin:1,scaleMax:5},
    {id:65,text:"Gruño, muerdo o marco territorio durante el sexo.",category:"primal",targetRoles:["primal_predator","primal","pet"],weight:3,scaleMin:1,scaleMax:5},
    {id:66,text:"Me excita que me muerdan o marquen físicamente en el cuerpo.",category:"primal",targetRoles:["primal_prey","primal","masochist"],weight:3,scaleMin:1,scaleMax:5},
    {id:67,text:"Prefiero el sexo en espacios naturales o 'salvajes'.",category:"primal",targetRoles:["primal","outdoor","adventurer"],weight:2,scaleMin:1,scaleMax:5},
    {id:68,text:"La ropa o accesorios 'animales' (orejas, colas) me excitan.",category:"primal",targetRoles:["primal","pet","furry"],weight:3,scaleMin:1,scaleMax:5},
    {id:69,text:"Me identifico más con un depredador que con una presa.",category:"primal",targetRoles:["primal_predator"],weight:4,scaleMin:1,scaleMax:5},
    {id:70,text:"Me identifico más con una presa que con un depredador.",category:"primal",targetRoles:["primal_prey"],weight:4,scaleMin:1,scaleMax:5},
    {id:71,text:"Arrastrar o ser arrastrado me resulta excitante.",category:"primal",targetRoles:["primal_predator","primal_prey"],weight:3,scaleMin:1,scaleMax:5},
    {id:72,text:"Comer del suelo o de las manos de alguien me excita.",category:"primal",targetRoles:["primal","pet","service_sub"],weight:3,scaleMin:1,scaleMax:5},
    {id:73,text:"El sexo en el suelo o superficies duras me resulta atractivo.",category:"primal",targetRoles:["primal","pet","rough"],weight:3,scaleMin:1,scaleMax:5},
    {id:74,text:"Sentir el olor natural de mi pareja me excita mucho.",category:"primal",targetRoles:["primal","scent_player"],weight:3,scaleMin:1,scaleMax:5},
    {id:75,text:"La higiene excesiva antes del sexo me parece innecesaria.",category:"primal",targetRoles:["primal","natural"],weight:2,scaleMin:1,scaleMax:5},
    
    // Nurturing Dynamic (76-90)
    {id:76,text:"Me gusta cuidar a otros como si fueran niños pequeños.",category:"nurturing",targetRoles:["caregiver","daddy","mommy"],weight:4,scaleMin:1,scaleMax:5},
    {id:77,text:"Me siento seguro cuando me tratan con ternura infantil.",category:"nurturing",targetRoles:["little","baby","age_regressor"],weight:4,scaleMin:1,scaleMax:5},
    {id:78,text:"Uso lenguaje infantil o comportamientos regresivos voluntariamente.",category:"nurturing",targetRoles:["little","ageplayer","baby"],weight:4,scaleMin:1,scaleMax:5},
    {id:79,text:"Comprar regalos o sorprender a mi pareja me satisface emocionalmente.",category:"nurturing",targetRoles:["caregiver","provider","daddy","mommy"],weight:3,scaleMin:1,scaleMax:5},
    {id:80,text:"Necesito que me consuelen físicamente cuando estoy triste.",category:"nurturing",targetRoles:["little","dependent","submissive"],weight:3,scaleMin:1,scaleMax:5},
    {id:81,text:"Me gusta usar chupetes, peluches o ropa infantil.",category:"nurturing",targetRoles:["little","abd","baby"],weight:4,scaleMin:1,scaleMax:5},
    {id:82,text:"Castigar a un 'niño' que se porta mal me parece apropiado en contexto.",category:"nurturing",targetRoles:["caregiver","daddy","disciplinarian"],weight:3,scaleMin:1,scaleMax:5},
    {id:83,text:"Ser castigado como un 'niño' me hace sentir en mi lugar.",category:"nurturing",targetRoles:["little","brat","age_regressor"],weight:3,scaleMin:1,scaleMax:5},
    {id:84,text:"Me gusta que me den instrucciones simples y claras.",category:"nurturing",targetRoles:["little","submissive","dependent"],weight:3,scaleMin:1,scaleMax:5},
    {id:85,text:"Me gusta dar instrucciones simples y claras a otros.",category:"nurturing",targetRoles:["caregiver","daddy","mommy"],weight:3,scaleMin:1,scaleMax:5},
    {id:86,text:"La idea de cambiar pañales o ser cambiado me resulta atractiva.",category:"nurturing",targetRoles:["abd","caregiver","little"],weight:4,scaleMin:1,scaleMax:5},
    {id:87,text:"Me siento más feliz cuando no tengo responsabilidades adultas.",category:"nurturing",targetRoles:["little","age_regressor"],weight:4,scaleMin:1,scaleMax:5},
    {id:88,text:"La responsabilidad de cuidar a otros me hace sentir realizado.",category:"nurturing",targetRoles:["caregiver","provider","daddy","mommy"],weight:3,scaleMin:1,scaleMax:5},
    {id:89,text:"Regresar a un estado mental infantil me da paz.",category:"nurturing",targetRoles:["little","age_regressor","meditative"],weight:4,scaleMin:1,scaleMax:5},
    {id:90,text:"La diferencia de edad (real o simulada) me excita.",category:"nurturing",targetRoles:["age_gap","daddy","little"],weight:3,scaleMin:1,scaleMax:5},
    
    // Pet Play & Ownership (91-105)
    {id:91,text:"Me identifico con comportamientos de animal doméstico (perro, gato).",category:"pet",targetRoles:["pet","puppy","kitten"],weight:4,scaleMin:1,scaleMax:5},
    {id:92,text:"Usar collar o accesorios de pet me excita sexualmente.",category:"pet",targetRoles:["pet","puppy","kitten","slave"],weight:3,scaleMin:1,scaleMax:5},
    {id:93,text:"Comer del suelo o de un plato me resulta excitante.",category:"pet",targetRoles:["pet","puppy","primal"],weight:3,scaleMin:1,scaleMax:5},
    {id:94,text:"Necesito aprobación de mi 'dueño' como un animal la necesita.",category:"pet",targetRoles:["pet","puppy","slave"],weight:3,scaleMin:1,scaleMax:5},
    {id:95,text:"Ladrar, maullar o hacer sonidos animales me resulta natural.",category:"pet",targetRoles:["pet","puppy","kitten"],weight:3,scaleMin:1,scaleMax:5},
    {id:96,text:"Me gusta que me acaricien la cabeza como a una mascota.",category:"pet",targetRoles:["pet","puppy","kitten","little"],weight:3,scaleMin:1,scaleMax:5},
    {id:97,text:"La idea de ser 'entrenado' como un animal me excita.",category:"pet",targetRoles:["pet","puppy","conditioned"],weight:4,scaleMin:1,scaleMax:5},
    {id:98,text:"Me gusta 'entrenar' a alguien como si fuera una mascota.",category:"pet",targetRoles:["owner","trainer","handler"],weight:4,scaleMin:1,scaleMax:5},
    {id:99,text:"Poseer personas es mi fantasía principal.",category:"ownership",targetRoles:["owner","master","mistress"],weight:4,scaleMin:1,scaleMax:5},
    {id:100,text:"Ser propiedad de alguien es mi fantasía principal.",category:"ownership",targetRoles:["slave","property","owned"],weight:4,scaleMin:1,scaleMax:5},
    {id:101,text:"Los contratos o acuerdos de propiedad escrita me excitan.",category:"ownership",targetRoles:["owner","slave","gorean","contractual"],weight:3,scaleMin:1,scaleMax:5},
    {id:102,text:"Me gustaría llevar marcas permanentes de propiedad (tatuajes, brands).",category:"ownership",targetRoles:["slave","property","owned"],weight:4,scaleMin:1,scaleMax:5},
    {id:103,text:"Me gustaría marcar permanentemente a mi propiedad.",category:"ownership",targetRoles:["owner","master","mistress"],weight:4,scaleMin:1,scaleMax:5},
    {id:104,text:"La idea de ser subastado o vendido me excita.",category:"ownership",targetRoles:["slave","property","auction"],weight:4,scaleMin:1,scaleMax:5},
    {id:105,text:"La idea de subastar o vender a alguien me excita.",category:"ownership",targetRoles:["owner","master","mistress"],weight:4,scaleMin:1,scaleMax:5},
    
    // Service, Bondage & Observation (106-120)
    {id:106,text:"Servir a otros es mi principal forma de expresar sumisión.",category:"service",targetRoles:["service_sub","servant","slave"],weight:4,scaleMin:1,scaleMax:5},
    {id:107,text:"Preparar comida, limpiar o cuidar me satisface sexualmente.",category:"service",targetRoles:["service_sub","maid","butler"],weight:3,scaleMin:1,scaleMax:5},
    {id:108,text:"Mi placer está principalmente en el placer de mi dominante.",category:"service",targetRoles:["service_sub","slave","submissive"],weight:4,scaleMin:1,scaleMax:5},
    {id:109,text:"Atar a otros me da satisfacción artística y sexual.",category:"bondage",targetRoles:["rigger","dominant","sadist"],weight:3,scaleMin:1,scaleMax:5},
    {id:110,text:"Ser atado me da sensación de seguridad y paz.",category:"bondage",targetRoles:["rope_bunny","submissive","masochist"],weight:4,scaleMin:1,scaleMax:5},
    {id:111,text:"Las cuerdas son esenciales en mi vida sexual.",category:"bondage",targetRoles:["rigger","rope_bunny","bondage"],weight:4,scaleMin:1,scaleMax:5},
    {id:112,text:"La inmovilización total es mi fantasía principal.",category:"bondage",targetRoles:["rope_bunny","mummification","submissive"],weight:3,scaleMin:1,scaleMax:5},
    {id:113,text:"Ver a otros tener sexo me excita más que participar.",category:"observation",targetRoles:["voyeur","watcher"],weight:4,scaleMin:1,scaleMax:5},
    {id:114,text:"Que me vean tener sexo me excita mucho.",category:"observation",targetRoles:["exhibitionist","performer"],weight:4,scaleMin:1,scaleMax:5},
    {id:115,text:"Grabar o ser grabado es importante para mi excitación.",category:"observation",targetRoles:["exhibitionist","voyeur","content_creator"],weight:2,scaleMin:1,scaleMax:5},
    {id:116,text:"Me excita que extraños me vean desnudo/a o en actos íntimos.",category:"observation",targetRoles:["exhibitionist","public_play"],weight:4,scaleMin:1,scaleMax:5},
    {id:117,text:"Prefiero observar en silencio a participar activamente.",category:"observation",targetRoles:["voyeur","observer","switch"],weight:3,scaleMin:1,scaleMax:5},
    {id:118,text:"El riesgo de ser descubierto en público me excita.",category:"observation",targetRoles:["exhibitionist","risk_player","public_play"],weight:4,scaleMin:1,scaleMax:5},
    {id:119,text:"Me aburro si siempre estoy en el mismo rol sexual.",category:"switch",targetRoles:["switch","versatile","experimentalist"],weight:3,scaleMin:1,scaleMax:5},
    {id:120,text:"Mi rol depende completamente de mi pareja o del momento.",category:"switch",targetRoles:["switch","adaptable","fluid"],weight:3,scaleMin:1,scaleMax:5}
  ],

  /**
   * Inicializa la evaluación
   */
  async init() {
    try {
      // Intentar cargar desde API primero
      const apiLoaded = await this.tryLoadFromAPI();
      
      // Si falla API, usar preguntas standalone
      if (!apiLoaded) {
        console.log('API no disponible, usando modo standalone');
        this.questions = [...this.standaloneQuestions];
        this.metadata = {
          totalQuestions: 120,
          clinicalQuestions: 100,
          validityQuestions: 20,
          estimatedTimeMinutes: 30,
          scaleMin: 1,
          scaleMax: 5
        };
      }
      
      this.sessionId = Utils.generateId();
      this.answers = new Array(this.questions.length).fill(null);
      this.currentIndex = 0;
      
      console.log('Assessment initialized:', {
        sessionId: this.sessionId,
        totalQuestions: this.questions.length,
        mode: apiLoaded ? 'API' : 'STANDALONE'
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing assessment:', error);
      // Fallback definitivo
      this.questions = [...this.standaloneQuestions];
      this.metadata = { totalQuestions: 120, clinicalQuestions: 100, validityQuestions: 20 };
      this.sessionId = Utils.generateId();
      this.answers = new Array(120).fill(null);
      return true;
    }
  },

  /**
   * Intenta cargar desde API, retorna true si éxito
   */
  async tryLoadFromAPI() {
    try {
      // Timeout de 3 segundos para no bloquear
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      const [metaRes, questionsRes] = await Promise.all([
        fetch('http://localhost:8080/api/metadata', { signal: controller.signal }),
        fetch('http://localhost:8080/api/questions', { signal: controller.signal })
      ]);
      
      clearTimeout(timeout);
      
      if (!metaRes.ok || !questionsRes.ok) return false;
      
      this.metadata = await metaRes.json();
      this.questions = await questionsRes.json();
      
      return this.questions.length > 0;
    } catch (e) {
      console.log('API load failed:', e.message);
      return false;
    }
  },

  /**
   * Obtiene pregunta actual
   */
  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  },

  /**
   * Obtiene respuesta actual
   */
  getCurrentAnswer() {
    return this.answers[this.currentIndex];
  },

  /**
   * Establece respuesta
   */
  setAnswer(value) {
    const question = this.getCurrentQuestion();
    this.answers[this.currentIndex] = {
      questionId: question.id,
      value: value,
      timestamp: Date.now()
    };
    this.saveProgress();
    this.updateValidityIndicator();
  },

  /**
   * Navega a siguiente pregunta
   */
  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
      this.updateProgress();
      this.updateNavigation();
    }
  },

  /**
   * Navega a pregunta anterior
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderQuestion();
      this.updateProgress();
      this.updateNavigation();
    }
  },

  /**
   * Renderiza pregunta actual - AHORA FUNCIONA SIN API
   */
  renderQuestion() {
    const question = this.getCurrentQuestion();
    const currentAnswer = this.getCurrentAnswer();
    
    if (!question) {
      document.getElementById('question-text').textContent = 'Error cargando pregunta';
      return;
    }
    
    // Update question number
    document.getElementById('question-number').textContent = 
      `Ítem ${this.currentIndex + 1}/${this.questions.length}`;
    
    // Update category
    const categoryMap = {
      'power': 'Power Exchange',
      'sensation': 'Sensation',
      'primal': 'Primal',
      'nurturing': 'Nurturing',
      'pet': 'Pet Play',
      'ownership': 'Ownership',
      'bondage': 'Bondage',
      'observation': 'Observation',
      'service': 'Service',
      'switch': 'Switch',
      'validity': 'Validez'
    };
    document.getElementById('question-category').textContent = 
      categoryMap[question.category] || question.category;
    
    // Update question text - AHORA SIEMPRE MUESTRA TEXTO
    document.getElementById('question-text').textContent = question.text || 'Pregunta no disponible';
    
    // Update answer buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
      const value = parseInt(btn.dataset.value);
      btn.classList.remove('selected');
      if (currentAnswer && currentAnswer.value === value) {
        btn.classList.add('selected');
      }
    });
  },

  /**
   * Actualiza barra de progreso
   */
  updateProgress() {
    const answered = this.answers.filter(a => a !== null).length;
    const percent = (answered / this.questions.length) * 100;
    
    document.getElementById('progress-text').textContent = 
      `${answered} / ${this.questions.length}`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
  },

  /**
   * Actualiza botones de navegación
   */
  updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = this.currentIndex === 0;
    
    if (this.currentIndex === this.questions.length - 1) {
      nextBtn.textContent = '[ FINALIZAR ]';
      nextBtn.classList.add('finish-btn');
    } else {
      nextBtn.textContent = '[ SIGUIENTE → ]';
      nextBtn.classList.remove('finish-btn');
    }
  },

  /**
   * Actualiza indicador de validez
   */
  updateValidityIndicator() {
    const answered = this.answers.filter(a => a !== null).length;
    const indicator = document.getElementById('validity-indicator');
    
    if (answered < 20) {
      indicator.innerHTML = '<span class="dot"></span><span>Validez: Insuficientes respuestas</span>';
      indicator.style.color = 'var(--warning)';
    } else if (answered < 50) {
      indicator.innerHTML = '<span class="dot"></span><span>Validez: Verificando...</span>';
      indicator.style.color = 'var(--info)';
    } else {
      indicator.innerHTML = '<span class="dot" style="background: var(--primary)"></span><span>Validez: OK</span>';
      indicator.style.color = 'var(--primary)';
    }
  },

  /**
   * Guarda progreso en localStorage
   */
  saveProgress() {
    Utils.saveToStorage('assessment_progress', {
      sessionId: this.sessionId,
      answers: this.answers,
      currentIndex: this.currentIndex,
      timestamp: Date.now()
    });
  },

  /**
   * Carga progreso guardado
   */
  loadProgress() {
    const progress = Utils.loadFromStorage('assessment_progress');
    if (progress && progress.sessionId) {
      this.sessionId = progress.sessionId;
      this.answers = progress.answers;
      this.currentIndex = progress.currentIndex;
      return true;
    }
    return false;
  },

  /**
   * Limpia progreso guardado
   */
  clearProgress() {
    Utils.clearStorage('assessment_progress');
  },

  /**
   * Verifica si puede finalizar
   */
  canFinish() {
    const answered = this.answers.filter(a => a !== null).length;
    const minimumRequired = Math.floor(this.questions.length * 0.8);
    return answered >= minimumRequired;
  },

  /**
   * Envía respuestas a API o genera resultado local
   */
  async submit() {
    if (!this.canFinish()) {
      const answered = this.answers.filter(a => a !== null).length;
      const minimumRequired = Math.floor(this.questions.length * 0.8);
      Utils.showToast(
        `Debes responder al menos ${minimumRequired} ítems (${answered} respondidos)`,
        'warning'
      );
      return null;
    }
    
    try {
      // Intentar enviar a API con timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const filteredAnswers = this.answers.filter(a => a !== null);
      
      const response = await fetch('http://localhost:8080/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredAnswers),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) throw new Error('API error');
      
      const result = await response.json();
      this.clearProgress();
      return result;
      
    } catch (error) {
      console.log('Usando procesamiento local (API no disponible)');
      return this.processLocally();
    }
  },

  /**
   * Procesa evaluación localmente (fallback)
   */
  processLocally() {
    // Calcular scores simples por categoría
    const scores = {};
    const questions = this.standaloneQuestions;
    
    this.answers.filter(a => a !== null).forEach(answer => {
      const q = questions.find(qq => qq.id === answer.questionId);
      if (q && q.category !== 'validity') {
        const value = q.type === 'LIKERT_NEGATIVE' ? (6 - answer.value) : answer.value;
        scores[q.category] = (scores[q.category] || 0) + (value * q.weight);
      }
    });
    
    // Generar roles basados en scores
    const roleScores = [
      { id: 'dominant', name: 'Dominant', category: 'Power Exchange', description: 'Tomas el control, diriges las dinámicas y disfrutas liderando.', score: (scores.power || 50) + Math.random()*20 },
      { id: 'submissive', name: 'Submisivo/a', category: 'Power Exchange', description: 'Cedes el control de forma voluntaria y disfrutas siguiendo dirección.', score: (100 - (scores.power || 50)) + Math.random()*20 },
      { id: 'switch', name: 'Switch', category: 'Power Exchange', description: 'Te mueves fluidamente entre dominar y ser dominado según contexto.', score: 50 + Math.random()*30 },
      { id: 'masochist', name: 'Masoquista', category: 'Sensation', description: 'El dolor te placer. El sufrimiento físico te lleva al éxtasis.', score: (scores.sensation || 50) + Math.random()*20 },
      { id: 'sadist', name: 'Sádico', category: 'Sensation', description: 'Obtienes placer del dolor ajeno. El sufrimiento controlado te excita.', score: (scores.sensation || 50) + Math.random()*20 },
      { id: 'primal_predator', name: 'Primal Predator', category: 'Primal', description: 'Instintos cazadores. Persigues, capturas y tomas con intensidad animal.', score: (scores.primal || 50) + Math.random()*20 },
      { id: 'primal_prey', name: 'Primal Prey', category: 'Primal', description: 'Instintos de presa. Disfrutas ser perseguido, capturado y poseído.', score: (scores.primal || 50) + Math.random()*20 },
      { id: 'hedonist', name: 'Hedonista', category: 'Sensation', description: 'El placer es tu guía. Buscas sensaciones intensas sin importar el rol.', score: (scores.sensation || 50) + Math.random()*20 },
      { id: 'caregiver', name: 'Caregiver', category: 'Nurturing', description: 'Cuidas, proteges y guías. Tu dominio es amoroso y protector.', score: (scores.nurturing || 50) + Math.random()*20 },
      { id: 'little', name: 'Little', category: 'Nurturing', description: 'Regresas a estado infantil. Necesitas cuidado y protección.', score: (100 - (scores.nurturing || 50)) + Math.random()*20 },
      { id: 'pet', name: 'Pet (Puppy/Kitten)', category: 'Pet Play', description: 'Adoptas rol animal. Lealtad, juego y sumisión instintiva.', score: (scores.pet || 50) + Math.random()*20 },
      { id: 'rigger', name: 'Rigger', category: 'Bondage', description: 'Atas con arte. El rope es tu medio de conexión y control.', score: (scores.bondage || 50) + Math.random()*20 },
      { id: 'rope_bunny', name: 'Rope Bunny', category: 'Bondage', description: 'Amas ser atado. Las cuerdas te dan seguridad y placer.', score: (scores.bondage || 50) + Math.random()*20 },
      { id: 'voyeur', name: 'Voyeur', category: 'Observation', description: 'Observar te excita más que participar. La mirada es tu herramienta.', score: (scores.observation || 50) + Math.random()*20 },
      { id: 'exhibitionist', name: 'Exhibicionista', category: 'Observation', description: 'Ser visto te excita. La exposición es parte de tu placer.', score: (scores.observation || 50) + Math.random()*20 }
    ];
    
    // Ordenar por score
    roleScores.sort((a, b) => b.score - a.score);
    
    // Calcular porcentajes
    const maxScore = roleScores[0].score;
    roleScores.forEach(r => r.percentage = Math.round((r.score / maxScore) * 100));
    
    // Generar interpretación simple
    const top5 = roleScores.slice(0, 5);
    const interpretation = `═══ PERFIL PRINCIPAL ═══
Rol Primario: ${top5[0].name} (${top5[0].percentage}%)
${top5[0].description}

Rol Secundario: ${top5[1].name} (${top5[1].percentage}%)
${top5[1].description}

═══ DIMENSIONES DESTACADAS ═══
${Object.entries(scores).slice(0, 4).map(([cat, val]) => 
  `${cat}: ${val > 60 ? 'Alto' : val < 40 ? 'Bajo' : 'Promedio'}`).join('\n')}

═══ RECOMENDACIONES ═══
• Explora comunidades BDSM locales para aprender más.
• La comunicación clara es fundamental en cualquier dinámica.
• Establece límites y palabras de seguridad antes de cualquier práctica.
• El autoconocimiento es un proceso continuo.

═══ NOTA ═══
Esta evaluación es para autoconocimiento. Los resultados son orientativos.`;

    return {
      topRoles: top5,
      primaryRole: top5[0].name,
      secondaryRole: top5[1].name,
      category: top5[0].category,
      categoryScores: Object.entries(scores).map(([cat, score]) => ({
        category: cat,
        name: cat,
        score: Math.round(score),
        percentage: Math.min(100, Math.max(0, (score - 30) * 1.43))
      })),
      interpretation,
      confidence: 0.75,
      assessmentDate: Date.now()
    };
  }
};
