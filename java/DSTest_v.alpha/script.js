document.addEventListener("DOMContentLoaded", () => {

    let questions = [];
    let answers = [];
    let index = 0;

    const qText = document.getElementById("question-text");
    const progress = document.getElementById("progress");
    const slider = document.getElementById("slider");
    const resultBox = document.getElementById("result");
    const output = document.getElementById("output");
    const introBox = document.getElementById("intro");
    const testBox = document.getElementById("test");

    const startBtn = document.getElementById("startBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const restartBtn = document.getElementById("restartBtn");
    const exitBtn = document.getElementById("exitBtn");
    const restartResult = document.getElementById("restartResult");
    const exitResult = document.getElementById("exitResult");

    // Preguntas básicas
    function generateQuestions() {
        const q = [];
        const add = (text, factors, reverse=false) => {
            q.push({text, factors, reverse});
        };

        add("Prefiero liderar y tomar decisiones.", {control:1});
        add("Me gusta que otros decidan por mí.", {submission:1});
        add("Me atrae servir a otros.", {service:1});
        add("Busco experiencias intensas y primitivas.", {primal:1});
        add("Disfruto del placer inmediato y hedonista.", {hedonism:1});
        add("Me gusta desafiar las normas y bromear con autoridad.", {brat:1});
        add("Evito controlar a otros.", {control:1}, true);
        add("Evito obedecer.", {submission:1}, true);
        add("Evito situaciones intensas.", {primal:1}, true);

        while(q.length < 50) {
            q.push(...q.slice(0,9));
        }

        return q;
    }

    questions = generateQuestions();
    answers = Array(questions.length).fill(3);

    function startTest() {
        introBox.classList.add("hidden");
        testBox.classList.remove("hidden");
        showQuestion();
    }

    function showQuestion() {
        qText.innerText = questions[index].text;
        progress.innerText = `[${index+1}/${questions.length}]`;
        slider.value = answers[index];
    }

    function next() {
        answers[index] = Number(slider.value);
        if(index < questions.length -1){
            index++;
            showQuestion();
        } else {
            showResult();
        }
    }

    function prev() {
        answers[index] = Number(slider.value);
        if(index > 0){
            index--;
            showQuestion();
        }
    }

    function restart() {
        index = 0;
        answers.fill(3);
        resultBox.classList.add("hidden");
        testBox.classList.remove("hidden");
        showQuestion();
    }

    function exitTest() {
        location.reload();
    }

    function evaluate() {
        let dim = {};
        questions.forEach((q,i)=>{
            let val = answers[i];
            if(q.reverse) val = 6-val;
            for(let k in q.factors){
                dim[k] = (dim[k]||0) + val*q.factors[k];
            }
        });

        for(let k in dim){
            dim[k] = Math.round((dim[k]/(questions.length*5))*100);
        }

        let roles = {
            "Dominante": dim.control||0,
            "Sumiso": dim.submission||0,
            "Switch": Math.min(dim.control||0, dim.submission||0),
            "Hedonista": dim.hedonism||0,
            "Service": dim.service||0,
            "Primal": dim.primal||0,
            "Brat": dim.brat||0
        };

        let sorted = Object.entries(roles).sort((a,b)=>b[1]-a[1]);
        return {dim, roles, primary: sorted[0][0], secondary: sorted[1][0]};
    }

    function validate() {
        let same = 0;
        for(let i=1;i<answers.length;i++){
            if(answers[i]===answers[i-1]) same++;
        }
        if(same>answers.length*0.8) return "Respuestas uniformes.";
        return "Respuestas válidas.";
    }

    function showResult(){
        testBox.classList.add("hidden");
        const r = evaluate();
        const val = validate();

        let text = `Perfil principal: ${r.primary}\nPerfil secundario: ${r.secondary}\nVALIDACIÓN: ${val}\n\n`;
        for(let k in r.roles){
            text += `${k}: ${r.roles[k]}%\n`;
        }

        output.innerText = text;
        resultBox.classList.remove("hidden");
        drawChart(r.dim);
    }

    function drawChart(data){
        const canvas = document.getElementById("chart");
        const ctx = canvas.getContext("2d");
        const keys = Object.keys(data);
        const cx = 200;
        const cy = 200;
        const r = 120;

        ctx.clearRect(0,0,400,400);
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.font = "12px Arial";

        let points = [];
        keys.forEach((k,i)=>{
            let angle = (i/keys.length)*Math.PI*2;
            let val = (data[k]||0)/100;
            let x = cx + Math.cos(angle)*r*val;
            let y = cy + Math.sin(angle)*r*val;
            points.push({x,y});
            ctx.fillText(k, cx+Math.cos(angle)*(r+20), cy+Math.sin(angle)*(r+20));
        });

        ctx.beginPath();
        points.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
        ctx.closePath();
        ctx.stroke();
    }

    startBtn.addEventListener("click", startTest);
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    restartBtn.addEventListener("click", restart);
    exitBtn.addEventListener("click", exitTest);
    restartResult.addEventListener("click", restart);
    exitResult.addEventListener("click", exitTest);

});
