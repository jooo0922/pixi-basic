'use strict';

let app;
let player;
// 입력한 key를 담아놓을 객체
let keys = {};
let keysDiv;

// JSON 오브젝트로 이 변수에는 캐릭터 움직임 cycle을 위한 frame을 담아놓을 것.
let playerSheet = {};

let speed = 2;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.body.appendChild(app.view);

  // spriteSheet animation을 위한 이미지를 preload하는 것.
  app.loader.add('boy', 'images/boy.png');
  app.loader.load(doneLoading); // 이미지 로드가 끝나면 수행할 함수를 여기에 작성해도 됨.

  // keyboard event handlers
  // Pixi 자체는 내부적으로 키보드 메소드가 없음.
  // 그래서 Web API의 기본 event handler(keyup, keydown)을 사용할 것.
  // keyup,down은 키를 누르고 뗄 때 발생하는 이벤트를 의미함. (방향키와 관련 없음.)
  window.addEventListener('keydown', keysDown); // key관련 이벤트들은 전역객체에 이벤트리스너를 거는 듯.
  window.addEventListener('keyup', keysUp);

  keysDiv = document.querySelector('#keys');
}

function doneLoading(e) {
  // load한 이미지를 이용해 baseTexture를 만들고, 각 부분을 crop해서 프레임별로 texture를 만들어서 각각 textureArray로 만드는 함수
  createPlayerSheet();

  // textureArray를 animatedSprite로 만들어서 맨 처음 캐릭터의 기본 animatedSprite를 canvas에 display해주는 함수
  createPlayer();

  app.ticker.add(gameLoop)
}

function createPlayerSheet() {
  // PIXI.BaseTexture(source) ;
  // A texture stores the information that represents an image. All textures have a base texture.
  // 여기서는 저장된 url을 source paramter로 전달하여 basetexture를 만듦.
  let ssheet = new PIXI.BaseTexture.from(app.loader.resources['boy'].url);
  let w = 32;
  let h = 32;

  // 애니메이션을 위한 frame을 만들기 위해 
  // playerSheet에 각각의 뱡향에 해당하는 texture들을 서있는 거, 걸어가는 거에 따라 각각 textureArray로 저장해줌.
  // Hard Coding으로 만들어야 함...
  // playerSheet.standSouth = []; 이렇게 key = value 쌍을 할당하는 것과 같음.
  playerSheet['standSouth'] = [
    // PIXI.Rectangle(x, y, width, height); 은 사각형을 정의하는 객체이지만, 여러 용도로 사용할 수 있다.
    // 예를 들어, tileset-image에서 특정 일부분의 sub-image만 추출할 경우, 해당 sub-image가 tileset에서 어떤 position에 있는지,
    // 그리고 해당 sub-image의 width, hieght값은 뭔지를 parameter로 전달해주면 일종의 frame역할을 하는 사각형이 만들어짐.
    // 프레임의 위치나 크기는 원하는 sub-image의 크기나 위치를 일일히 확인하고 값을 할당해줘야 할 듯...

    // 그래서 PIXI.Texture(baseTexture, frameOfSubImage); 요렇게 parameter를 전달해주면
    // tileset img에서 해당 frame 부분만큼 잘라서 texture로 저장해줌.

    // Texture() 객체는 이미지 전체 또는 이미지의 부분을 texture로 저장해줌. 프레임을 parameter로 전달하면 부분 이미지 도출,
    // 프레임을 전달하지 않으면 전체 이미지 도출함.
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 1 * h, w, h))
  ];

  playerSheet['standWest'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 2 * h, w, h))
  ];

  playerSheet['standEast'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 3 * h, w, h))
  ];

  playerSheet['standNorth'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 0 * h, h, h))
  ];
  // 얘내들은 각 방향으로 standing만 하고 있는 sub-image들을 frame으로 만들어서 저장해놓은 것.
  // 일종의 전체 애니메이션 중에서 idle animation에 해당할거임. 

  // 여기서부터는 걸어가는 프레임의 텍스쳐들을 각각 방향마다 배열로 저장해준거. 
  // 걸어가는 프레임은 서있는 프레임 1개 + 걸어가는 프레임 2개로 방향마다 총 3개의 프레임 텍스쳐들이 저장되어 있어야 함.
  playerSheet['walkSouth'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 1 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 1 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 1 * h, w, h))
  ];

  playerSheet['walkWest'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 2 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 2 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 2 * h, w, h))
  ];

  playerSheet['walkEast'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 3 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 3 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 3 * h, w, h))
  ];

  playerSheet['walkNorth'] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * w, 0 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * w, 0 * h, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * w, 0 * h, w, h))
  ];
}

// 이거는 이제 이미지 로드가 끝나면, 맨 처음에 등장할 animatedSprite, 즉 standSouth를 캔버스에 그려주는 함수 
function createPlayer() {
  // PIXI.AnimatedSprite()는 여러개의 텍스쳐가 저장된 'textureArray'를 parameter로 전달해서
  // 그걸 가지고서 하나의 animation이 적용된 sprite로 만들어주는 객체임.
  player = new PIXI.AnimatedSprite(playerSheet.standSouth);
  player.anchor.set(0.5); // animatedSprite의 기준점을 가운데로 이동시키고
  player.animationSpeed = 0.5; // animatedSprite의 애니메이션 플레이 속도를 정해줌. 기본값은 1. 값이 높을수록 빨라짐.
  player.loop = false; // animatedSprite의 애니메이션을 반복할 것인지 결정. 여기서는 단축키를 누를 때마다 1번씩만 애니메이션이 재생되면 되니까 loop 필요없음.
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;
  app.stage.addChild(player);
  player.play();
  // animatedSprite를 실제로 play해줌. 근데 standSouth 텍스쳐로 만드는거니까 이건 안해줘도 되는데
  // walkSouth 이런 애들은 마지막에 꼭 play()를 호출해줘야 animatedSprite의 애니메이션이 실제로 플레이됨.
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
    // 우리는 player.loop = false로 함. 왜냐면 방향키를 누르고 있을때만 애니메이션이 돌기를 원하니까.
    // 근데 단축키를 계속 누르고 있으면 play가 빠른 속도로 override(갱신)되니까, 하나의 프레임에 갇혀버림.
    // 그러니까 이미 play되고 있는 상태라면, textureArray를 swap하지도 않고, play를 갱신하지도 못하게 함.
    if (!player.playing) {
      // animatedSprite.textures = [textureArray] 이거는 animatedSprite의 textureArray들을 swapping(교체)할 때 사용하는 메소드
      // texture랑은 약간 다름. animatedSprite에서만 쓰이고, textureArray만 할당받을 수 있음.
      player.textures = playerSheet.walkNorth;
      player.play(); // 플레이를 항상 해줘야 함!
    }
    player.y -= speed;
  }
  // A
  if (keys['65']) {
    if (!player.playing) {
      player.textures = playerSheet.walkWest;
      player.play();
    }
    player.x -= speed;
  }
  // S
  if (keys['83']) {
    if (!player.playing) {
      player.textures = playerSheet.walkSouth;
      player.play();
    }
    player.y += speed;
  }
  // D
  if (keys['68']) {
    if (!player.playing) {
      player.textures = playerSheet.walkEast;
      player.play();
    }
    player.x += speed;
  }
}