const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./settings.json').app;
const port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors())

app.listen(port, () => console.log('App listening on port ' + port));
module.exports = app;