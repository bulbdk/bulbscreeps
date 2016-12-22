/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawnTools');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    //hvordan skal det gøres????
                
    //grund creep skal udvides med et loop af udbygninger, hvis der ikke er energi til det næste trin i loopet bliver det kontrolleret at der er energi til nogle af de andre ting
                
    //der laves en grundlægende creep til den enkelte grund funktion
                
    // loop flere gange igennem for at få lavet en creep
                
    //Hvor meget energi er der tilbage
    //array med alle creeps parts cost pris
    
    designCreep(basisCreep, extendArry, maxCost){
         var creepParts = {move:50, WORK:100, CARRY:50, ATTACK:80 }
         
         function calcprice(design){
              var creepParts = {move:50, WORK:100, CARRY:50, ATTACK:80 }
             var price = 0
             for(var i in design){
                 price =+ creepParts[i]
             }
            return price 
         }
        
        
    };
    
    designCreep(basicCreep, extendArrays, maxEnergiToUse, spawnToUse){
        var creepDesign = basicCreep 
        console.log(spawnToUse.canCreateCreep(creepDesign))
        console.log(creepDesign)
        
        if(spawnToUse.canCreateCreep(creepDesign)==0){
            
            buildLoop:
            do {
                //console.log(extendArrays.length)
                for(var i = 0; i < extendArrays.length; i++){
                    var testDesign = creepDesign
                    
                    testDesign = testDesign.concat(extendArrays[i])
                  

                    if((spawnToUse.canCreateCreep(creepDesign)==0) && (calcPrice(testDesign) <= maxEnergiToUse) ){
                        creepDesign = testDesign
                    }
                    else{
                    
                        break buildLoop;
                    }
                    
                }
            //console.log(creepDesign)    
            //console.log("status "+ spawnToUse.canCreateCreep(creepDesign))        
            
                
            if(calcPrice(testDesign) > maxEnergiToUse){
                        break;
                    }else{
                        console.log(calcPrice(testDesign))
                    }    
            }
            while(spawnToUse.canCreateCreep(creepDesign)==0)
            
        }
        console.log(creepDesign)
    
     
    }
    
    

};