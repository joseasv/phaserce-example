import Phaser from 'phaser'
import Estado from './Estado'
import JugadorMapa from './mapa/JugadorMapa'
import Neblina from './mapa/Neblina'

export default class extends Phaser.State {
  preload() {
    this.game.load.image("sprites", "sprites/casilla_linea.png");
    this.game.load.image('caballero', 'sprites/caballero.png');
    this.game.load.tilemap('mapa1', 'tiled/mapa1.json', null, Phaser.Tilemap.TILED_JSON);

  }

  create() {

    this.camera.flash('#000000');
    let tecla = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    tecla.onDown.add(function () {
      console.log("espacio");

      let maxNumEnemigos = Estado.enemigos.mapa1.length;
      let enemigo = Estado.enemigos.mapa1[0];
      Estado.enemigo = enemigo;
      this.game.state.start("pelea");
    }, this);



    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.stage.backgroundColor = '#123123';

    // Mapa de Tiled
    let map;
    map = this.game.add.tilemap('mapa1');
    map.addTilesetImage('Mazmorra', 'sprites');
    let layer;
    layer = map.createLayer('capapatrones1', map.width * map.tileWidth * 2, map.height * map.tileWidth * 2);
    layer.resizeWorld();

    let capaJugador = this.game.add.group();
    capaJugador.add(layer);
    this.jugador = new JugadorMapa("caballero", map, this.game, capaJugador);
    this.jugador.iniciar();
    if (Estado.jugador.posicion == null) {
      let xInicial = map.objects["Capa de Objetos 1"][0].x + map.tileWidth / 2;
      let yInicial = map.objects["Capa de Objetos 1"][0].y - map.tileHeight / 2;
      console.log("xInicial=" + xInicial + ", " + "yInicial=" + yInicial);
      this.jugador.moverAPosicion(xInicial, yInicial);
    }

    else {
      console.log("regresando a la posicion antreior");
      let xAnt = Estado.jugador.posicion.x;
      let yAnt = Estado.jugador.posicion.y;
      this.jugador.moverAPosicion(xAnt, yAnt);
    }

    let capaNeblina = this.game.add.group();

    function transicion(casilla) {

      let centroX = this.game.camera.x;
      let bordeIzq = centroX - window.innerWidth / 2;
      let bordeDer = centroX + window.innerWidth


      //console.log(this.game.camera)
      console.log("bordeIzq: " + bordeIzq)
      console.log("bordeDer: " + bordeDer)
      console.log("jugador.sprite.left: " + casilla.left)
      console.log("jugador.sprite.right: " + casilla.right)

      let graphics = this.game.add.graphics(0, 0);
      graphics.beginFill(0xFFFFFF)
      graphics.drawRect(0, 0, casilla.left - bordeIzq, window.innerHeight);
      graphics.endFill()
      let telonIzq = this.game.add.sprite(bordeIzq, 0)
      telonIzq.addChild(graphics)
      telonIzq.scale.x = 0

      let graphics2 = this.game.add.graphics(0, 0);
      graphics2.beginFill(0xFFFFFF)
      graphics2.drawRect(0, 0, bordeDer - casilla.right, window.innerHeight);
      graphics2.endFill()
      console.log(this.game.camera.bounds.right)
      let telonDer = this.game.add.sprite(bordeDer, 0)
      telonDer.addChild(graphics2)

      telonDer.scale.x = 0

      let animTelonIzq = this.game.add.tween(telonIzq.scale).to({ x: 1 }, 600)
      let animTelonDer = this.game.add.tween(telonDer.scale).to({ x: -1 }, 600)

      animTelonDer.onComplete.add(function () {
        this.game.camera.fade('#000000');
        this.game.state.start("pelea");
      }, this)

      animTelonIzq.start();
      animTelonDer.start();
    }

    // Colocando la neblina en el mapa
    if (Estado.neblina.length == 0) {
      for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
          let tile = map.getTile(x, y);
          if (tile != null) {
            new Neblina(this.game, null, tile, this.jugador, capaNeblina, layer, transicion);
          }
        }
      }
    } else {
      for (let i = 0; i < Estado.neblina.length; i++) {
        let datos = Estado.neblina[i];
        new Neblina(this.game, datos, null, this.jugador, capaNeblina, layer, transicion);
      }
    }




  }

  render() {
    //this.game.debug.body(this.jugador.sprite);
  }

  shutdown() {
    Estado.jugador.posicion = this.jugador.posActual;

  }
}
