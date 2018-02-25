(function(){
    "use strict";

    //aide a reduire la redondance dans la creation de sprites (fantomes, gommes) et la recherche de position aleatoire
    var ObjetInteractifCarte = function ObjetInteractifCarte(jeu, carte, cle){
        
        this.leJeu = jeu;
        
        //position choisie aleatoirement
        this.carte = carte.concat();
        var position = this.trouverPosition();

        //sprite, animations
        Phaser.Sprite.call(this, this.leJeu, position.x + JEU_PACMAN_RUNNER.TAILLE_TUILE/2, position.y + JEU_PACMAN_RUNNER.TAILLE_TUILE/2, cle);
        
        //physique
        this.leJeu.physics.enable(this, Phaser.Physics.ARCADE);
        
        //son qui joue quand pacman mange un objet
        this.sonManger = this.leJeu.add.audio("sonGomme");
        
    };
    
    ObjetInteractifCarte.prototype = Object.create(Phaser.Sprite.prototype);
    ObjetInteractifCarte.prototype.constructor = ObjetInteractifCarte;
    
    //determine les coordonnees x et y d'un element et les retourne
    ObjetInteractifCarte.prototype.trouverPosition = function(){
            //position choisie aleatoirement selon la carte
            var indexHasard;
            //doit etre une tuile de sol
            do{
                indexHasard = Math.floor(Math.random()*this.carte.length);
            } while(this.carte[indexHasard].type != "sol");
            //retourne la valeur x et y sur l'ecran (pixels)
            return {x:this.carte[indexHasard].x, y:this.carte[indexHasard].y};
    };
    
    ObjetInteractifCarte.prototype.manger = function() {
            //joue le son
            this.sonManger.play();
            //Détruire la gomme
            this.destroy();
    };
    
    window.ObjetInteractifCarte = ObjetInteractifCarte;
    
}());