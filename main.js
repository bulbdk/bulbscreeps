var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWorker = require('role.worker')
//var spawnTools = require('spawnTools')

module.exports.loop = function () {
//tilfør de enkelte resuser medtohder og property til at fortælle hvor meget at de bruges
//skal vi prøve igen 



    for(var name in Memory.creeps) {// clear mem
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }



    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
    }
    for(var Spawns in Game.spawns){
        var spawn = Game.spawns[Spawns]
        //console.log(spawn.room.memory.workerInRoom)
        if(!spawn.room.hasOwnProperty("workerInRoom")){
            spawn.room.memory.workerInRoom = 0
        }
        //console.log(spawn.room.memory.workerInRoom)
        //console.log(spawn.room.name)
        if(!spawn.memory.hasOwnProperty("minNumberOfWorkers")){
            spawn.memory.minNumberOfWorkers = 10
        }
        //console.log("crreps i rummet: " + spawn.room.memory.workerInRoom + " og min er: "+ spawn.memory.minNumberOfWorkers )
        if( spawn.room.memory.workerInRoom < spawn.memory.minNumberOfWorkers ){
            //hvis under halvdellen af maks antal worker, skal der bare lave simple workers
            if (spawn.room.memory.workerInRoom < spawn.memory.minNumberOfWorkers/2){
                //spawn simpel worker
                //if(spawn.energy >= 300){
                    var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'worker'});
                    console.log('Spawning new worker: ' + newName);
                //}

                }
            else
            {
            if(spawn.energy == spawn.energyCapacity && spawn.energy >= 150){

                // Hvorstore creeps kan der laves i rummet.
                // for ver move part kan der være to andre dele, en del koster 50 energi en heder
                //console.log(spawn.energyCapacity)
                //antal muligeblokke = maks energi/50
                // antal move blokke math.ceil(muligeblokke/3)
                // antal work blokke er en for ver 3 energi enheder
                // workblokke = (maks muligeblokke - move blokke)/3 dog minimum 1
                // antal storage blokke = muligeblokk -moveblokk - work blokke


                //hvordan skal det gøres????

                //grund creep skal udvides med et loop af udbygninger, hvis der ikke er energi til det næste trin i loopet bliver det kontrolleret at der er energi til nogle af de andre ting

                //der laves en grundlægende creep til den enkelte grund funktion

                // loop flere gange igennem for at få lavet en creep

                //Hvor meget energi er der tilbage


                var muligeBlokke = Math.floor(spawn.energy / 100)
                console.log(muligeBlokke)
                var moveBlokke = Math.ceil(muligeBlokke/3)
                var workBlokke = Math.floor((muligeBlokke - moveBlokke)/3)
                if(workBlokke < 1)
                { workBlokke = 1}
                var opbevaringBlokke = muligeBlokke - moveBlokke - workBlokke
                //array for udrustning
                var udrustning = []
                for(var i = 0; i < moveBlokke; i++){
                    udrustning.push(MOVE)
                }
                for(var i = 0; i < workBlokke; i++){
                    udrustning.push(WORK)
                }
                for(var i = 0; i < opbevaringBlokke; i++){
                    udrustning.push(CARRY)
                }



                console.log(udrustning)
                var newName = spawn.createCreep(udrustning, undefined, {role: 'worker'});
                console.log('Spawning new worker: ' + newName);
            }

            }



        }
    }
    /*    var creepParts = {MOVE:50, WORK:100, CARRY:50, ATTACK:80 }
     function calcPrice(design){

             var price = 0

             for(var i = 0 ; i < design.length; i ++){

                 price += creepParts[design[i].toUpperCase()]

             }
            //console.log(price)
            return price
         }

    //console.log(calcPrice([WORK,WORK,MOVE]))

    function  designC(basicCreep, extendArrays, maxEnergiToUse, spawnToUse){
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
    designC([WORK,CARRY,MOVE],[[CARRY,MOVE],[WORK,MOVE]],500,Game.spawns["Hjemme"])
    //console.log(Game.spawns["Hjemme"].canCreateCreep([WORK,CARRY,MOVE,CARRY,MOVE,WORK,MOVE]))
    */

}
