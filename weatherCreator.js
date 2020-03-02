const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

/**
 * createWeatherDatabase creates a SQLite DB file 'weather.sqlite3' in the working directory.
 * This DB file contains two tables, cities, which contains information about
 * the 100 most populated-cities in the United States, and users, which
 * consists of users subscribed to the weather app and their accompanying city. The 
 * tables are not created if they previously exist. 
 * @return void 
 */
function createWeatherDatabase(){
  let db = new sqlite3.Database("./weather.sqlite3", (err) => { 
      if (err) { 
          console.log('Error when creating the database', err);
      } else { 
        console.log("create database table cities");
        db.run("CREATE TABLE IF NOT EXISTS cities(id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, state TEXT, latitude FLOAT, longitude FLOAT, rank INT, tempToday FLOAT, tempTomorrow FLOAT, icon TEXT, emailType TEXT)");
        console.log("create database table users");
        db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, city TEXT, state TEXT)");
        insertCitiesIntoTable(db);
      } 
  })
}

/**
 * insertCitiesIntoTable fetches data about the 100-most populated cities in the US and adds
 * various information about said cities into the cities table in the weather database. 
 * @param {*} db is a valid sqlite3.Databse with a table cities with the appropriote fields. 
 * @return void 
 */
function insertCitiesIntoTable(db) {
  const insertData = (city, state, latitude, longitude, rank) =>{
    db.run(`INSERT INTO cities (city, state, latitude, longitude, rank, tempToday, tempTomorrow, icon, emailType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
     [city, state, latitude, longitude, rank, 0, 0, 'cloudy', 'neutral'], function(err) {
        if (err) {return console.log(err.message);}
        console.log(`A row has been inserted with rowid ${this.lastID}`); // get the last insert id
    });
  };

  const api = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=1000-largest-us-cities-by-population-with-geographic-coordinates&rows=100&start=0&sort=population';

  fetch(api)
      .then(response => response.json())
      .then(data => {
          const records = data['records'];
          for(let i = 0; i < records.length; i++){
              let city = records[i]['fields']['city'];
              let state = records[i]['fields']['state'];
              let latitude = records[i]['fields']['coordinates'][0];
              let longitude = records[i]['fields']['coordinates'][1];
              let rank = records[i]['fields']['rank'];
              insertData(city, state, latitude, longitude, rank);
          }
      });
}

createWeatherDatabase();