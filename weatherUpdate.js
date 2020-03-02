const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

/**
 * updateWeather updates the weather for each city in the database weather.sqlite3.
 * It modifies the field emailType based on how tomorrow's weather compares to today's
 * 
 * Precondition: there exists a table cities in the weather database that contains
 * the fields id, latitude, longitude, temperatureHigh, temperatureLow, icon, and
 * emailType
 * @returns void
 */
function updateWeather() {
    const path = './weather.sqlite3'
    try {
        if (fs.existsSync(path)) {
            let db = new sqlite3.Database(path);
            updateWeatherHelper(db); 
        }
        else {console.log('weather db does not exist');}
    } 
    catch(err) {console.error(err);}
}

/**
 * updateWeatherHelper calls the DarkSky API to gain weather information. 
 * If the weather tommorow is "clear-day" or "clear-night" or tomorrow is 5 degrees warmer
 * than today, the emailType is "good". If it is 5 degrees colder or the weather type
 * is "rain", "snow", "sleet", "wind", or "fog", then the emailType is "bad". Otherwise,
 * it is neutral
 * 
 * @param {*}  db is a valid sqlite3 database that contains
 * the fields id, latitude, longitude, temperatureHigh, temperatureLow, icon, and
 * emailType
 */
function updateWeatherHelper(db) {
    const goodDays = ["clear-day", "clear-night"];
    const badDays = ["rain", "snow", "sleet", "wind", "fog"];

    db.each("SELECT id, latitude, longitude FROM cities", 
        (error, row) => {
        /*gets called for every row our query returns*/
            if (error) {return console.error(err.message);}
            let id = row.id; 
            let latitude = row.latitude;
            let longitude = row.longitude; 

            fetch("https://api.darksky.net/forecast/64399f401d702859208e3d719194cbf5/" + latitude + "," + longitude)
                .then(response => {return response.json();})
                .then(data => {
                    
                    const tempToday = (data['daily']['data'][0]['temperatureHigh'] +  data['daily']['data'][0]['temperatureLow']) / 2; 
                    const tempTomorrow = (data['daily']['data'][1]['temperatureHigh'] + data['daily']['data'][1]['temperatureHigh']) / 2; 
                    const icon = data['daily']['data'][0]['icon'];
                    let emailType = "neutral"; 
                    if(tempTomorrow - tempToday < -5 || goodDays.includes(icon)){emailType = "good";}
                    if(tempTomorrow - tempToday > 5 || badDays.includes(icon)){emailType = "bad";}

                    let sql = `UPDATE cities SET tempToday = ?, tempTomorrow = ?, icon = ?, emailType = ? WHERE id = ?`;
        
                    db.run(sql, [tempToday, tempTomorrow, icon, emailType, id], function(err) {
                        if (err) {return console.error(err.message);}
                        console.log(`Row(s) updated: ${this.changes}`);
                    });
                })
                .catch((error) => {console.error('Error:', error);});
        });
}

updateWeather(); 