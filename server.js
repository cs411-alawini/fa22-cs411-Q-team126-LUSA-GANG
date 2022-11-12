var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.172.131.38',
                user: 'root',
                password: 'lusa123',
                database: 'PassOrFail'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
	res.render('index', { title: 'Select All' });
});

app.get('/success', function(req, res) {
	console.log(req.body);
	res.send({'message': 'Success'});
});
 
// this code is executed when a user clicks the form submit button
app.get('/selectcourses', function(req, res) {   
	var sql = `SELECT * FROM Courses LIMIT 10;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/insertuser', function(req, res) {   
	console.log("Insert user");
	var sql  = `INSERT INTO Users VALUES ("${req.body.userid}", "${req.body.password}", "${req.body.username}");`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/deleteuser', function(req, res) {   
	console.log("Delete user");
	var sql  = `DELETE FROM Users WHERE userid = "${req.body.userid}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/updateuser', function(req, res) {   
	console.log("Update user");
	var sql  = `UPDATE Users SET userid = "${req.body.newuserid}" WHERE userid = "${req.body.curruserid}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/searchcourses', function(req, res) {   
	console.log("Search Courses");
	var sql  = `SELECT * FROM Courses WHERE subject = "${req.body.sname}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/searchusers', function(req, res) {   
	console.log("Search Users");
	var sql  = `SELECT * FROM Users WHERE userid = "${req.body.userid}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/selectavggpa', function(req, res) {   
	console.log("Select AVG GPA");
	var sql  = `SELECT DISTINCT subject, courseNo, ROUND(AVG(avgGPA), 3) AS avgGPA FROM Courses WHERE YearTerm IN (SELECT YearTerm FROM Courses WHERE YearTerm LIKE '%2021%') GROUP BY Subject, courseNo;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.post('/selectmaxgpa', function(req, res) {   
	console.log("Select MAX GPA");
	var sql  = `SELECT DISTINCT c.subject, c.courseNo, ROUND(MAX(avgGPA), 2) AS HighestGPA FROM (SELECT * FROM Courses WHERE courseNo Like '1%' AND YearTerm Like '%2021%') c GROUP BY c.Subject, c.courseNo HAVING HighestGPA > 3.75;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function(err, result) {
	if (err) {
		res.send(err)
		return;
	}
	
	console.log(result);
	res.send(result);
	});
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});
