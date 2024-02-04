import Phaser from 'phaser'

export default class BarraVida {

  constructor(game, posX, posY, vidaTotal, vidaActual) {
    this.vidaTotal = vidaTotal;
    if (vidaActual == undefined)
      this.vidaActual = vidaTotal;
    else {
      this.vidaActual = vidaActual;
    }

    var fondo = game.add.bitmapData(200, 40);
    fondo.ctx.beginPath();
    fondo.ctx.rect(0, 0, 180, 30);
    fondo.ctx.fillStyle = '#858585';
    fondo.ctx.fill();
    game.add.sprite(posX, posY, fondo);

    var barra = game.add.bitmapData(200, 40);
    barra.ctx.beginPath();
    barra.ctx.rect(0, 0, 180, 30);
    barra.ctx.fillStyle = '#ffe823';
    barra.ctx.fill();

    var style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    game.add.text(posX - 50, posY, "Vida", style);
    this.barra = game.add.sprite(posX, posY, barra);

    this.texto = game.add.text(posX + 190, posY, this.vidaActual + "/" + this.vidaTotal, style);

    this.anchoLleno = this.barra.width;

    if (vidaActual != vidaTotal) {
      this.quitarVida(0);
    }
  }

  quitarVida(dano) {
    if (this.barra.width != 0) {
      this.vidaActual = this.vidaActual - dano;
      if (this.vidaActual < 0) {
        this.vidaActual = 0;
      }
      this.barra.width = (this.anchoLleno * (this.vidaActual)) / (this.vidaTotal);
      this.texto.text = this.vidaActual + "/" + this.vidaTotal;
    }
  }

  estaVivo() {
    return this.vidaActual == 0;
  }
}
