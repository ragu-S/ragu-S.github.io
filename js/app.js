(function() {
  var CanvasObjects = [];
  var myRenderer;
  var stage;
  var canvasHeight = 810;
  var canvasWidth = 1000;
  var selectPressed = false;

  window.onload = function() {

    initPixie();

    addUI();

    addCiricle();

    addRect();

    //drawPolygon();
    //moveObject(stage);
  };

  function initPixie() {
    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0x3da8bb);

    var rendererOptions = {
      antialiasing:false,
      transparent:false,
      resolution:1
    };

    // create a renderer instance
    myRenderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, rendererOptions);

    // add the renderer view element to the DOM
    //document.body.appendChild(myRenderer.view);
    document.getElementById('whiteboard').appendChild(myRenderer.view);

    // width="1000" height="810px"
  // requestAnimFrame(animate);

  //   function animate() {
  //     requestAnimFrame(animate);
    stage.interactive = true;
    myRenderer.render(stage);
  }

  function addUI() {
    var iconActive = false;

    // Set toolbox button listeners
    var pencilIcon = document.getElementById('pencil');
    var selectIcon = document.getElementById('select');
    var rectIcon = document.getElementById('rectangle');

    pencilIcon.addEventListener('click', function(data) {
      console.log("pencil selected");
      selectPressed = false;
      activatePencil();
      //drawRect();
    });

    selectIcon.addEventListener('click', function(data) {
      console.log("pressing select");
      selectPressed = true;
      deactivateStage();
    });

    rectIcon.addEventListener('click', function(data) {
      selectPressed = false;
      deactivateStage();
      drawRect();
    });

  }

  function drawRect() {
    // var isActive = true;
    var isDown = false;
    var originalCoords;
    var curStageIndex = 0;
    var drawBegan = false;
    var finalGraphics;
    var inverse;

    stage.mousedown = function(data) {
      console.log("selected",selectPressed);
      if(selectPressed) return;
      isDown = true;
      data.originalEvent.preventDefault();
      var graphics = PIXI.Graphics();

      this.data = data;

      originalCoords = data.getLocalPosition(this);
      curStageIndex = stage.children.length;

      console.log("drawing");
    };

    stage.mousemove = function(data) {
      if(isDown) {
        var graphics = new PIXI.Graphics();
        var localPos = data.getLocalPosition(this);

        if(drawBegan) stage.removeChildAt(curStageIndex);

        graphics.beginFill(0xFF0000);
        graphics.drawRect(
          originalCoords.x,
          originalCoords.y,
          localPos.x - originalCoords.x,
          localPos.y - originalCoords.y
        );

        //inverse = (localPos.x - originalCoords.x < 0) || (localPos.y - originalCoords.y < 0);

        stage.addChild(graphics);

        finalGraphics = graphics;
        //finalCoords =

        drawBegan = true;

        myRenderer.render(stage);
      }
    };

    stage.mouseup = function(data) {
      drawBegan = false;
      isDown = false;
      // var graphics = new PIXI.Graphics();

      if(finalGraphics) {
        console.log("Final", finalGraphics.getBounds());
        finalGraphics.interactive = true;

        moveObject(finalGraphics);
      }

      myRenderer.render(stage);
    };

  }

  function addRect() {
    //var rect = new PIXI.drawRect(120,10,100,200);
    var path = [];
    var graphics = new PIXI.Graphics();
    graphics.interactive = true;

    //moveObject(graphics, { x: 600*0.75, y: 10 });
    moveObject(graphics);

    graphics.beginFill(0xFF0000);
    graphics.drawRect(canvasWidth*0.75,10,100,200);

    stage.addChild(graphics);

    myRenderer.render(stage);
  }

  function addCiricle() {
    var circle = new PIXI.Circle(200,200,40);

    var path = [];
    var graphics = new PIXI.Graphics();
    graphics.interactive = true;

    moveObject(graphics);

    graphics.beginFill(0xFF00FF);

    graphics.drawShape(circle);

    stage.addChild(graphics);

    myRenderer.render(stage);
  }

  function getPolygonBounds(vertices, lineWidth, boundingWidth) {
    var upperBounds = [];
    var lowerBounds = [];

    lineWidth += boundingWidth || 3;

    vertices.forEach(function(point, index, array) {
      if((index+1)%2 === 0)
      // X-Coordinate
      upperBounds.push(point + lineWidth);
      // Y-Coordinate
      lowerBounds.push(point - lineWidth);
    });

    return [upperBounds, lowerBounds];
  }

  function activatePencil() {
    var path = [];

    // var isActive = true;
    var isDown = false;
    var posOld;
    var stageIndex = 0;
    var lines = 0;

    stage.mousedown = function(data) {
      //if(!isActive) return;
      isDown = true;
      lines = 0;
      path = [];
      console.log("mousedown");
      posOld = [data.global.x, data.global.y];
      path.push(posOld[0],posOld[1]);
      stageIndex = stage.children.length - 1;
      //graphics.moveTo(data.global.x, data.global.y);
    };

    stage.mousemove = function(data) {
      //if(!isActive) return;
      if(!isDown) return;
      var graphics = new PIXI.Graphics().lineStyle(2, 0xFF0000);
      //path.push(data.global.y);
      //var newPosition = this.data.getLocalPosition(this.parent);
      graphics.moveTo(posOld[0], posOld[1]);
      //console.log(data.global.x, data.global.y);
      graphics.lineTo(data.global.x, data.global.y);
      posOld = [data.global.x, data.global.y];
      path.push(posOld[0],posOld[1]);
      lines++;
      stage.addChild(graphics);

      myRenderer.render(stage);
    };

    stage.mouseup = function() {
      isDown = false;

      if(!path.length) return;
      //graphics.lineStyle(5, 0xFF0000);
      //graphics.moveTo(path[0][0], path[0][1]);
      //graphics.drawPolygon(path);
      while(lines) {
        stage.removeChildAt(stageIndex + lines);
        lines--;
      }

      var graphics = new PIXI.Graphics().lineStyle(2, 0xFF0000);

      graphics.drawPolygon(path);

      graphics.interactive = true;

      graphics.hitArea = graphics.getBounds();

      moveObject(graphics, { x: graphics.hitArea.x, y: graphics.hitArea.y });

      stage.addChild(graphics);

      CanvasObjects.push({
        _id: CanvasObjects.length + 1,
        type: 'pencil',
        coords: path
      });

      myRenderer.render(stage);
    };
  }

  function deactivateStage() {
    stage.mousedown = null;
    stage.mousemove = null;
    stage.mouseup = null;
  }

  function moveObject(graphics, inverse) {
    var selected = false;
    var orginial;

    graphics.mousedown = graphics.touchstart = function(data)
    {
      if(!selectPressed) return;
      data.originalEvent.preventDefault();

      this.data = data;
      orginial = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      myRenderer.render(stage);
      //console.log(data.getLocalPosition(obj));
      //obj.position = obj.toLocal(data.getLocalPosition(obj));
      // obj.y += 20;
    };

    graphics.mousemove = function(data)
    {
      if(selected) {
        var newPosition = this.data.getLocalPosition(this.parent);

        //if(inverse) {
          // this.position.x = orginial.x - newPosition.x;
          // this.position.y = orginial.y - newPosition.y;
        //}
        // else {
          this.position.x = newPosition.x - orginial.x;
          this.position.y = newPosition.y - orginial.y;
        // }

        //this.position = newPosition;
        //console.log(this.data.global.x, this.data.global.y);
        myRenderer.render(stage);
      }
    };

    graphics.mouseup = graphics.mouseupoutside = graphics.touchend = graphics.touchendoutside = function(data) {
      if(!selectPressed) return;
      selected = false;
      this.alpha = 1;
      //this.dragging = false;

      // set the interaction data to null
      this.data = null;
      myRenderer.render(stage);
    };
  }
})();
