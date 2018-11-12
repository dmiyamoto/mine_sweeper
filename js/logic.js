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
        (msg !== "") ? alert(msg) : "";
      }
    }

  }    
  
  canvas.addEventListener('click', onClick, false); // 盤面がクリックされたら上記onClick関数を動作させる
  
  
  // 対戦開始前：プレイヤーが揃っているか否かをチェックし、先行(黒)と後攻(白)を決め、対戦を開始する
  // 対戦中：対戦中の旨をアラートを表示
  function play(){
    url = "http://localhost:8000/play/";
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        play_flg = true; //試合開始する
        document.getElementById('flg_img').disabled = false; // フラグモードボタンの操作を可能にする
        var msg = JSON.parse(xhr.responseText);
        alert(msg);
      }
    }

  }
  
  // フラグモード設定ボタンがクリックされた動作する関数（フラグモード：ONの際は爆弾の箇所にフラグを建てる）
  function flg_button(){
    var id = localStorage.getItem("msweep");
    param = "id=" + id;
    url = "http://localhost:8000/flgmode/?" + param;
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        var tempRes = JSON.parse(xhr.responseText);
        if(tempRes['flgmode'] !== ""){
          flg_mode = tempRes['flgmode'];
          (flg_mode) ? document.getElementById('flg_mode').innerHTML = "フラグモード：ON" : document.getElementById('flg_mode').innerHTML = "フラグモード：OFF";
        }else{
          final_flg = true; //試合終了フラグをONにする
          document.getElementById('flg_img').disabled = true; // フラグモードボタンの操作を不可にする
          msg = tempRes['msg'];
          alert(msg);
        }
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
    document.getElementById('flg').innerHTML = "<button id='flg_img' onclick='flg_button()' disabled ><img src='/img/flag_img.png' width='50' height='50'></button><i id='flg_mode'>フラグモード：OFF</i>"
  }

  // 当マインスイーパーアプリのサーバ側に接続する
  function start(idname){

    var obj = document.getElementById(idname);
    var idx = obj.selectedIndex;       //インデックス番号を取得
    var opval = obj.options[idx].value;  //value値を取得
    var optxt  = obj.options[idx].text;  //ラベルを取得 

    // 試合途中の再入室か本当に試合を開始するのかを判定
    if(localStorage.getItem("msweep") !== null){
      var id = localStorage.getItem("msweep");
      param = "id=" + id + "&opval=" + opval + "&optxt=" + optxt;
      url = "http://localhost:8000/restart/?" + param;
      xhr.open('GET', url, true);
      xhr.send();

      // サーバーからの応答内容を処理
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var msg = JSON.parse(xhr.responseText);
          if(msg !== 'その部屋は他のプレーヤーが対戦中です。'){
            init(); // 初期化処理
            var domMsg = document.createElement("div");
            domMsg.innerHTML = new Date().toLocaleTimeString() + " " + msg;
            msgArea.appendChild(domMsg);
            play_flg = true;
          }else{
            alert(msg);
          }
        }
      }
    }else{
      init(); // 初期化処理
      var player = document.getElementById('name_input').value; // プレーヤー名を取得
      var id = 'id' + Math.floor(Math.random() * 1111111) + player; // 当ユーザー用識別ID生成
      localStorage.setItem("msweep",id); //ローカルストレージに当ユーザー用識別ID格納
      
      // ユーザー情報をサーバー側にセット
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

  }
  