"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- CHARGEMENT MEDIAS ---------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

JEU_PACMAN_RUNNER.ChargementMedias = function(){
    //image de chargement
    this.pacman = null;
};

JEU_PACMAN_RUNNER.ChargementMedias.prototype = {
        
    init: function(){
        
        this.pacman = this.game.add.image(this.game.width/2, this.game.height/3, "rondelleLoad");
        this.pacman.scale.x = 2;
        this.pacman.scale.y = 2;
        this.pacman.anchor.set(0.5,0.5);
        var texte = this.game.add.text(
            this.game.width/2,this.game.height/2 + 40,
            "Chargement ...",
            {font: "bold 32px ARIAL", fill: "#ee0", align: "center"}
        );
        texte.anchor.set(0.5);
    },
        
    preload : function(){
        //barre de chargement
        var barre = this.game.add.sprite(this.game.width/4, (this.game.height/3)*2, "barreChargement");
        var fond = this.game.add.sprite(this.game.width/4, (this.game.height/3)*2, "barreChargement");
        fond.alpha = 0.5;
        barre.anchor.set(0,0);
        this.game.load.setPreloadSprite(barre);
            
        //Chargement des images
        this.game.load.image("menuBg", "medias/img/splash.png", 960, 640);
        this.game.load.image("menuTitre", "medias/img/titre.png", 698, 100);
        this.game.load.image("menuPacman", "medias/img/pacmanImg.png", 384, 384);
        this.game.load.spritesheet("jouerBtn", "medias/img/bouton-jouer.png", 360, 80);
        this.game.load.spritesheet("instrBtn", "medias/img/bouton-instructions.png", 580, 80);
        this.game.load.spritesheet("ecranBtn", "medias/img/bouton-pleinEcran.png", 64, 64);
        this.game.load.spritesheet("persosImg", "medias/img/pacman-spriteSheetPerso.png", 32, 32);
        this.game.load.image("gommeImg", "medias/img/gomme.png", 32, 32);
        this.game.load.spritesheet("tuiles_32", "medias/img/tuiles_32.png", JEU_PACMAN_RUNNER.TAILLE_TUILE, JEU_PACMAN_RUNNER.TAILLE_TUILE);  

        //Chargement des sons
        this.game.load.audio("sonIntro", ["medias/sons/Pacman-sound.mp3", "medias/sons/Pacman-sound.ogg"]);          
        this.game.load.audio("sonFin", ["medias/sons/Pacman-death-sound.mp3", "medias/sons/Pacman-death-sound.ogg"]);
        this.game.load.audio("sonGomme", ["medias/sons/pacman_coinin.mp3", "medias/sons/pacman_coinin.ogg"]);
        this.game.load.audio("sonPowerUp", ["medias/sons/pacman_power1.mp3", "medias/sons/pacman_power1.ogg"]);
        this.game.load.audio("sonTuile", ["medias/sons/smb_breakblock.mp3", "medias/sons/smb_breakblock.ogg"]);
            
    },
        
    loadUpdate: function(){
        this.pacman.angle += 3;
    },

    create: function(){
        this.game.state.start("intro");
    }
};