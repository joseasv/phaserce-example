import Phaser from 'phaser'
import Estado from '../Estado'

export default class extends Phaser.Sprite {

  constructor(game, estadoPrevio, tile, jugador, capa, layerMapa, transicion) {
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 64, 64);
    graphics.endFill();
    var neblinaText = graphics.generateTexture();
    graphics.destroy();
    if (estadoPrevio == null) {
      //console.log(tile);
      //console.log("creando neblina en "  +(tile.worldX + 32) + " " + (tile.worldY + 32));
      super(game, (tile.worldX + 32), (tile.worldY + 32), neblinaText);
      //console.log("nueva neblina en x:"  + this.x + " y:" + this.y);
      this.estado = {
        x: tile.x,
        y: tile.y,
        xReal: this.x,
        yReal: this.y,
        visitar: false,
        visible: false,
        alpha: 1
      };

      Estado.neblina.push(this.estado);
    } else {

      super(game, estadoPrevio.xReal, estadoPrevio.yReal, neblinaText);
      this.alpha = estadoPrevio.alpha;
      this.estado = estadoPrevio;
    }

    this.layerMapa = layerMapa;

    this.jugador = jugador;
    this.transicion = transicion;
    this.game = game;

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.enable = false;
    this.body.data.shapes[0].sensor = true;
    this.inputEnabled = true;
    this.events.onInputDown.add(this.clickNeblina, this);
    capa.add(this);

  }

  disipar() {
    //console.log("disipar");
    this.alpha = 0;
    this.estado.alpha = this.alpha;
    this.estado.visible = true;
  }

  condensar() {
    //console.log("condensar");
    if (this.estado.visible) {
      this.alpha = 0.5;
      this.estado.alpha = this.alpha;
      this.estado.visible = false;
    }
  }

  visitar() {
    this.estado.visitar = true;
  }

  esVisible() {
    return this.estado.visible;
  }

  clickNeblina(pointer) {


    if (this.esVisible() &&
      (this.estado.xReal != this.jugador.posActual.x || this.estado.yReal != this.jugador.posActual.y)) {

      this.visitar();
      this.jugador.moverAPosicion(this.estado.xReal, this.estado.yReal);
      var chance = this.game.rnd.integerInRange(0, 100);
      if (this.jugador.casVisitadas > 5 && chance < ((this.jugador.casVisitadas - 3) * 10)) {
        console.log("pelea");
        console.log(this);
        this.jugador.desactivar();
        var maxNumEnemigos = Estado.enemigos.mapa1.length;
        var enemigo = Estado.enemigos.mapa1[0];
        Estado.enemigo = enemigo;

        this.transicion(this);

      } else {
        console.log("no pelea")
      }
    } else {
      console.log("el mismo lugar");
    }
  }

}
