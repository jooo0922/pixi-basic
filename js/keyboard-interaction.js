'use strict';

let app;
let player;
// 입력한 key를 담아놓을 객체
let keys = {};
let keysDiv;

window.onload = function() {
  app = new PIXI.Application(
    {
      width: 800,
      height: 600,
      backgroundColor: 0xAAAAAA 
    }
  );

  document.body.appendChild(app.view); 

  // player object
  player = new PIXI.Sprite.from("images/player.png");
  player.anchor.set(0.5); // anchor는 sprite를 move 또는 rotate 할 때의 기준점? 중심점 개념. 이거의 위치를 설정해주는 메소드가 set()
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;

  app.stage.addChild(player);

  // keyboard event handlers
  // Pixi 자체는 내부적으로 키보드 메소드가 없음.
  // 그래서 Web API의 기본 event handler(keyup, keydown)을 사용할 것.
  // keyup,down은 키를 누르고 뗄 때 발생하는 이벤트를 의미함. (방향키와 관련 없음.)
  window.addEventListener('keydown', keysDown); // key관련 이벤트들은 전역객체에 이벤트리스너를 거는 듯.
  window.addEventListener('keyup', keysUp);

  // Moving sprite
  // Pixi의 ticker를 이용하면 looping functon을 만들어서 sprite이 움직이게 만들 수 있음.
  // ticker에 추가되는 함수를 보통 game loop 라고 함수명을 붙이는데, 
  // game loop 함수안에 넣은 코드들은 1초에 60번 실행됨. 60fps임.
  // 이렇게 작성하는 순간 window가 load되자마자 gameloop 함수를 1초에 60번 실행시킴. 
  // 캔버스로 치면 requestAnimationFrame이랑 비슷한 기능인것 같음.
  // 실제로 공식 튜토리얼 문서에 requestAnimationFrame으로 gameloop 함수를 실행시킬 수 있다고 함.
  app.ticker.add(gameLoop)

  keysDiv = document.querySelector('#keys');
}

function keysDown(e) {
  // e.keyCode는 key별로 할당된 고유의 ASCII 코드값. 
  // 이거로 사용자가 어떤 키를 입력했는지 감지해서 함수를 처리할 수 있음.
  console.log(e.keyCode); 
  keys[e.keyCode] = true; 
  // object[key] = value; 이런식으로 새로운 key: value 쌍을 오브젝트에 추가할 수 있음.
  /**
   * object property 추가 방법
   * 1. obj.key = value;
   * 2. obj.[key(e.keyCode 이런거로 key를 할당할 때)] = value; 
   * 3. obj['keyname'] = value;
   * 1, 2, 3은 모두 같은 방법. 셋 다 obj에 key를 할당, 또는 접근해서 value를 할당하는 방법.
   */
}

function keysUp(e) {
  console.log(e.keyCode);
  keys[e.keyCode] = false;
}

function gameLoop() {
  // console.log('loop'); 이걸로 찍어보면 윈도우창이 로드되는 순간부터 계속 콘솔창에 loop를 1초에 60번씩 찍어내고 있음.
  // 이 말은, onload 이벤트가 발생한 순간부터 ticker의 loop function이 호출됬다고 보면 됨.
  // if 조건문에 해당되는 순간에만 player의 좌표값을 움직이면서 1초에 60개의 프레임을 그려내는 거임. 

  // 키보드를 누를 때마다 keys에 할당되는 값들을 string화하여 HTML에 뿌려줌. 
  // 그니까 어떤 키가 지금 눌리고 있고, 한번 눌리 뒤에 떼어졌는지 HTML에서 render되서 보여지겠지?
  keysDiv.innerHTML = JSON.stringify(keys);
  
  // 그냥 조건문을 이렇게만 써도 keys['87']의 값이 true일 때~ if block을 실행하라는 게 되는거지
  // 그니까 특정 단축키 (W, A, S, D)를 keydown하는 동안 해당 if 블록이 실행되면서 애니메이션을 그리는거지
  // W
  if (keys['87']) { 
    player.y -= 5;
  }
  // A
  if (keys['65']) { 
    player.x -= 5;
  }
  // S
  if (keys['83']) { 
    player.y += 5;
  }
  // D
  if (keys['68']) { 
    player.x += 5;
  }
}