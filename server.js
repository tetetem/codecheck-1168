var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var db = process.env.DATABASE_URL || "postgres://qcgffoigvaopwm:uPpXEcKghEWSXsJSkvmoyv_ESh@ec2-54-83-198-159.compute-1.amazonaws.com:5432/d1k38il97kqurk?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function(req, res, next) {
  next();
});

router.get('/', function(req, res){
  res.json({ test: "test"});
});

app.use('/api', router);

app.listen(port);    

router.route('/projects')
  .get(function(req, res) {
    res.statusCode = 200;
    res.json({ message: "any" });
  })

  .post(function(req, res) {
    console.log("req: "+req);
    if(req.body.title == undefined || req.body.description == undefined) {
      res.statusCode = 400;
      console.log("title or description undefined");
      res.json({ message: "any" });
    } else {
      pg.connect(db, function(err, client) {
        console.log("sucessfully connected");
        var qs = ("INSERT INTO projects(url, title, description) VALUES (" + "$$" +
        req.body.url + "$$, $$" +
        req.body.title + "$$, $$" +
        req.body.description + "$$);");
        client.query(qs, function(error, result) {
          if(error) {
            console.log(error);
            res.statusCode = 400;  
            res.json({ message: "any" });
          } else {
            res.statusCode = 200;
            client.query('SELECT LASTVAL()', function(error, result) {
              res.json({id: Number(result.rows[0].lastval), url: req.body.url, title: req.body.title, description: req.body.description });
            });
          }
        });
      });
    }
  });

router.route('/projects/:id')
  .get(function(req, res) {
    pg.connect(db, function(err, client) {
      var qs = ("SELECT id FROM projects WHERE id = " + req.params.id + ";");
      client.query(qs, function(error, result) {
        if(error) {
          res.statusCode = 404;  
        } else {
          if(result.rows.length == 0){
            res.statusCode = 404;
          } else
          {
            res.statusCode = 200;
          }
        }
        res.json({ message: "any" });
      });
    });
  })

  .delete(function(req, res) {
    pg.connect(db, function(err, client) {
      var qs = ("SELECT id FROM projects WHERE id = " + req.params.id +";" );
      client.query(qs, function(error, result) {
        if(error) {
          res.statusCode = 404;  
        } else {
          if(result.rows.length == 0) {
            res.statusCode = 404;  
          } else {
            var q = ("DELETE FROM projects WHERE id = "+ req.params.id);
            res.statusCode = 200;
            client.query(q);
          }
        }
        res.json({ message: "any" });
      });
    });
  })

      

