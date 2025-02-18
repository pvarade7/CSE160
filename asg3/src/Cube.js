class Cube {
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];  // base color
      this.matrix = new Matrix4();
      this.textureNum = 0; 
      this.cubeVerts32Positions = new Float32Array([
        // FRONT FACE (2 triangles)
         0,0,0,   1,1,0,   1,0,0,
         0,0,0,   0,1,0,   1,1,0,
  
        // TOP FACE (2 triangles)
         0,1,0,   0,1,1,   1,1,1,
         0,1,0,   1,1,1,   1,1,0,
  
        // RIGHT FACE (2 triangles)
         1,1,0,   1,1,1,   1,0,0,
         1,0,0,   1,1,1,   1,0,1,
  
        // LEFT FACE (2 triangles)
        0,1,0,   0,1,1,   0,0,0,
        0,0,0,   0,1,1,   0,0,1,
  
        // BOTTOM FACE (2 triangles)
         0,0,0,   0,0,1,   1,0,1,
         0,0,0,   1,0,1,   1,0,0,
  
        // BACK FACE (2 triangles)
         0,0,1,   0,1,1,   1,1,1,
         0,1,1,   1,0,1,   1,1,1
      ]);
  
      
      this.cubeVerts32UV = new Float32Array([
        // FRONT FACE
        0,0,   1,1,   1,0,
        0,0,   0,1,   1,1,
  
        // TOP FACE
        0,0,   0,1,   1,1,
        0,0,   1,1,   1,0,
  
        // RIGHT FACE
        0,0,   0,1,   1,1,
        0,0,   1,1,   1,0,
  
        // LEFT FACE
        0,0,   1,1,   1,0,
        0,0,   1,0,   1,1,
  
        // BOTTOM FACE
        0,0,   0,1,   1,1,
        0,0,   1,1,   1,0,
  
        // BACK FACE
        0,0,   0,1,   1,1,
        0,1,   1,0,   1,1
      ]);
    }
  
    renderfaster() {
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      gl.uniform4f(u_FragColor,
                   this.color[0],
                   this.color[1],
                   this.color[2],
                   this.color[3]);
  
      if (!window.g_vertexBuffer) {  // Make global buffers just once
        window.g_vertexBuffer = gl.createBuffer();
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, window.g_vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32Positions, gl.STATIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      if (!window.g_uvBuffer) {
        window.g_uvBuffer = gl.createBuffer();
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, window.g_uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32UV, gl.STATIC_DRAW);
  
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_UV);
  
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
  }
  