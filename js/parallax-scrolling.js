'use strict';

// Parallax scrolling and Tiling sprite
// tiling sprite를 이용해서 parallax(시차) 즉, 멀리 있는 물체는 천천히, 가까이 있는 물체는 빨리 움직이는 애니메이션 구현
let app;

// tiling sprite들을 담아놓을 변수
let bgBack;
let bgMiddle;
let bgFront;
let bgX = 0; // background의 최초 위치값.(x좌표 0에서 시작해서 계속 x방향으로 이동해야 하니까)
let bgSpeed = 1; // tiling sprites들이 얼마나 빠르게 움직일 것인지를 정해주는 값.

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view);

  // 일단 tiling sprite들을 loader로 preload하기
  app.loader.baseUrl = 'assets';
  app.loader
    .add('bgBack', 'forest_pack/trees-back.png')
    .add('bgMiddle', 'forest_pack/trees-middle.png')
    .add('bgFront', 'forest_pack/trees-front.png');
  app.loader.onComplete.add(initLevel); // 이미지들이 전부 로딩도면 level을 초기화하는 함수를 추가함.
  app.loader.load();

}

function gameLoop(delta) {
  // 이제 tiling sprite로 parallax 애니메이션을 만들어야 하니까 1초에 60번씩 수행해줄 함수를 만들어서 호출할거임.
  updateBg();
}

function initLevel() {
  // 일단 createBg를 호출해서 return받은 tiling sprite들을 변수에 담아놓을거임.
  // 가장 밑에 깔려야 할 layer(즉, bgBack)부터 차곡차곡 쌓여야 하니까 순서대로 tile Sprite를 캔버스에 렌더하고 변수에 할당할거임.
  // 여기서는 tiling sprite들을 캔버스에 렌더하는 순서가 상당히 중요하다!
  bgBack = createBg(app.loader.resources['bgBack'].texture);
  bgMiddle = createBg(app.loader.resources['bgMiddle'].texture);
  bgFront = createBg(app.loader.resources['bgFront'].texture);

  // 이미지 로드 완료되자마자 바로 수행하는 함수에서 document에 이벤트를 걸어서
  // parallax scrolling만 있으면 좀 심심하니까 약간의 interactive를 주려는 것.
  document.addEventListener('keyup', switchDir);

  // parallax를 구현하려면 캔버스에 애니메이션을 줘야하지만 onload의 콜백함수에서 이미지들을 load하자마자 바로 주면 안됨.
  // load한 이미지들을 가지고 뭔가를 처리하고 세팅하고 나서 캔버스에 애니메이션을 걸어줄 것임.
  app.ticker.add(gameLoop);
}

// tiling sprites를 반복적으로 재사용해서 여러개 만들려고 따로 정리한 함수
function createBg(texture) {
  /**
   * PIXI.TileSprite()
   * 
   * tile image들의 양끝 모서리는 서로 연결되어 보일 수 있도록 그림이 그려진거임.
   * 그니까 이 이미지들이 양 사이드마다 반복적으로 이어붙여지면서 마치 끝없이 이동하는 듯한 느낌을 주며 parallax scrolling으로 보이는거
   * 그래서 이런 이미지들을 수평방향으로 반복적으로 shift해줘서 무한 스크롤이 가능한 layer로 만들어주는 객체가 TileSprite(). 
   * tiling 자체가 '기와, 타일'라는 뜻. 마치 기와, 타일처럼 반복적으로 쭉 이어지는 이미지들을 뜻하는 것.
   */
  let tiling = new PIXI.TilingSprite(texture, 800, 600) // 뒤에 두개의 parameter는 각각의 tile sprite의 width와 height 값을 할당해줌.
  tiling.position.set(0, 0); // x, y 좌표값을 0, 0에 위치시킴
  app.stage.addChild(tiling); // 캔버스에 렌더한 뒤

  return tiling; // return받아서 어딘가에 담아놓겠지?
}

function updateBg() {
  bgX = bgX + bgSpeed; // 한 번 수행할 때마다 각 tiling sprite의 x좌표가 bgSpeed값만큼(+1) 이동하게 됨.
  // 콘솔에 찍어보면서 switchDir로 인해서 keyup 이벤트를 받았을때 어떻게 값들이 변화하는지 확인해볼 것.
  // console.log(`bgX: ${bgX}, bgSpeed: ${bgSpeed}`); 
  bgFront.tilePosition.x = bgX;
  bgMiddle.tilePosition.x = bgX / 2; // 멀리있는 물체일수록 x좌표가 덜 이동하도록, 즉 속도가 느리게 해준거!
  bgBack.tilePosition.x = bgX / 4;
}

// 키를 뗏을 때 parallax scroll의 방향을 바꿔주는 함수
function switchDir(e) {
  console.log(e.keyCode); // key 관련 이벤트 사용 시 해당하는 이벤트가 발생한 key의 keyCode를 모르겠으면 항상 콘솔로 찍어서 확인해볼 것.
  // 왼쪽 방향키, 오른쪽 방향키, 스페이스바의 keyCode값을 확인한 후 각각의 key event에 원하는 인터랙션을 줘보자.
  switch (e.keyCode) {
    case 37:
      // left arrow
      bgSpeed = bgSpeed - 1;
      // 요렇게 하면 updateBg가 실행될 때마다 bgX 값은 -1, -2, -3,... 로 할당될거임. -> 왼쪽 방향으로 움직일거임
      // 또 여러 번 누르게 되면 bgSpeed값 자체가 초기값 1에서 0, -1, -2, -3... 이렇게 됨. 즉 방향뿐만 아니라 속도가 더 빨라진다는 거!
      break;
    case 39:
      // right arrow
      bgSpeed = bgSpeed + 1;
      break;
    case 32:
      // space bar
      bgSpeed = 0; // 요렇게 하면 updateBg가 실행될 때마다 bgX값은 계속 0만 더해지니까 변화가 없음 -> 멈추겠지 
      break;
  }
}