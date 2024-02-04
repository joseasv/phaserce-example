import Phaser from 'phaser'
import BarraVida from './BarraVida'

export default class EnemigoPelea {

  constructor(datos, capaPersonajes, capaAtaques, game, funcResBatalla){
    this.game = game;
    this.funcResBatalla = funcResBatalla;
    this.estado = datos;
    this.jugador = null;
    this.sprite = capaPersonajes.create(500, 200, datos.sprite);
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    game.add.text(500,460, datos.nombre, style);
    this.barra = new BarraVida(game, 500, 500, datos.vida);

    this.spriteAtaque = game.make.sprite(100,200,"animEspada");
    this.spriteAtaque.visible = false;
    this.animAtaque = this.spriteAtaque.animations.add("espada");
    this.animAtaque.onComplete.add(function(){
      console.log("termino animacion");
      this.spriteAtaque.visible = false;
      this.jugador.herir(datos.ataque);
      /*if (!this.jugador.vivo()){
        funcResBatalla(this.jugador, this, game);
      } else{
        this.jugador.ataque();
      }*/
    }, this);
    capaAtaques.addChild(this.spriteAtaque);
  }

  oponente (jugador){
    this.jugador = jugador;
  }

  vivo (){
    return this.barra.vidaActual > 0;
  }

  ataque(destJugador){
    /*if (this.estado.destreza > destJugador){
      return this.estado.ataque;
    } else{
      var ataqueFallido = game.rnd.integerInRange(0,3);
      if (ataqueFallido != 0){
        return this.estado.ataque;
      }
      else {
        return null;
      }
    }*/

    /*this.spriteAtaque.visible = true;
    this.animAtaque.play("espada", 10, false);*/

    var xInicial = this.sprite.x;
    var tiempo = 250;
    var tweenAtaque = this.game.add.tween(this.sprite).to({x: xInicial - 100}, tiempo);
    var tweenRegreso = this.game.add.tween(this.sprite).to({x: xInicial}, tiempo);

    tweenAtaque.onComplete.add(function(){
      this.spriteAtaque.visible = true;
      this.animAtaque.play("espada", 10, false);
    }, this);
    tweenRegreso.onComplete.add(function(){
      if (!this.jugador.vivo()){
        this.funcResBatalla(this.jugador, this, this.game);
      } else{
        this.jugador.ataque();
      }
    }, this);
    tweenRegreso.delay(300);
    tweenAtaque.chain(tweenRegreso);
    tweenAtaque.start();
  }

  herir (ataqueEne){
    var danoTotal = ataqueEne - this.estado.defensa;
    this.barra.quitarVida(danoTotal);

    if (this.barra.estaVivo()){
      this.sprite.alpha = 0
    }

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var texto = this.game.add.text(this.sprite.x + 20,this.sprite.y + 60, danoTotal, style, this.capaAtaques);
    texto.alpha = 0;
    var tweenDano = this.game.add.tween(texto).to({alpha:1, y:this.sprite.y - 30}, 600, Phaser.Easing.Cubic.Out);
    tweenDano.onComplete.add(function(){
      this.game.time.events.add(300, function() {    // anything here will happen 1 second after the tween has ended
        texto.destroy();

      }, this);
    }, this);

    tweenDano.start();
  }

}
