(function(){
    
    "use strict";
    
    
    var Pacman = function Pacman(jeu, couche, vitesse){
        
        //reference necessaire
        this.leJeu = jeu;
        //Gestion des flèches du clavier pour les controles sur desktop
        this.lesFleches = this.leJeu.input.keyboard.createCursorKeys();
        
        //creation du perso
        Phaser.Sprite.call(this, this.leJeu, 0, 0, "persosImg");
        
        this.animations.add("droite", [32,33], 6, true );
        this.animations.add("gauche", [34,35], 6, true );
        this.animations.add("bas", [36,37], 6, true );
        this.animations.add("haut", [38,39], 6, true );
        this.frame=32;
        
        this.vitessePacman = vitesse;
        
        //Ajout de la physique pour notre pacman
        this.leJeu.physics.enable(this, Phaser.Physics.ARCADE); 
        this.body.setSize(26,26, 2, 2);
        
        //si le pacman a le pouvoir d'une super gomme
        this.powerUp = false;
        //la duree restante du power up
        this.dureePowerUp = 0;
        //la musique du powerUp
        this.sonPowerUp = this.leJeu.add.audio("sonPowerUp",1,true);
        
        
        //ajout au groupe pour l'affichage du perso
        couche.add(this);
        
    };
    
    Pacman.prototype = Object.create(Phaser.Sprite.prototype);
    Pacman.prototype.constructor = Pacman;
    
    Pacman.prototype.setPositionDepart = function(x,y){
        this.position.x = x;
        this.position.y = y;
    }
    
    Pacman.prototype.gererDeplacement = function(offsetPacman){
        if(this.leJeu.device.desktop){
            this.gererDeplacementDesktop();
        }else{
             this.gererDeplacementMobile(offsetPacman);
        }
    };
    
    Pacman.prototype.gererDeplacementDesktop = function(){
            //Détecter les touches du clavier pour le déplacement du pacman
            //Au départ, on met les vitesses sur l'axe des x et des y à 0
            //On ajuste les animations pour chaque flèche
            this.body.velocity.set(0);
            
            //velocite
            if (this.lesFleches.right.isDown) {
                //Déplacement vers la droite
                this.body.velocity.x = this.vitessePacman;
                this.play("droite");
                
            }else if (this.lesFleches.left.isDown) {
                //Déplacement vers la gauche - on inverse la vitesse
                this.body.velocity.x = - this.vitessePacman;
                this.play("gauche");
               
            }
            if (this.lesFleches.up.isDown){
                //Déplacement vers le haut
                this.body.velocity.y = - this.vitessePacman;
                this.play("haut");
                
            }else if (this.lesFleches.down.isDown){
                // Déplacement vers le bas
                this.body.velocity.y =  this.vitessePacman;
                this.play("bas");
            }
            
            //Si les deux vitesses sont à 0, c'est que notre pacman est au repos
            if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
                //On arrête les animations
                this.animations.stop();
            }
    };
    
    Pacman.prototype.gererDeplacementMobile = function(offsetPacman){
                
                this.body.velocity.set(0);
        
                //objet utilise pour les raccourcis dans le code qui controle les deplacements de pacman
                this.posDeplacement = {
                    pacmanX: this.body.position.x - offsetPacman, //ajustement par rapport a l'ecran
                    pacmanY: this.body.position.y,
                    pointeurX: this.leJeu.input.pointer1.position.x,
                    pointeurY: this.leJeu.input.pointer1.position.y
                };
                this.posDeplacement.diffX = this.posDeplacement.pointeurX - this.posDeplacement.pacmanX;
                this.posDeplacement.diffY = this.posDeplacement.pointeurY - this.posDeplacement.pacmanY;
                //ajustement selon la position du pointeur sur l'ecran; pacman suit une direction plus naturelle
                this.posDeplacement.prioriteHorizontale = Math.abs(this.posDeplacement.diffX) > Math.abs(this.posDeplacement.diffY);
    
                //deplace le pacman si on appuie sur l'ecran
                if(this.leJeu.input.pointer1.isDown){
                    if (this.posDeplacement.diffX > 20) {
                        //Déplacement vers la droite
                        this.body.velocity.x = this.vitessePacman;
                    }else if (this.posDeplacement.diffX < -20) {
                        //Déplacement vers la gauche - on inverse la vitesse
                        this.body.velocity.x = - this.vitessePacman;
                    }else{
                        this.body.velocity.x = 0;
                    }
                    if (this.posDeplacement.diffY < -20){
                        //Déplacement vers le haut
                        this.body.velocity.y = - this.vitessePacman;
                    }else if (this.posDeplacement.diffY > 20){
                        // Déplacement vers le bas
                        this.body.velocity.y =  this.vitessePacman;
                    }else{
                         this.body.velocity.y = 0;
                    }
                    //animations
                    /*l'animation horizontale a priorite si pacman se deplace dans les deux axes 
                    quand le pointeur est aligne sur l'axe x (ou quand pacman se deplace seulement sur l'axe x)*/
                    if(this.posDeplacement.prioriteHorizontale){
                        if(this.body.velocity.x > 0){
                            this.play("droite");
                        }else if(this.body.velocity.x < 0){
                            this.play("gauche");
                        }else{
                            this.animations.stop();
                        }
                    }else{
                        if(this.body.velocity.y > 0){
                            this.play("bas");
                        }else if(this.body.velocity.y < 0){
                            this.play("haut");
                        }else{
                            this.animations.stop();
                        }
                    }
                //arrete le pacman si on n'appuie pas
                }else{
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;
                    this.animations.stop();
                }
                
                
    };
    
    Pacman.prototype.activerPowerUp = function(){
            this.dureePowerUp = JEU_PACMAN_RUNNER.DUREE_POWERUP;
            this.powerUp = true;
            this.sonPowerUp.play();
    };
    Pacman.prototype.desactiverPowerUp = function(){
            this.powerUp = false;
            this.sonPowerUp.pause();
    };
    
    Pacman.prototype.updateDureePowerUp = function(barrePowerUp){
        if(this.dureePowerUp > 0){
            this.dureePowerUp --;
            barrePowerUp.scale.x = (this.dureePowerUp/JEU_PACMAN_RUNNER.DUREE_POWERUP)*2.1;
        }
        if(this.powerUp && this.dureePowerUp <= 0){
            this.desactiverPowerUp();
        }
    };
    
    
    window.Pacman = Pacman;
    
}());