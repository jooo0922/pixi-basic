'use strict';

// Using pointer events in pixi.js (pointer는 cursor가 클릭 가능한 상태일 때로 바뀌는거)
let app;

// mutiple graphic 추가 생성을 위해 만든 변수
let r1;
let r2;
let r3;

// pointerup 한 이후에도 pointerover가 되어있는데 녹색으로 안바뀌는 버그 
// pointerdown 한 상태임에도 graphic을 벗어나면(pointerout) 흰색이 되어버리는 버그
// 얘내를 해결하기 위해 만든 bolean 변수
let pointerIsDown = false;
let pointerIsOver = false;

// pointer event가 발생할 때 graphic에 적용할 컬러코드를 담아놓은 것. fillColor가 아닌 tint를 이용할거라고 함.
const NORMAL = 0xFFFFFF;
const OVER = 0x00FF00;
const DOWN = 0xFF0000;

// multiple rectangle의 width, height값을 재사용하기 위해 정의한 const
const RECT_W = 100;
const RECT_H = 100;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view);

  r1 = createRect(100, 450, RECT_W, RECT_H, 'rect01', 20);
  r2 = createRect(300, 450, RECT_W, RECT_H, 'rect02', 40);
  r3 = createRect(500, 450, RECT_W, RECT_H, 'rect03', 80);

  app.stage.addChild(r1);
  app.stage.addChild(r2);
  app.stage.addChild(r3);

  app.ticker.add(gameLoop);
}

function gameLoop(delta) {

}

// multiple rectangle을 만들기 위한 함수
// 그냥 onload의 콜백함수에서 graphic을 만들때 쓰는 것들을 함수를 따로 파서 정리한 것. 왜냐면 여러개를 만들어야 되니깐!
// 근데 이런식으로 graphic object를 여러 개 만드는 게 이상적인 방식은 아님
// 가장 좋은 건 class를 만들고, 거기서 오브젝트를 생성하는 게 더 나음.
function createRect(x, y, w, h, name, speed) {
  let rect = new PIXI.Graphics();
  rect.beginFill(NORMAL);
  rect.drawRect(x, y, w, h);
  rect.endFill(); // 그림 그리기가 끝나면 endFill()로 꼭 마무리할 것.
  rect.interactive = true;
  rect.buttonMode = true; // 해당 sprite 객체 또는 그래픽을 클릭할 수 있는 버튼으로 만듦. hover시 pointer cursor로 바뀜.

  // 5개의 pointer events를 걸어놓고 각각에 해당하는 콜백함수를 호출한 것.
  rect.on('pointerup', doPointerUp);
  rect.on('pointerdown', doPointerDown);
  rect.on('pointerover', doPointerOver);
  rect.on('pointerout', doPointerOut);
  // pointerdown한 상태에서 바깥으로 pointer가 나갔다가(pointerout) pointerup 시켰을 때 콜백함수도 따로 지정해주려는 것
  rect.on('pointerupoutside', doPointerUpOutside);

  // 지금 rect 자체는 new PIXI.Graphic에 의해 생성된 Object이기 때문에, 여러가지 attribute가 있는 거
  // 그래서 우리도 name이라는 키를 만들어서 거기에 parameter로 받은 name값을 할당하는 거. 커스텀 attribute를 만든거임.
  // rect['name'] = name; 이렇게 해도 됨. 똑같음.
  rect.name = name;
  rect.speed = speed; // name이랑 마찬가지 원리

  return rect;
}

// this는 rect를 가리킴. Why?
// DOM 이벤트 처리기 함수에서 this를 사용하거나, 그 외에 이벤트 처리 함수에서 사용할 경우,
// this === e.currentTarget, 즉, 이벤트가 바인딩된 요소로 설정됨. 여기서 이벤트가 바인딩된 애는 rect잖아?
function doPointerUp() {
  // console.log('UP!');
  // pointerIsOver이 true면 초록색으로, 아니면 원래 색으로 하라는 거
  if (pointerIsOver) {
    this.tint = OVER;
    this.y = this.y - this.speed; // 마우스가 올려진 상태에서 클릭 후 '뗏을 때' y좌표값이 위쪽으로 speed값만큼 이동하겠지
    console.log('moving ->' + this.name);
  } else {
    this.tint = NORMAL;
  }
  pointerIsDown = false;
}

function doPointerDown() {
  // console.log('DOWN!');
  // console.log(this);
  this.tint = DOWN;
  pointerIsDown = true;
}

function doPointerOver() {
  // console.log('Over');
  // pointerover가 되지 않은 상태일 때에만 해당 if block을 실행하라는거임.
  // 이미 over상태면 아무것도 하지 말라는 것.
  if (!pointerIsOver) {
    this.tint = OVER;
    pointerIsOver = true;
  }
}

function doPointerOut() {
  // console.log('OUT!');
  // pointerIsDown이 false일 때에만 흰색으로 돌아가게 하고, 아닌 경우는 그냥 원래 색으로 냅두라는 거겠지?
  if (!pointerIsDown) {
    this.tint = NORMAL;
    pointerIsOver = false;
  }
}

function doPointerUpOutside() {
  this.tint = NORMAL;
  pointerIsOver = false;
  pointerIsDown = false;
}