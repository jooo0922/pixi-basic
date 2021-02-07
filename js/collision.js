'use strict';

// Basic collision
// pixi 자체에는 collision library나 function이 없음. 우리가 직접 만들어줘야 함.
let app;
let player;

// player와 충돌할 무언가를 만들어줘야 함.
let enemy;

let speed = 4;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.body.appendChild(app.view);

  // player object
  player = new PIXI.Sprite.from("images/player.png");
  player.anchor.set(0.5);
  player.x = 16; // 16은 브라우저 왼쪽 모서리와 캔버스 사이의 간격이 16이라서 위치시킨것 같음.
  player.y = app.view.height / 2;
  app.stage.addChild(player);

  // enemy object
  enemy = new PIXI.Sprite.from("images/player.png");
  enemy.anchor.set(0.5);
  enemy.x = app.view.width - 16; // 반대편에 있어야 하는 애니까 끝에서 -16하면 되겠지
  enemy.y = app.view.height / 2;
  app.stage.addChild(enemy);

  app.ticker.add(gameLoop);
}

function gameLoop(delta) {
  player.x += speed;
  enemy.x -= speed; // 여기까진 일단 서로를 향해서 돌진하다가 서로를 pass through하는 애니메이션이 나오겠지

  // rectsIntersect(player, enemy)로 return받은 값이 true면 해당 if block을 수행하라는 거지?
  if (rectsIntersect(player, enemy)) {
    speed = 0;
  }

}

// function that detect hit each ohter
function rectsIntersect(a, b) {
  // spriteObj.getBounds()는 해당 sprite 객체의 x, y 좌표 및 width, height값을 포함하는 객체를 return함.
  let aBox = a.getBounds();
  let bBox = b.getBounds();

  // 여기 조건을 모두 만족하는 순간은 두 박스의 모서리가 맞딱뜨린 후부터 서로의 반대편 모서리가 포개어지기 전까지
  return aBox.x + aBox.width > bBox.x && // aBox의 오른쪽 모서리 > bBox의 왼쪽 모서리
    aBox.x < bBox.x + bBox.width && // aBox의 왼쪽 모서리 < bBox의 오른쪽 모서리
    aBox.y + aBox.height > bBox.y && // aBox의 아래쪽 모서리 > bBox의 위쪽 모서리 (y는 아래로 갈수록 항상 더 큼.)
    aBox.y < bBox.y + bBox.height; // aBox의 위쪽 모서리 < bBox의 아래쪽 모서리 (아래 두 줄은 aBox가 위, bBox가 아래에서 출발할 때를 가정하는 거 같음.)
  // 이렇게 조건문만 나열해놓으면, 얘내를 모두 만족하면 true, 아니면 false를 return하게 될거임.
}