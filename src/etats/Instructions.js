"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- INSTRUCTIONS --------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

    JEU_PACMAN_RUNNER.Instructions = function Instructions(){

    };

    JEU_PACMAN_RUNNER.Instructions.prototype = {

        create: function(){ 
            //styles
            var styleTitre = {font: "bold 72px Arial", fill: "#f80", align: "center"};
            var styleTexte = {font: "bold 32px ARIAL", fill: "#000", align: "center"};
            //fond
            this.game.add.image(0,0, "menuBg");
            //titre
            var titreTxt = this.game.add.text(
                this.game.width/2, this.game.height/4 + 20, 
                "INSTRUCTIONS", 
                styleTitre
            );
            titreTxt.anchor.set(0.5, 1);
              
            //affiche les controles selon la plateforme
            var txtControle;
            if(this.game.device.desktop){
                txtControle = "Déplacez-vous avec les flèches du clavier.";
            }else{
                txtControle = "Déplacez-vous en appuyant dans\nla direction souhaitée.";
            }         
            
            var texte = this.game.add.text(
                this.game.width/2,this.game.height*0.47,
                "Survivez le plus longtemps\n" + 
                "possible en évitant les\n" + 
                "fantômes et sans vous arrêter!\n" + 
                "Mangez les gommes pour des points bonus!\n" +
                txtControle,
                styleTexte
            );
            texte.anchor.set(0.5);

            //Boutons
            var boutonJouer= this.game.add.button(this.game.width/2, this.game.height*0.75, "jouerBtn",this.jouer, this,1,0,2,0);
            boutonJouer.anchor.set(0.5);
            
            var boutonPleinEcran = this.game.add.button(this.game.width/6, this.game.height*0.75, "ecranBtn", this.activerPleinEcran, this);
            boutonPleinEcran.anchor.set(0.5);
            //
            if(this.game.scale.isFullScreen){
                boutonPleinEcran.setFrames(3,1,5,1);
            }else{
                boutonPleinEcran.setFrames(2,0,4,0);
            }
            
        },

        jouer: function(){
            //Aller à l'écran de jeu
            this.game.state.start("jeu");
        },
        
        activerPleinEcran: function(bouton){
            if(this.game.scale.isFullScreen){
                //desactive le mode plein ecran si on y est deja
                bouton.setFrames(2,0,4,0);
                Ecran.enleverPleinEcran();
            }else{
                //active le mode plein ecran si on n'y est pas
                bouton.setFrames(3,1,5,1);
                Ecran.mettrePleinEcran();
            }
        }
    };