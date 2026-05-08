import java.util.*;

public class QuestionBank {

    public static List<Question> get() {
        List<Question> q = new ArrayList<>();

        String[] control = {
                "Prefiero liderar situaciones.",
                "Me gusta tomar decisiones.",
                "Asumo el control fácilmente."
        };

        String[] submission = {
                "Prefiero que otros decidan.",
                "Me siento cómodo siguiendo.",
                "Disfruto obedecer."
        };

        String[] primal = {
                "Actúo por instinto.",
                "Me dejo llevar fácilmente.",
                "Prefiero intensidad a control."
        };

        for (int i = 0; i < 20; i++) {

            q.add(new Question(control[i % control.length], Map.of("control", 1.0), false));
            q.add(new Question(submission[i % submission.length], Map.of("submission", 1.0), false));
            q.add(new Question(primal[i % primal.length], Map.of("primal", 1.0), false));

            q.add(new Question("Evito el control.", Map.of("control", 1.0), true));
            q.add(new Question("Evito obedecer.", Map.of("submission", 1.0), true));
            q.add(new Question("Evito intensidad.", Map.of("primal", 1.0), true));

            q.add(new Question("Busco placer directo.", Map.of("hedonism", 1.0), false));
            q.add(new Question("Me gusta servir.", Map.of("service", 1.0), false));
            q.add(new Question("Desafío normas.", Map.of("brat", 1.0), false));
        }

        return q;
    }
}
