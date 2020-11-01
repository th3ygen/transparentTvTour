const path = require('path');
const express = require('express');

const config = require('./config.json');
const pins = require('./pins.json');

const app = express();

app.use('/res', express.static(path.join(__dirname, 'res')));
app.use('/info', require('./routers/resource.router'));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/conf', async (req, res) => {
    res.status(200).send(config);
});
app.get('/pins', async (req, res) => {
    res.status(200).send(pins);
});

app.listen(8080, () => {
    console.log('Listening to port 8080');
});