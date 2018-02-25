(function(){
    "use strict";
    
    var Fantome = function Fantome(jeu, couche, carte, vitesse){
        
        //animations (et couleur) du fantome
        var LES_ANIMS = [[[0,1], [2,3], [4,5], [6,7]], //rouge
                        [[8,9], [10,11], [12,13], [14,15]], //jaune
                        [[16,17], [18,19], [20,21], [22,23]], //cyan
                        [[24,25], [26,27], [28,29], [30,31]]]; //rose
        
        this.leJeu = jeu;
        this.vitesse = vitesse;
        
        //couleur et position choisies aleatoirement
        this.couleur = Math.floor(Math.random() * 4);
        
        //sprite, animations
        ObjetInteractifCarte.call(this, this.leJeu, carte, "persosImg");
        this.animations.add("droite", LES_ANIMS[this.couleur][0], 6, true );
        this.animations.add("gauche", LES_ANIMS[this.couleur][1], 6, true );
        this.animations.add("bas", LES_ANIMS[this.couleur][2], 6, true );
        this.animations.add("haut", LES_ANIMS[this.couleur][3], 6, true );
        this.frame=8*this.couleur;
        
        //physique
        this.leJeu.physics.enable(this, Phaser.Physics.ARCADE);
    
        //ajout au groupe pour l'affichage du perso
        couche.add(this);
        
        //demarrer le deplacement du fantome
        this.changerDirection();
        
    };
    
    Fantome.prototype = Object.create(ObjetInteractifCarte.prototype);
    Fantome.prototype.constructor = Fantome;
    
    //change la direction des fantomes
    Fantome.prototype.changerDirection = function(){           
        //On attribue une vitesse sur l'axe des x et des y au hasard à chaque fantôme pour changer sa direction - on modifie aussi l'animation
        switch (this.game.rnd.between(1,4)) {
            case 1:
                this.body.velocity.x = this.vitesse;
                this.play("droite");
                break;
            case 2:
                this.body.velocity.x = -this.vitesse;
                this.play("gauche");
                break;
            case 3:
                this.body.velocity.y = this.vitesse;
                this.play("bas");
                break;
            case 4:
                this.body.velocity.y = -this.vitesse;
                this.play("haut");
                break;
        }
    };
    
    
    window.Fantome = Fantome;
    
}());