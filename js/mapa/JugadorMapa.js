import Phaser from 'phaser'


export default class JugadorMapa {

  constructor(nombreSprite, mapaActual, game, capaJugador) {
    this.nombreSprite = nombreSprite;
    this.sprite;
    this.mapa = mapaActual;
    this.spritePelea;
    this.posActual = {};
    this.casVisitadas = 0;
    this.activo = true;

    this.game = game;
    this.capa = capaJugador;
  }

  iniciar() {
    this.sprite = this.game.add.sprite(0, 0, this.nombreSprite);
    this.game.physics.enable(this.sprite, Phaser.Physics.P2JS);
    this.sprite.body.enable = false;
    this.sprite.body.setCircle(this.mapa.tileWidth, 0, 0);
    this.sprite.body.data.shapes[0].sensor = true;
    //this.sprite.body.data.shapes[1].sensor = true;
    this.sprite.body.onBeginContact.add(modificarNeblina, this);
    this.sprite.body.onEndContact.add(ponerNeblina, this);
    //this.sprite.body.debug = true;

    this.game.camera.follow(this.sprite);

    this.capa.add(this.sprite);
  }

  desactivar() {
    this.sprite.body.onBeginContact.forget();
    this.sprite.body.onEndContact.forget();
    this.activo = false;
  }

  estaActivo() {
    return this.activo;
  }

  mostrarEnPosicionInicial() {

    var xInicial = this.mapa.objects["Capa de Objetos 1"][0].x + this.mapa.tileWidth / 2;
    var yInicial = this.mapa.objects["Capa de Objetos 1"][0].y - this.mapa.tileHeight / 2;
    console.log("xInicial=" + xInicial + ", " + "yInicial=" + yInicial);
    this.sprite.body.x = xInicial;
    this.sprite.body.y = yInicial;

  }

  moverATile(tile) {
    tileJugador = tile;
    this.sprite.body.x = tile.worldX + this.mapa.tileWidth / 2;
    this.sprite.body.y = tile.worldY + this.mapa.tileHeight / 2;
    tile.properties.visitado = true;

    this.posActual = { x: this.sprite.body.x, y: this.sprite.body.y };
  }

  moverAPosicion(xReal, yReal) {
    if (this.activo) {
      this.sprite.body.x = xReal;
      this.sprite.body.y = yReal;
      this.casVisitadas++;
      this.posActual = { x: xReal, y: yReal };
    }

  }


  reiniciar() {
    this.sprite.body.x = this.posActual.x;
    this.sprite.body.y = this.posActual.y;
  }
}

function modificarNeblina(body1, shapeA, shapeB, equation) {
  if (body1 != null) {
    body1.sprite.disipar();
  }
}

function ponerNeblina(body1, shapeA, shapeB, equation) {
  if (body1 != null && body1.sprite != null) {
    body1.sprite.condensar();
  }
}
