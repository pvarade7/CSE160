class Turtle {
    constructor() {
      this.type = 'turtle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 30.0;
    }
  
    render() {
      let d = this.size / 200.0;
      let cx = this.position[0];
      let cy = this.position[1];
  
      // Shell
      gl.uniform4f(u_FragColor, 0.6, 0.3, 0.0, 1.0);
      let shellSegments = 20;
      let shellRadius = 6 * d;
      let angleStep = 360 / shellSegments;
      for (let i = 0; i < shellSegments; i++) {
        let angle1 = i * angleStep;
        let angle2 = (i + 1) * angleStep;
        let rad1 = (Math.PI / 180) * angle1;
        let rad2 = (Math.PI / 180) * angle2;
        let x1 = cx + shellRadius * Math.cos(rad1);
        let y1 = cy + shellRadius * Math.sin(rad1);
        let x2 = cx + shellRadius * Math.cos(rad2);
        let y2 = cy + shellRadius * Math.sin(rad2);
        drawTriangle([cx, cy, x1, y1, x2, y2]);
      }
  
      // Flippers
      gl.uniform4f(u_FragColor, 0.0, 0.8, 0.2, 1.0);
      drawTriangle([cx - 4*d, cy + 2*d, cx - 8*d, cy + 6*d, cx - 3*d, cy + 4*d]);
      drawTriangle([cx + 4*d, cy + 2*d, cx + 8*d, cy + 6*d, cx + 3*d, cy + 4*d]);
      drawTriangle([cx - 3*d, cy - 3*d, cx - 7*d, cy - 6*d, cx - 2*d, cy - 5*d]);
      drawTriangle([cx + 3*d, cy - 3*d, cx + 7*d, cy - 6*d, cx + 2*d, cy - 5*d]);
  
      // Bigger head
      drawTriangle([cx, cy + 5.5*d, cx - 2.2*d, cy + 10.5*d, cx + 2.2*d, cy + 10.5*d]);
  
      // Eyes
      gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
      drawTriangle([cx - 1.0*d, cy + 9.7*d, cx - 1.4*d, cy + 9.3*d, cx - 0.6*d, cy + 9.3*d]);
      drawTriangle([cx + 1.0*d, cy + 9.7*d, cx + 1.4*d, cy + 9.3*d, cx + 0.6*d, cy + 9.3*d]);
  
      // Smile
      drawTriangle([cx - 1.0*d, cy + 7.7*d, cx + 1.0*d, cy + 7.7*d, cx, cy + 7.2*d]);
  
      // Tongue (pink)
      gl.uniform4f(u_FragColor, 1.0, 0.6, 0.8, 1.0);
      drawTriangle([cx - 0.5*d, cy + 7.2*d, cx + 0.5*d, cy + 7.2*d, cx, cy + 6.8*d]);
  
      // Tail
      gl.uniform4f(u_FragColor, 0.0, 0.8, 0.2, 1.0);
      drawTriangle([cx, cy - 6*d, cx - 1*d, cy - 8*d, cx + 1*d, cy - 8*d]);
    }
  }
  
  