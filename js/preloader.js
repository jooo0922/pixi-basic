'use strict';

// preloader in pixi
// 사소하지만 프로젝트 규모가 커지면 그래픽, 미디어 파일들이 많아질수록 preloader의 필요성이 높아짐. 
// 데이터가 많을수록 로드하는데 기다리는 시간이 많아질테니까
// 기존의 gif preloader랑은 다르게 처리할 예정.
let app;
let player;

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

  // preload assets
  /**
   * Loading images into the texture cache
   * 
   * 우리가 sprite 이미지가 화면에 렌더할 수 있게 하려면,
   * PIXI가 이미지를 렌더링할 때는 WebGL을 이용하여 GPU로 렌더링하는데,
   * GPU가 생짜 이미지파일을 렌더하려면 'WebGL texture'라는 형식으로 변환이 되어야 함.
   * 이걸 가능하게 해주는 게 loader 객체임. 
   * 기본 구조는
   *  
   * app.loader
   *  .add('이미지 url')
   *  .load(setup); 
   * 
   * 이런 식으로 chaining을 하면서 작성 가능. 
   * setup은 loading이 끝나자마자 수행할 콜백함수를 파라미터로 전달해 넣는 것임.
   */
  app.loader.baseUrl = 'images'; // 자동으로 설정되는 기본 url. bloat01~10까지 load할 때 'images/bloat~~.png'다 쓰기 귀찮아서 해놓은 거.
  app.loader
    .add('sprite01', 'abloat01.png') // 로드할 파일을 추가함. 이 때 로드하는 resource 각각에 고유이름을 부여할 수 있음.
    .add('sprite02', 'abloat02.png')
    .add('sprite03', 'abloat03.png')
    .add('sprite04', 'abloat04.png')
    .add('sprite05', 'bloat05.png')
    .add('sprite06', 'bloat06.png')
    .add('sprite07', 'bloat07.png')
    .add('sprite08', 'bloat08.png')
    .add('sprite09', 'bloat09.png')
    .add('sprite10', 'bloat10.png')
    .add('player', 'player.png'); // chainable add methods로 여러 개의 파일을 동시에 로드할 수 있음.

  app.loader.onProgress.add(showProgress); // 로딩이 진행중일 때 호출할 함수를 더해 줌.
  app.loader.onComplete.add(doneLoading); // 로딩이 끝날 때 호출할 함수를 더해 줌.
  app.loader.onError.add(reportError); // 로딩중 에러가 발생했을 때 호출할 함수를 더해 줌. 셋 다 Web API 임.

  app.loader.load(); // load()를 따로 호출할 수도 있음. 이걸 하면 Network 탭에서 해당 파일들이 로드되어 있는 걸 볼 수 있음.
}

// 세 함수 모두 onload event를 파라미터로 전달받은거
function showProgress(e) {
  console.log(e.progress); // 이거는 load 이벤트의 진행률을 0~100까지 숫자로 return해줌
}

function reportError(e) {
  console.log(e.message);
  console.error('ERROR: ' + e.message); 
  // 존재하지 않는 이미지 파일명을 load해서 에러를 일으키면 해당 에러메시지가 콘솔에 찍힘
  // 물론 에러가 난다면 pixi 자체에서 콘솔창에 에러를 보고함 
  // GET http://127.0.0.1:5500/images/abloat01.png 404 (Not Found) 이런 식으로
}

function doneLoading(e) {
  console.log('DONE LOADING!');

  // pixi 개발팀 권고사항
  // loader 객체를 이용해서 일반 이미지파일을 texture format으로 변환하여 로드했다면,
  // loader의 resource 오브젝트에서 해당 이미지를 로드할 때 부여한 이름.texture로 sprite 변수를 생성할 것을 권하고 있음.
  // loader 객체로 이미지들을 load하면 resource 객체에 해당 이미지들이 모두 들어가있음.
  player = PIXI.Sprite.from(app.loader.resources.player.texture); 
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;
  player.anchor.set(0.5); // 원래 anchor point 위치를 x, y값 따로따로 지정해줘야 하는데 하나만 써서 하면 두 좌표값 모두에 같은 값이 적용되나 봄.
  app.stage.addChild(player);
}

