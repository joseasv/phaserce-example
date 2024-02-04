import 'pixi'
import 'p2'
import Phaser from 'phaser'


import EstadoMapa from './mapa'
import EstadoPelea from './pelea'

class Juego extends Phaser.Game {
  constructor() {
    super(window.innerWidth, window.innerHeight, Phaser.WEBGL, '', null, true);



    this.state.add('juego', EstadoMapa);
    this.state.add('pelea', EstadoPelea);
    this.state.start('juego');
  }


}

window.juego = new Juego();
