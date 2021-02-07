'use strict';

let app;

// 3 different screens
let titleScreen;
let mainScreen;
let endScreen;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.body.appendChild(app.view);
  window.addEventListener('keyup', switchContainer);

  // Create our screens
  // container 객체는 sprite 객체들을 grouping해서 single unit으로 컨트롤하고 관리할 때 사용하는 객체.
  // 또는 game scene을 만들 때 사용한다고도 함.
  titleScreen = new PIXI.Container();
  mainScreen = new PIXI.Container();
  endScreen = new PIXI.Container();

  // 맨 처음에는 titleScreen만 빼고 나머지는 안보이게 하려는거임.
  // visible property가 false이면 sprite나 container 객체가 안보이게 할 수 있음.
  mainScreen.visible = false;
  endScreen.visible = false;

  app.stage.addChild(titleScreen);
  app.stage.addChild(mainScreen);
  app.stage.addChild(endScreen);

  // setup title screen
  // pixi의 graphic class는 canvas drawing api와 거의 유사함. 
  // 항상 새로운 그래픽 인스턴스를 만들려면 new PIXI.Graphic(); 을 할당하고 시작할 것.
  let redRect = new PIXI.Graphics();
  redRect.beginFill(0xFF0000); // 색을 채우는 메소드
  redRect.drawRect(0, 0, app.view.width, app.view.height); // rectangle을 그리는 메소드, (x, y, width, height)을 파라미터로 받음.
  titleScreen.addChild(redRect); // sprite을 container에 추가하는 방법.

  let text1 = new PIXI.Text('Title Screen');
  text1.anchor.set(0.5);
  text1.x = app.view.width / 2;
  text1.y = app.view.height / 2;
  text1.style = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 40,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: 0xFFFFFF,
    strokeThickness: 3
  });
  titleScreen.addChild(text1); // 마찬가지로 text1을 container에 추가함. 


  // setup main screen
  let greenRect = new PIXI.Graphics();
  greenRect.beginFill(0x00FF00);
  greenRect.drawRect(0, 0, app.view.width, app.view.height);
  mainScreen.addChild(greenRect);

  let text2 = new PIXI.Text('Main Screen');
  text2.anchor.set(0.5);
  text2.x = app.view.width / 2;
  text2.y = app.view.height / 2;
  text2.style = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 40,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: 0xFFFFFF,
    strokeThickness: 3
  });
  mainScreen.addChild(text2);

  // setup end screen
  let blueRect = new PIXI.Graphics();
  blueRect.beginFill(0x0000FF);
  blueRect.drawRect(0, 0, app.view.width, app.view.height);
  endScreen.addChild(blueRect);

  let text3 = new PIXI.Text('End Screen');
  text3.anchor.set(0.5);
  text3.x = app.view.width / 2;
  text3.y = app.view.height / 2;
  text3.style = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 40,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: 0xFFFFFF,
    strokeThickness: 3
  });
  endScreen.addChild(text3);
}

function switchContainer(e) {
  // e.key는 해당 키의 이름(키보드에 프린트된 이름)을 string으로 return해주는 거같음. e.keyCode랑 다름
  // 어떤 키를 누르는지에 따라 각 container.visible값을 바꿔줌.
  switch (e.key) {
    case '1':
      titleScreen.visible = true;
      mainScreen.visible = false;
      endScreen.visible = false;
      break;
    case '2':
      titleScreen.visible = false;
      mainScreen.visible = true;
      endScreen.visible = false;
      break;
    case '3':
      titleScreen.visible = false;
      mainScreen.visible = false;
      endScreen.visible = true;
      break;
  }
}