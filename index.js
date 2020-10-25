const path = require('path');
const express = require('express');

const config = require('./config.json');

const app = express();

app.use('/res', express.static(path.join(__dirname, 'public/res')));
app.use('/info', require('./routers/resource.router'));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/conf', async (req, res) => {
    res.status(200).send(config);
});

app.listen(8080, () => {
    console.log('Listening to port 8080');
});