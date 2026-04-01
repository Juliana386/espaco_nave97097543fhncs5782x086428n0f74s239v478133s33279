let nave;
let tiros = [];
let inimigos = [];
let pontos = 0;
let jogoAcabou = false;

function setup() {
  createCanvas(600, 400);
  nave = new Nave();
}

function draw() {
  background(20);

  if (jogoAcabou) {
    exibirGameOver();
    return; // Para a execução do resto do código
  }

  // Placar
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Pontos: " + pontos, 20, 30);

  nave.update();
  nave.show();

  // Gerenciar Tiros
  for (let i = tiros.length - 1; i >= 0; i--) {
    tiros[i].update();
    tiros[i].show();
    
    if (tiros[i].offscreen()) {
      tiros.splice(i, 1);
    } else {
      for (let j = inimigos.length - 1; j >= 0; j--) {
        if (tiros[i].hits(inimigos[j])) {
          inimigos.splice(j, 1);
          tiros.splice(i, 1);
          pontos += 10;
          break;
        }
      }
    }
  }

  // Gerenciar Inimigos (Bolas Vermelhas)
  if (frameCount % 60 == 0) {
    inimigos.push(new Inimigo());
  }

  for (let i = inimigos.length - 1; i >= 0; i--) {
    inimigos[i].update();
    inimigos[i].show();

    // VERIFICAÇÃO DE DERROTA: Se o inimigo tocar na nave
    if (nave.colide(inimigos[i])) {
      jogoAcabou = true;
    }

    if (inimigos[i].offscreen()) {
      inimigos.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    tiros.push(new Tiro(nave.x + nave.w / 2, nave.y));
  }
  // Reiniciar o jogo se apertar 'R' após perder
  if (jogoAcabou && (key === 'r' || key === 'R')) {
    reiniciarJogo();
  }
}

function exibirGameOver() {
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2);
  fill(255);
  textSize(20);
  text("Pontos finais: " + pontos, width / 2, height / 2 + 40);
  text("Pressione 'R' para reiniciar", width / 2, height / 2 + 80);
}

function reiniciarJogo() {
  pontos = 0;
  tiros = [];
  inimigos = [];
  jogoAcabou = false;
  nave = new Nave();
  loop();
}

// --- Classes ---

class Nave {
  constructor() {
    this.w = 40;
    this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - 40;
    this.velocidade = 5;
  }

  show() {
    fill(0, 100, 255); // Azul
    rect(this.x, this.y, this.w, this.h, 5);
    fill(150, 200, 255);
    rect(this.x + 10, this.y - 10, 20, 10, 5);
  }

  update() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) this.x -= this.velocidade;
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.w) this.x += this.velocidade;
  }

  // Lógica de colisão simples (distância entre centros)
  colide(inimigo) {
    let d = dist(this.x + this.w/2, this.y + this.h/2, inimigo.x, inimigo.y);
    return d < (this.w/2 + inimigo.r);
  }
}

class Tiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.v = 7;
  }
  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.r * 2);
  }
  update() { this.y -= this.v; }
  offscreen() { return this.y < 0; }
  hits(inimigo) {
    let d = dist(this.x, this.y, inimigo.x, inimigo.y);
    return d < this.r + inimigo.r;
  }
}

class Inimigo {
  constructor() {
    this.r = random(15, 25);
    this.x = random(this.r, width - this.r);
    this.y = -this.r;
    this.v = random(2, 4);
  }
  show() {
    fill(255, 0, 0); // Vermelho
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
  update() { this.y += this.v; }
  offscreen() { return this.y > height + this.r; }
}
