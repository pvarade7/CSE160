// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
}
`;

var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform int u_whichTexture;
void main() {

    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;            // Use color

    } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV,1.0,1.0);     // Use UV debug color

    } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV); // Use texture0

    } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
        gl_FragColor = vec4(1,.2,.2,1);        // Error, put Redish
    }
}`;

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;


function setupWebGL() {
    canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  gl.enable(gl.DEPTH_TEST); 
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
    }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }


  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
 
// Get the storage location of u_ModelMatrix
u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
}

u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
}

// Get the storage location of u_GlobalRotateMatrix
u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
}


u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
}

u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
if (!u_whichTexture) {
  console.log('Failed to get the storage location of u_whichTexture');
  return;
}

u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
}
u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
if (!u_Sampler1) {
  console.log('Failed to get u_Sampler1');
  return;
}


// Set an initial value for this matrix to identity
var identityM = new Matrix4();
gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);


}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // The color of the point
let g_selectedSize = 5.0;
let g_selectedType = POINT;
let g_selectedSegments = 10; // Default value

// Global angle variables
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;

// Animation on/off flags
let g_yellowAnimation = false;
let g_magentaAnimation = false;



function addActionsForHtmlUI() {
    // Button Events (Shape Type)
    //document.getElementById('green').onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
    //document.getElementById('red').onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
    //document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes();};
    //document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;};
    //document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE;};
    //document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;};

    document.getElementById('animationMagentaOffButton').onclick = function() { g_magentaAnimation = false; };
    document.getElementById('animationMagentaOnButton').onclick = function() { g_magentaAnimation = true; };

    document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};
    document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};

    
    // Slider Events
    //document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value / 100;});
    //document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value / 100;});
    //document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value / 100;});
    //document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});
    //document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value;});
    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });

}



function initTextures() {
  // Create two Image objects
  const imageSky   = new Image();
  const imageGrass = new Image();

  // Check they were created
  if (!imageSky || !imageGrass) {
    console.log('Failed to create image objects');
    return false;
  }

  // onload for sky
  imageSky.onload = function() {
    console.log('Sky image loaded successfully');
    // Upload to TEXTURE0 => u_Sampler0
    sendImageToTEXTURE(imageSky, 0); 
  };

  // onload for grass
  imageGrass.onload = function() {
    console.log('Grass image loaded successfully');
    // Upload to TEXTURE1 => u_Sampler1
    sendImageToTEXTURE(imageGrass, 1);
  };

  // onerror (optional)
  imageSky.onerror = function() {
    console.log('Error loading sky image');
  };
  imageGrass.onerror = function() {
    console.log('Error loading grass image');
  };

  // Start the actual file loads
  imageSky.src   = 'sky.jpg';
  imageGrass.src = 'grass.jpg';

  console.log('Started loading images...');
  return true;
}


function sendImageToTEXTURE(image, texUnitIndex) {
  // Create a texture object
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image’s Y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Pick which texture unit to use (0 or 1)
  if (texUnitIndex === 0) {
    gl.activeTexture(gl.TEXTURE0);
  } else { // 1, or more if you have more textures
    gl.activeTexture(gl.TEXTURE1);
  }

  // Bind the texture object
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Upload the image into the GPU
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,
                gl.UNSIGNED_BYTE, image);

  // Finally, tell the sampler uniform which texture unit it belongs to
  if (texUnitIndex === 0) {
    gl.uniform1i(u_Sampler0, 0);
    console.log('sky.jpg loaded into TEXTURE0 => u_Sampler0');
  } else {
    gl.uniform1i(u_Sampler1, 1);
    console.log('grass.jpg loaded into TEXTURE1 => u_Sampler1');
  }
}


function main() {
  // Retrieve <canvas> element
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  addMouseListeners();

  document.onkeydown = keydown;

  initTextures(); 

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;


function tick() {
  // Save the current time
  g_seconds=performance.now()/1000.0-g_startTime;

  // Update Animation Angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}


// Update the angles of everything if currently animated
function updateAnimationAngles() {
  if (g_yellowAnimation) {
      g_yellowAngle = (45*Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
      g_magentaAngle = (45*Math.sin(3*g_seconds));
  }
}




var g_shapesList = [];


// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return [x, y];
}


function keydown(ev) {
  // Check the keyCode
  if (ev.keyCode === 65) {       // 'A' -> Move left
    g_camera.eye.elements[0] -= 0.2;
  } else if (ev.keyCode === 68) { // 'D' -> Move right
    g_camera.eye.elements[0] += 0.2;
  } else if (ev.keyCode === 87) { // 'W' -> Move forward
    g_camera.eye.elements[2] -= 0.2;
  } else if (ev.keyCode === 83) { // 'S' -> Move backward
    g_camera.eye.elements[2] += 0.2;
  } else if (ev.keyCode === 81) { // 'Q' -> Pan left
    g_camera.panLeft();
  } else if (ev.keyCode === 69) { // 'E' -> Pan right
    g_camera.panRight();
  } else if (ev.keyCode === 90) { // 'Z' => Add block
    addBlockInFront();
  } else if (ev.keyCode === 88) { // 'X' => Remove block
    removeBlockInFront();
}

  renderAllShapes();
  console.log(ev.keyCode);
}

let isDragging = false;
let lastX = -1;
let lastY = -1;
const MOUSE_SENSITIVITY = 0.5;

function addMouseListeners() {
  canvas.onmousedown = function(ev) {
    isDragging = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
  };

  canvas.onmouseup = function(ev) {
    isDragging = false;
  };

  canvas.onmousemove = function(ev) {
    if (!isDragging) return;

    let dx = ev.clientX - lastX;
    let dy = ev.clientY - lastY;
    lastX = ev.clientX;
    lastY = ev.clientY;

    let yawAngle = dx * MOUSE_SENSITIVITY;
    if (yawAngle > 0) {
      g_camera.panRight(yawAngle);
    } else {
      g_camera.panLeft(-yawAngle);
    }

    let pitchAngle = dy * MOUSE_SENSITIVITY;
    if (pitchAngle > 0) {
      g_camera.pitchDown(pitchAngle);
    } else {
      g_camera.pitchUp(-pitchAngle);
    }

    renderAllShapes();
  };

  canvas.oncontextmenu = function(ev) {
    ev.preventDefault();
  };
}


function getLookedAtCell(maxDistance = 20, step = 0.1) {
  // Use the full 3D direction from eye to at
  let forward = new Vector3([
    g_camera.at.elements[0] - g_camera.eye.elements[0],
    g_camera.at.elements[1] - g_camera.eye.elements[1],
    g_camera.at.elements[2] - g_camera.eye.elements[2]
  ]);
  forward.normalize();

  for (let dist = 0; dist < maxDistance; dist += step) {
    // World coordinates at this step
    let testPos = new Vector3([
      g_camera.eye.elements[0] + forward.elements[0] * dist,
      g_camera.eye.elements[1] + forward.elements[1] * dist,
      g_camera.eye.elements[2] + forward.elements[2] * dist
    ]);

    // Convert world coords → map coords. (Because drawMap does (x-2, z-2).)
    let mapX = Math.floor(testPos.elements[0] + 2 + 0.5);
    let mapZ = Math.floor(testPos.elements[2] + 2 + 0.5);

    if (
      mapZ >= 0 && mapZ < g_map.length &&
      mapX >= 0 && mapX < g_map[0].length
    ) {
      return { x: mapX, z: mapZ };
    }
  }

  return null;
}

function addBlockInFront() {
  let cell = getLookedAtCell();
  if (!cell) {
    console.log('No valid cell in front of camera');
    return;
  }
  let { x, z } = cell;
  g_map[z][x]++; // Increase height of that cell
  console.log(`Added block at x=${x}, z=${z}, new height=${g_map[z][x]}`);
  renderAllShapes();
}

function removeBlockInFront() {
  let cell = getLookedAtCell();
  if (!cell) {
    console.log('No valid cell in front of camera');
    return;
  }
  let { x, z } = cell;
  if (g_map[z][x] > 0) {
    g_map[z][x]--;
    console.log(`Removed block at x=${x}, z=${z}, new height=${g_map[z][x]}`);
  } else {
    console.log(`Cannot remove from x=${x}, z=${z}, height=0`);
  }
  renderAllShapes();
}



var g_camera = new Camera();

var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

function drawMap() {
  for (let z=0; z<g_map.length; z++){
    for (let x=0; x<g_map[0].length; x++){
      let height = g_map[z][x];
      for (let h=0; h<height; h++){
        let wall = new Cube();
        wall.textureNum = 1;  
        wall.color = [1,1,1,1];
        wall.matrix.translate(x - 2, -0.75 + h*1.0, z - 2);
        wall.renderfaster();
      }
    }
  }
}


function drawBee(x, y, z, rotY, scaleFactor) {
  let beeMatrix = new Matrix4();
  beeMatrix.translate(x, y, z);           // position
  beeMatrix.rotate(rotY, 0, 1, 0);        // rotate about Y
  beeMatrix.scale(scaleFactor, scaleFactor, scaleFactor);

  let head = new Cube();
  head.color = [0.0, 0.0, 0.0, 1.0];  
  head.textureNum = -2;             
  let headMatrix = new Matrix4(beeMatrix);
  headMatrix.translate(0, 0, 0.15);  
  headMatrix.scale(0.15, 0.15, 0.15);
  head.matrix = headMatrix;
  head.renderfaster();

  
  let body1 = new Cube();
  body1.color = [0.0, 0.0, 0.0, 1.0]; // black
  body1.textureNum = -2;
  let body1Matrix = new Matrix4(beeMatrix);
  body1Matrix.translate(0, 0, 0.0);
  body1Matrix.scale(0.2, 0.2, 0.1);
  body1.matrix = body1Matrix;
  body1.renderfaster();

  let body2 = new Cube();
  body2.color = [1.0, 1.0, 0.0, 1.0]; // yellow
  body2.textureNum = -2;
  let body2Matrix = new Matrix4(beeMatrix);
  body2Matrix.translate(0, 0, -0.1); // further behind
  body2Matrix.scale(0.2, 0.2, 0.1);
  body2.matrix = body2Matrix;
  body2.renderfaster();

  let tail = new Cube();
  tail.color = [0.0, 0.0, 0.0, 1.0];
  tail.textureNum = -2;
  let tailMatrix = new Matrix4(beeMatrix);
  tailMatrix.translate(0, 0, -0.2); 
  tailMatrix.scale(0.2, 0.2, 0.1);
  tail.matrix = tailMatrix;
  tail.renderfaster();


  let leftWing = new Cube();
  leftWing.color = [1.0, 1.0, 1.0, 0.6];
  leftWing.textureNum = -2;
  let leftWingMatrix = new Matrix4(beeMatrix);
  leftWingMatrix.translate(-0.15, 0.15, 0.0); 
  leftWingMatrix.rotate(20, 0, 0, 1); 
  leftWingMatrix.scale(0.6, 0.02, 0.3);
  leftWing.matrix = leftWingMatrix;
  leftWing.renderfaster();

  // Right wing
  let rightWing = new Cube();
  rightWing.color = [1.0, 1.0, 1.0, 0.6];
  rightWing.textureNum = -2;
  let rightWingMatrix = new Matrix4(beeMatrix);
  rightWingMatrix.translate(0.15, 0.15, 0.0);
  rightWingMatrix.rotate(-20, 0, 0, 1);
  rightWingMatrix.scale(0.6, 0.02, 0.3);
  rightWing.matrix = rightWingMatrix;
  rightWing.renderfaster();
}


function renderAllShapes() {
  // Clear <canvas>
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, 1* canvas.width/canvas.height,  1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();

  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
    g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]
);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawMap(); 


  //var len = g_points.length;
  var len = g_shapesList.length;

  // Draw the floor
  var ground = new Cube();
  ground.color = [1.0, 0.0, 0.0, 1.0];
  ground.textureNum = 1;
  ground.matrix.translate(0, -0.75, 0.0);
  ground.matrix.scale(20, 0.1, 20);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.renderfaster();


  // Draw the sky
  var sky = new Cube();
  sky.color = [1.0, 1.0, 1.0, 1.0];
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.renderfaster();

  drawBee( 2.0, 1.5,  0.0,   20, 1.0);
  drawBee( 0.0, 2.0,  2.0,  -45, 0.8); 
  drawBee(-2.0, 1.0, -2.0,   90, 1.2); 

  drawBee( 3.5, 2.2,  3.0,   30, 0.7); 
  drawBee(-3.0, 2.5,  1.5,  180, 1.0); 
  drawBee( 1.0, 2.8, -3.5,  -15, 1.1); 
  drawBee( 4.0, 2.0, -1.5,   60, 0.9); 
  drawBee(-4.0, 2.0,  2.5,  -30, 1.0);

  drawBee(  2.5, 2.5,  4.0,   10, 0.8); 
  drawBee( -2.5, 2.5,  4.0,  -10, 1.0); 
  drawBee(  0.5, 3.2, -2.0,   45, 0.9); 
  drawBee( -0.5, 1.7,  2.0,  -45, 1.1); 
  drawBee(  3.8, 1.9, -2.5,   20, 0.85); 
  drawBee( -3.8, 2.0,  1.8,  160, 1.05); 
  drawBee(  2.2, 3.0, -0.8,  100, 1.0); 
  drawBee( -2.2, 3.5,  0.8,   80, 0.7); 
  drawBee(  1.7, 2.7,  3.4,  -60, 0.95); 
  drawBee( -1.7, 3.1, -3.4,  120, 1.2); 

  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 1.0, 0.0, 1.0];
  body.textureNum = -2;
  body.matrix.translate(-.25, -.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, .3, .5);
  body.renderfaster();


  // Draw a left arm
  var yellow = new Cube();
  yellow.color = [1,1,0,1];
  yellow.matrix.setTranslate(0, -.5, 0.0);
  yellow.matrix.rotate(-5,1,0,0);
 
  yellow.matrix.rotate(-g_yellowAngle, 0,0,1);
  var yellowCoordinatesMat=new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, .7, .5);
  yellow.matrix.translate(-.5,0,0);
  yellow.renderfaster();

  // Test box
  var magenta = new Cube();
  magenta.color = [1,0,1,1];
  magenta.textureNum = -2;
  magenta.matrix = yellowCoordinatesMat;
  magenta.matrix.translate(0, 0.65, 0);
  magenta.matrix.rotate(g_magentaAngle,0,0,1);
  magenta.matrix.scale(.3,.3,.3);
  magenta.matrix.translate(-.5,0,-0.001);
  magenta.renderfaster();


  // A bunch of rotating cubes
  var K=10.0;
  for (var i=1; i<K; i++) {
  var c = new Cube();
  c.matrix.translate(-.8,1.9*i/K-1.0,0);
  c.matrix.rotate(g_seconds*100,1,1,1);
  c.matrix.scale(.1, 0.5/K, 1.0/K);
  c.renderfaster();
}


  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}







  
    // Set the text of an HTML element
    function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}




