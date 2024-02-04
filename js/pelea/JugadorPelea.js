import Phaser from 'phaser'
import BarraVida from './BarraVida'

export default class JugadorPelea {

  constructor(nombreSprite, capaPersonajes, capaAtaques, estado, game, funcResBatalla){

    this.funcResBatalla = funcResBatalla;
    this.estado = estado;
    this.arma = this.estado.equipo.arma;
    this.ataqueTotal = this.estado.ataque + this.arma.ataque;
    this.enemigo = null;
    this.sprite = capaPersonajes.create(100, 250, nombreSprite);
    this.barra = new BarraVida(game, 100, 500, estado.vidaTotal, estado.vidaActual);
    this.game = game;
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    game.add.text(100,460, "Proto", style);

    this.spriteAtaque = game.make.sprite(500,200,"animEspada");
    this.spriteAtaque.visible = false;
    this.animAtaque = this.spriteAtaque.animations.add("espada");
    this.animAtaque.onComplete.add(function(){
      console.log("termino animacion");
      this.spriteAtaque.visible = false;
      this.enemigo.herir(this.ataqueTotal );
      console.log("vida enemigo " + this.enemigo.barra.vidaActual);


    }, this);
    capaAtaques.addChild(this.spriteAtaque);

    this.activo = false;
    this.proxAtaqueEspecial = null;

    var habilidadesTemp = {};

    for (var habilidad of this.arma.habilidades){
      var nuevaHabilidad = {};
      nuevaHabilidad.sprite = game.make.sprite(500,200,"animEspada");
      nuevaHabilidad.sprite.visible = false;
      capaAtaques.addChild(nuevaHabilidad.sprite);

      nuevaHabilidad.animAtaque = nuevaHabilidad.sprite.animations.add("espada");
      nuevaHabilidad.animAtaque.onComplete.add(function(){
        console.log("termino animacion especial " + habilidad.nombre);
        nuevaHabilidad.sprite.visible = false;
        this.enemigo.herir(this.ataqueTotal * habilidad.modAtaque );
      }, this);

      var textoHabili = game.add.text(100,560, habilidad.nombre, style);
      textoHabili.inputEnabled = true;
      textoHabili.events.onInputDown.add(function(){
        if (this.activo == true){
          console.log("activando ataque " + habilidad.nombre);
          this.proxAtaqueEspecial = habilidad.nombre;
        } else{
          console.log("no se puede activar " + habilidad.nombre);
        }

      }, this);

      habilidadesTemp[habilidad.nombre] = nuevaHabilidad;
    }

    this.habilidades = habilidadesTemp;

    //game.add.text(100,660, this.arma.nombre, style);
  }


  activar(){
    this.activo=true;
    console.log("activado " + this.activo);
  }

  oponente (enemigo) {
    this.enemigo = enemigo;
  };

  vivo (){
    return this.barra.vidaActual > 0;
  };

  ataque (destrezaEne){
    /*if (this.estado.destreza > destrezaEne){
      return this.estado.ataque;
    }*/
    var xInicial = this.sprite.x;
    var tiempo = 250;
    var tweenAtaque = this.game.add.tween(this.sprite).to({x: xInicial + 100}, tiempo);
    var tweenRegreso = this.game.add.tween(this.sprite).to({x: xInicial}, tiempo);

    tweenAtaque.onComplete.add(function(){
      if (this.proxAtaqueEspecial == null){
        this.ataqueNormal();
      }
      else{
        this.ataqueEspecial();
      }

    }, this);
    tweenRegreso.onComplete.add(function(){
      this.chequeoEnemigo();
    }, this);
    tweenRegreso.delay(300);
    tweenAtaque.chain(tweenRegreso);
    tweenAtaque.start();
    /*this.game.add.tween(this.sprite).to({x: this.sprite.x + 20}).onComplete(function(){
      this.spriteAtaque.visible = true;
      this.animAtaque.play("espada", 10, false);
    });*/


  };

  ataqueNormal(){
    this.spriteAtaque.visible = true;
    this.animAtaque.play("espada", 10, false);
  }

  ataqueEspecial(){
    this.habilidades[this.proxAtaqueEspecial].sprite.visible = true;
    this.habilidades[this.proxAtaqueEspecial].animAtaque.play("espada", 10, false);
    this.proxAtaqueEspecial = null;
  }

  chequeoEnemigo(){
    if (!this.enemigo.vivo()){
      this.funcResBatalla(this, this.enemigo, this.game);
    } else{
      this.enemigo.ataque();
    }
  }

  herir (ataqueEne){
    if (ataqueEne != null){
      /*var danoResultante = ataqueEne - this.estado.defensa;
      this.estado.vidaActual -= danoResultante;
      return this.estado.ataque;*/
      //this.barra.quitarVida(ataqueEne - this.estado.defensa);
      var danoTotal = ataqueEne - this.estado.defensa;
      this.barra.quitarVida(danoTotal);

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
}
