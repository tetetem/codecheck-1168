var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('pg').verbose();
var db = "tcp://;

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
    if(req.body.title == undefined || req.body.description == undefined) {
      res.statusCode = 400;
      res.json({ message: "any" });
    } else {
      db.run('INSERT INTO projects(url, title, description) VALUES (?, ?, ?)',
        req.body.url,
        req.body.title,
        req.body.description
        , function(err) {
          if(err) {
            res.statusCode = 400;  
            res.json({ message: "any" });
          } else {
            res.statusCode = 200;
    res.json({id: this.lastID, url: req.body.url, title: req.body.title, description: req.body.description });
          }
        });
    }
  });

router.route('/projects/:id')
  .get(function(req, res) {
    db.all("SELECT id FROM projects WHERE id = ?", req.params.id , function(err, rows) {
      if(err){
        res.statusCode = 404;
      } else {
        if(rows.length == 0) {
          res.statusCode = 404;
        } else {
          res.statusCode = 200;
        }
      }
      res.json({ message: "any" });
    });
  })

  .delete(function(req, res) {
    db.all("SELECT id FROM projects WHERE id = ?", req.params.id , function(err, rows) {
      if(err){
        res.statusCode = 404;
      } else {
        if(rows.length == 0) {
          res.statusCode = 404;
        } else {
          db.run("DELETE FROM projects WHERE id = ?", req.body.id);
          res.statusCode = 200;
        }
      }
      res.json({ message: "any" });
    });
  })

      




    
