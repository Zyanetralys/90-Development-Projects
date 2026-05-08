import java.util.Map;

public class Question {
    String text;
    Map<String, Double> factors;
    boolean reverse;

    public Question(String text, Map<String, Double> factors, boolean reverse) {
        this.text = text;
        this.factors = factors;
        this.reverse = reverse;
    }
}
