"use strict";

const screen = document.getElementById("screen");
const foodLayer = document.getElementById("food-layer");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");

const xmlns = "http://www.w3.org/2000/svg";

let width = window.innerWidth || 800;
let height = window.innerHeight || 600;
let score = 0;
let highScore = localStorage.getItem("dragon_high_score") || 0;
if (highScoreEl) highScoreEl.innerText = highScore;

const resize = () => {
    width = window.innerWidth || document.documentElement.clientWidth || 800;
    height = window.innerHeight || document.documentElement.clientHeight || 600;
};
window.addEventListener("resize", resize, false);

const pointer = { x: width / 2, y: height / 2 };

window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    rad = 0;
}, false);

const N = 40;
const elems = [];

for (let i = 0; i < N; i++) elems[i] = { use: null, x: width / 2, y: height / 2 };

const prepend = (use, i) => {
    const elem = document.createElementNS(xmlns, "use");
    elems[i].use = elem;
    elem.setAttribute("href", "#" + use);
    screen.prepend(elem);
};

for (let i = 1; i < N; i++) {
    if (i === 1) prepend("Cabeza", i);
    else if (i === 8 || i === 14) prepend("Aletas", i);
    else prepend("Espina", i);
}

// Controle das Bolas de Fogo
const foods = [];
const TOTAL_FOODS = 5;

const spawnFood = () => {
    const layer = document.getElementById("food-layer") || foodLayer;
    if (!layer) return;

    resize();

    // Garante margem para não colar nas bordas
    const margin = 100;
    const maxX = Math.max(width - margin, margin + 50);
    const maxY = Math.max(height - margin, margin + 50);

    const x = Math.floor(Math.random() * (maxX - margin) + margin);
    const y = Math.floor(Math.random() * (maxY - margin) + margin);

    const use = document.createElementNS(xmlns, "use");
    use.setAttribute("href", "#Fireball");
    // Usar x e y diretamente é o padrão SVG mais seguro e compatível
    use.setAttribute("x", x);
    use.setAttribute("y", y);
    
    layer.appendChild(use);
    foods.push({ x, y, elem: use });
};

const createExplosion = (x, y) => {
    const layer = document.getElementById("food-layer") || foodLayer;
    if (!layer) return;

    const circle = document.createElementNS(xmlns, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "35");
    circle.setAttribute("fill", "#00F0FF");
    circle.setAttribute("opacity", "0.8");
    layer.appendChild(circle);
    
    setTimeout(() => circle.remove(), 300);
};

let frm = Math.random();
let rad = 0;
let hue = 0;

const run = () => {
    requestAnimationFrame(run);

    hue = (hue + 1.5) % 360;
    screen.style.filter = `hue-rotate(${hue}deg) drop-shadow(0 0 12px rgba(0, 240, 255, 0.8))`;

    let e = elems[0];
    const ax = (Math.cos(3 * frm) * rad * width) / height;
    const ay = (Math.sin(4 * frm) * rad * height) / width;
    
    e.x += (ax + pointer.x - e.x) / 10;
    e.y += (ay + pointer.y - e.y) / 10;

    for (let i = 1; i < N; i++) {
        let e = elems[i];
        let ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
        
        const s = ((162 + 4 * (1 - i)) / 50) * 0.5;
        
        if (e.use) {
            e.use.setAttribute(
                "transform",
                `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${(180 / Math.PI) * a}) scale(${s},${s})`
            );
        }
    }

    // Colisão com a cabeça do dragão
    const head = elems[1];
    if (head) {
        for (let i = foods.length - 1; i >= 0; i--) {
            const f = foods[i];
            const dist = Math.hypot(head.x - f.x, head.y - f.y);
            
            if (dist < 50) {
                score += 10;
                if (scoreEl) scoreEl.innerText = score;
                
                if (score > highScore) {
                    highScore = score;
                    if (highScoreEl) highScoreEl.innerText = highScore;
                    localStorage.setItem("dragon_high_score", highScore);
                }

                createExplosion(f.x, f.y);
                if (f.elem) f.elem.remove();
                foods.splice(i, 1);

                // Cria uma nova comida em posição aleatória
                spawnFood();
            }
        }
    }

    frm += 0.003;
};

// Garante o start apenas após a janela carregar completamente
window.addEventListener("load", () => {
    resize();
    for (let i = 0; i < TOTAL_FOODS; i++) {
        spawnFood();
    }
    run();
});