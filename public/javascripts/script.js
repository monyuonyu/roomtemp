//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		JQueri test
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
$(function()
{
	// いきなり文字の色を変える
   $(".hoge1").css("color","blue") 
});

$(function()
{
	// クリックされたら背景色を変える
   $(".hoge2").click(function()
   {
		$(this).css("background-color", "yellow")
   });
});

$(function()
{
	// クリックされたら隠す
   $(".hoge3").click(function() {
      $(this).hide(); 
   }); 
});

$(function()
{
	// クリックされたら増える
	$(".hoge4").click(function(){
		$(this).append("増えます^^")
	});
});

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		WebSocket (クライアント)
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// WebSocketサーバに接続
var ws = new WebSocket("ws://localhost:7777/");

// エラーが発生した場合に呼ばれる
ws.onerror = function(e){
	alert(e);
};

// コネクションが成功した場合に最初の一回呼ばれる
ws.onopen = function(){
	//alert("WebSocket connect OK!!")
	
	// クライアント側での console.log() はブラウザのデベロッパーツールのコンソールを見ればわかる
	console.log("WebSocket connect OK!!");
	$(".ws_test").append("<p>", "WebSocket connect OK!!", "</p>");

	// nodeへWebSocketからHelloを送信
	ws.send(JSON.stringify({
	  hoge:"hello!! I'm a Browser"
	}));
	
};

// メッセージをサーバから受信した場合に逐次呼ばれる
ws.onmessage = function(event){
	var JSON_data = JSON.parse(event.data);
	console.log(event);
	//alert("websocket onmessage!!", event.data);
	
	// ws_testクラスへhtmlを追記してゆく
	$(".ws_test").append("<p>", "id = ",JSON_data.id, " temp = ", JSON_data.temp, "</p>");
	
};

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//		グラフ表示 TEST {highcharts というグラフ表示javascriptライブラリ}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■s
var chart;
$(document).ready(function () {

	// MongoDBから情報をグラフに反映(nodeからejsへ受け渡されたdocsデータ)


    //グラフのオプションを設定
    chart = new Highcharts.Chart({
        
        chart: {
            //グラフ表示させるdivをidで設定
            renderTo: 'container',
            //グラフ右側のマージンを設定
            marginRight: 140,
            //グラフ左側のマージンを設定
            marginBottom: 40
        },
        //グラフのタイトルを設定
        title: {
            text:  "月別売上高(棒グラフ)"
        },
        //x軸の設定
        xAxis: {
            title: {
                text: '(月)'
            },
            //x軸に表示するデータを設定
            categories:["2011年1月", "2011年2月", "2011年3月", "2011年4月", "2011年5月", "2011年6月", "2011年7月", "2011年8月", "2011年9月", "2011年10月", "2011年11月"],
            //小数点刻みにしない
            allowDecimals: false
        },
        //y軸の設定
        yAxis: [{
            title: {
                //タイトル名の設定
                text: "売上",
                style: {
                   //タイトルの色を設定
                   color: '#4572A7',
                }
            },
            //y軸の表記設定
            labels: {
	            formatter: function() {
　　　　	        return (this.value / 1000 + "千円");
　　　　	    }
            },
            //小数点刻みにしない
            allowDecimals: false,
            //最大値を設定
            max: 6000,
            //最小値を設定
            min: 0
        }],
        //グラフにマウスオーバーすると出てくるポップアップの表示設定
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
						this.x + ': ' + this.y + "円";
            }
        },
        //凡例の設定
        legend: {
            //凡例が縦に並ぶ
            layout: 'vertical',
            //凡例の横位置
            align: 'right',
            //凡例の縦位置
            verticalAlign: 'top'
        },
        //グラフデータの設定
        series: [{
            //名前を設定
            name: "売上",
            //色の設定
            color: '#000000',
            //グラフタイプの設定(column：棒グラフ)　pie：円グラフ　line:折れ線グラフ
            type: 'line',
            //x,y軸の設定
            data: [3597 ,3395 ,3228, 3107, 3046, 3102 ,3320, 3657, 4069, 4353, 4406]
        }]
    });
});
