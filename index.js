'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Shoes = require('./shoesFactory');
// const router = require('./routes');
const ShoesAPI = require('./api/shoes-api');

const app = express();
const session = require('express-session');
const flash = require('express-flash');


// DB Setup
const {
    Pool
} = require('pg');
// Heroku pool
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:pass@127.0.0.1:5432/shoesdb';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const shoesInstance = Shoes(pool);
// const route = router(shoesInstance);
const shoeAPI = ShoesAPI(shoesInstance);





// app use
app.use(session({
    secret: 'Tshimugaramafatha'
}));
app.use(flash());
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


//routes
app.get('/api/shoes', shoeAPI.all);


const PORT = process.env.PORT || 3030;
//FIRE TO THE SERVER  
app.listen(PORT, function () {
    console.log('ShoeAPI app running on port : ', PORT)
});