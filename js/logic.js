// 入室情報を画面上に表示するためのエリア情報を認識
var msgArea = document.querySelector("#msg");

// 盤面がクリックされたら動作する関数
function onClick(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var playerID = localStorage.getItem("msweep");

    param = "id=" + playerID + "&x=" + x + "&y=" + y;
    url = "http://localhost:8000/set/?" + param;
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        var msg = JSON.parse(xhr.responseText);
        alert(msg);
      }
    }

  }    
  
  canvas.addEventListener('click', onClick, false); // 盤面がクリックされたら上記onClick関数を動作させる
  
  
  // 対戦開始前：プレイヤーが揃っているか否かをチェックし、先行(黒)と後攻(白)を決め、対戦を開始する
  // 対戦中：対戦中の旨をアラートを表示
  function play(){
    xhr = new XMLHttpRequest();
    url = "http://localhost:8000/play/";
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        play_flg = true;
        var msg = JSON.parse(xhr.responseText);
        alert(msg);
      }
    }

  }
  
  // 盤面を空にし、マスを作成する。
  function init() {
    for ( var y = 0; y < ROWS; ++y ) {
      for ( var x = 0; x < COLS; ++x ) {
        drawBlock( x, y );
      }
    }
    document.getElementById('play').innerHTML = "<button id='competition_start' onclick='play()'>対戦開始</button>";
  }

  // 当マインスイーパーアプリのサーバ側に接続する
  function start(idname){
    init(); // 初期化処理

    var obj = document.getElementById(idname);
    var idx = obj.selectedIndex;       //インデックス番号を取得
    var opval = obj.options[idx].value;  //value値を取得
    var optxt  = obj.options[idx].text;  //ラベルを取得    
    var player = document.getElementById('name_input').value; // プレーヤー名を取得
    var id = 'id' + Math.floor(Math.random() * 1111111) + player; // 当ユーザー用識別ID生成
    localStorage.setItem("msweep",id); //ローカルストレージに当ユーザー用識別ID格納
    
    // ユーザー情報をサーバー側にセット
    xhr = new XMLHttpRequest();
    param = "id=" + id + "&player=" + player + "&opval=" + opval + "&optxt=" + optxt;
    url = "http://localhost:8000/prepare/?" + param;
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        var msg = JSON.parse(xhr.responseText);
        if(msg !== 'その部屋は他のプレーヤーが対戦中です。'){
          var domMsg = document.createElement("div");
          domMsg.innerHTML = new Date().toLocaleTimeString() + " " + msg;
          msgArea.appendChild(domMsg);
        }else{
            alert(msg);
        }
      }
    }
  }
  