
/*
 * GET home page.
 */



exports.index = function(req, res){


//��������������������������������������������������������������������������������
//		mongoose �{����js�t�@�C���𕪂��ċL�q���ׂ��͂�
//��������������������������������������������������������������������������������
	var mongoose = require('mongoose');
	var User = mongoose.model('User');
	var data;

	var data2 = {
  		"supplies" : ["mop", "broom", "duster"],
 		"title" : "Title Test"
	};

	console.log("debug");
	console.log(data2);
	console.log(data);

	
	User.find({}, function(err, docs) {
		console.log(docs)
		for (var i=0, size=docs.length; i<size; ++i) {
			console.log("id:",docs[i].id, "temp", docs[i].temp);
		}
		//data = JSON.parse(JSON.stringify(docs));
		//data=100;

		// EJS�Ƀ����_�����O�˗��i�����ɒl�����邱�Ɓj
		res.render('index', {title:"ABABABABA!!", data:docs});

	});
	



};
