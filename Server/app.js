var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var debug = require('debug')('my-application');
var mongoose = require('mongoose');


// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('view engine', 'ejs');

app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(session({
		secret: settings.cookie_secret,
		store: new MongoStore({
				db: db_hw_session.db
		})
}));
*/
mongoose.connect('mongodb://localhost:27017/db_hw');

var Student = mongoose.model('Student',
{
  'stu_id':String,
	'name':String,
	'come':{
			type:Boolean,
			default:false,
		    required:true
	},
	'lock':{
			type:Boolean,
			default:false,
		    required:true
	}
});

//API

app.get('/api/getList' , function(req,res)
{
		Student.find(function (err,student)
		{
				if(err)
				  res.send(err);
				else
					res.json(student);
		});
});



app.post('/api/changeStudent/', function(req, res) {

	Student.findOne( {  stu_id:req.body.stu_id },function(err,student)
	{
			student.come=!student.come;
			// student.lock=true;  //when change from Web , lock the come status
			student.save();
			res.end("ok");
	});

});


// index Page
app.get("/", function(req,res)
{
  	res.sendfile("./public/index.html");
});


// Server Configure
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
	console.log("Server is listening on port:" + server.address().port);
	debug('Express server listening on port ' + server.address().port);
});


// Socket.IO configure
var io = require('socket.io').listen(server);
io.on('connection', function(socket){


});
