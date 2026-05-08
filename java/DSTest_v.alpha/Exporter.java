import java.io.FileWriter;
import java.util.List;
import java.util.Map;

public class Exporter {

    public static void exportCSV(List<Integer> answers, Map<String, Double> dim) {

        try {
            FileWriter writer = new FileWriter("resultados.csv");

            writer.write("Pregunta,Respuesta\n");

            for (int i = 0; i < answers.size(); i++) {
                writer.write((i + 1) + "," + answers.get(i) + "\n");
            }

            writer.write("\nDimensiones\n");

            for (String k : dim.keySet()) {
                writer.write(k + "," + dim.get(k) + "\n");
            }

            writer.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
