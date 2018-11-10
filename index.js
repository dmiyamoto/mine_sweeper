const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// 初期ステータス一覧
var init_state = {
  map: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  player: {
    one: "",
    two: "",
    oneID:"",
    twoID:"",
    roomName: ""
  },
  score:{
    one: "",
    two: ""
  }
};

const COLS = 10, ROWS = 10;  // 横10、縦10マス 

var state = {}; // 試合中の情報
var play_flg = false; //試合中か否かの判定フラグ
var final_flg = false; //試合終了したか否かの判定フラグ
var x = 0; //座標取得用変数のCOLS用
var y = 0; //座標取得用変数のROWS用

var calcX;
var calcY;
var calcXY;

var msg; // メッセージ用変数

// 開く箇所周囲の爆弾有無チェック用配列
const directions = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0]
]

// ルーム管理
var roomA = [];

app.use('/js',express.static(__dirname + '/js'));

app.get('/' , function(req, res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/prepare' , function(req, res){
  var room = req.query;
  var flag_room = false;
	    switch (room['opval']){
	        case 'roomA':
	            if(roomA.length < 2){
	            	var detail = {id:room['id'], player:room['player'], roomName:room['optxt']};
	              roomA.push(detail);
	            }else{
	              flag_room = true;
	            }
	            break;
	    }
	(flag_room) ? msg = 'その部屋は他のプレーヤーが対戦中です。' : msg = room['player'] + "が、" + room['optxt'] + "に入室しました";

  res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.json(msg);
});

app.get('/play' , function(req, res){
  if((roomA.length === 2) && (play_flg === false)){
    play_flg = true;
    state = Object.assign({},init_state);

    for(var i = 0; i < ROWS; i++){
      state['map'][i][Math.floor(Math.random() * 10)] = {opened:false, hasBom:true, numBom:"", hasFlag:false};
    }

    state['player']['one'] = roomA[0]['player'];
    state['player']['two'] = roomA[1]['player'];
    state['player']['oneID'] = roomA[0]['id'];
    state['player']['twoID'] = roomA[1]['id'];
    state['player']['roomName'] = roomA[0]['roomName'];
    msg = '試合が開始しましたので、よろしくお願いします。';
  }else if(play_flg){
    msg = '既に試合中です。';
  }else{
    msg = 'まだ対戦相手がいないので、試合開始できません。';
  }

  res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.json(msg);
});

app.get('/set' , function(req, res){
  var data = req.query;
  if((play_flg === true) && (final_flg === false)){ // 試合中なら操作を可能とする
		// y座標を取得
		y = data['y'];
    for(var i = 0; i < ROWS; i++){
      y = y - 50;
      if(y < 0){
        calcY = i;
        break;
      }
    }
    // x座標を取得
    x = data['x'];
    for(var s = 0; s < COLS; s++){
      x = x - 50;
      if(x < 0){
        calcX = s;
        break;
      }
    }

    // 対象座標の箇所を判定・処理
    if(state['map'][calcY][calcX] === 0){
      // 所定の箇所を開き、その周囲に爆弾が無いかチェックしてオープンする。
      var counter = 0;
      for(var h = 0; h < directions.length; h++){
        var tmp2X = calcX - directions[h][0];
        var tmp2Y = calcY - directions[h][1];
        if((tmp2X >= 0) && (tmp2X < COLS) && (tmp2Y >= 0) && (tmp2Y < ROWS) && (state['map'][tmp2Y][tmp2X] !== 0)){
          (state['map'][tmp2Y][tmp2X]['hasBom'])? counter = counter + 1 : counter = counter;
        }
      }
      (counter !== 0)? state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:counter, hasFlag:false} : state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:"", hasFlag:false};
      judge(calcY, calcX);      
    }else if(state['map'][calcY][calcX]['opened']){
      msg = 'その場所は、既に開いています。';
      res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.json(msg);
    }else if(state['map'][calcY][calcX]['hasBom']){
      final_flg = true;
      (state['player']['oneID'] === data['id']) ? msg = '爆弾に引っかかったので、' + state['player']['one'] + 'さんの負けになります。' : msg = '爆弾に引っかかっ他ので、' + state['player']['two'] + 'さんの負けになります。';
      res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.json(msg);
    }

  }else if((play_flg === false) && (final_flg === false)){
    msg = 'まだ試合中では無いので操作できません。';
    res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.json(msg);
  }else{
    msg = '試合は終了しました。再試合を希望される場合は当サイトを再度読み込んでください。';
    res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.json(msg);
  }

});

app.get('/draw' , function(req, res){
  res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.json(state['map']);
});

// 所定の箇所の周囲を判定し、開いていく関数
function judge(calcY, calcX){
  
  for(var p = 0; p < directions.length; p++){
    var tmpX = calcX - directions[p][0];
    var tmpY = calcY - directions[p][1];
    if((tmpX >= 0) && (tmpX < COLS) && (tmpY >= 0) && (tmpY < ROWS) && (state['map'][tmpY][tmpX] === 0)){
      var counter = 0;
      for(var g = 0; g < directions.length; g++){
        var tmp2X = tmpX - directions[g][0];
        var tmp2Y = tmpY - directions[g][1];
        if((tmp2X >= 0) && (tmp2X < COLS) && (tmp2Y >= 0) && (tmp2Y < ROWS) && (state['map'][tmp2Y][tmp2X] !== 0)){
          (state['map'][tmp2Y][tmp2X]['hasBom'])? counter = counter + 1 : counter = counter;
        }
      }
      (counter !== 0)? state['map'][tmpY][tmpX] = {opened:true, hasBom:false, numBom:counter, hasFlag:false}:state['map'][tmpY][tmpX] = {opened:true, hasBom:false, numBom:"", hasFlag:false};
    }
  }

}

app.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});