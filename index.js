const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

// 初期ステータス一覧
var init_state = {
  map: [
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
    [{opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}, {opened:false, hasBom:false, numBom:"", hasFlag:false}],
  ],
  client: [
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
    [{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false},{opened:false}],
  ],
  player: {
    one: "",
    two: "",
    oneID:"",
    twoID:"",
    roomName: ""
  },
  flg_mode: {
    one: false,
    two: false
  },
  score:{
    one: 0,
    two: 0
  }
};

const COLS = 10, ROWS = 10;  // 横10、縦10マス 

var state = {}; // 試合中の情報
var play_flg = false; //試合中か否かの判定フラグ
var final_flg = false; //試合終了したか否かの判定フラグ
var next_flg = false; //再戦希望か否かの判定フラグ
var replay_flg = false; //再戦を受け入れたか否かの判定フラグ
var exit_flg = false; //対戦相手が退出したか否かの判定フラグ
var x = 0; //座標取得用変数のCOLS用
var y = 0; //座標取得用変数のROWS用

var calcX;
var calcY;

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
app.use('/img',express.static(__dirname + '/img'));

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

  (flag_room) ? msg = 'その部屋は他のプレーヤーが対戦中です。' : msg = "";

  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json(msg);
});

app.get('/restart' , function(req, res){
  var room = req.query;
  var reFlag = {flg:false, name:""};
  switch (room['opval']){
    case 'roomA':
      [...Array(roomA.length)].reduce((acc,c,idx) => ((roomA[idx]['id'] === room['id'])? reFlag = {flg:true, name:roomA[idx]['player']} : ""),"");
      (reFlag['flg']) ? msg = reFlag['name'] + "が、" + room['optxt'] + "に再入室しました" : msg = 'その部屋は他のプレーヤーが対戦中です。';
      res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
      res.json(msg);
      break;
  }
});

app.get('/flgmode' , function(req, res){
  var flgmode_data = req.query;
  if((state['player']['oneID'] === flgmode_data['id']) || (state['player']['twoID'] === flgmode_data['id'])){
    if(state['player']['oneID'] === flgmode_data['id']){
      (state['flg_mode']['one']) ? state['flg_mode']['one'] = false : state['flg_mode']['one'] = true;
      msg = {msg:"",flgmode:state['flg_mode']['one']};
    }else{
      (state['flg_mode']['two']) ? state['flg_mode']['two'] = false : state['flg_mode']['two'] = true;
      msg = {msg:"",flgmode:state['flg_mode']['two']};
    }
  }else{
    msg = {msg:'対戦中のプレーヤーでは無い人物の操作を検知したので試合終了します。',flgmode:""};
    final_flg = true;
  }
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json(msg);
});

app.get('/play' , function(req, res){
  if((roomA.length === 2) && (play_flg === false)){
    play_flg = true;
    //オブジェクトを初期化（初回用）
    state = Object.assign({},init_state);
    
    //オブジェクトを初期化（２周目以降用）
    for(var k = 0; k < ROWS; k++){
      for(var c = 0; c < COLS; c++){
        state['map'][k][c]['opened'] = false;
        state['map'][k][c]['hasBom'] = false;
        state['map'][k][c]['numBom'] = false;
        state['map'][k][c]['hasFlag'] = false;
        state['client'][k][c]['opened'] = false;
        if(state['client'][k][c]['numBom'] !== undefined){
          delete state['client'][k][c]['numBom'];
          delete state['client'][k][c]['hasFlag'];
        }
      }
    }
    state['flg_mode']['one'] = false;
    state['flg_mode']['two'] = false;
    state['score']['one'] = 0;
    state['score']['two'] = 0;

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

  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json(msg);
});

app.get('/nextplay' , function(req, res){
  next_flg = true;
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json("");
});

app.get('/nextstatus' , function(req, res){
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json({flg:next_flg});
});

app.get('/nextstart' , function(req, res){
  //初期化
  for(var k = 0; k < ROWS; k++){
    for(var c = 0; c < COLS; c++){
      state['map'][k][c]['opened'] = false;
      state['map'][k][c]['hasBom'] = false;
      state['map'][k][c]['numBom'] = false;
      state['map'][k][c]['hasFlag'] = false;
      state['client'][k][c]['opened'] = false;
      if(state['client'][k][c]['numBom'] !== undefined){
        delete state['client'][k][c]['numBom'];
        delete state['client'][k][c]['hasFlag'];
      }
    }
  }
  state['flg_mode']['one'] = false;
  state['flg_mode']['two'] = false;
  state['score']['one'] = 0;
  state['score']['two'] = 0;
  
  final_flg = false;
  next_flg = false;
  replay_flg = true;

  for(var i = 0; i < ROWS; i++){
    state['map'][i][Math.floor(Math.random() * 10)] = {opened:false, hasBom:true, numBom:"", hasFlag:false};
  }

  state['player']['one'] = roomA[0]['player'];
  state['player']['two'] = roomA[1]['player'];
  state['player']['oneID'] = roomA[0]['id'];
  state['player']['twoID'] = roomA[1]['id'];
  state['player']['roomName'] = roomA[0]['roomName'];
  msg = "試合が開始しますので、よろしくお願いします。"
  
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json(msg);
});

app.get('/exit' , function(req, res){
  var exitData = req.query
  
  for(var k = 0; k < ROWS; k++){
    for(var c = 0; c < COLS; c++){
      state['map'][k][c]['opened'] = false;
      state['map'][k][c]['hasBom'] = false;
      state['map'][k][c]['numBom'] = false;
      state['map'][k][c]['hasFlag'] = false;
      state['client'][k][c]['opened'] = false;
      if(state['client'][k][c]['numBom'] !== undefined){
        delete state['client'][k][c]['numBom'];
        delete state['client'][k][c]['hasFlag'];
      }
    }
  }
  if(state['player']['oneID'] === exitData['id']){
    state['player']['one'] = "";
    state['player']['oneID'] = "";
  }else{
    state['player']['two'] = "";
    state['player']['twoID'] = "";
  }
  state['flg_mode']['one'] = false;
  state['flg_mode']['two'] = false;
  state['score']['one'] = 0;
  state['score']['two'] = 0;
  
  play_flg = false;
  final_flg = false;
  next_flg = false;
  exit_flg = true;
  
  for(var s = 0; s < roomA.length; s++){
    (roomA[s]['id'] === exitData['id']) ? roomA.splice(s, 1) : "";
  }
  
  msg = "";
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json(msg);
});

app.get('/nextwait' , function(req, res){
  if(exit_flg){
    exit_flg = false;
    msg = "対戦相手が退出しました。新しい対戦相手が入室してくるまでお待ちください。"
    res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.json({msg:msg,flg:'exit'});
  }else if(replay_flg){
    replay_flg = false;
    msg = "対戦相手が再戦を受け入れましたので再試合が開始します。\nよろしくお願いします。"
    res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.json({msg:msg,flg:'replay'});
  }else{
    msg = ""
    res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.json({msg:msg,flg:""});
  }
});

app.get('/status' , function(req, res){
  var data = [];
  for(var a = 0; a < roomA.length; a++){
    data.push(roomA[a]['player'] + "が、" + roomA[a]['roomName'] + "に入室しました");
  }
  msg = data;
  (play_flg) ? msg = '試合が開始しましたので、よろしくお願いします。' : "";  
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json({msg:msg,flg:play_flg});
});

app.get('/set' , function(req, res){
  var data = req.query;
  // 試合中かつ対象のプレイヤーなら、操作を可能とする
  if( (play_flg) && (final_flg === false) && ((data['id'] === state['player']['oneID']) || (data['id'] === state['player']['twoID'])) ){
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
    if((state['map'][calcY][calcX]['opened'] === false) && (state['map'][calcY][calcX]['hasBom'] === false)){
      // 所定の箇所を開き、その周囲に爆弾が無いかチェックしてオープンする。
      var counter = 0;
      for(var h = 0; h < directions.length; h++){
        var tmp2X = calcX - directions[h][0];
        var tmp2Y = calcY - directions[h][1];
        if((tmp2X >= 0) && (tmp2X < COLS) && (tmp2Y >= 0) && (tmp2Y < ROWS) && (state['map'][tmp2Y][tmp2X] !== 0)){
          (state['map'][tmp2Y][tmp2X]['hasBom'])? counter = counter + 1 : counter = counter + 0;
        }
      }

      if(state['player']['oneID'] === data['id']){
        if(state['flg_mode']['one']){
          // 該当箇所を開き、対象プレーヤーから得点を減算する(間違った箇所にフラグを立てているため)
          (counter !== 0) ? state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:counter, hasFlag:true} : state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:"", hasFlag:true};
          (counter !== 0) ? state['client'][calcY][calcX] = {opened:true, hasFlag:true} : state['client'][calcY][calcX] = {opened:true, hasFlag:true};
          state['score']['one'] = state['score']['one'] - 1;
        }else{
          // 該当箇所を開き、対象プレーヤーに得点を加算し、周囲のマスを開く
          (counter !== 0) ? state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:counter, hasFlag:false} : state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:"", hasFlag:false};
          (counter !== 0) ? state['client'][calcY][calcX] = {opened:true, numBom:counter, hasFlag:false} : state['client'][calcY][calcX] = {opened:true, numBom:"", hasFlag:false};
          state['score']['one'] = state['score']['one'] + 1;
          judge(calcX, calcY, data['id']);
        }
      }else if(state['player']['twoID'] === data['id']){
        if(state['flg_mode']['two']){
          // 該当箇所を開き、対象プレーヤーから得点を減算する(間違った箇所にフラグを立てているため)
          (counter !== 0) ? state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:counter, hasFlag:true} : state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:"", hasFlag:true};
          (counter !== 0) ? state['client'][calcY][calcX] = {opened:true, hasFlag:true} : state['client'][calcY][calcX] = {opened:true, hasFlag:true};
          state['score']['two'] = state['score']['two'] - 1;
        }else{
          // 該当箇所を開き、対象プレーヤーに得点を加算し、周囲のマスを開く
          (counter !== 0) ? state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:counter, hasFlag:false} : state['map'][calcY][calcX] = {opened:true, hasBom:false, numBom:"", hasFlag:false};
          (counter !== 0) ? state['client'][calcY][calcX] = {opened:true, numBom:counter, hasFlag:false} : state['client'][calcY][calcX] = {opened:true, numBom:"", hasFlag:false};
          state['score']['two'] = state['score']['two'] + 1;
          judge(calcX, calcY, data['id']);
        }
      }
      msg = "";
    }else if((state['map'][calcY][calcX]['opened']) && (state['map'][calcY][calcX]['hasFlag'] === false)){
      msg = "";
    }else if((state['map'][calcY][calcX]['opened']) && (state['map'][calcY][calcX]['hasFlag']) && (state['map'][calcY][calcX]['hasBom'] === false)){
      if((state['player']['oneID'] === data['id']) && (state['flg_mode']['one'])){
        state['map'][calcY][calcX] = {opened:false, hasBom:false, numBom:"", hasFlag:false};
        state['client'][calcY][calcX] = {opened:false};
        state['score']['one'] = state['score']['one'] + 1;
      }else if((state['player']['twoID'] === data['id']) && (state['flg_mode']['two'])){
        state['map'][calcY][calcX] = {opened:false, hasBom:false, numBom:"", hasFlag:false};
        state['client'][calcY][calcX] = {opened:false};
        state['score']['two'] = state['score']['two'] + 1;
      }
      msg = "";
    }else if((state['map'][calcY][calcX]['opened']) && (state['map'][calcY][calcX]['hasFlag']) && (state['map'][calcY][calcX]['hasBom'])){
      if((state['player']['oneID'] === data['id']) && (state['flg_mode']['one'])){
        state['map'][calcY][calcX] = {opened:false, hasBom:true, numBom:"", hasFlag:false};
        state['client'][calcY][calcX] = {opened:false};
        state['score']['one'] = state['score']['one'] - 1;
      }else if((state['player']['twoID'] === data['id']) && (state['flg_mode']['two'])){
        state['map'][calcY][calcX] = {opened:false, hasBom:true, numBom:"", hasFlag:false};
        state['client'][calcY][calcX] = {opened:false};
        state['score']['two'] = state['score']['two'] - 1;
      }
      msg = "";
    }else if((state['map'][calcY][calcX]['opened'] === false) && (state['map'][calcY][calcX]['hasBom'])){
      if((state['player']['oneID'] === data['id']) && (state['flg_mode']['one'])){
        state['map'][calcY][calcX] = {opened:true, hasBom:true, numBom:"", hasFlag:true};
        state['client'][calcY][calcX] = {opened:true, hasFlag:true};
        state['score']['one'] = state['score']['one'] + 1;
        msg = "";
      }else if((state['player']['twoID'] === data['id']) && (state['flg_mode']['two'])){
        state['map'][calcY][calcX] = {opened:true, hasBom:true, numBom:"", hasFlag:true};
        state['client'][calcY][calcX] = {opened:true, hasFlag:true};
        state['score']['two'] = state['score']['two'] + 1;
        msg = "";
      }else{
        final_flg = true;
        (state['player']['oneID'] === data['id']) ? msg = '爆弾に引っかかったので、' + state['player']['one'] + 'さんの負けになります。' : msg = '爆弾に引っかかったので、' + state['player']['two'] + 'さんの負けになります。';
      }
    }

  }else if((play_flg === false) && (final_flg === false)){
    msg = 'まだ試合中では無いので操作できません。';
  }else{
    msg = '試合は終了しました。再試合を希望される場合は当サイトを再度読み込んでください。';
  }
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.json({msg:msg,flg:final_flg});

});

app.get('/draw' , function(req, res){
  var cnt = 0;
  // 爆弾が埋まっている数＋現在開いているマスの数を計測
  (play_flg)?[...Array(ROWS)].reduce((acc,c,idx) => ([...Array(COLS)].reduce((acc2,c2,idx2) => ((state['map'][idx][idx2]['opened']) ? cnt = cnt + 1 : cnt = cnt + 0),"")),""):"";
  res.set('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  if((cnt !== (COLS * ROWS)) && (final_flg === false)){
    res.json({msg:"", map:state['client']});
  }else if((cnt !== (COLS * ROWS)) && (final_flg)){
    res.json({msg:'対戦相手が爆弾に引っかかったので、あなたの勝利です。', map:state['client']});
  }else{
    final_flg = true;
    var part = '  ' + state['player']['one'] + 'さん：' + state['score']['one'] + '点\n  ' + state['player']['two'] + 'さん：' + state['score']['two'];
    if(state['score']['one'] === state['score']['two']){
      res.json({msg:'この勝負は引き分けになります。\n' + part});
    }else if(state['score']['one'] > state['score']['two']){
      res.json({msg:state['player']['one'] + 'さんの勝利です。\n' + part});
    }else{
      res.json({msg:state['player']['two'] + 'さんの勝利です。\n' + part});
    }
  }
});

// 所定の箇所の周囲を判定し、開いていく関数
function judge(calcX, calcY, playerID){
  for(var p = 0; p < directions.length; p++){
    var tmpX = calcX - directions[p][0];
    var tmpY = calcY - directions[p][1];
    if((tmpX >= 0) && (tmpX < COLS) && (tmpY >= 0) && (tmpY < ROWS) && (state['map'][tmpY][tmpX]['opened'] === false) && (state['map'][tmpY][tmpX]['hasBom'] === false)){
      var counter = 0;
      for(var g = 0; g < directions.length; g++){
        var tmp2X = tmpX - directions[g][0];
        var tmp2Y = tmpY - directions[g][1];
        if((tmp2X >= 0) && (tmp2X < COLS) && (tmp2Y >= 0) && (tmp2Y < ROWS)){
          (state['map'][tmp2Y][tmp2X]['hasBom'])? counter = counter + 1 : counter = counter + 0;
        }
      }
      // 該当箇所を開き、対象プレーヤーに得点を加算
      (counter !== 0) ? state['map'][tmpY][tmpX] = {opened:true, hasBom:false, numBom:counter, hasFlag:false} : state['map'][tmpY][tmpX] = {opened:true, hasBom:false, numBom:"", hasFlag:false};
      (counter !== 0) ? state['client'][tmpY][tmpX] = {opened:true, numBom:counter, hasFlag:false} : state['client'][tmpY][tmpX] = {opened:true, numBom:"", hasFlag:false};
      (state['player']['oneID'] === playerID) ? state['score']['one'] = state['score']['one'] + 1 : state['score']['two'] = state['score']['two'] + 1 ;
    }
  }
}

app.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});