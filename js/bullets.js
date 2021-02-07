'use strict';

// creating bullets(총알? 공?) for a game
let app;
let player;
let bullets = [];
// bullet array를 만든 이유는, bullet을 추적하기 위함.
// 발사하는 bullet이나 그런 것들을 우리가 움직일 수 있도록, 그리고 언제 어디에 있는지 확인한 다음 없애기 위해서 만듦.
// pixi에 의해서 추적되는 총알을 없애주기 위해서!

let bulletSpeed = 10;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view); // 여기서만 body안의 div태그에 넣어놓은거...
  app.stage.interactive = true;
  // app.stage.on('pointerdown', fireBullet); 
  // 이렇게 하면 이상한 게, sprite을 클릭했을때만 콘솔이 찍히고, stage(즉 캔버스영역)을 클릭하면 콘솔이 안찍힘.
  // 이게 좀 작동이 이상하고 우리가 원하는 게 아니기 때문에 아예 이걸 감싸고 있는 div 태그에 이벤트를 걸려고 함.
  document.querySelector('#gameDiv').addEventListener('pointerdown', fireBullet);

  // player object
  player = new PIXI.Sprite.from("images/player.png");
  player.anchor.set(0.5);
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;

  app.stage.addChild(player);

  // game loop를 만들어야 함. 총발을 발사하면 게임이 실행되니까 어딘가로 움직여야 하니까.
  app.ticker.add(gameLoop);
}

function fireBullet(e) {
  console.log('FIRE!');

  let bullet = createBullet();
  bullets.push(bullet);
  console.log(bullets);
  // 화면밖으로 나간 bullet sprite 객체를 잘 지웠는지 확인함. 클릭하자마자 콘솔에 확인시켜주는 거기 때문에
  // 클릭하는 순간 화면에 보이는 bullet sprite의 개수만 보일거임. 
  console.log(app.stage.children);
  // 화면 밖으로 나간 bullet sprite 객체를 stage에서 잘 지웠는지 확인함.
  // stage에는 player가 항상 존재하기 때문에 bullets array보다 항상 개수가 1개 더 많게 표시될 거임.
}

function createBullet() {
  let bullet = new PIXI.Sprite.from('images/bullet.png');
  bullet.anchor.set(0.5);
  bullet.x = player.x;
  bullet.y = player.y; // 일단 player랑 같은 좌표에 위치시키는 거임.
  bullet.speed = bulletSpeed; // 이거는 bullet이라는 sprite 객체에 speed: bulletSpeed 라는 key: value 값을 할당하는거임.
  app.stage.addChild(bullet);

  return bullet; // bullets array에 push하려고 마지막에 return한 것
}

function updateBullets(delta) {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.y -= bullets[i].speed;

    // 앞에 for loop에서 y좌표값을 -10씩, 즉 위쪽으로 옮겨가고 있으니까, y좌표값이 0보다 작다는 건
    // '해당 bullet sprite이 화면 밖으로 나갔다' 는 의미임. 그럴 경우, 'dead: true'라는 key: value 한 쌍을 객체에 할당하라는 뜻 
    if (bullets[i].position.y < 0) {
      bullets[i].dead = true; // 마찬가지로 하나의 bullet sprite객체에 임의로 이름을 지은 새로운 key: value 값을 할당한거임.
    }
  }

  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].dead) { // dead가 true인 bullet sprite가 있다면, 즉 화면밖으로 나간 sprite가 있다면, 해당 블록 실행.
      app.stage.removeChild(bullets[i]); // stage상에서 sprite를 제거하고 싶을때는 removeChild(sprite); 메소드를 사용함.
      // array.splice(start index, counts to delete) 삭제, 교체, 추가하기 시작할 index값을 넣고, 그 index를 포함해 삭제할 개수를 뒤에 넣음.
      bullets.splice(i, 1); // 즉 bullets array에서 해당 bullet sprite 객체만 지운다는 것.
    }
  }
}

// loop function의 경우 선택적으로 delta라는 parameter를 전달할 수 있는데, 
// 이게 뭐냐면 프레임 사이의 지연 시간? 시간 간격? 을 의마한다고 함.
// position을 얼만큼 이동할지 값을 더해줄 때 delta값을 더해주면 주사율에 관계없이 애니메이션을 만들 수 있다고 함.
// 그니까 성능이 후진 디바이스에서 돌리다가 프레임이 잘 안넘어가면 해당 지연시간만큼 이동할 수 있게 해주는 거 같음.
// 근데 이거는 말그대로 optional한 거라 안넣어줘도 상관은 없다고 함.
function gameLoop(delta) {
  updateBullets(delta);
  // 얘가 각각의 bullet의 y 값에 speed(10)만큼 더해주는 함수잖아. 
  // 또 div를 클릭할 때마다 bullet을 생성해서 stage에 렌더하고 bullets array에 넣어주잖아.
  // 지금 이 canvas에 ticker가 걸려있는 상태이기 때문에 1초에 60개씩 새로운 프레임을 그려내고 있고!
  // 그러면 당연히 gameLoop 함수도 1초에 60번씩 수행되고 있고, y값에 10씩 더해주는 것도 1초에 60번씩 진행된다는 거지?
  // 이렇게 하면 클릭할 때마다 새로운 bullet이 생성되서 bullet 애니메이션이 렌더될 수밖에 없다

  // 근데 한편으로는 화면밖에 나간 bullet sprite들도 bullet array에 계속 남아있게 되고,
  // stage상에도 남아있게 되는거라, 실제로는 화면 밖으로 나가서 안보이는건데도 stage에 남아서 계속 렌더되고 있는 상태임.
  // 이걸 다 제거하고 싶은거야. 어디서? updateBullets 함수에서
}