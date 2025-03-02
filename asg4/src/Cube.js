class Cube {
  constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.cubeVerts32Positions = [
          // Front
          0, 0, 0, 1, 1, 0, 1, 0, 0,
          0, 0, 0, 0, 1, 0, 1, 1, 0,
          // Top 
          0, 1, 0, 1, 1, 1, 1, 1, 0,
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          // Bottom
          0, 1, 0, 1, 1, 1, 1, 1, 0,
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          // Left
          1, 0, 0, 1, 1, 1, 1, 1, 0,
          1, 0, 0, 1, 0, 1, 1, 1, 1,
          // Right
          0, 0, 0, 0, 1, 1, 0, 1, 0,
          0, 0, 0, 0, 0, 1, 0, 1, 1,
          // Back 
          0, 0, 1, 1, 1, 1, 0, 1, 1,
          0, 0, 1, 1, 0, 1, 1, 1, 1
      ];

      this.cubeVerts32UV = new Float32Array([
          0, 0, 0, 1, 1, 0, 1, 0, 0,
          0, 0, 0, 0, 1, 0, 1, 1, 0,
  
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          0, 1, 0, 1, 1, 1, 1, 1, 0,
  
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          0, 1, 0, 1, 1, 1, 1, 1, 0,
  
          0, 0, 0, 1, 0, 1, 0, 0, 1,
          0, 0, 0, 1, 0, 0, 1, 0, 1,
  
          1, 0, 0, 1, 1, 1, 1, 1, 0,
          1, 0, 0, 1, 0, 1, 1, 1, 1,
  
          0, 0, 1, 1, 1, 1, 0, 1, 1,
          0, 0, 1, 1, 0, 1, 1, 1, 1
      ]);

      this.uvVerts = [
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1
      ];

      this.NormalVerts = [
          0, 0, -1, 0, 0, -1, 0, 0, -1,
          0, 0, -1, 0, 0, -1, 0, 0, -1,
          0, 1, 0, 0, 1, 0, 0, 1, 0,
          0, 1, 0, 0, 1, 0, 0, 1, 0,
          0, -1, 0, 0, -1, 0, 0, -1, 0,
          0, -1, 0, 0, -1, 0, 0, -1, 0,
          1, 0, 0, 1, 0, 0, 1, 0, 0,
          1, 0, 0, 1, 0, 0, 1, 0, 0,
          -1, 0, 0, -1, 0, 0, -1, 0, 0,
          -1, 0, 0, -1, 0, 0, -1, 0, 0,
          0, 0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, 1, 0, 0, 1, 0, 0, 1
      ]
  }

  render() {
      var rgba = this.color;
  
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      drawTriangle3DUVNormal([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
      drawTriangle3DUVNormal([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
  
      drawTriangle3DUVNormal([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
      drawTriangle3DUVNormal([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
  
      drawTriangle3DUVNormal([0, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
      drawTriangle3DUVNormal([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
  
      drawTriangle3DUVNormal([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
      drawTriangle3DUVNormal([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);

      drawTriangle3DUVNormal([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 1, 1, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
      drawTriangle3DUVNormal([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
  
      gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);
      drawTriangle3DUVNormal([0, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
      drawTriangle3DUVNormal([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
  }

  renderfaster() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUVNormal(this.cubeVerts32Positions, this.uvVerts, this.NormalVerts);
  }
}