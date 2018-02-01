var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	multer = require('multer');

var app = express();

app.set('view engine','ejs');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req,res){
	res.render('index');
})

var storage = multer.diskStorage({
	destination: function(req,file,callback){
		callback(null, './uploads');
	},
	filename: function(req,file,callback){
		console.log(file);
		callback(null, file.fieldname +"-"+ Date.now() + path.extname(file.originalname));
	}
})

app.post('/', function(req,res){
	var upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname)
			if (ext !== '.mp4' && ext !== '.mkv' && ext !== '.3gp' && ext !== '.wmv' && ext!=='.avi') {
				return callback(res.end('Only videos of format:{mp4, mkv, 3gp, wmv, avi} are allowed'), null)
			}
			callback(null, true)
		}
	}).single('userFile');

	console.log(upload.size);
	upload(req,res, function(err){
		if(err) throw err;
		res.end('File is uploaded');
	})
	// res.send(upload);
})

app.listen(app.get('port'), function(err){
	if(err) throw err;
	console.log('App is connected...');
})
