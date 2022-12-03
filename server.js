var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
const { rmSync } = require('fs');
var connection = mysql.createConnection({
	host: '34.172.131.38',
	user: 'root',
	password: 'pwd123',
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
app.get('/', function (req, res) {
	res.render('index', { title: 'Select All' });
});

app.get('/success', function (req, res) {
	console.log(req.body);
	res.send({ 'message': 'Success' });
});

// this code is executed when a user clicks the form submit button
app.get('/selectcourses', function (req, res) {
	var sql = `SELECT * FROM Courses LIMIT 10;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
		res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
	});
});

app.post('/insertuser', function (req, res) {
	console.log("Insert user");
	var sql = `INSERT INTO Users VALUES ("${req.body.userid}", "${req.body.password}", "${req.body.username}");`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
	});
});

app.post('/deleteuser', function (req, res) {
	console.log("Delete user");
	var sql = `DELETE FROM Users WHERE userid = "${req.body.userid}" AND password = "${req.body.password}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
	});
});

app.post('/updateuser', function (req, res) {
	console.log("Update user password");
	var sql = `UPDATE Users SET password = "${req.body.newpassword}" WHERE userid = "${req.body.userid}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
	});
});

app.post('/searchcourses', function (req, res) {
	console.log("Search Courses");
	var sql = `SELECT * FROM Courses WHERE subject = "${req.body.sname}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
		res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
	});
});

app.post('/searchusers', function (req, res) {
	console.log("Search Users");
	var sql = `SELECT * FROM Users WHERE userid = "${req.body.userid}";`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
		res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
	});
});

app.post('/selectavggpa', function (req, res) {
	console.log("Select AVG GPA");
	var sql = `SELECT DISTINCT subject, courseNo, ROUND(AVG(avgGPA), 3) AS avgGPA FROM Courses WHERE YearTerm IN (SELECT YearTerm FROM Courses WHERE YearTerm LIKE '%2021%') GROUP BY Subject, courseNo;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}

		console.log(result);
		res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
	});
});

app.post('/selectadvanced', function (req, res) {
        console.log("Select Advanced");
        var sql = `CALL SelectBestFreshmanClasses();`;
        console.log(req.body);
        console.log(sql);
        connection.query(sql, function (err, result) {
                if (err) {
                        res.send(err)
                        return;
                }

                console.log(result);
                res.render('redirect.ejs', { res: JSON.stringify(result, null, '\t') });
        });
});

app.post('/selectsubavggpa', function (req, res) {
        console.log("Select Subject AVG GPA");
        var sql1 = `CALL SubjectAvgGPA();`;
	var sql2 = 'SELECT subject, AVG(subAvgGPA) from SubjectAvgGPA GROUP BY subject;';
        console.log(req.body);
        connection.query(sql1, function (err, result) {
                if (err) {
                        res.send(err)
                        return;
                }

                console.log(result);
        });

	connection.query(sql2, function (err, result) {
                if (err) {
                        res.send(err)
                        return;
                }

                console.log(result);
                res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
        });
});

app.get('/selectmaxgpa', function (req, res) {
	const fs = require('fs');
	console.log("Select MAX GPA");
	var sql = `SELECT DISTINCT c.subject, c.courseNo, ROUND(MAX(avgGPA), 2) AS HighestGPA FROM (SELECT * FROM Courses WHERE courseNo Like '1%' AND YearTerm Like '%2021%') c GROUP BY c.Subject, c.courseNo HAVING HighestGPA > 3.75;`;
	console.log(req.body);
	console.log(sql);
	connection.query(sql, function (err, result) {
		if (err) {
			res.send(err)
			return;
		}
		// var input = document.getElementById("display");
		// input.value = result;
		// res.render('redirect.ejs', { res: JSON.stringify(result, null, '\t')});

		console.log(result[0]);
		res.render('redirect.ejs', { res: JSON.stringify(result, null, 45) });
		// var jsonContent = JSON.stringify(result);
		// fs.writeFile("views/output.json", jsonContent, 'utf8', function (err) {
		// 	if (err) {
		// 		console.log("An error occured while writing JSON Object to File.");
		// 		return console.log(err);
		// 	}

		// 	console.log("JSON file has been saved.");
		// }); KEEP THIS MAYBE

		// res.render('redirect.ejs', { res: JSON.stringify(result[1])});
		// res.render('redirect.ejs');
		// res.render('redirect.ejs', { res: result });
	});
});

// app.get('/selectmaxgpa', function (req, res) {

// 	var sql = `SELECT DISTINCT c.subject, c.courseNo, ROUND(MAX(avgGPA), 2) AS HighestGPA FROM (SELECT * FROM Courses WHERE courseNo Like '1%' AND YearTerm Like '%2021%') c GROUP BY c.Subject, c.courseNo HAVING HighestGPA > 3.75;`;
// 	// 	console.log(req.body);

// 	connection.query(sql, function (err, result) {
// 		if (err) {
// 			res.send(err)
// 			return;
// 		}

// 		console.log(result);
// 		var name = result;
// 		res.render('redirect', { name: name });
// 	});
// });

app.listen(80, function () {
	console.log('Node app is running on port 80');
});
