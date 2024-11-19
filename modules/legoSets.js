require('dotenv').config();
const Sequelize = require('sequelize');
dialectModule: require("pg");


const setData = require("../data/setData");
const themeData = require("../data/themeData");

// console.log(themeData)



// set up sequelize to point to our postgres database
let sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectModule: require("pg"),
    dialectOptions: {
    ssl: { rejectUnauthorized: false },
    },
    }
    );


// creating theme table 
const Theme = sequelize.define(
    'Theme',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true, // automatically increment the value
      },
      name: Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

const Set = sequelize.define(
    'Set',
    {
      set_num: {
        type: Sequelize.STRING,
        primaryKey: true, // use "project_id" as a primary key
      },
      name: Sequelize.STRING,
      year: Sequelize.INTEGER,
      num_parts: Sequelize.INTEGER,
      theme_id: Sequelize.INTEGER, 
      img_url:Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

  Set.belongsTo(Theme, {foreignKey: 'theme_id'});

// Code Snippet to insert existing data from Set / Themes








function initialize(){
    
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                console.log("Database synchronized successfully.");
                resolve();
            })
            .catch((error) => {
                console.error("Error synchronizing the database:", error);
                reject(error);
            });
    });
   
}

function getAllSets(){
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [Theme] 
        })
        .then((allSets) => {
            
            resolve(allSets); 
        })
        .catch((error) => {
            console.error("Error fetching sets:", error);
            reject(error);
        });
    });
}

function getSetByNum(setNum){
    return new Promise((resolve, reject)=>{

        Set.findAll({
            include: [Theme], 
            where: {
                set_num: setNum,
            }
        })
        .then((sets) => {
            if (sets.length > 0) {
                resolve(sets[0]);       
            } else {
                reject(new Error("Unable to find requested set")); 
            }        
        })
        .catch((error) => {
            console.error("Error fetching sets:", error);
            reject(error);
        });
        })  
}

function getSetsByTheme(theme){
    return new Promise((resolve, reject)=>{

        Set.findAll({include: [Theme], where: {
            '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${theme}%`
            }
        }})
        .then((sets) => {
            if (sets.length > 0) {
                resolve(sets);        
            } else {
                reject(new Error("Unable to find requested set"));  
            }        
        })
        .catch((error) => {
            console.error("Error fetching sets:", error);
            reject(error);
        });
    })
}

function addSet(setData){
    return new Promise((resolve, reject)=>{
        Set.create(setData)
        .then(() => {
          resolve(); 
        })
        .catch((err) => {
          reject(err.errors[0].message); 
        });
    })
}

function getAllThemes() {
    return new Promise((resolve, reject) => {
      Theme.findAll()  
        .then(themes => {
          resolve(themes);  
        })
        .catch(err => {
          reject(err);  
        });
    });
  }
  
  function editSet(set_num, setData) {
    return new Promise((resolve, reject)=>{
      Set.update(
        setData,
        {
          where: { set_num : set_num }, 
        }
      ).then(() => {
        resolve();
      })
      .catch((err)=>{
        reject(err.errors[0].message)
      })
      
    })
  }


  function DeleteSet(set_num){
    return new Promise((resolve, reject)=>{
      Set.destroy({
        where: { set_num: set_num }, 
      }).then(() => {
        resolve();
      })
      .catch((err)=>{
        reject(err.errors[0].message);
      })
    })
  }

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, DeleteSet }

