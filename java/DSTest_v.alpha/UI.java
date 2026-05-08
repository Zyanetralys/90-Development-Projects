import javax.swing.*;
import java.awt.*;
import java.util.*;

public class UI extends JFrame {

    private List<Question> questions;
    private List<Integer> answers;
    private int index = 0;

    private JLabel label;
    private JSlider slider;

    public UI() {

        questions = QuestionBank.get();
        answers = new ArrayList<>(Collections.nCopies(questions.size(), 3));

        setTitle("Evaluación de Perfil");
        setSize(700, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        getContentPane().setBackground(Color.BLACK);
        setLayout(new BorderLayout());

        label = new JLabel("", SwingConstants.CENTER);
        label.setForeground(Color.RED);
        label.setFont(new Font("Arial", Font.BOLD, 16));

        slider = new JSlider(1, 5, 3);
        slider.setBackground(Color.BLACK);
        slider.setForeground(Color.RED);

        JPanel panel = new JPanel();
        panel.setBackground(Color.BLACK);

        JButton next = new JButton("Siguiente");
        JButton prev = new JButton("Atrás");
        JButton exit = new JButton("Salir");
        JButton restart = new JButton("Reiniciar");

        next.addActionListener(e -> next());
        prev.addActionListener(e -> prev());
        exit.addActionListener(e -> System.exit(0));
        restart.addActionListener(e -> restart());

        panel.add(prev);
        panel.add(next);
        panel.add(restart);
        panel.add(exit);

        add(label, BorderLayout.NORTH);
        add(slider, BorderLayout.CENTER);
        add(panel, BorderLayout.SOUTH);

        showQ();
        setVisible(true);
    }

    private void showQ() {
        label.setText("<html>[" + (index + 1) + "/" + questions.size() + "]<br>" +
                questions.get(index).text + "</html>");
        slider.setValue(answers.get(index));
    }

    private void next() {
        answers.set(index, slider.getValue());

        if (index < questions.size() - 1) {
            index++;
            showQ();
        } else {
            showResult();
        }
    }

    private void prev() {
        answers.set(index, slider.getValue());

        if (index > 0) {
            index--;
            showQ();
        }
    }

    private void restart() {
        index = 0;
        Collections.fill(answers, 3);
        showQ();
    }

    private void showResult() {

        Result r = Engine.evaluate(questions, answers);

        String validation = Validator.validate(answers);

        Exporter.exportCSV(answers, r.dimensions);

        JFrame graph = new JFrame("Perfil");
        graph.add(new RadarChart(r.dimensions));
        graph.pack();
        graph.setVisible(true);

        StringBuilder sb = new StringBuilder();
        sb.append(r.description).append("\n\n");
        sb.append("VALIDACIÓN: ").append(validation).append("\n\n");

        r.roles.forEach((k, v) ->
                sb.append(k).append(": ").append((int)Math.round(v)).append("\n")
        );

        JOptionPane.showMessageDialog(this, sb.toString());
    }
}
