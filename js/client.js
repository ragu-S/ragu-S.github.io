var stage, oX, oY, size, color, start, i;
var drawing = [];
var LeftArrow = 37;
var SHIFT = 16;

function keydown(event) {
  //removes previous drawing
  if(event.keyCode == LeftArrow){
    stage.removeChild(drawing[i - 1]);
    i--;
  }
  stage.update();
}

function init() {
  stage = new createjs.Stage("whiteboard");
  stage.enableDOMEvents(true);
  color = "#ff0000";
  size = 2;
  start = false;
  i = 0;

  // adding new shape to canvas
  stage.on("stagemousedown",function(evt) {
    start = true;
    drawing[i] = new createjs.Shape();
    stage.addChild(drawing[i]);
  });

  stage.on("stagemouseup",function(evt) {
    start = false;
    i++;
  });

  stage.on("stagemousemove",function(evt) {

    if(oX && start){
      drawing[i].graphics.beginStroke(color)
      .setStrokeStyle(size,"round")
      .moveTo(oX,oY)
      .lineTo(evt.stageX,evt.stageY);

      stage.update(); 
    } 

    oX = evt.stageX;
    oY = evt.stageY;           
  });

  this.document.onkeydown = keydown;
  stage.update();
}