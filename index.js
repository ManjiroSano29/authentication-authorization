require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const authentication = require('./routes/authentication');
const hmm = require('./routes/hmm');


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors());
app.use(cookieParser());

const mySecret = process.env['MONGO_URL'];
mongoose.connect(mySecret);

app.use('/', authentication);
app.use('/user', hmm);

app.listen(3000, () => {
  console.log('start');
});