// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
}
`;

var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}
`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
/*
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
}
*/
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



function main() {
  // Retrieve <canvas> element
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

 

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.4, 0.5, 1.0);

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

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const globalRotMat = new Matrix4().rotate(-g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  const BROWN = [0.6, 0.4, 0.2, 1.0];
  const WHITE = [0.95, 0.95, 0.95, 1.0];
  const BLACK = [0.1, 0.1, 0.1, 1.0];
  const PINK  = [0.95, 0.6, 0.6, 1.0];

  let bodyMain = new Cube();
  bodyMain.color = BROWN;
  bodyMain.matrix.translate(-0.35, -0.1, -0.2);
  bodyMain.matrix.scale(0.8, 0.3, 0.4);
  bodyMain.render();

  let bodyUnder = new Cube();
  bodyUnder.color = WHITE;
  bodyUnder.matrix.translate(-0.35, -0.2, -0.2);
  bodyUnder.matrix.scale(0.8, 0.2, 0.4);
  bodyUnder.render();

  let neck = new Cube();
  neck.color = BROWN;
  neck.matrix.translate(-0.4, -0.1, -0.15);
  neck.matrix.scale(0.15, 0.2, 0.3);
  neck.render();

  let head = new Cube();
  head.color = BROWN;
  head.matrix.translate(-0.52, -0.1, -0.15);
  head.matrix.scale(0.25, 0.25, 0.3);
  head.render();

  let muzzle = new Cube();
  muzzle.color = WHITE;
  muzzle.matrix.translate(-0.55, -0.05, -0.12);
  muzzle.matrix.scale(0.15, 0.12, 0.24);
  muzzle.render();

  let nose = new Cube();
  nose.color = BLACK;
  nose.matrix.translate(-0.56, -0.01, -0.08);
  nose.matrix.scale(0.04, 0.04, 0.16);
  nose.render();

  let mouth = new Cube();
  mouth.color = PINK;
  mouth.matrix.translate(-0.55, -0.08, -0.08);
  mouth.matrix.scale(0.02, 0.02, 0.16);
  mouth.render();

  let leftEye = new Cube();
  leftEye.color = BLACK;
  leftEye.matrix.translate(-0.56, 0.04, 0.15);
  leftEye.matrix.scale(0.04, 0.04, 0.04);
  leftEye.render();

  let rightEye = new Cube();
  rightEye.color = BLACK;
  rightEye.matrix.translate(-0.56, 0.04, -0.20);
  rightEye.matrix.scale(0.04, 0.04, 0.04);
  rightEye.render();

  let leftEar = new Cube();
  leftEar.color = BROWN;
  leftEar.matrix.translate(-0.55, 0.12, 0.05);
  leftEar.matrix.rotate(15, 0, 0, 1);
  leftEar.matrix.scale(0.05, 0.15, 0.08);
  leftEar.render();

  let rightEar = new Cube();
  rightEar.color = BROWN;
  rightEar.matrix.translate(-0.55, 0.12, -0.15);
  rightEar.matrix.rotate(15, 0, 0, 1);
  rightEar.matrix.scale(0.05, 0.15, 0.08);
  rightEar.render();

  let flUpper = new Cube();
  flUpper.color = WHITE;
  flUpper.matrix.translate(-0.3, -0.3, 0.15);
  flUpper.matrix.scale(0.08, 0.25, 0.08);
  flUpper.render();

  let flLower = new Cube();
  flLower.color = WHITE;
  flLower.matrix.translate(-0.3, -0.3, 0.15);
  flLower.matrix.rotate(g_yellowAngle, 1, 0, 0);
  flLower.matrix.translate(0, -0.25, 0);
  flLower.matrix.scale(0.08, 0.25, 0.08);
  flLower.render();

  let frUpper = new Cube();
  frUpper.color = WHITE;
  frUpper.matrix.translate(-0.3, -0.3, -0.25);
  frUpper.matrix.scale(0.08, 0.25, 0.08);
  frUpper.render();

  let frLower = new Cube();
  frLower.color = WHITE;
  frLower.matrix.translate(-0.3, -0.3, -0.25);
  frLower.matrix.rotate(g_yellowAngle, 1, 0, 0);
  frLower.matrix.translate(0, -0.25, 0);
  frLower.matrix.scale(0.08, 0.25, 0.08);
  frLower.render();

  let blUpper = new Cube();
  blUpper.color = WHITE;
  blUpper.matrix.translate(0.3, -0.3, 0.15);
  blUpper.matrix.scale(0.08, 0.25, 0.08);
  blUpper.render();

  let blLower = new Cube();
  blLower.color = WHITE;
  blLower.matrix.translate(0.3, -0.3, 0.15);
  blLower.matrix.rotate(g_yellowAngle, 1, 0, 0);
  blLower.matrix.translate(0, -0.25, 0);
  blLower.matrix.scale(0.08, 0.25, 0.08);
  blLower.render();

  let brUpper = new Cube();
  brUpper.color = WHITE;
  brUpper.matrix.translate(0.3, -0.3, -0.25);
  brUpper.matrix.scale(0.08, 0.25, 0.08);
  brUpper.render();

  let brLower = new Cube();
  brLower.color = WHITE;
  brLower.matrix.translate(0.3, -0.3, -0.25);
  brLower.matrix.rotate(g_yellowAngle, 1, 0, 0);
  brLower.matrix.translate(0, -0.25, 0);
  brLower.matrix.scale(0.08, 0.25, 0.08);
  brLower.render();

  let tailBase = new Cube();
  tailBase.color = BROWN;
  tailBase.matrix.translate(0.4, 0.1, -0.02);
  tailBase.matrix.rotate(-20, 0, 0, 1);
  tailBase.matrix.scale(0.15, 0.06, 0.06);
  tailBase.render();

  let tailTip = new Cube();
  tailTip.color = BROWN;
  tailTip.matrix = new Matrix4(tailBase.matrix);
  tailTip.matrix.translate(1.0, 0, 0);
  tailTip.matrix.rotate(g_magentaAngle, 0, 0, 1);
  tailTip.matrix.scale(0.8, 1.0, 1.0);
  tailTip.render();

  sendTextToHTML(
    `Camera=${g_globalAngle}, Leg=${g_yellowAngle}, Tail=${g_magentaAngle}`,
    "numdot"
  );
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




