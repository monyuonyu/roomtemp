
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		require 必要なmoduleの読み込み
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , nt = require('net')
  , mongoose = require('mongoose')
  , ws = require('websocket.io');


//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		express
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){

	//********************************************************************************
	//		mongoose find() sample
	//********************************************************************************
	User.find({}, function(err, docs) {
		console.log(docs)
		for (var i=0, size=docs.length; i<size; ++i) {
			console.log("id:",docs[i].id, "temp", docs[i].temp);
		}
	});

	console.log("Express server listening on port " + app.get('port'));
});

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		net
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// var roomtemp = function(id, temp){
	// this.id = id;
	// this.temp = temp;
// };

var buff = "";
var server_nt = nt.createServer(function(socket){
	socket.write("Hello!! from net module\r\n");
	console.log('connectid!!');

	// データ受信コールバック関数
	socket.on('data', function(data){
		//socket.write(data);
		if(data == ';')
		{
			socket.write("rcvdata = ");
			socket.write(buff);

			// ID:TEMP; の形式でデータが送られてくるとする 例 0:22;
			var data = buff.split(":");
			

			//********************************************************************************
			//		mongoose 受け取ったデータを保存処理
			//********************************************************************************
			// スキーマから実データを生成
			var user = new User();
			user.id  = data[0];
			user.temp = data[1];
			console.log("user", user);

			// 保存
			user.save(function(err) {
				if (err) { console.log(err); }
			});

			//********************************************************************************
			//		WebSocket 受け取ったデータをクライアントに送信
			//********************************************************************************
			// 受信したメッセージを全てのクライアントに送信する
			var snd_message = new function(){
				this.id = data[0];
				this.temp = data[1];
			};
			console.log("new data =", data);
			server_ws.clients.forEach(function(client) {
				console.log("in forEach", snd_message);
				var JSON_data = JSON.stringify(snd_message);
				client.send(JSON_data);
			});
			
			// 次のデータ受信のためにバッファをクリア
			buff = "";
		}
		else
		{
			buff += data;
		}
		
	});
});

// 待受開始
server_nt.listen(8888, function(){
	console.log('net is listen 8888 port');
});

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		WebSocket
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var server_ws = ws.listen(7777, function () {
	console.log('websocket is listen 7777 port');
});

// 新しいコネクションが来るたびに呼び出される
server_ws.on('connection', function(socket) {
	console.log('websocket Connected!!');
	
	// メッセージ受信コールバック関数
	socket.on('message', function(data){
		console.log('rcved message');
		var data = JSON.parse(data);
		console.log(data);
	});
});

// 受信したメッセージを全てのクライアントに送信する
//server.clients.forEach(function(client) {
//	client.send(data);
//});

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		Mongoose
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// スキーマ型の用意
var Schema   = mongoose.Schema;

// スキーマの生成
var UserSchema = new Schema({
  id:{type:String},
  temp:{type:String}
});

// モデルの結びつけ
mongoose.model('User', UserSchema);

// MongoDB接続
mongoose.connect('mongodb://localhost/sample_db');

// スキーマから実データを生成
var User = mongoose.model('User');
//var user = new User();
//user.id  = 1;
//user.point = 21;

// 保存
//user.save(function(err) {
//  if (err) { console.log(err); }
//});
