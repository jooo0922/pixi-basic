'use strict';

// Using ES6 Class to extend sprite class in pixi.js
// ES6 Class 문법으로 sprite 생성하기
let app;
let knight;
let wolf;

// class에서 extends 키워드를 사용하면 PIXI.Sprite에 정의된 fields and method가
// 자동적으로 class Monster에 포함됨. -> 클래스 상속!
class Monster extends PIXI.Sprite {
  // 생성자에 전달할 parameter를 깜빡하고 할당하지 못할 수도 있으니까, 각 파라미터에 default value를 할당해줄 수도 있음. optional하게 해도 됨.
  constructor(x = 0, y = 0, texture, name = 'none', hp = 100, speed = 5) {
    super(texture); // 부모 클래스인 PIXI.Sprite에서 texture 값을 상속받는 것. 
    // 그니까 이거는 run = new PIXI.Sprite.from(app.loader.resources['run'].texture); 이런식으로 변환된 텍스쳐 포맷으로 sprite 객체를 만드는 거를
    // 클래스 상속을 통해서 표현하는 방법임.
    /**
     * super 키워드는 부모 오브젝트의 함수를 호출할 때 사용
     * 
     * 문법
     * super([arguments]); // 부모 클래스의 생성자 호출
     * super.functionOnParent([arguments]); // 부모 클래스의 메소드 호출
     */

    this.anchor.set(0.5);
    // this는 이제 뭐가되겠어? 예를 들어 run = new Monster(x, y, texture, name, hp, speed); 
    // 이렇게 인스턴스 생성할 때 생성될 인스턴스 자체, 즉, run을 가리키는 거겠지?

    this.name = name;
    this.hp = hp;
    this.speed = speed;
    // 얘내는 만들어진 sprite 객체 인스턴스에 우리가 원하는 key = value 쌍을 새롭게 만든거임.

    this.x = x;
    this.y = y;
    // 얘내는 좌표값을 할당해준거지?
  }

  // Monster class의 메소드를 정의함.
  status() {
    return this.name + ' has ' + this.hp + ' hit points';
  }

  move() {
    // 해당 메소드를 호출하면 x좌표값을 파라미터로 전달받은 speed값만큼 더해서 이동시켜주는 것.
    this.x = this.x + this.speed;

    // 해당 sprite 객체의 anchor point가 canvas 오른쪽 끝 - width의 절반 or 왼쪽 끝 - width의 절반에 위치하게 될 경우, 
    // 왜 this.width/2를 했을까? 생성자에서 anchor.set(0.5) 로 위치시켰으니까!
    // 기준점 자체가 sprite 객체의 가운데에 있는거야! 그니까 걔내들이 전체 캔버스 width에서 sprite 객체 width의 절반을 뺀 만큼의 위치에 있어야
    // sprite 객체가 캔버스 끝에 닿게 되는거임. 
    // 즉 sprite 객체가 캔버스 양끝에 닿았을때 해당 if block을 실행하라는 거임.
    if (this.x > app.view.width - this.width / 2 ||
      this.x < this.width / 2) {
      this.speed = -this.speed; // 이렇게 하면 x좌표값의 이동방향이 바뀌겠지?
    }
  }
}

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.querySelector('#gameDiv').appendChild(app.view);

  // 클래스로 생성하고자 하는 sprite에 사용될 이미지들 preload하기
  app.loader.baseUrl = 'sprites';
  app.loader
    .add('knight', 'knight.png')
    .add('wolf', 'wolf.png');
  app.loader.onComplete.add(doneLoading);
  app.loader.load();
}

// 로드가 완전히 끝나면 수행할 함수
function doneLoading() {
  // 로드한 이미지들을 가져와서 sprite로 만들거임.
  createMonsters();

  // 로드가 끝나고 나서 함수를 수행할 때 캔버스에 애니메이션을 걸려고 함.
  app.ticker.add(gameLoop);
}

function gameLoop(delta) {
  // knight, wolf는 createMonsters 함수에 의해 class Monster로부터 각각 새로운 인스턴스를 할당받게 됨.
  // 그리고 얘내들이 global scope로 지정되어 있기 때문에 loop function에서도 사용할 수 있음.
  // 그러니까 얘내들의 인스턴스에서 move 메소드를 1초에 60번 호출함으로써 애니메이션을 만들 수 있음
  knight.move();
  wolf.move();
}

function createMonsters() {
  knight = new Monster(100, 100, app.loader.resources['knight'].texture, 'knight', 200, 6);
  wolf = new Monster(100, 500, app.loader.resources['wolf'].texture, 'wolf', 100, 10);
  app.stage.addChild(knight);
  app.stage.addChild(wolf);
}