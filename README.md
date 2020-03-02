# weather-app
An app that emails all users tomorrow's weather according to this specification https://www.klaviyo.com/weather-app

Before doing anything, clone the repository and run the command "node weatherCreator.js" in the directory to initialize the database weather with tables cities and users. 

To be able to use the website (located at public/index.html) for submitting an email to the database, you must have a server running. Running the command "node server.js" should be allow you to view the 100-most populous cities in the US and submit emails to the user table in the database. 

To update the weather for each city in cities tomorrow, run "node weatherUpdate.js"

To send emails to every user in users, run node "emailer.js"
