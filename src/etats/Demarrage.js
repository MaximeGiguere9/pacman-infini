"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- DEMARRAGE -----------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

JEU_PACMAN_RUNNER.Demarrage = function(){};
    
JEU_PACMAN_RUNNER.Demarrage.prototype = {
        
    init: function(){
        //parametres d'affichage
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; 
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        //pointeurs sur mobile
        this.game.input.maxPointers = 1;
        //force l'orientation paysage sur mobile
        if (!this.game.device.desktop) {
            this.game.scale.forceOrientation(true, false);
            this.game.scale.enterIncorrectOrientation.add(this.afficherImageOrientation, this);
            this.game.scale.leaveIncorrectOrientation.add(this.afficherImageOrientation, this);
        }
        
    },
    //image qui apparait quand on est ans la mauvaise orientation
    afficherImageOrientation: function(){
         var d = document.getElementById('orientation').style;
         d.display = (d.display == "none") ? "block" : "none"; 
    },
        
    preload: function(){
        this.game.load.image("barreChargement", "medias/img/barreChargement.png");
        this.game.load.image("rondelleLoad", "medias/img/pacmanImgLoad.png", 96, 96);  
    },
        
    create: function(){
        this.game.state.start("chargementMedias");
    }
};