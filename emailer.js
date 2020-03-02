const nodemailer = require('nodemailer');
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose(); 

/* the email to send the message from */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ronnieweatherapp@gmail.com',
      pass: 'badpassword'
      //BDAY: 01/01/2000
    }
});

/**
 * sendEmails sends an email to each user in the users table in the weather
 * table with tomorrow's weather in the user's city and a discount.
 * Optionally, the message praises the good weather tomorrow if that is the case and
 * cheers the user up if there is bad weather tomorrow. 
 * 
 * Precondition: there exists a database weather.sqlite3 in the current directory 
 * that has two tables, cities and users. The cities table has the fields
 * email, emailType, city, tempToday, and icon and the users table has the fields
 * email and city. 
 * @return void 
 */
function sendEmails() {
    const path = './weather.sqlite3'
    try {
        if (fs.existsSync(path)) {
            sendEmailsHelper(); 
        }
        else {console.log('weather db does not exist');}
    } 
    catch(err) {console.error(err);}
}

function sendEmailsHelper() {
    let db = new sqlite3.Database('./weather.sqlite3');
    let sql = "SELECT email, cities.city, tempToday, icon, emailType FROM cities, users WHERE cities.city = users.city";
    
    const emails = {
        good : "It's nice out! Enjoy a discount on us.",
        bad : "Not so nice out? That's okay, enjoy a discount on us.",
        neutral : "Enjoy a discount on us." 
    }

    const weather = {
        "clear-day" : "sunny",
        "clear-night" : "clear skies", 
        "rain" : "rainy", 
        "snow" : "snowy",
        "sleet" : "slushy",
        "wind" : "windy",
        "fog" : "foggy",
        "cloudy" : "cloudy",
        "partly-cloudy-day" : "partly-cloudy",
        "partly-cloudy-night" : "partly-cloudy"
    }

    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          
        let mailOptions = {
            from: 'ronnieweatherapp@gmail.com',
            to: row['email'],
            subject: emails[row['emailType']],
            text: "Tomorrow it will be " + [row['tempToday']] + " degrees and " + weather[row["icon"]] + " in " + row["city"]
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 

        });
      });
}

sendEmails(); 
