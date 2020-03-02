const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

/**
 * getUserFromDB returns the email, city, and state of every occurence of the
 * email parameter in the weather.sqlite3 database
 * 
 * Precondition: there exists a sqlite3 database titled weather.sqlite3 in the
 * current directory and it contains a table users that contains the fields
 * email, city, and state
 * @param email is a valid email
 * @return a Promise that when resolved, contains every occurence of the entry in
 * the database along with the city and state of that entry
 */
async function getUserFromDB(email) {
    const path = './weather.sqlite3'
    try {
        if (fs.existsSync(path)) {
            return getUserFromDBHelper(path, email); 
        }
        else {console.log('cities db does not exist');}
    } 
    catch(err) {console.error(err);}
}

async function getUserFromDBHelper(path, email){
    return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path, (err) => {if (err) {console.error(err.message);}});
    const queries = [];

    db.each('SELECT email, city, state FROM users WHERE email = ?', [email], (err, row) => {
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

/**
 * addUserToDB adds a user to the user table in the weather sqlite3 database.
 * It only adds the user if the email address given is not currently present
 * in the database. 
 * 
 * Precondition: user is a 
 * @param {*} data is an object that contains two fields, email, which is a valid
 * email address and city, which is a city AND a state seperated by the string ', ' 
 * @returns void 
 */
async function addUserToDB(data){
    let email = data['email'];
    let cityPlusState = data['city'];
    getUserFromDB(email)
        .then(query => {
            if(query.length === 0 ){ //checks that user is not present in db 
                let commaIndex = cityPlusState.indexOf(","); 
                let city = cityPlusState.substring(0, commaIndex); 
                let state = cityPlusState.substring(commaIndex + 2);
                addUserToDBHelper(email, city, state); 
            }
        })
        .catch((error) => {console.error('Error:', error);});
}

function addUserToDBHelper(email, city, state){
    let db = new sqlite3.Database("./weather.sqlite3", (err) => { 
        if (err) { console.log('Error when opening the database', err);}
        else {
            db.run('INSERT INTO users (email, city, state) VALUES (?, ?, ?)', [email, city, state], function(err) {
                if(err) {return console.log(err.message);}
                console.log(`A row has been inserted with rowid ${this.lastID}`); 
            })
        }
    });
}

module.exports = addUserToDB; 