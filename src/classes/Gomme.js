(function(){
    "use strict";
    
    var Gomme = function Gomme(jeu, couche, carte){
        
        this.leJeu = jeu;

        //sprite, animations
        ObjetInteractifCarte.call(this, this.leJeu, carte, "gommeImg");
        //anchor au centre car on applique une animation sur le scale qui donne un effet de pulsation
        this.anchor.set(0.5,0.5);
        this.leJeu.add.tween(this.scale).to({x:2,y:2},1000,Phaser.Easing.Default, true, (Math.random()*1000), -1, true);
        
        //physique
        this.leJeu.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setSize(4, 4, -1, 0);
    
        // 1/20 chance d'etre une super gomme, qui permet a pacman de manger les fantomes
        if(Math.random()*20 < 1){
            this.superGomme = true;
            this.tint = 0xff8888;
        }else{
            this.superGomme = false;
        }
        
        //ajout au groupe pour l'affichage du perso
        couche.add(this);
        
    };
    
    Gomme.prototype = Object.create(ObjetInteractifCarte.prototype);
    Gomme.prototype.constructor = Gomme;
    
    window.Gomme = Gomme;
    
}());