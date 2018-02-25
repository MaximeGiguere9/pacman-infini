/**
 * Classe statique Ecran  
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 2016-05-01
 * Fortement inspiré de : Screen Orientation API Demo by Aurelio De Rosa (Version Mars 2016)
 * @see https://github.com/AurelioDeRosa/HTML5-API-demos
 */

(function () {  //  IIFE
    "use strict";
    
    
    var prefix =  'orientation' in screen ? '' :
            'mozOrientation' in screen ? 'moz' :
            'msOrientation' in screen ? 'ms' : null;

    var Ecran = {
        PORTRAIT: "portrait-primary",
        PAYSAGE:  "landscape-primary",
              
        mettrePleinEcran:function(){
            var element= document.documentElement;
              if(element.requestFullscreen) {
                     element.requestFullscreen();
                  } else if(element.mozRequestFullScreen) {
                     element.mozRequestFullScreen();
                  } else if(element.webkitRequestFullscreen) {
                     element.webkitRequestFullscreen();
                  } else if(element.msRequestFullscreen) {
                     element.msRequestFullscreen();
                  }
            Ecran.verrouillerEcran(Ecran.PAYSAGE);
        },
        
        enleverPleinEcran: function(){
            var element= document.documentElement;
              if(document.exitFullscreen) {
                     document.exitFullscreen();
                  } else if(document.mozCancelFullScreen) {
                     document.mozCancelFullScreen();
                  } else if(document.webkitExitFullscreen) {
                     document.webkitExitFullscreen();
                  } else if (document.msExitFullscreen) {
                     document.msExitFullscreen();
                  }
            Ecran.deVerrouillerEcran();
        },

		/**
		 * Permet de bloquer l'écran en mode paysage ou portrait
		 * si l'application est en mode plein-écran 
		 * 
		 * @param {String} orientationEcran Orientation souhaité défini avec les constantes de classes
		 * @return {Boolean} Retourne true à gérer au besoin lorsque l'écran est verrouillé
		 */
                      
        verrouillerEcran : function(orientationEcran){
            //Si c'est possible (c.-à-d. si le navigateur intègre l'API), on va bloquer l'orientation du périphérique
          
            if(prefix != null && (orientationEcran== Ecran.PAYSAGE || orientationEcran == Ecran.PORTRAIT)) {

                //Mettre un petit délai pour être certain que l'application est déjà en mode pleinEcran car c'est une condition pour bloquer l'orientation de l'écran
                
                window.setTimeout(function () {
                    
					// Vérifier quelle version de l'API est implémentée dans le navigateur
					if ('orientation' in screen && 'angle' in screen.orientation) {
						screen.orientation.lock(orientationEcran);

					} else {
						 screen[prefix + (prefix === '' ? 'l' : 'L') + 'ockOrientation'](orientationEcran);                                
					}          
                                      
                }, 100);
                
                //Au besoin...
                return true;
            }
            
        },// Fin verrouillerEcran
  
		
			
        deVerrouillerEcran : function(){
            //Si c'est psooible, on va débloquer l'orientation du périphérique

            if(prefix != null) {          
                 // Vérifier quelle version de l'API est implémentée dans le navigateur
                if ('orientation' in screen && 'angle' in screen.orientation) {
                    screen.orientation.unlock();
                    
                } else {
                    screen[prefix + (prefix === '' ? 'u' : 'U') + 'nlockOrientation']();     
                } 
            }
            
            //Au besoin...
            return false;
            
        },// Fin deVerrouillerEcran       
        
    }

	//Mettre la classe publique
    window.Ecran=Ecran; //ou return Ecran;  

}());//Fin IIFE