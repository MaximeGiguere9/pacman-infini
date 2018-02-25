"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- INTRO JEU -----------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

JEU_PACMAN_RUNNER.Intro = function (){};

JEU_PACMAN_RUNNER.Intro.prototype = {
    create: function(){
        //Images d'intro
        this.game.add.image(0,0, "menuBg");
            
        var pacman = this.game.add.image(0,0, "menuPacman");
        pacman.anchor.set(0.2, 0.1);
        this.game.add.tween(pacman.position).from({x:-this.game.width},500,Phaser.Easing.Default, true, 100, 0);
            
        var titre = this.game.add.image(this.game.width/2 + 10,this.game.height/4, "menuTitre");
        titre.anchor.set(0.5);
        this.game.add.tween(titre.scale).to({x:1.05},1000,Phaser.Easing.Default, true, 0, -1, true);
        
        //Son d'intro
        this.game.add.audio("sonIntro",1).play();
        
        //Boutons
        var boutonInstr= this.game.add.button(this.game.width/2,this.game.height*0.6, "instrBtn", this.allerEcranInstructions, this,1,0,2,0);
        boutonInstr.anchor.set(0.5);
        
        var boutonJouer= this.game.add.button(this.game.width/2, this.game.height*0.75, "jouerBtn", this.allerEcranJeu, this,1,0,2,0);
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

    allerEcranJeu: function(){
        //Démarrer l'écran du jeu
        this.game.state.start("jeu");
    },
    
    allerEcranInstructions: function(){
        //Démarrer l'écran d'instructions
        this.game.state.start("instructions");
    },
    
    //--NOTE: fonctionne sur les fonctions d'emulations mobiles de chrome, mais je n'ai aucun moyen de tester sur des vrais mobiles car le fullscreen et le lock ne sont pas supportes sur iOS (iPhone 5 et iPad 2, iOS 9)--//
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