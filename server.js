const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const db = require('./db');
require('dotenv').config();


const app = express();
const router = express.Router();

app.use(bodyParser.json()); // req.body
app.use(cookieParser());
const PORT = process.env.PORT || 3000;


app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

//to decode the data from url
app.use(express.urlencoded({extended:false}));


//to link image diectory
app.use(express.static(path.join(__dirname, 'public')));



// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');


//routes to select routes
app.use('/user', userRoutes);
app.use('/user/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 8080');
})