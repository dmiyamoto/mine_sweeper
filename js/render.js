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
var final_flg = false; //試合終了したか否かの判定フラグ

var xhr = new XMLHttpRequest(); // Ajaxの設定
var url; // ルーティング用変数
var param; // ルーティングのパラメーター用変数

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
    
    var tmpResponse;
    var state_info;
    url = "http://localhost:8000/draw/";
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        tmpResponse = JSON.parse(xhr.responseText);
        if(tmpResponse['msg'] === ""){
          state_info = tmpResponse['map'];
          console.log(state_info);
          for(var q = 0; q < ROWS; q++){ //y座標の処理ループ
            for(var t = 0; t < COLS; t++){ //x座標の処理ループ
              if (state_info[q][t] !== 0) { // 開いている箇所を描画
                if(state_info[q][t]['opened']) { // 開いている箇所を描画
                  ctx.fillStyle = 'rgb(207, 215, 223)'; 
                  ctx.fillRect( BLOCK_W * t , BLOCK_H * q, BLOCK_W - 1 , BLOCK_H - 1 );
                  // 該当箇所に爆弾が無く、周囲に爆弾があれば、爆弾の個数を描画
                  if((state_info[q][t]['hasBom'] === false) && (state_info[q][t]['numBom'] !== "")){
                    ctx.font = "49px ＭＳ ゴシック";
                    ctx.fillStyle = "red";
                    ctx.fillText(state_info[q][t]['numBom'], BLOCK_W * t , BLOCK_H * (q + 1)); //爆弾数はy座標1プラス
                  }
                }
              }
            } 
          }
        }else{
          // 試合終了のメッセージ表示
          if(final_flg === false){
            final_flg = true;
            alert(tmpResponse['msg']);
          }
        }
      }
    }

  }else{
    // 対戦相手が試合開始しているか否か判定
    var tmpResponse;
    url = "http://localhost:8000/status/";
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        tmpResponse = JSON.parse(xhr.responseText);
        (tmpResponse['flg'])? play_flg = tmpResponse['flg'] : "";
        (tmpResponse['msg'] !== "")? alert(tmpResponse['msg']) : "";
      }
    }
  }

}

// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする
}

// 60ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( drawAll, 3000 );