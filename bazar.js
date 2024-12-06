


const express = require('express');
const dotenv = require('dotenv');

const mongoose = require('mongoose');

const cors = require("cors")

const mainroutes = require('./routes/route')

const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require('path')


const app = express();

dotenv.config();

const port = process.env.PORT;

app.use('/uploads', express.static('uploads'))

// For testing
app.get('/', (req, res) => {
    res.send('API is working');
});


app.use(cors())
app.use(express.json());
app.use(mainroutes)



const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected');
    } catch (err) {
        console.error('MongoDB database connection failed', err);
    }
};







app.listen(port, () => {
    connect()
    console.log('Server is up on port ' + port)
})


// let filePath = path.join(__dirname, './cert.pem');
// const certificate = fs.readFileSync(filePath, 'utf8');
// let filePath1 = path.join(__dirname, './privatekey.pem');
// const pvtkey = fs.readFileSync(filePath1, 'utf8');
// const options = {
//     key: pvtkey,
//     cert: certificate,
// };
// https.createServer(options, app)
//     .listen(port, function (req, res) {
//         connect()
//         console.log("Server started at port https " + port);
//     });