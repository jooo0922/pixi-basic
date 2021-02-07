'use strict';

// Using pointer events in pixi.js (pointer는 cursor가 클릭 가능한 상태일 때로 바뀌는거)
let app;

// pointerup 한 이후에도 pointerover가 되어있는데 녹색으로 안바뀌는 버그 
// pointerdown 한 상태임에도 graphic을 벗어나면(pointerout) 흰색이 되어버리는 버그
// 얘내를 해결하기 위해 만든 bolean 변수
let pointerIsDown = false;
let pointerIsOver = false;

// pointer event가 발생할 때 graphic에 적용할 컬러코드를 담아놓은 것. fillColor가 아닌 tint를 이용할거라고 함.
const NORMAL = 0xFFFFFF;
const OVER = 0x00FF00;
const DOWN = 0xFF0000;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view);

  let rect = new PIXI.Graphics();
  rect.beginFill(NORMAL);
  rect.drawRect((app.view.width / 2) - 100, (app.view.height / 2) - 100, 200, 200);
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

  app.stage.addChild(rect);

  app.ticker.add(gameLoop);
}

function gameLoop(delta) {

}

function doPointerUp() {
  // console.log('UP!');
  // pointerIsOver이 true면 초록색으로, 아니면 원래 색으로 하라는 거
  if (pointerIsOver) {
    this.tint = OVER;
  } else {
    this.tint = NORMAL;
  }
  pointerIsDown = false;
}

function doPointerDown() {
  // console.log('DOWN!');
  // console.log(this);
  this.tint = DOWN; // thi는 rect를 가리키는 것 같음.
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