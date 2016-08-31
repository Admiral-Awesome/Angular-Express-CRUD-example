var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var winston = require('winston');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
 

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser());
app.use(methodOverride());
app.use("/js", express.static(__dirname + '/js'));
app.use("/views", express.static(__dirname + '/views'));
app.use("/css", express.static(__dirname + '/css'));
var connection = mongoose.connect('mongodb://localhost:27017/');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});
var router = express.Router(); 
var schema = new mongoose.Schema({ name: 'string', weight: 'string', func : 'string' });
var items = mongoose.model('item', schema);
mongoose.Promise = global.Promise;

router.route('/items')
    .post(function(req, res) {
        
        var item = new items({name : req.body.name, weight : req.body.weight, func : req.body.func});   
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json(item);
            
        });
        
    }).get(function(req, res) {
        items.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });
    });
router.route('/items/:items_id')
    .get(function(req, res) {
        items.findById(req.params.items_id, function(err, item) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json(item);
        });
    }).put(function(req, res) {

        
        items.findById(req.params.items_id, function(err, item) {

            if (err)
                res.send(err);

            item.name = req.body.name;  
            item.weight = req.body.weight;  
            item.func = req.body.func;  
            
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'item updated!' });
            });

        })
    }).delete(function(req, res) {
        console.log(req.params);
        items.remove({
            _id: req.params.items_id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });;
app.get('/', function (req, res) {
  res.sendFile(__dirname + "\\index.html");
  
});

app.use('/api', router);



app.listen(3000, function () {
  console.log('app listening on port 3000!');
});


