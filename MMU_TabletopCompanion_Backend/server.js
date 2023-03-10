const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

//Server port
const {HTTP_PORT} = require('./app/lib/config');

//Initialise app
const app = express();
app.use(cors());

//Start server and listen
app.listen(HTTP_PORT, () => {
    console.log("Server listening on port: " + HTTP_PORT);
});

//Start logging with minimal output
app.use(morgan('tiny'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Root endpoint
app.get("/", (req, res, next) => {
    res.json({"status":"Alive"});
});

require('./app/routes/cards.routes')(app);
require('./app/routes/users.routes')(app);
require('./app/routes/decks.routes')(app);

//Default response/not found
app.use(function(req, res){
    res.sendStatus(404);
});

