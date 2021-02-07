'use strict';

// Pointer events part3 - sprites & texture swapping
// pointer event에 따라서 sprite & texture가 바뀌는 거 만들어보는 것
let app;
let splash;
let pointerIsDown = false;
let pointerIsOver = false;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view);

  app.loader.baseUrl = 'sprites';
  app.loader
    .add('idle', 'splash01.png')
    .add('down', 'splash02.png')
    .add('over', 'splash03.png')
    .add('upoutside', 'splash04.png');
  app.loader.onComplete.add(doneLoading);
  app.loader.load();

  app.ticker.add(gameLoop);
}

function gameLoop(delta) {

}

// 이 함수에서는 로딩을 완료하면 stage에 로드한 splash 이미지 중 하나를 추가하려는 것 
function doneLoading() {
  // loader객체로 이미지들을 preloading했다면 texture format으로 sprite를 생성하는 게 좋다.
  splash = new PIXI.Sprite.from(app.loader.resources['idle'].texture); // app.loader.resource.idle.texture 이렇게 써도 됨.
  splash.anchor.set(0.5);
  splash.x = app.view.width / 2;
  splash.y = app.view.height / 2;

  splash.interactive = true;
  splash.buttonMode = true;

  splash.on('pointerup', doPointerUp);
  splash.on('pointerupoutside', doPointerUpOutside);
  splash.on('pointerdown', doPointerDown);
  splash.on('pointerover', doPointerOver);
  splash.on('pointerout', doPointerOut);

  app.stage.addChild(splash);
}

function doPointerUp() {
  if (pointerIsOver) {
    splash.texture = app.loader.resources['over'].texture;
    // 마우스 클릭을 뗏고, sprite에 pointerover를 한 상태에서는 over sprite가 보이도록 한 것.
  } else {
    splash.texture = app.loader.resources['idle'].texture;
    // 마우스 클릭을 뗀 상태에서 pointerover도 아닌, 벗어나있는 상태라면 원래 맨 처음의 texture로 다시 override 하는 것
  }
  pointerIsDown = false;
}

function doPointerUpOutside() {
  // 마우스를 누른 상태에서 나와있다가 떼었을 때 원래의 초기 idle로 돌아가지 않는 버그를 해결하려고 추가로 만든 걸어놓은 이벤트 콜백함수
  splash.texture = app.loader.resources['idle'].texture;
  pointerIsDown = false;
  pointerIsOver = false;
}

function doPointerDown() {
  pointerIsDown = true;
  // sprite.texture에 새로운 texture를 할당함으로써 sprite.texture에 이미 담겨있는 텍스쳐를 override 하는거임. -> texture swapping 하는 방법!
  splash.texture = app.loader.resources['down'].texture;
}

function doPointerOver() {
  pointerIsOver = true;
  splash.texture = app.loader.resources['over'].texture;
}

function doPointerOut() {
  if (!pointerIsDown) {
    // pointer가 sprite 객체 밖으로 나와있는 상태에서 마우스를 떼고 있으면? 원래의 초기 idle sprite로 되돌려놔야 함.
    splash.texture = app.loader.resources['idle'].texture;
    pointerIsOver = false;
  }
}