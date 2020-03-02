const sqlite3 = require('sqlite3').verbose();

/**
 * getCities returns the 100 most-populated cities in the US ordered by their size 
 * 
 * Precondition: './weather.sqlite3' is a valid sqlite3 database that has a table cities
 * with the fields city, state, and rank 
 * @return A Promise that resolves to return the city and state of the 100-most populated US cities
 */
function getCities(){
    return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./weather.sqlite3', (err) => {if (err) {console.error(err.message);}});
    const queries = [];
    db.each('SELECT city, state FROM cities ORDER BY rank ASC', (err, row) => {
        if (err) {reject(err); 
        } else {queries.push(row); 
        }
    }, (err, n) => {
        if (err) { reject(err); 
        } else {resolve(queries); 
        }
    });
    });  
}

module.exports = getCities