'use strict';

// Using CSS Fonts
// FontFreak
// Download custom fonts, set in CSS and use to render texts in Pixi's Text object. 
let app;
let text1;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xAAAAAA
  });

  document.body.appendChild(app.view);

  // Text 객체를 통해서 stage에 원하는 텍스트를 display할 수 있음.
  // Text 객체는 Sprite class로부터 inherit되기 때문에, sprite 객체가 가지고 있는
  // x, y, width, height, alpha, rotation 등 property를 모두 가지고 있고, 이걸 sprite 처럼 컨트롤할 수 있다.
  text1 = new PIXI.Text('Welcome To Your Doom!');
  text1.x = app.view.width / 2;
  text1.y = app.view.height / 2;
  text1.anchor.set(0.5);
  // textStyle은 텍스트 스타일을 추가할 때 쓰는 함수. style 이라는 객체를 추가해서 안에다가 텍스트 스타일 관련 데이터들을 object로 전달해줌.
  text1.style = new PIXI.TextStyle({
    fill: 0xFF0000,
    fontSize: 40,
    fontFamily: 'Arcade' // 이 부분이 중요! 우리가 css에서 @font-face 안에 임의로 할당한 font-family의 이름을 여기에 써주는 거! 그래야 해당 폰트가 적용됨!.
  });
  app.stage.addChild(text1);
}