/*
 現在の盤面の状態を描画する処理
 */
const canvas = document.getElementsByTagName( 'canvas' )[ 0 ];  // キャンバス
const ctx = canvas.getContext( '2d' ); // コンテクスト
const W = 500, H = 500;  // キャンバスのサイズ
const COLS = 10, ROWS = 10;  // 横10、縦10マス
const BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定
var x = 0; //座標取得用変数のCOLS用
var y = 0; //座標取得用変数のROWS用

var play_flg = false; //試合中か否かの判定フラグ
var restart_flg = false; //再入室したか否かの判定フラグ
var final_flg = false; //試合終了したか否かの判定フラグ
var flg_mode = false; //フラグモードか否かの判定フラグ
var next_flg = false; //再戦希望か否かの判定フラグ

var xhr = new XMLHttpRequest(); // Ajaxの設定
var url; // ルーティング用変数
var param; // ルーティングのパラメーター用変数

var msg_roomA = []; //入室メッセージ管理用

// 入室情報を画面上に表示するためのエリア情報を認識
var msgArea = document.querySelector("#msg");

// x, yの部分へマスを描画する処理
function drawBlock( x, y ) {
  ctx.fillStyle = 'rgb(0, 96, 109)'; 
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeStyle = 'rgb(0, 0, 0)'; 
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

// 現盤面の状態全体を描画し直す処理
function drawAll() {
  if(play_flg){
    
    if(final_flg === false){
      var tmpResponse;
      var state_info;
      url = "/draw/";
      xhr.open('GET', url, true);
      xhr.send();

      // サーバーからの応答内容を処理
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          tmpResponse = JSON.parse(xhr.responseText);
          if((tmpResponse['msg'] === "")||(restart_flg)){
            state_info = tmpResponse['map'];
            restart_flg = false; // 再入室時１回のみの処理
            
            for(var q = 0; q < ROWS; q++){ //y座標の処理ループ
              for(var t = 0; t < COLS; t++){ //x座標の処理ループ
                
                if(state_info[q][t]['opened'] === false) {
                  drawBlock( t, q ); //閉じている箇所を描画
                }else if((state_info[q][t]['opened']) && (state_info[q][t]['hasFlag'] === false)) {
                  ctx.fillStyle = 'rgb(207, 215, 223)'; 
                  ctx.fillRect( BLOCK_W * t , BLOCK_H * q, BLOCK_W - 1 , BLOCK_H - 1 );
                  // 該当箇所に爆弾が無く、周囲に爆弾があれば、爆弾の個数を描画
                  if(state_info[q][t]['numBom'] !== ""){
                    ctx.font = "49px ＭＳ ゴシック";
                    ctx.fillStyle = "red";
                    ctx.fillText(state_info[q][t]['numBom'], BLOCK_W * t , BLOCK_H * (q + 1)); //爆弾数はy座標1プラス
                  }
                }else if((state_info[q][t]['opened']) && (state_info[q][t]['hasFlag'])) {
                  ctx.fillStyle = 'rgb(207, 215, 223)'; 
                  ctx.fillRect( BLOCK_W * t , BLOCK_H * q, BLOCK_W - 1 , BLOCK_H - 1 );
                  // フラグ画像を描画
                  var img = new Image();
                  img.src = "/img/flag_img.png";
                  ctx.drawImage(img, BLOCK_W * t , BLOCK_H * q, BLOCK_W, BLOCK_H);
                }
                
              } 
            }
          }else{
            // 試合終了のメッセージ表示
            if(final_flg === false){
              final_flg = true; //試合終了フラグをONにする
              document.getElementById('competition_start').disabled = true; // 対戦開始ボタンの操作を不可にする
              document.getElementById('flg_img').disabled = true; // フラグモードボタンの操作を不可にする
              document.getElementById('next_play').disabled = false; // 再戦するボタンの操作を可能にする
              document.getElementById('exit_play').disabled = false; // 退出するボタンの操作を可能にする
              alert(tmpResponse['msg']);
            }
          }
        }
      }
    }else if((final_flg) && (next_flg === false)){
      url = "/nextstatus/";
      xhr.open('GET', url, true);
      xhr.send();

      // サーバーからの応答内容を処理
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var nextFlg = JSON.parse(xhr.responseText);
          if(nextFlg['flg']){
            // 確認ダイアログの表示
            if(window.open('','_self').confirm('対戦相手が再戦を希望しています。再戦されますか？\n再戦する場合はOK、退出する場合はキャンセルを押してください。')){
              // OKボタン押下時の処理
              url = "/nextstart/";
              xhr.open('GET', url, true);
              xhr.send();
              
              // サーバーからの応答内容を処理
              xhr.onreadystatechange = () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                  var tmp = JSON.parse(xhr.responseText);
                  init(); //初期化処理を実施する
                  final_flg = false;
                  document.getElementById('competition_start').disabled = false; // 対戦開始ボタンの操作を可能にする
                  document.getElementById('flg_img').disabled = false; // フラグモードボタンの操作を可能にする
                  document.getElementById('next_play').disabled = true; // 再戦するボタンの操作を不可にする
                  document.getElementById('exit_play').disabled = true; // 退出するボタンの操作を不可にする
                  alert(tmp);
                }
              }
            }else {
              // キャンセルボタン押下時の処理
              param = "id=" + localStorage.getItem("msweep");
              url = "/exit/?" + param;
              xhr.open('GET', url, true);
              xhr.send();
              
              // サーバーからの応答内容を処理
              xhr.onreadystatechange = () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                  localStorage.removeItem("msweep"); //ローカルストレージのIDを削除
                  window.open('','_self').close();; //画面を閉じる
                }
              }
            }
          }
        }
      }
    }else if((final_flg) && (next_flg)){
      url = "/nextwait/";
      xhr.open('GET', url, true);
      xhr.send();

      // サーバーからの応答内容を処理
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var reply = JSON.parse(xhr.responseText);
          switch(reply['flg']){
            case 'exit':
              alert(reply['msg']);
              next_flg = false;
              play_flg = false;
              final_flg = false;
              init(); //初期化処理を実施する
              document.getElementById('competition_start').disabled = false; // 対戦開始ボタンの操作を可能にする
              document.getElementById('flg_img').disabled = false; // フラグモードボタンの操作を可能にする
              document.getElementById('next_play').disabled = true; // 再戦するボタンの操作を不可にする
              document.getElementById('exit_play').disabled = true; // 退出するボタンの操作を不可にする
              break;
            case 'replay':
              next_flg = false;
              final_flg = false;
              init(); //初期化処理を実施する
              document.getElementById('competition_start').disabled = false; // 対戦開始ボタンの操作を可能にする
              document.getElementById('flg_img').disabled = false; // フラグモードボタンの操作を可能にする
              document.getElementById('next_play').disabled = true; // 再戦するボタンの操作を不可にする
              document.getElementById('exit_play').disabled = true; // 退出するボタンの操作を不可にする
              alert(reply['msg']);
              break;
            default:
              break;
          }
        }
      }
    }

  }else{
    // 対戦相手が試合開始しているか否か判定
    var tmpResponse;
    if(localStorage.getItem("msweep") !== null){
      var param = "id=" + localStorage.getItem("msweep");
      url = "/status/?" + param;
      xhr.open('GET', url, true);
      xhr.send();
  
      // サーバーからの応答内容を処理
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          tmpResponse = JSON.parse(xhr.responseText);
          (tmpResponse['flg'])? play_flg = tmpResponse['flg'] : ""; //試合開始する
          (tmpResponse['flg'])? document.getElementById('flg_img').disabled = false : ""; // フラグモードボタンの操作を可能にする
          if(play_flg){
            alert(tmpResponse['msg']);
          }else{
            if((tmpResponse['msg'].length > 0) && (msg_roomA.length < 2)){
              for(var t = 0; t < tmpResponse['msg'].length; t++){
                if(msg_roomA.length !== 0){
                  (msg_roomA[0] !== tmpResponse['msg'][t]) ? msg_roomA.push(tmpResponse['msg'][t]) : "";
                  if(msg_roomA[0] !== tmpResponse['msg'][t]){
                    var domMsg = document.createElement("div");
                    domMsg.innerHTML = new Date().toLocaleTimeString() + " " + tmpResponse['msg'][t];
                    msgArea.appendChild(domMsg);
                  }
                }else{
                  msg_roomA.push(tmpResponse['msg'][t]);
                  var domMsg = document.createElement("div");
                  domMsg.innerHTML = new Date().toLocaleTimeString() + " " + tmpResponse['msg'][t];
                  msgArea.appendChild(domMsg);
                }
              }
            }
          }
        }
      }  
    }
  }

}

// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする
}

// 800ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( drawAll, 700 );