const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const centroX = canvas.width / 2;
const centroY = canvas.height / 2;
const radio = canvas.width / 2 - 20;

const opciones = ["Beso", "1$", "Abrazo", "Cachetada", "Caricia", "Regalo", "Piropo", "Chiste"];
const colores = ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40","#8BC34A","#E91E63"];

let angulo = 0;
let velocidad = 0;
let girando = false;

const sonido = document.getElementById("sonidoGiro");

function dibujarRuleta() {
    const numOpciones = opciones.length;
    const anguloPorSegmento = (2 * Math.PI) / numOpciones;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numOpciones; i++) {
        const inicio = angulo + i * anguloPorSegmento;
        const fin = inicio + anguloPorSegmento;

        const grad = ctx.createRadialGradient(centroX, centroY, radio*0.1, centroX, centroY, radio);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(1, colores[i % colores.length]);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, inicio, fin);
        ctx.lineTo(centroX, centroY);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(inicio + anguloPorSegmento/2);
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(opciones[i], radio - 10, 5);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.moveTo(centroX, centroY - radio - 15);
    ctx.lineTo(centroX - 15, centroY - radio + 25);
    ctx.lineTo(centroX + 15, centroY - radio + 25);
    ctx.closePath();
    ctx.fillStyle = "#333";
    ctx.fill();
}

function animar() {
    if (velocidad > 0.002) {
        angulo += velocidad;
        velocidad *= 0.97;
        dibujarRuleta();
        requestAnimationFrame(animar);
    } else if (girando) {
        girando = false;
        mostrarResultado();
    }
}

function mostrarResultado() {
    const numOpciones = opciones.length;
    const anguloPorSegmento = (2 * Math.PI) / numOpciones;
    let indice = Math.floor((2 * Math.PI - (angulo % (2*Math.PI))) / anguloPorSegmento);
    indice = indice % numOpciones;
    document.getElementById("resultado").textContent = "Resultado: " + opciones[indice];
}

document.getElementById("girar").addEventListener("click", () => {
    if (!girando) {
        girando = true;
        velocidad = Math.random() * 0.3 + 0.4;
        sonido.currentTime = 0;
        sonido.play();
        animar();
    }
});

dibujarRuleta();
