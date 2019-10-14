var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var rowsCopy = [];
var arrOne = [];

app.set('view engine', 'ejs');

var connected = mysql.createConnection({
  host: '34.65.160.241',
  sockePath: 'cloudlabs-254110:europe-west6:db-for-lab',
  user: 'besh',
  password: '',
  database: 'waterinfo'
});

connected.connect(function(error) {
  if(!!error) {
    console.log('Error' + error);
  } else {
    console.log('Connected');
  }
});

app.get('/form', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/water', function(req, res) {

  connected.query("SELECT * FROM measurements", function(error, rows, fields){
    if(!!error) {
      console.log('Error in the query' + error);
    } else {
      console.log('Seccessful query\n');

      rows.forEach(function(element) {
        arrOne.push(element['cityName']);
        arrOne.push(element['coordinates']);
        arrOne.push(element['waterLevel']);
        arrOne.push(element['date']);
        rowsCopy.push(arrOne);
        arrOne = [];
      });

      res.render('water', {row: rowsCopy});
    }


  });

  rowsCopy = [];
});

app.post('/form', urlencodedParser, function(req, res){
  connected.query(`INSERT INTO measurements(cityName, coordinates, waterLevel,
    date) VALUES('${req.body.cityName}', '${req.body.coordinates}',
    '${req.body.waterLevel}', '${req.body.date}')`)
  console.log(req.body);
  res.sendFile(__dirname + "/index.html");
});

app.listen(1337);
