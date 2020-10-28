// Indicate that the code should be executed in "strict mode"
'use strict';

// Import node.js. This allows the user to use the file system 
var fs = require('fs');
// Import node.js path module. This lets the user to to connect with the file & directory path
var path = require('path');
// Import sequelize module. This lets the user connect with the server and a database & sequelize does this through object syntax.
var Sequelize = require('sequelize');
// This module.filename returns the absolute path of the file where it's called. The path.basename shortens it, but equals index.js
var basename = path.basename(module.filename);
// This env is assigned to 'development' if the NODE_ENV key in process.env is not defined
var env = process.env.NODE_ENV || 'development';
// Import the value corresponding to the env key in the config.json file. This allows login configuration to access MySQL
var config = require(__dirname + '/../config/config.json')[env];
// Assign the variable db to it an empty object
var db = {};

// If use_env_variable is a key in the config object
if (config.use_env_variable) {
  // Then we create a new sequelize using the defined env_variable
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  // If its not, then create a new sequelize using the config values listed
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // ReaddirSync returns an array containing files from the current directory (__dirname)
  .readdirSync(__dirname)
  // The .filter uses callback function on each array. A new array is what the filter method returns 
  .filter(function (file) {
    // Returns true if the file does not begin with '.', & the filename does not equal 'index.js' & it must be a javascript file 
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // The .forEach passes each array item into a callback function
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    // The db object adds a new key pair value. The key is the contructor's name & the value is the class constructor model
    db[model.name] = model;
  });

// Object.keys is the db object returning an array containing keys. The forEach passes each array item to a callback function
Object.keys(db).forEach(function (modelName) {
  // Because the forEach loops through an array of db's keys, each modelName is a key in db. If associate function is defined, models object is the argument
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize = sequelize and Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
