const setData = require("../data/setData");
const themeData = require("../data/themeData");
// console.log(themeData)

let sets = [];

function initialize(){
    return new Promise((resolve, reject) =>{

        sets = setData.map((obj1)=>{
            obj1['theme'] = themeData.find((obj2) => obj2.id === obj1.theme_id)['name']
            return obj1
        })
        resolve();
    })
}

function getAllSets(){
    return new Promise((resolve, reject)=>{
        resolve(sets)
    })
    
}

function getSetByNum(setNum){
    return new Promise((resolve, reject)=>{
    if(sets.find((obj1)=>obj1['set_num'] === setNum) !== undefined){
        resolve(sets.find((obj1)=>obj1['set_num'] === setNum))    
    }
    else{
        reject(': unable to find requested set');
    }
    })  
}

function getSetsByTheme(theme){
    let temp =  sets.filter((obj1)=>{
        return obj1['theme'].toLowerCase().includes(theme.toLowerCase())
    })
    return new Promise((resolve, reject)=>{
        
        if(temp !== undefined){
            resolve(temp)
        }
        else{
            reject('unable to find requested sets')
        }
    })
}


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }

