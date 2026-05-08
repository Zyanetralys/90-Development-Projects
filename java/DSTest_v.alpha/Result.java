import java.util.Map;

public class Result {
    Map<String, Double> dimensions;
    Map<String, Double> roles;
    String primary;
    String secondary;
    String description;

    public Result(Map<String, Double> dimensions, Map<String, Double> roles,
                  String primary, String secondary, String description) {
        this.dimensions = dimensions;
        this.roles = roles;
        this.primary = primary;
        this.secondary = secondary;
        this.description = description;
    }
}
