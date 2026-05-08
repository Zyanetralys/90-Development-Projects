import javax.swing.*;
import java.awt.*;
import java.util.Map;

public class RadarChart extends JPanel {

    private Map<String, Double> data;

    public RadarChart(Map<String, Double> data) {
        this.data = data;
        setPreferredSize(new Dimension(400, 400));
        setBackground(Color.BLACK);
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2 = (Graphics2D) g;
        g2.setColor(Color.RED);

        int cx = getWidth() / 2;
        int cy = getHeight() / 2;
        int r = 120;

        int n = data.size();
        double step = 2 * Math.PI / n;

        int i = 0;
        int[] xs = new int[n];
        int[] ys = new int[n];

        for (String key : data.keySet()) {

            double val = data.get(key) / 100.0;
            double angle = i * step;

            xs[i] = cx + (int)(Math.cos(angle) * r * val);
            ys[i] = cy + (int)(Math.sin(angle) * r * val);

            g2.drawString(key,
                    cx + (int)(Math.cos(angle) * (r + 20)),
                    cy + (int)(Math.sin(angle) * (r + 20)));

            i++;
        }

        g2.drawPolygon(xs, ys, n);
    }
}
