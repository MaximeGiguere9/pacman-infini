"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- FIN JEU -------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

    JEU_PACMAN_RUNNER.Fin = function FinJeu(){
        //Le score et le temps de la partie
        this.score;
        this.temps;
    };

    JEU_PACMAN_RUNNER.Fin.prototype = {

        init : function(score, temps){
            //Récupérer les valeurs passées en paramètres
            this.score = score;
            this.temps = temps;
            //calculer le meilleur score
            this.meilleurScore = localStorage.getItem(JEU_PACMAN_RUNNER.NOM_LOCALSTORAGE);
            if(this.score > this.meilleurScore){
                this.meilleurScore = this.score;
                localStorage.setItem(JEU_PACMAN_RUNNER.NOM_LOCALSTORAGE, this.meilleurScore);
            }
        },

        create: function(){ 
            //Faire jouer le son de la fin du jeu
            this.game.add.audio("sonFin",1).play();
            //styles
            var styleTitre = {font: "bold 72px Arial", fill: "#f80", align: "center"};
            var styleTexte = {font: "bold 32px ARIAL", fill: "#000", align: "center"};
            //fond
            this.game.add.image(0,0, "menuBg");
            //titre
            var titreTxt = this.game.add.text(
                this.game.width/2, this.game.height/4 + 20, 
                "FIN DU JEU", 
                styleTitre
            );
            titreTxt.anchor.set(0.5, 1);
            //score de la partie
            var scoreTxt = this.game.add.text(
                this.game.width / 2, this.game.height/3 + 30, 
                ("Votre score:\n" + this.score + " point(s)"), 
                styleTexte
            );
            scoreTxt.anchor.set(0.5);
            //meilleur score
            var meilleurScoreTxt = this.game.add.text(
                this.game.width / 2, this.game.height/2 + 50, 
                ("Meilleur score:\n" + this.meilleurScore + " point(s)"), 
                styleTexte
            );
            meilleurScoreTxt.anchor.set(0.5);

            //Boutons
            var boutonJouer= this.game.add.button(this.game.width/2, this.game.height*0.75, "jouerBtn",this.rejouer, this,1,0,2,0);
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

        rejouer: function(){
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