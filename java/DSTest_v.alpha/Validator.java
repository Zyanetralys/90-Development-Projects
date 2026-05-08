import java.util.List;

public class Validator {

    public static String validate(List<Integer> answers) {

        int same = 0;
        for (int i = 1; i < answers.size(); i++) {
            if (answers.get(i).equals(answers.get(i - 1))) same++;
        }

        if (same > answers.size() * 0.8)
            return "Respuestas demasiado uniformes.";

        long extremes = answers.stream().filter(a -> a == 1 || a == 5).count();

        if (extremes > answers.size() * 0.9)
            return "Sesgo en respuestas extremas.";

        return "Respuestas válidas.";
    }
}
