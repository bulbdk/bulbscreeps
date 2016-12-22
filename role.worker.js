/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.worker');
 * mod.thing == 'a thing'; // true
 */
function sourceStatus(){
    this.time = Game.time
    this.newUsers = 0
    this.newOnWayUsers = 0
    
   
    
    this.users = 0
    this.onWayUsers = 0
    
    
}
function workToDo(){
    this.time = Game.time
    this.upgrader = 0
    this.builder = 0
    this.energiMover = 0
    this.minUpgrader = 2
    this.minBuilder = 2
    this.MinEnergiMover = 2
    
    this.countUpgrader = 0
    this.countBuilder = 0
    this.countEnergiMover = 0
    

}

var worker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //worker in the room
        if(creep.room.hasOwnProperty("workerInRoom")){
            creep.room.memory.workerInRoom += 1;
            //console.log(creep.room.memory.workerInRoom)
        }
        else{
          creep.room.workerInRoom = true
          creep.room.memory.workerInRoom = 1
          //console.log(creep.room.memory.workerInRoom)
        }
        
        function energiToWork(){
            if(creep.carry.energy > 10){
            return true
            }
            else{
                creep.memory.state = "havest"
                creep.memory.kilde = findSource
                return false
                }
        }

        function jobEnergiMover(){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    
                    creep.moveTo(targets[0]);
                }
            }else{
                creep.memory.state = "builder" 
            }
            
        }

        function jobUpgrader(){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        
        }

        function jobBuilder(){
             var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                creep.memory.state ="upgrader"
            }
        }

        function getFunction(todo){
            //return a function for the creep to do
            if(todo.energiMover <= todo.MinEnergiMover){
                return "energiMover"
            }

            else if(todo.upgrader <= todo.minUpgrader){
                return "upgrader"
            }
            else if (todo.builder <= todo.minBuilder){
                return "builder"
            }
            else{
                switch(Math.floor(Math.random()*3+1)){
                    case 1:
                        creep.say("Im a builder now")
                        return "builder"
                        
                        break;
                
                    case 2:
                        creep.say("Im a Upgrader now")
                        
                        return "upgrader"
                        break;
                    
                    case 3:
                        creep.say("Im a energi mover now")
                        return "energiMover"
                        break;
                    
                
                }
            }
        }
        
        //der skal være en status om hvad den enkelte scrreps fortager sig
        //til at starte med en en screep være i gang med havesting, 
        
        
        //skal der høstes eller arbejdes ??
        
        //gå til stedet for at opgaven kan løses, via path
        
        //udfør opgaven..
        
        // er der andre opgaver der kan gøres i området?
        
        //states 3 stk
        //høster
        //bevæger
        //arbejder
        
        
        var findSource = function() {
            if(!creep.room.memory.hasOwnProperty("sourceStatus")){
                 creep.room.memory.sourceStatus = new Object()
            }
            var sources = creep.room.find(FIND_SOURCES);
            
            var returnValueID = 0
            var shortesQueue = 1000
            for(var i = 0; i < sources.length; i ++){
                
                //console.log(creep.room.memory.sourceStatus[sources[i].id] )
                if(creep.room.memory.sourceStatus[sources[i].id] == undefined){
                    creep.room.memory.sourceStatus[sources[i].id] = new sourceStatus()
                    //console.log(sources[i].id)
                }
                //find out if there are fever user
                //console.log(creep.room.memory.sourceStatus[sources[i].id].users)
                
                if ((creep.room.memory.sourceStatus[sources[i].id].users * 2 + creep.room.memory.sourceStatus[sources[i].id].onWayUsers) < shortesQueue){
                    shortesQueue = creep.room.memory.sourceStatus[sources[i].id].users * 2 + creep.room.memory.sourceStatus[sources[i].id].onWayUsers
                    returnValueID = i
                }
              
                
            }
            
            return sources[returnValueID].id 
            
        }
        
        if(creep.memory.state == undefined){
           creep.memory.state = "test" 
        }

        if(creep.room.memory.workToDo == undefined){
            creep.room.memory.workToDo = new workToDo()
        }


        var rummetWork =creep.room.memory.workToDo
        if(rummetWork.time != Game.time){
            rummetWork.time = Game.time
            rummetWork.upgrader = rummetWork.countUpgrader
            rummetWork.builder = rummetWork.countBuilder
            rummetWork.energiMover = rummetWork.countEnergiMover
            
            
            rummetWork.countUpgrader = 0
            rummetWork.countBuilder = 0
            rummetWork.countEnergiMover = 0
        }
        
        
        switch(creep.memory.state){
            case "havest":
                
                
                // creepen fuldt opladt?
                if(creep.carry.energy < creep.carryCapacity){
                    //der skal findes en kilde til creepen
                    
                    var kilde = creep.memory.kilde
                    if((kilde == undefined) || (kilde == 0)){
                        
                        //console.log(creep.name)
                        creep.memory.kilde = findSource()
                    
                        kilde = creep.memory.kilde
                    
                    }
                    
                    var kildeMem = creep.room.memory.sourceStatus[creep.memory.kilde]
                    
                    try{
                    if(kildeMem.time != Game.time){
                        kildeMem.time = Game.time    
                        kildeMem.users = kildeMem.newUsers
                        kildeMem.newUsers = 0
                        kildeMem.onWayUsers = kildeMem.newOnWayUsers
                        kildeMem.newOnWayUsers = 0
                    }
                    }
                    catch(eer){
                        console.log("der er fejl med "+ creep.name)
                        console.log(creep.memory.kilde)
                        break;
                    }
                    
                    var kildeObj = Game.getObjectById(kilde)
                    if(creep.harvest(kildeObj) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(kildeObj);
                        kildeMem.newOnWayUsers++
                    }
                    else{
                        kildeMem.newUsers++   
                    }
                }
                else{
                    creep.memory.state = "findWork"
                }
                break;
            case "findWork":
                if(creep.room.memory.workToDo === undefined){
                    creep.room.memory.workToDo = new workToDo()
                }
                creep.memory.state = getFunction(creep.room.memory.workToDo)
                creep.memory.kilde = 0
                break;
            
            case "builder":
                creep.room.memory.workToDo.countBuilder++
                if(energiToWork()){
                    jobBuilder()
                }
                break;
                
                
            case "upgrader":
                creep.room.memory.workToDo.countUpgrader++
                if(energiToWork()){
                    jobUpgrader()
                }
                break;
                
            case "energiMover":
                creep.room.memory.workToDo.countEnergiMover++
                 if(energiToWork()){
                    jobEnergiMover() 
                 }
                break;
            
            case "test":
                    energiToWork()
                    if(creep.memory.state == "test"){
                        creep.memory.state = "havest"
                    }
                    break;
            
            default:
                //if(creep.memory.kilde == indefined){
                    creep.memory.kilde = findSource()    
                //}
                break;
            
        }
        
        
       
    }
};

module.exports = worker;