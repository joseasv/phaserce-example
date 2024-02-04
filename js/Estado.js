class Estado {

  // Objeto para manejar la informacion persistente en los estados del juego
  constructor() {
    this.neblina = [];
    this.jugador = {
      posicion: null,
      vidaTotal : 20,
      vidaActual : 20,
      ataque : 5,
      defensa : 3,
      destreza : 5,
      dinero : 0,

      equipo: {
        arma: null
      }
    }

    this.armas = {
      0: {
        nombre: "Espada corta",
        ataque: 3,
        habilidades : []
      }
    }

    this.armaHabilidades = {
      0: {
        nombre: "Estocada",
        modAtaque: 3,
        modDefensa: 1,
        modDestreza: 1,
      }
    }

    this.enemigos ={
      mapa1:[
        {nombre: "Fantasma",
         vida: 6,
         ataque: 4,
         defensa: 3,
         destreza: 4,
         sprite: "enemigoGrande",
         animAtaque: "ataqueFantasma.png",
         dinero: 10}
      ],
    };
    this.enemigo = null;

    this.armas[0].habilidades.push(this.armaHabilidades[0]);
    this.jugador.equipo.arma = this.armas[0];

  }

}



export default (new Estado);
