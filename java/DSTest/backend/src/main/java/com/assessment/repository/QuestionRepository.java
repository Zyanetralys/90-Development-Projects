package com.assessment.repository;

import com.assessment.model.Question;
import com.assessment.model.QuestionType;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

/**
 * Banco completo de ítems para evaluación psicológica de roles BDSM
 * Total: 120 ítems (100 clínicos + 20 escalas de validez)
 * Tiempo estimado: 25-35 minutos
 * 
 * Dimensiones evaluadas:
 * - Power Exchange (Dominancia/Sumisión)
 * - Sensation Seeking (Dolor/Placer)
 * - Primal Instinct (Depredador/Presa)
 * - Nurturing Dynamic (Caregiver/Little)
 * - Service Orientation (Servicio)
 * - Ownership Tendency (Propiedad)
 * - Pet Play Affinity (Rol animal)
 * - Bondage Preference (Ataduras)
 * - Exhibition/Voyeur (Mostrar/Ver)
 * - Switch Flexibility (Flexibilidad de rol)
 */
@Repository
public class QuestionRepository {
    
    public List<Question> getAllQuestions() {
        return Arrays.asList(
            // ═══════════════════════════════════════════════════════════════
            // ESCALAS DE VALIDEZ (Ítems 1-20)
            // Detectan respuestas falsas, aleatorias o socialmente deseables
            // ═══════════════════════════════════════════════════════════════
            
            // --- Escala L (Lie) - Deseabilidad Social (8 ítems) ---
            new Question(1, "Nunca he dicho una mentira, ni siquiera pequeña.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(2, "Siempre trato a todo el mundo con respeto, sin excepción.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(3, "Me gusta todo el mundo que conozco.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(4, "Nunca me he enfadado tanto como para perder el control.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(5, "Siempre admito mis errores inmediatamente.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(6, "Nunca he tenido pensamientos que me avergüencen.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(7, "Me considero una persona moralmente superior a la mayoría.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            new Question(8, "Nunca he sentido celos de nadie.", "validity", 
                new String[]{}, 2, QuestionType.VALIDITY_LIE, 1, 5),
            
            // --- Escala F (Infrequency) - Respuestas Raras/Extremas (6 ítems) ---
            new Question(9, "A veces siento que puedo leer la mente de otras personas.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            new Question(10, "He visto cosas que otras personas no pueden ver.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            new Question(11, "Mis sueños siempre se hacen realidad al día siguiente.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            new Question(12, "Tengo poderes especiales que nadie más conoce.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            new Question(13, "Las máquinas funcionan mejor cuando yo estoy cerca.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            new Question(14, "Puedo controlar el clima con mis pensamientos.", "validity", 
                new String[]{}, 3, QuestionType.VALIDITY_INFREQUENT, 1, 5),
            
            // --- Escala VRIN/TRIN - Consistencia (6 ítems pareados) ---
            new Question(15, "Me gusta tomar el control en situaciones íntimas.", "power", 
                new String[]{"dominant", "domme"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(16, "Prefiero que otros tomen el control en situaciones íntimas.", "power", 
                new String[]{"submissive", "slave"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            new Question(17, "El dolor físico me resulta placentero en contexto sexual.", "sensation", 
                new String[]{"masochist"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(18, "El dolor físico me resulta desagradable en cualquier contexto.", "sensation", 
                new String[]{}, 4, QuestionType.LIKERT_NEGATIVE, 1, 5),
            
            new Question(19, "Me identifico con comportamientos de animal doméstico.", "pet", 
                new String[]{"pet", "puppy"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(20, "Me identifico con comportamientos de animal salvaje.", "primal", 
                new String[]{"primal_predator", "primal_prey"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 1: POWER EXCHANGE (Ítems 21-40)
            // Evalúa tendencias de dominancia, sumisión y intercambio de poder
            // ═══════════════════════════════════════════════════════════════
            
            new Question(21, "Me siento más cómodo cuando sé quién manda en una relación.", "power", 
                new String[]{"dominant", "submissive"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(22, "Dar órdenes claras me resulta natural y satisfactorio.", "power", 
                new String[]{"dominant", "domme", "owner"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(23, "Obedecer órdenes me produce una sensación de paz interior.", "power", 
                new String[]{"submissive", "slave", "service_sub"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(24, "La idea de ser 'propiedad' de alguien me excita sexualmente.", "power", 
                new String[]{"slave", "property", "owned"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(25, "Me gusta negociar los límites antes de cualquier práctica.", "power", 
                new String[]{"switch", "dominant", "submissive"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(26, "Siento alivio cuando alguien más asume la responsabilidad total.", "power", 
                new String[]{"submissive", "little", "service_sub"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(27, "Me excita corregir o castigar a alguien que lo merece.", "power", 
                new String[]{"dominant", "sadist", "disciplinarian"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(28, "Ser corregido o castigado me ayuda a sentirme en mi lugar.", "power", 
                new String[]{"submissive", "brat", "slave"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(29, "Me arrodillo naturalmente ante personas que respeto o admiro.", "power", 
                new String[]{"submissive", "slave", "service_sub"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(30, "Espero que las personas me muestren respeto físico (arrodillarse, bajar la mirada).", "power", 
                new String[]{"dominant", "domme", "owner"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(31, "Me gusta usar títulos formales como 'Sir', 'Ma'am', 'Master', 'Mistress'.", "power", 
                new String[]{"dominant", "submissive", "lifestyle"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(32, "Los protocolos y reglas formales me resultan atractivos y excitantes.", "power", 
                new String[]{"dominant", "submissive", "gorean"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(33, "Me siento perdido o ansioso sin una figura de autoridad clara.", "power", 
                new String[]{"submissive", "little", "dependent"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(34, "Me siento frustrado cuando otros no siguen mis instrucciones.", "power", 
                new String[]{"dominant", "control_focused"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(35, "Puedo cambiar entre dominar y ser dominado según la pareja o situación.", "power", 
                new String[]{"switch", "versatile"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(36, "He fantaseado con ser comprado/a o vendido/a como propiedad.", "power", 
                new String[]{"slave", "property", "auction"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(37, "He fantaseado con comprar o vender a una persona como propiedad.", "power", 
                new String[]{"owner", "master", "mistress"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(38, "La palabra 'No' es difícil de aceptar cuando estoy en rol dominante.", "power", 
                new String[]{"dominant", "control_issues"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(39, "La palabra 'No' es difícil de decir cuando estoy en rol sumiso.", "power", 
                new String[]{"submissive", "people_pleaser"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(40, "El poder me excita más que el sexo en sí mismo.", "power", 
                new String[]{"dominant", "power_exchange"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 2: SENSATION SEEKING (Ítems 41-60)
            // Evalúa tolerancia al dolor, búsqueda de sensaciones intensas
            // ═══════════════════════════════════════════════════════════════
            
            new Question(41, "El dolor físico me produce excitación sexual clara.", "sensation", 
                new String[]{"masochist", "painslut"}, 5, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(42, "Ver dolor en otros me produce excitación sexual clara.", "sensation", 
                new String[]{"sadist", "sadomasochist"}, 5, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(43, "Busco sensaciones intensas, sean placenteras o dolorosas.", "sensation", 
                new String[]{"hedonist", "edge_player", "sensation_seeker"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(44, "Las marcas en mi cuerpo (moretones, ronchas) me hacen sentir bien después.", "sensation", 
                new String[]{"masochist", "slave", "branded"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(45, "El límite entre dolor y placer es difuso o inexistente para mí.", "sensation", 
                new String[]{"masochist", "sadomasochist", "hedonist"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(46, "Prefiero el placer suave al dolor intenso.", "sensation", 
                new String[]{"vanilla_curious", "gentle"}, 2, QuestionType.LIKERT_NEGATIVE, 1, 5),
            new Question(47, "Me excita el riesgo controlado en prácticas sexuales.", "sensation", 
                new String[]{"edge_player", "risk_aware", "adventurer"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(48, "La inmovilización total me produce ansiedad, no placer.", "sensation", 
                new String[]{}, 2, QuestionType.LIKERT_NEGATIVE, 1, 5),
            new Question(49, "Puedo disociarme del dolor durante escenas intensas.", "sensation", 
                new String[]{"masochist", "submissive", "experienced"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(50, "Necesito aftercare intenso después de escenas fuertes.", "sensation", 
                new String[]{"masochist", "submissive", "drop_prone"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(51, "El dolor emocional me afecta más que el dolor físico.", "sensation", 
                new String[]{"emotional_masochist", "psychological"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(52, "Me excita humillar o ser humillado verbalmente.", "sensation", 
                new String[]{"sadist", "masochist", "degradation"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(53, "Prefiero prácticas que no dejen marcas visibles.", "sensation", 
                new String[]{"vanilla", "discreet", "professional"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(54, "La intensidad física es más importante que la emocional para mí.", "sensation", 
                new String[]{"sensation_focused", "physical"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(55, "La conexión emocional es más importante que la intensidad para mí.", "sensation", 
                new String[]{"emotional_focused", "intimate"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(56, "He buscado deliberadamente situaciones de dolor extremo.", "sensation", 
                new String[]{"extreme_masochist", "edge_player"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(57, "El sangre me excita o me produce fascinación.", "sensation", 
                new String[]{"blood_player", "extreme"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(58, "Las agujas, cuchillos u objetos punzantes me resultan atractivos.", "sensation", 
                new String[]{"needle_player", "knife_player", "sharp_objects"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(59, "Prefiero sesiones largas y agotadoras a sesiones cortas.", "sensation", 
                new String[]{"endurance", "marathon"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(60, "El orgasmo es menos importante que la experiencia completa.", "sensation", 
                new String[]{"non_orgasmic", "experience_focused"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 3: PRIMAL INSTINCT (Ítems 61-75)
            // Evalúa instintos animales, comportamientos de caza/presa
            // ═══════════════════════════════════════════════════════════════
            
            new Question(61, "Siento impulsos animales que no puedo controlar racionalmente.", "primal", 
                new String[]{"primal", "primal_predator", "primal_prey"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(62, "Me excita perseguir y 'cazar' a mi pareja sexual.", "primal", 
                new String[]{"primal_predator", "hunter"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(63, "Fantaseo con ser perseguido, capturado y poseído.", "primal", 
                new String[]{"primal_prey", "prey"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(64, "El sexo sin palabras, puro instinto, me excita más que el sexo verbal.", "primal", 
                new String[]{"primal", "primal_predator", "primal_prey"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(65, "Gruño, muerdo o marco territorio durante el sexo.", "primal", 
                new String[]{"primal_predator", "primal", "pet"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(66, "Me excita que me muerdan o marquen físicamente en el cuerpo.", "primal", 
                new String[]{"primal_prey", "primal", "masochist"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(67, "Prefiero el sexo en espacios naturales o 'salvajes'.", "primal", 
                new String[]{"primal", "outdoor", "adventurer"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(68, "La ropa o accesorios 'animales' (orejas, colas) me excitan.", "primal", 
                new String[]{"primal", "pet", "furry"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(69, "Me identifico más con un depredador que con una presa.", "primal", 
                new String[]{"primal_predator"}, 4, QuestionType.FORCED_CHOICE_A, 1, 5),
            new Question(70, "Me identifico más con una presa que con un depredador.", "primal", 
                new String[]{"primal_prey"}, 4, QuestionType.FORCED_CHOICE_B, 1, 5),
            new Question(71, "Arrastrar o ser arrastrado me resulta excitante.", "primal", 
                new String[]{"primal_predator", "primal_prey"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(72, "Comer del suelo o de las manos de alguien me excita.", "primal", 
                new String[]{"primal", "pet", "service_sub"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(73, "El sexo en el suelo o superficies duras me resulta atractivo.", "primal", 
                new String[]{"primal", "pet", "rough"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(74, "Sentir el olor natural de mi pareja me excita mucho.", "primal", 
                new String[]{"primal", "scent_player"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(75, "La higiene excesiva antes del sexo me parece innecesaria.", "primal", 
                new String[]{"primal", "natural"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 4: NURTURING DYNAMIC (Ítems 76-90)
            // Evalúa dinámicas de cuidado, regresión de edad (DDlg/MDlb)
            // ═══════════════════════════════════════════════════════════════
            
            new Question(76, "Me gusta cuidar a otros como si fueran niños pequeños.", "nurturing", 
                new String[]{"caregiver", "daddy", "mommy"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(77, "Me siento seguro cuando me tratan con ternura infantil.", "nurturing", 
                new String[]{"little", "baby", "age_regressor"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(78, "Uso lenguaje infantil o comportamientos regresivos voluntariamente.", "nurturing", 
                new String[]{"little", "ageplayer", "baby"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(79, "Comprar regalos o sorprender a mi pareja me satisface emocionalmente.", "nurturing", 
                new String[]{"caregiver", "provider", "daddy", "mommy"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(80, "Necesito que me consuelen físicamente cuando estoy triste.", "nurturing", 
                new String[]{"little", "dependent", "submissive"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(81, "Me gusta usar chupetes, peluches o ropa infantil.", "nurturing", 
                new String[]{"little", "abd", "baby"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(82, "Castigar a un 'niño' que se porta mal me parece apropiado en contexto.", "nurturing", 
                new String[]{"caregiver", "daddy", "disciplinarian"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(83, "Ser castigado como un 'niño' me hace sentir en mi lugar.", "nurturing", 
                new String[]{"little", "brat", "age_regressor"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(84, "Me gusta que me den instrucciones simples y claras.", "nurturing", 
                new String[]{"little", "submissive", "dependent"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(85, "Me gusta dar instrucciones simples y claras a otros.", "nurturing", 
                new String[]{"caregiver", "daddy", "mommy"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(86, "La idea de cambiar pañales o ser cambiado me resulta atractiva.", "nurturing", 
                new String[]{"abd", "caregiver", "little"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(87, "Me siento más feliz cuando no tengo responsabilidades adultas.", "nurturing", 
                new String[]{"little", "age_regressor"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(88, "La responsabilidad de cuidar a otros me hace sentir realizado.", "nurturing", 
                new String[]{"caregiver", "provider", "daddy", "mommy"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(89, "Regresar a un estado mental infantil me da paz.", "nurturing", 
                new String[]{"little", "age_regressor", "meditative"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(90, "La diferencia de edad (real o simulada) me excita.", "nurturing", 
                new String[]{"age_gap", "daddy", "little"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 5: PET PLAY & OWNERSHIP (Ítems 91-105)
            // Evalúa identificación con roles animales y dinámicas de propiedad
            // ═══════════════════════════════════════════════════════════════
            
            new Question(91, "Me identifico con comportamientos de animal doméstico (perro, gato).", "pet", 
                new String[]{"pet", "puppy", "kitten"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(92, "Usar collar o accesorios de pet me excita sexualmente.", "pet", 
                new String[]{"pet", "puppy", "kitten", "slave"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(93, "Comer del suelo o de un plato me resulta excitante.", "pet", 
                new String[]{"pet", "puppy", "primal"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(94, "Necesito aprobación de mi 'dueño' como un animal la necesita.", "pet", 
                new String[]{"pet", "puppy", "slave"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(95, "Ladrar, maullar o hacer sonidos animales me resulta natural.", "pet", 
                new String[]{"pet", "puppy", "kitten"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(96, "Me gusta que me acaricien la cabeza como a una mascota.", "pet", 
                new String[]{"pet", "puppy", "kitten", "little"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(97, "La idea de ser 'entrenado' como un animal me excita.", "pet", 
                new String[]{"pet", "puppy", "conditioned"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(98, "Me gusta 'entrenar' a alguien como si fuera una mascota.", "pet", 
                new String[]{"owner", "trainer", "handler"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(99, "Poseer personas es mi fantasía principal.", "ownership", 
                new String[]{"owner", "master", "mistress"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(100, "Ser propiedad de alguien es mi fantasía principal.", "ownership", 
                new String[]{"slave", "property", "owned"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(101, "Los contratos o acuerdos de propiedad escrita me excitan.", "ownership", 
                new String[]{"owner", "slave", "gorean", "contractual"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(102, "Me gustaría llevar marcas permanentes de propiedad (tatuajes, brands).", "ownership", 
                new String[]{"slave", "property", "owned"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(103, "Me gustaría marcar permanentemente a mi propiedad.", "ownership", 
                new String[]{"owner", "master", "mistress"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(104, "La idea de ser subastado o vendido me excita.", "ownership", 
                new String[]{"slave", "property", "auction"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(105, "La idea de subastar o vender a alguien me excita.", "ownership", 
                new String[]{"owner", "master", "mistress"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            
            // ═══════════════════════════════════════════════════════════════
            // DIMENSIÓN 6: SERVICE, BONDAGE & OBSERVATION (Ítems 106-120)
            // Evalúa orientación al servicio, bondage y voyeurismo/exhibicionismo
            // ═══════════════════════════════════════════════════════════════
            
            new Question(106, "Servir a otros es mi principal forma de expresar sumisión.", "service", 
                new String[]{"service_sub", "servant", "slave"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(107, "Preparar comida, limpiar o cuidar me satisface sexualmente.", "service", 
                new String[]{"service_sub", "maid", "butler"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(108, "Mi placer está principalmente en el placer de mi dominante.", "service", 
                new String[]{"service_sub", "slave", "submissive"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(109, "Atar a otros me da satisfacción artística y sexual.", "bondage", 
                new String[]{"rigger", "dominant", "sadist"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(110, "Ser atado me da sensación de seguridad y paz.", "bondage", 
                new String[]{"rope_bunny", "submissive", "masochist"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(111, "Las cuerdas son esenciales en mi vida sexual.", "bondage", 
                new String[]{"rigger", "rope_bunny", "bondage"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(112, "La inmovilización total es mi fantasía principal.", "bondage", 
                new String[]{"rope_bunny", "mummification", "submissive"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(113, "Ver a otros tener sexo me excita más que participar.", "observation", 
                new String[]{"voyeur", "watcher"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(114, "Que me vean tener sexo me excita mucho.", "observation", 
                new String[]{"exhibitionist", "performer"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(115, "Grabar o ser grabado es importante para mi excitación.", "observation", 
                new String[]{"exhibitionist", "voyeur", "content_creator"}, 2, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(116, "Me excita que extraños me vean desnudo/a o en actos íntimos.", "observation", 
                new String[]{"exhibitionist", "public_play"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(117, "Prefiero observar en silencio a participar activamente.", "observation", 
                new String[]{"voyeur", "observer", "switch"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(118, "El riesgo de ser descubierto en público me excita.", "observation", 
                new String[]{"exhibitionist", "risk_player", "public_play"}, 4, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(119, "Me aburro si siempre estoy en el mismo rol sexual.", "switch", 
                new String[]{"switch", "versatile", "experimentalist"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5),
            new Question(120, "Mi rol depende completamente de mi pareja o del momento.", "switch", 
                new String[]{"switch", "adaptable", "fluid"}, 3, QuestionType.LIKERT_POSITIVE, 1, 5)
        );
    }
    
    /**
     * Obtiene solo los ítems clínicos (excluye escalas de validez)
     */
    public List<Question> getClinicalQuestions() {
        return getAllQuestions().stream()
            .filter(q -> !"validity".equals(q.getCategory()))
            .toList();
    }
    
    /**
     * Obtiene solo los ítems de validez
     */
    public List<Question> getValidityQuestions() {
        return getAllQuestions().stream()
            .filter(q -> "validity".equals(q.getCategory()))
            .toList();
    }
    
    /**
     * Obtiene ítems por dimensión específica
     */
    public List<Question> getQuestionsByDimension(String dimension) {
        return getAllQuestions().stream()
            .filter(q -> dimension.equals(q.getCategory()))
            .toList();
    }
    
    /**
     * Obtiene ítems ponderados por rol específico
     */
    public List<Question> getQuestionsForRole(String roleId) {
        return getAllQuestions().stream()
            .filter(q -> Arrays.asList(q.getTargetRoles()).contains(roleId))
            .filter(q -> q.getWeight() >= 3)
            .toList();
    }
}
