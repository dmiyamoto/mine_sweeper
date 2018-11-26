//windowが閉じた時のイベント登録
window.onbeforeunload = function(){
  if(window.confirm('退出されますか？\n退出する場合はOK、途中退席する場合(※試合自体は続行中)はキャンセルを押してください。')){
    param = 'id=' + localStorage.getItem('msweep');
    url = '/exit/?' + param;
    xhr.open('GET', url, true);
    xhr.send();
    
    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        localStorage.removeItem('msweep'); //ローカルストレージのIDを削除
        window.open('/', '_self').close(); //画面を閉じる
      }
    }
  }else{
    window.open('/', '_self').close(); //画面を閉じる
  }
}

// 盤面が左クリックされたら動作する関数
function onClick(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const playerID = localStorage.getItem('msweep');

  param = 'id=' + playerID + '&x=' + x + '&y=' + y + '&flg=' + '';
  url = '/set/?' + param;
  xhr.open('GET', url, true);
  xhr.send();

  // サーバーからの応答内容を処理
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if(data['flg']){
        final_flg = true; //試合終了フラグをONにする
        document.getElementById('competition_start').disabled = true; // 対戦開始ボタンの操作を不可にする
        document.getElementById('next_play').disabled = false; // 再戦するボタンの操作を可能にする
        document.getElementById('exit_play').disabled = false; // 退出するボタンの操作を可能にする
      }
      (data['msg'] !== '') ? alert(data['msg']) : '';
    }
  }

}
  
// 盤面が左クリックされたら上記onClick関数を動作させる
canvas.addEventListener('click', onClick, false); 


// 盤面が右クリックされたら動作する関数
function onRightClick(e) {
  // ブラウザーのデフォルトの右クリックの挙動を阻止する
  e.preventDefault();
  
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const playerID = localStorage.getItem('msweep');

  param = 'id=' + playerID + '&x=' + x + '&y=' + y + '&flg=true';
  url = '/set/?' + param;
  xhr.open('GET', url, true);
  xhr.send();

  // サーバーからの応答内容を処理
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if(data['flg']){
        final_flg = true; //試合終了フラグをONにする
        document.getElementById('competition_start').disabled = true; // 対戦開始ボタンの操作を不可にする
        document.getElementById('next_play').disabled = false; // 再戦するボタンの操作を可能にする
        document.getElementById('exit_play').disabled = false; // 退出するボタンの操作を可能にする
      }
      (data['msg'] !== '') ? alert(data['msg']) : '';
    }
  }

}

// 盤面が右クリックされたら上記onRightClick関数を動作させる
canvas.addEventListener('contextmenu', onRightClick, false); 


// 退出処理を実行するための関数
function exitPlay(){
  if(localStorage.getItem('msweep') !== null){
    param = 'id=' + localStorage.getItem('msweep');
    url = '/exit/?' + param;
    xhr.open('GET', url, true);
    xhr.send();
    
    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        localStorage.removeItem('msweep'); //ローカルストレージのIDを削除
        window.open('/', '_self').close(); //画面を閉じる
      }
    }
  }
  
}

// 再戦処理を希望する関数
function nextPlay(){
  if(localStorage.getItem('msweep') !== null){
    next_flg = true;
    const id = localStorage.getItem('msweep');
    param = 'id=' + id;
    url = '/nextplay/?' + param;
    xhr.open('GET', url, true);
    xhr.send();
  
    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        next_flg = true;
      }else{
        next_flg = false;
      }
    }
  }
  
}
  
// 対戦開始前：プレイヤーが揃っているか否かをチェックし、先行(黒)と後攻(白)を決め、対戦を開始する
// 対戦中：対戦中の旨をアラートを表示
function play(){
  url = '/play/';
  xhr.open('GET', url, true);
  xhr.send();

  // サーバーからの応答内容を処理
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      play_flg = true; //試合開始する
      const msg = JSON.parse(xhr.responseText);
      alert(msg);
    }
  }

}

// 盤面を空にし、マスを作成する。
function init() {
  for ( let y = 0; y < ROWS; ++y ) {
    for ( let x = 0; x < COLS; ++x ) {
      drawBlock( x, y );
    }
  }
  document.getElementById('play').innerHTML = "<button id='competition_start' onclick='play()'>対戦開始</button> <button id='next_play' onclick='nextPlay()' disabled>再戦する</button> <button id='exit_play' onclick='exitPlay()' disabled>退出する</button>";
  document.getElementById('wrapper').style.display="block";
}

// 当マインスイーパーアプリのサーバ側に接続する
function start(idname){

  const obj = document.getElementById(idname);
  const idx = obj.selectedIndex;       //インデックス番号を取得
  const opval = obj.options[idx].value;  //value値を取得
  const optxt  = obj.options[idx].text;  //ラベルを取得 

  // 試合途中の再入室か本当に試合を開始するのかを判定
  if(localStorage.getItem('msweep') !== null){
    const id = localStorage.getItem('msweep');
    param = 'id=' + id + '&opval=' + opval + '&optxt=' + optxt;
    url = '/restart/?' + param;
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        const msg = JSON.parse(xhr.responseText);
        if(msg !== 'その部屋は他のプレーヤーが対戦中です。'){
          init(); // 初期化処理
          // msg_roomA.push(new Date().toLocaleTimeString() + " " + msg);
          // console.log(msg_roomA);
          // let content = msg_roomA[0];
          // for(let s = 1; s < msg_roomA.length; s++){
          //   content = content + '\n\n' + msg_roomA[s];
          // }
          // // document.getElementById('msg').innerHTML = '<textarea name="textarea" id="textarea" cols="320" rows=400></textarea>';
          // document.getElementById('msg').textarea.value = content;
          play_flg = true;
          restart_flg = true;
        }else{
          alert(msg);
        }
      }
    }
  }else{
    init(); // 初期化処理
    const player = document.getElementById('name_input').value; // プレーヤー名を取得
    const id = 'id' + Math.floor(Math.random() * 1111111) + player; // 当ユーザー用識別ID生成
    localStorage.setItem('msweep', id); //ローカルストレージに当ユーザー用識別ID格納
    
    // ユーザー情報をサーバー側にセット
    param = 'id=' + id + '&player=' + player + '&opval=' + opval + '&optxt=' + optxt;
    url = '/prepare/?' + param;
    xhr.open('GET', url, true);
    xhr.send();

    // サーバーからの応答内容を処理
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        const msg = JSON.parse(xhr.responseText);
        (msg === 'その部屋は他のプレーヤーが対戦中です。') ? alert(msg) : '';
      }
    }
  }

}