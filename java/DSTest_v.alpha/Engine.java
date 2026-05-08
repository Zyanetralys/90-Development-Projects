import java.util.*;

public class Engine {

    public static Result evaluate(List<Question> questions, List<Integer> answers) {

        Map<String, Double> dim = new HashMap<>();

        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
            double val = answers.get(i);

            if (q.reverse) val = 6 - val;

            for (String f : q.factors.keySet()) {
                dim.put(f, dim.getOrDefault(f, 0.0) + val * q.factors.get(f));
            }
        }

        dim.replaceAll((k, v) -> (v / (questions.size() * 5)) * 100);

        double control = dim.getOrDefault("control", 0.0);
        double sub = dim.getOrDefault("submission", 0.0);
        double sad = dim.getOrDefault("sadism", 0.0);
        double mas = dim.getOrDefault("masochism", 0.0);
        double serv = dim.getOrDefault("service", 0.0);
        double primal = dim.getOrDefault("primal", 0.0);
        double hed = dim.getOrDefault("hedonism", 0.0);
        double brat = dim.getOrDefault("brat", 0.0);

        Map<String, Double> roles = new HashMap<>();
        roles.put("Dominante", control);
        roles.put("Sumiso", sub);
        roles.put("Switch", Math.min(control, sub));
        roles.put("Sádico", sad);
        roles.put("Masoquista", mas);
        roles.put("Esclavo", sub + serv);
        roles.put("Service", serv);
        roles.put("Primal Depredador", primal + control);
        roles.put("Primal Presa", primal + sub);
        roles.put("Hedonista", hed);
        roles.put("Brat", brat);

        List<Map.Entry<String, Double>> sorted = new ArrayList<>(roles.entrySet());
        sorted.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        String primary = sorted.get(0).getKey();
        String secondary = sorted.get(1).getKey();

        String desc = buildDescription(primary, secondary, dim);

        return new Result(dim, roles, primary, secondary, desc);
    }

    private static String buildDescription(String p, String s, Map<String, Double> dim) {

        StringBuilder sb = new StringBuilder();

        sb.append("Perfil principal: ").append(p).append("\n");
        sb.append("Perfil secundario: ").append(s).append("\n\n");

        if (dim.get("control") > 70)
            sb.append("Alta necesidad de control.\n");

        if (dim.get("submission") > 70)
            sb.append("Alta tendencia a ceder control.\n");

        if (dim.get("primal") > 60)
            sb.append("Predominio de respuestas instintivas.\n");

        if (dim.get("hedonism") > 60)
            sb.append("Orientación clara al placer.\n");

        if (dim.get("service") > 60)
            sb.append("Fuerte orientación a servir.\n");

        if (Math.abs(dim.get("control") - dim.get("submission")) < 10)
            sb.append("Perfil flexible tipo switch.\n");

        return sb.toString();
    }
}
