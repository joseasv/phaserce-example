import Phaser from 'phaser'
import Estado from './Estado'
import EnemigoPelea from './pelea/EnemigoPelea'
import JugadorPelea from './pelea/JugadorPelea'

export default class extends Phaser.State{

  preload(){
    this.game.load.image('caballeroGrande', 'sprites/caballeroGrande.png');
    this.game.load.image("enemigoGrande", "sprites/enemigoGrande1.png");
    this.game.load.image("fondoPelea", "sprites/fondo.png");

    this.game.load.atlasJSONHash("animEspada", "sprites/animPelea.png", "sprites/animPelea.json");
  }

  create(){
    this.game.world.scale.setTo(1,1);
    this.camera.flash('#000000');

    let tecla = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    tecla.onDown.add(function(){
        console.log("espacio");
        this.game.state.start("juego");
    }, this);

    let capaFondo = this.game.add.group();
    let capaPersonajes = this.game.add.group();
    let capaAtaques = this.game.add.group();

    capaFondo.create(0,200, "fondoPelea");
    let objPersonaje = new JugadorPelea("caballeroGrande", capaPersonajes, capaAtaques, Estado.jugador, this.game, this.resultadoBatalla);
    let objEnemigo = new EnemigoPelea(Estado.enemigo, capaPersonajes, capaAtaques, this.game, this.resultadoBatalla);


    objPersonaje.oponente(objEnemigo);
    objEnemigo.oponente(objPersonaje);
    /*while (true && objPersonaje.vivo() && objEnemigo.vivo()){
      var danoAlEnemigo = objPersonaje.ataque(objEnemigo.estado.destreza);
      objEnemigo.herir(danoAlEnemigo);
      var danoAlJugador = objEnemigo.ataque(objPersonaje.estado.destreza);
      objPersonaje.herir(danoAlJugador);
    }*/

    let textoInicio = this.game.add.text(200, this.game.world.centerY, "Comenzar bat", { font: "25px Arial", fill: "#ff0044", align: "center" });
    textoInicio.inputEnabled = true;
    textoInicio.events.onInputDown.add(function(item){
      objPersonaje.activar();
      objPersonaje.ataque();
      item.destroy();
    }, this);
  }

  update (){

  }

  resultadoBatalla(jugador, enemigo, game){
    if (jugador.vivo()){
      console.log("gano el jugador");

      let textoInicio = game.add.text(200, game.world.centerY, "GANASTE", { font: "25px Arial", fill: "#ff0044", align: "center" });
      textoInicio.inputEnabled = true;
      textoInicio.events.onInputDown.add(function(item){
        this.game.camera.fade('#000000');
        game.state.start("juego");
        item.destroy();
        Estado.jugador.vidaActual = jugador.barra.vidaActual;
      }, this);
    } else {
      console.log("perdio el jugador")
    }
  }

}
