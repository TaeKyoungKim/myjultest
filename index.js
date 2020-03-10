var express = require('express');
var bodyParser = require('body-parser');
var dot = require('dotenv')
var app = express();
var apiRouter = require('./routes/index')

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'))
const mysql = require('mysql')

dot.config();

var db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})

app.use('/',apiRouter)

// app.post('/', function (req, res, next) {
//     var userId = req.body['userId'];
//     var userPw = req.body['userPw'];
//     db.query('select * from test_user where id=\'' + userId + '\' and pw=\'' + userPw + '\'', function (err, rows, fields) {
//         if (!err) {
//             if (rows[0]!=undefined) {
//                 res.send('id : ' + rows[0]['id'] + '<br>' +
//                     'pw : ' + rows[0]['pw']);
//             } else {
//                 res.send('no data');
//             }

//         } else {
//             res.send('error : ' + err);
//         }
//     });
// });

app.listen(3001 , ()=>{
    console.log("Start@@")
})

