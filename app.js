'use strict';

const express = require('express');
const tus = require('tus-node-server');
const path = require('path');

const app = express();
const server = new tus.Server();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'assets')));

// A bucket is a container for objects (files).
const projectId = process.env.GCLOUD_PROJECT_ID;
const bucket = process.env.GCLOUD_STORAGE_BUCKET;
// [END config]

server.datastore = new tus.GCSDataStore({
    path: '/uploads',
    projectId: projectId,
    keyFilename: 'keyfile.json',
    bucket: bucket,
});

app.all('/uploads/*', function(req, res) {
    console.log(req);

    server.handle(req, res);
});


app.get('/', function(req, res, next){
    res.render('index');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
