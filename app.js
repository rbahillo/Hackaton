
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//New Code
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('localhost:27017/test');

var server = new mongo.Server("127.0.0.1", 27017, {});

//obtenemos la base de datos de prueba que creamos
var db = new mongo.Db('test', server, {})
var collection;
db.open(function (error, client) {
	if (error) throw error;
	collection = new mongo.Collection(client, 'usercollection');
})


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); 


/* Starts serving html */ 
app.engine('html', require('ejs').renderFile);

app.get('/demo', function (req, res)
{
    res.render('demo.html');
});

app.get('/Send', function(req, res){ // Specifies which URL to listen for
	console.log(req.query.alias);
	
	  newstuff = [{ "alias" : req.query.alias, "email" : req.query.email , "score" : req.query.score}]
	  collection.find({email: newstuff[0].email}).toArray( function(err, results){
		  user = results[0];
		  if(user!=null){
			  if(user.best<newstuff[0].score){
				  user.best=newstuff[0].score
			  }
			  
			  user.total=parseInt(user.total)+parseInt(newstuff[0].score)
			  console.log(user);
			  collection.save(user, {w: 1}, function(err, records){
				   docs = collection.find().sort({best:-1}).toArray(function(e,docs){
					   res.json(docs);
				   });
				    });
		  }
		  else{
			  user = {}
			  user.alias=newstuff[0].alias
			  user.email=newstuff[0].email
			  user.best=newstuff[0].score
			  user.total=newstuff[0].score
			  collection.insert(user, {w: 1}, function(err, records){
				  docs = collection.find().sort({best:-1}).toArray(function(e,docs){
					  	res.json(docs);
					   });
					    });
		  }
			   
			  
	  });
	  //var collection = new mongo.Collection(client, 'usercollection');
	});

app.get('/bestResults', function (req, res)
		{
			var collection = db.get('usercollection');
			collection.find({},{},function(e,docs){
		        res.render('userlist', {
		            "userlist" : docs
		        });
		    });
		});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
