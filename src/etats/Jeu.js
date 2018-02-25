"use strict";

///////////////////////////////////////////////////////////////////////////////////////
//- JEU -----------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////

    JEU_PACMAN_RUNNER.Jeu = function (){
        //les differents layers seront contenus dans couches
        this.couches = null;
        //Les tuiles des cartes
        this.carteGauche = [];
        this.carteDroite = [];
        //les murs
        this.murs = null;
        //calcule le deroulement de la carte pour savoir quand et ou en creer une nouvelle
        this.positionDeroulement = 0;
        //Le personnage du pacman
        this.pacman = null;
        
        //Le score du jeu
        this.score = 0;
        this.scoreTxt = null;
        this.tempsEcoule = 0;
        this.tempsTxt = null;
        //le nombre maximal de fantomes qui peuvent apparaitre sur la carte
        this.nbFantomesMax = null;
        //representation graphque de la duree du power up
        this.barrePowerUp = null;
        //son qui joue quand on detruit une tuile
        this.sonTuile = null;
    };

    JEU_PACMAN_RUNNER.Jeu.prototype = {
        
        init: function(){
            //reinitialise les variables quand on commence une partie
            this.nbFantomesMax = JEU_PACMAN_RUNNER.NB_FANTOMES_MAX;
            this.positionDeroulement = 0;
        },
        
        create: function(){
            this.sonTuile = this.game.add.audio("sonTuile",0.5);
            
            //permet a la camera de se deplacer librement
            this.game.camera.bounds = null;
            
            //l'ordre des groupes fait en sorte que les elements s'affichent dans le bon ordre
            this.couches = {
                carte:this.game.add.group(),
                gommes:this.game.add.group(),
                fantomes:this.game.add.group(),
                pacman:this.game.add.group()
            };
            
            //Tous les éléments du jeu utilisent la physique... on va donc le préciser ici
            //Ajout de la physique pour l'ensemble du jeu
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            
            //murs
            //collideWorldBounds n'est pas utilise sur pacman car il doit pouvoir sortir par le cote gauche
            this.murs = {
                droit: this.game.add.tileSprite(this.game.width, 0, JEU_PACMAN_RUNNER.TAILLE_TUILE, this.game.height, "tuiles_32",1),
                haut: this.game.add.tileSprite(0, -JEU_PACMAN_RUNNER.TAILLE_TUILE, this.game.width, JEU_PACMAN_RUNNER.TAILLE_TUILE, "tuiles_32",1),
                bas: this.game.add.tileSprite(0, JEU_PACMAN_RUNNER.TAILLE_TUILE*16, this.game.width, JEU_PACMAN_RUNNER.TAILLE_TUILE, "tuiles_32",1)
            };
            this.game.physics.enable([this.murs.droit, this.murs.haut, this.murs.bas], Phaser.Physics.ARCADE);
            this.murs.droit.body.immovable = true;
            this.murs.haut.body.immovable = true;
            this.murs.bas.body.immovable = true;
            //garde les murs relatifs a la camera
            this.murs.droit.fixedToCamera = true;
            this.murs.haut.fixedToCamera = true;
            this.murs.bas.fixedToCamera = true;
            
            //creer les cartes initiales
            //la premiere carte est toujours la meme, les cartes subsequentes sont choisies au hasard
            this.creerCarteJeu(JEU_PACMAN_RUNNER.CARTE_DEBUT, 0, false);
            this.creerCarteJeu();
            
            //creer le personnage
            this.pacman = new Pacman(this.game, this.couches.pacman, 150);
            this.pacman.setPositionDepart((JEU_PACMAN_RUNNER.POS_DEPART_PERSO[0]*JEU_PACMAN_RUNNER.TAILLE_TUILE)+2, (JEU_PACMAN_RUNNER.POS_DEPART_PERSO[1]*JEU_PACMAN_RUNNER.TAILLE_TUILE)+2);
            
            //Initialiser et afficher le score
            this.score=0;
            this.scoreTxt= this.game.add.text(
                this.game.width/2,this.game.height, 
                "SCORE = 0", 
                {font: "bold 36px Arial", fill: "#FFF"}
            );
            this.scoreTxt.anchor.set(0.5, 2);
            this.scoreTxt.fixedToCamera = true;
            
            //Initialiser et afficher le temps
            this.game.time.reset();
            this.tempsTxt= this.game.add.text(
                this.game.width/2,this.game.height, 
                "TEMPS ÉCOULÉ = 0", 
                {font: "bold 16px Arial", fill: "#FFF"}
            );
            this.tempsTxt.anchor.set(0.5, 2);
            this.tempsTxt.fixedToCamera = true;
            
            //barre du power up
            this.barrePowerUp = this.game.add.sprite(0, (this.game.height/4)*3+32, "barreChargement");
            this.barrePowerUp.scale.setTo(0, 0.3);
            this.barrePowerUp.tint = 0xff0000;
            this.barrePowerUp.anchor.set(0,0);
            this.barrePowerUp.fixedToCamera = true;
            
                       
        },
        
        modifierScore: function(score){
            //remettre le texte a sa position initiale pour eviter qu'il se decale
            this.scoreTxt.position.x = this.game.width/2;
            this.scoreTxt.position.y = this.game.height;
            //change le score
            this.score += score;
            //animation
            this.game.add.tween(this.scoreTxt.cameraOffset).to({x:this.scoreTxt.position.x, y:this.scoreTxt.position.y+5},50,Phaser.Easing.Default,true,0,0,true);
        },
        
        
        //-- NOTE : le jeu est incroyablement lent sur sur iPhone 5, mais fonctionne bien sur iPad 2. C'est probablement du a la memoire disponible et a la quantite de sprite creees par les cartes --//
        
        //creee des sprite pour former une carte de tuiles
        creerCarteJeu: function(carte, positionDepart, creerObjets){
            //valeurs par defaut (minifier ne fonctionne pas avec des valeurs par defaut dans les args car ES6)
            carte = typeof carte === 'undefined'? Phaser.ArrayUtils.getRandomItem(JEU_PACMAN_RUNNER.CARTES_NIVEAUX) : carte; // l'array d'index de tuiles
            positionDepart = typeof positionDepart === 'undefined'? JEU_PACMAN_RUNNER.TAILLE_TUILE*JEU_PACMAN_RUNNER.LARGEUR_CARTE + this.positionDeroulement: positionDepart; //la position x de depart (gauche)
            creerObjets = typeof creerObjets === 'undefined'? true : creerObjets; // generer ou non des gommes et fantomes
            
            //detruit la carte maintenant en dehors de l'ecran
            for(var i = 0; i < this.carteGauche.length; i++){
                this.carteGauche[i].destroy();
            }
            //la carte creee precedemment deroule et est maintenant partiellement en dehors de l'ecran
            this.carteGauche = this.carteDroite.concat();
            this.carteDroite = [];
            //cree une nouvelle carte qui va apparaitre par la droite
            var tuile, posX, posY;
            for(var i = 0; i < carte.length; i++){
                //positions en pixels sur la carte
                posX = (i % JEU_PACMAN_RUNNER.LARGEUR_CARTE)*JEU_PACMAN_RUNNER.TAILLE_TUILE + positionDepart;
                posY = (Math.floor(i / JEU_PACMAN_RUNNER.LARGEUR_CARTE))*JEU_PACMAN_RUNNER.TAILLE_TUILE;
                //sprite
                tuile = this.couches.carte.create(posX, posY, "tuiles_32");
                //frame (et type) selon l'index de l'array de carte
                tuile.frame = carte[i];
                if(tuile.frame == 0){
                    tuile.type = "mur";
                    //permettre la collision avec les murs
                    this.game.physics.enable(tuile, Phaser.Physics.ARCADE);
                    tuile.body.immovable = true;      
                } else{
                    tuile.type = "sol";
                }
                //afin de distinguer les tuile appartenant a cette carte
                //(plutot qu'utiliser this.couches.carte qui refere a toutes les tuiles des deux cartes)
                this.carteDroite[i] = tuile;
            }
            //augmente le nombre de fantomes max a chaque nouvelle carte
            this.nbFantomesMax += 0.5;
            //peuple la carte
            if(creerObjets){
                this.creerObjetsCarte();
            }
            
        },
        
        //cree des objets aleatoires pour peupler la carte
        creerObjetsCarte: function(){
            //fantomes
            var nbFantomes = Math.ceil(Math.random()*this.nbFantomesMax);
            console.log(this.nbFantomesMax);
            for(var i = 0; i < nbFantomes; i++){
                new Fantome(this.game, this.couches.fantomes, this.carteDroite, 150);
            }
            //gommes
            var nbGommes = Math.ceil(Math.random()*JEU_PACMAN_RUNNER.NB_GOMMES_MAX);
            for(var i = 0; i < nbGommes; i++){
                new Gomme(this.game, this.couches.gommes, this.carteDroite);
            }
        },
        
        mangerGomme : function(pacman, gomme) {
            //active le powerUp si la gomme est super
            if(gomme.superGomme){
                this.pacman.activerPowerUp();
            }
            //detruit la gomme
            gomme.manger();
            //Augmenter le score
            this.modifierScore(1000);
        },

        //gere le deroulement des elements du jeu
        deroulerJeu: function(){
            this.positionDeroulement ++;
            this.game.camera.focusOnXY(this.positionDeroulement+this.game.width/2, this.game.height/2);
            //si la carte est rendue completement en dehors de l'ecran, on en genere une nouvelle
            if(this.positionDeroulement % (JEU_PACMAN_RUNNER.TAILLE_TUILE*JEU_PACMAN_RUNNER.LARGEUR_CARTE) == 0){
                this.creerCarteJeu();
            }
            //si pacman est en dehors de l'ecran, on termine le jeu
            if(this.pacman.x <= -this.pacman.width + this.positionDeroulement){
                this.allerFinJeu();
            }
        },
        
        //actualise les infos a afficher, comme le score et le temps
        afficherInfos: function(){
            //score
            this.score ++;
            this.scoreTxt.text = "SCORE : " + this.score;
            //temps
            this.tempsEcoule = Math.floor(this.game.time.totalElapsedSeconds());
            this.tempsTxt.text = "TEMPS ÉCOULÉ : " + Math.floor(this.tempsEcoule/60) //minutes
            + ":" + (this.tempsEcoule%60 < 10 ? "0" + this.tempsEcoule%60 : this.tempsEcoule%60); //secondes
            //on rajoute un zero si le nombre de secondes est plus petit que 10 afin de conserver un format 0:00
        },
        
        update: function(){
            //bouts de codes isoles pour ne pas encombrer la fonction et pour tester plus facilement
            this.deroulerJeu();
            this.afficherInfos();
            //fonctions du pacman
            this.pacman.gererDeplacement(this.positionDeroulement);
            if(this.pacman.powerUp){
                this.pacman.updateDureePowerUp(this.barrePowerUp);  
            }
            //Détection des collisions avec les murs
            this.game.physics.arcade.collide(this.pacman, [this.murs.droit, this.murs.haut, this.murs.bas]);
            this.game.physics.arcade.collide(this.couches.fantomes, [this.murs.haut, this.murs.bas, this.couches.carte], this.gererDirectionFantome, null, this);
            //detection de collision entre pacman et un objet
            this.game.physics.arcade.collide(this.pacman, this.couches.carte, this.gererCollisionTuile, null, this);
            this.game.physics.arcade.collide(this.pacman, this.couches.fantomes, this.gererCollisionFantome, null, this);
            this.game.physics.arcade.collide(this.pacman, this.couches.gommes, this.mangerGomme, null, this);
            
        },
        
        gererDirectionFantome: function(objet1, objet2){
            //pour une raison ou une autre, les args sont inverses quand le fantome touche un mur plutot qu'une tuile
            //mais pas de probleme! on peut trouver la nature des objets quand-meme
            if(objet2.type != 'mur'){
                objet2.changerDirection();
            } else{
                objet1.changerDirection();
            }
        },
        
        gererCollisionFantome: function(hero, ennemi){
            //mange le fantome si pacman a le power up
            if(this.pacman.powerUp){
                ennemi.manger();
                //Augmenter le score
                this.modifierScore(5000);
            }else{
                //sinon termine la partie
                this.allerFinJeu();
            }
        },
        
        gererCollisionTuile: function(hero, tuile){
            //detruit la tuile si pacman a le power up
            if(this.pacman.powerUp){
                tuile.destroy();
                this.sonTuile.play();
                //Augmenter le score
                this.modifierScore(200);
            }
        },
        
        allerFinJeu : function () {
            //detruit les cartes
            for(var i = 0; i < this.carteGauche.length; i++){
                this.carteGauche[i].destroy();
                this.carteDroite[i].destroy();
            }
            //coupe le son
            this.pacman.desactiverPowerUp();
            //Aller à la fin du jeu - on passe le score comme info supplémentaire
            this.game.state.start("fin", true, false, this.score ,this.temps);
        },
          
        //(debug) infos des body des personnages
        /*render: function(){
            this.game.debug.cameraInfo(this.game.camera);
            this.game.debug.body(this.pacman);
            for(var i = 0; i < this.couches.fantomes.length; i++){
                this.game.debug.body(this.couches.fantomes.getChildAt(i));
            }
            for(var i = 0; i < this.couches.gommes.length; i++){
                this.game.debug.body(this.couches.gommes.getChildAt(i));
            }
        }*/
        
    };