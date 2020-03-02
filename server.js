const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000

const getCities = require('./getCities')
const addUserToDB = require('./userExists')

app.get('/getCities', async (req, res) => res.send(await getCities()));
app.post('/addEmail', async (req, res) => res.send(await addUserToDB(req.body)));

app.listen(port, () => console.log(`Weather app listening on port ${port}!`))