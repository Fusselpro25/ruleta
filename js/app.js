// ===== Ruleta justa (todas las opciones con la misma probabilidad) =====
const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const centroX = canvas.width / 2;
const centroY = canvas.height / 2;
const radio = canvas.width / 2 - 10;

const opciones = ["Beso", "Tira otra vez", "Abrazo", "Cachetada", "Caricia", "Regalo", "Piropo", "Chiste"];
const colores = ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40","#8BC34A","#E91E63"];

// Audio
const sonidoGiro = new Audio("audio/spin.wav");
const sonidoResultado = new Audio("audio/win.wav");

let angulo = 0;               
let girando = false;

let indiceSeleccionado = null;
let anguloInicio = 0;
let anguloFinal = 0;
let tiempoInicio = 0;
let duracionGiro = 0;

const btnGirar = document.getElementById("girar");
const resultadoElem = document.getElementById("resultado");
const sonidoCheck = document.getElementById("sonidoCheck");
let sonidoActivo = true;
sonidoCheck.addEventListener('change', () => sonidoActivo = sonidoCheck.checked);

function playSonidoGiro() {
    if (sonidoActivo) { try { sonidoGiro.currentTime = 0; sonidoGiro.play(); } catch(e){} }
}
function playSonidoResultado() {
    if (sonidoActivo) { try { sonidoResultado.currentTime = 0; sonidoResultado.play(); } catch(e){} }
}

// Dibujo con sectores IGUALES
function dibujarRuleta() {
    const n = opciones.length;
    const seg = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < n; i++) {
        const inicio = angulo + i * seg;
        const fin = inicio + seg;

        const grad = ctx.createRadialGradient(centroX, centroY, radio * 0.3, centroX, centroY, radio);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, colores[i % colores.length]);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, inicio, fin);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texto
        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(inicio + seg / 2);
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(opciones[i], radio - 15, 5);
        ctx.restore();
    }

    // Centro
    ctx.beginPath();
    ctx.arc(centroX, centroY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff5722";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Easing
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animar(timestamp) {
    if (!girando) return;

    const t = Math.min((timestamp - tiempoInicio) / duracionGiro, 1);
    const e = easeOutCubic(t);
    angulo = anguloInicio + (anguloFinal - anguloInicio) * e;

    dibujarRuleta();

    if (t < 1) {
        requestAnimationFrame(animar);
    } else {
        girando = false;
        mostrarResultado();
    }
}

// Ganador uniforme
function sorteoJusto() {
    return Math.floor(Math.random() * opciones.length);
}

// Preparar giro para que el sector ganador quede en la flecha
function prepararGiro(indiceGanador) {
    const n = opciones.length;
    const seg = (2 * Math.PI) / n;
    const flechaArriba = -Math.PI / 2;

    const objetivoBase = flechaArriba - (indiceGanador + 0.5) * seg;
    const vueltasExtra = 4 + Math.floor(Math.random() * 3);
    const diffActual = ((objetivoBase - (angulo % (2 * Math.PI))) + 2 * Math.PI) % (2 * Math.PI);

    anguloInicio = angulo;
    anguloFinal = angulo + diffActual + 2 * Math.PI * vueltasExtra;

    duracionGiro = 2600 + Math.random() * 1200;
    tiempoInicio = performance.now();
}

// Mostrar resultado
function mostrarResultado() {
    resultadoElem.textContent = "Resultado: " + opciones[indiceSeleccionado];
    resultadoElem.style.animation = "none";
    setTimeout(() => {
        resultadoElem.style.animation = "pulse 0.5s";
    }, 10);
    playSonidoResultado();
    btnGirar.disabled = false;
}

// Evento: Girar
btnGirar.addEventListener("click", () => {
    if (girando) return;
    girando = true;
    btnGirar.disabled = true;
    resultadoElem.textContent = "";

    // Sorteo uniforme
    indiceSeleccionado = sorteoJusto();
    prepararGiro(indiceSeleccionado);

    playSonidoGiro();
    requestAnimationFrame(animar);
});

// Inicial
dibujarRuleta();
