'use strict';

/**
 * DevTools failed to load SourceMap: Could not load content for ...js.map HTTP error: status code 404, net::ERR_HTTP_RESPONSE_CODE_FAILURE
 * pixi.min.js파일 연결 시 개발자 도구에 이런 에러메시지가 뜬다면
 * pixi.min.js파일에 들어가서
 * //# sourceMappingURL=pixi.min.js.map 이거를 지워주거나
 * // //# sourceMappingURL=pixi.min.js.map 이런 식으로 앞에 // 를 더 붙이면 에러메시지가 없어짐.
 */

let app;
let player;

// window.onload
// 자바스크립트에서 페이지가 로드 되면 자동으로 실행되는 전역 콜백함수
// 페이지의 모든 요소들이 로드되어야 호출되며, 한 페이지에서 하나의 window.onload()함수만 적용
// 사용법
// window.onload = function () {}
window.onload = function() {
  // Pixi의 Application 객체는 HTML <canvas> element를 자동 생성해줌.
  // 이 객체는 파라미터로 생성할 캔버스에 대한 데이터가 담긴 JSON Object를 전달받음.
  app = new PIXI.Application(
    {
      width: 800,
      height: 600,
      backgroundColor: 0xAAAAAA // 똑같은 Hexadecimal code 인데 # 대신 0x를 붙인거임.
    }
  );

  document.body.appendChild(app.view); 
  // 이렇게 하면 Pixi가 자동 생성한 Canvas element가 HTML 문서에 추가되는 것.
  // app 자체를 appendChild 할 수 없고, 항상 app.view로 해야 함.

  // 여기까지가 Pixi를 사용하기 위해 기본적으로 작성해야 하는 코드들

  // sprite
  // sprite는 코드로 컨트롤할 수 있는 이미지들을 의미함.
  // 위치, 크기 등 여러 특성을 컨트롤해서 인터랙티브한 그래픽을 만들 수 있음.
  // sprite를 컨트롤하는 방법을 배우는 게 Pixi에서 가장 중요한 개념.
  player = new PIXI.Sprite.from("images/player.png");
  player.anchor.set(0.5); // anchor를 Sprite 이미지의 center로 맞춤.
  // 이제 sprite를 screen, 즉 캔버스 중앙에 배치할 수 있도록 좌표값을 가운데로 맞추자.
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;

  // stage
  // stage는 Pixi Container 객체로써, 캔버스에 무언가를 렌더해서 보이게 하려면 stage object 안에 넣어줘야 함.
  // Important: you won't be able to see any of your sprites unless you add them to the stage!
  app.stage.addChild(player); // stage안에 sprite를 넣을땐 appendChild가 아니라 addChild로 넣어줘야 함. 헷갈리지 말것.

  // mouse interactions
  // 먼저 stage가 인터랙션을 받을 수 있도록 해야함.
  app.stage.interactive = true;
  // 이벤트 리스너랑 똑같음. stage가 인터랙션을 받을 준비가 되면, 'pointermove'같은 이벤트를 걸 수 있고, 
  // 그 이벤트가 발생할 때 호출할 콜백함수가 movePlayer인 것. 일종의 addEventListener와 같은거임
  app.stage.on('pointermove', movePlayer);
}

function movePlayer(e) {
  // pointermove의 움직임 좌표값을 저장해서 player의 좌표를 그거에 계속 맞추면 되겠지?
  let pos = e.data.global;
  // console.log(pos);
  
  // console.log(player.x, player.y); 
  // player의 x, y값을 찍어보면 위에서 넣은 좌표값이 마우스가 움직일 때마다 콘솔에 찍힘.
  // 그렇다면, pointermove에서 실시간으로 변화하는 좌표값을 player의 x,y값에 할당하면
  // 포인터가 움직일 때마다 따라서 움직이겠지?
  player.x = pos.x;
  player.y = pos.y;
}
