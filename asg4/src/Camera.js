class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 3]);
        this.at  = new Vector3([0, 0, -100]);
        this.up  = new Vector3([0, 1,  0]);
    }
    
    forward(step=0.1) {
        let f = this.at.sub(this.eye);
        f.normalize();
        f = f.mul(step);
        this.eye = this.eye.add(f);
        this.at  = this.at.add(f);
    }
    back(step=0.1) {
        let f = this.eye.sub(this.at);
        f.normalize();
        f = f.mul(step);
        this.eye = this.eye.add(f);
        this.at  = this.at.add(f);
    }
    left(step=0.1) {
        let f = this.at.sub(this.eye);
        f.normalize();
        let s = f.cross(this.up);
        s.normalize();
        s = s.mul(-step);
        this.eye = this.eye.add(s);
        this.at  = this.at.add(s);
    }
    right(step=0.1) {
        let f = this.at.sub(this.eye);
        f.normalize();
        let s = f.cross(this.up);
        s.normalize();
        s = s.mul(step);
        this.eye = this.eye.add(s);
        this.at  = this.at.add(s);
    }
    // Pan left
    panLeft(angleDeg=1) {
        let f = this.at.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angleDeg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let rotatedF = rotationMatrix.multiplyVector3(f);
        this.at = this.eye.add(rotatedF);
    }
    // Pan right
    panRight(angleDeg=1) {
        let f = this.at.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-angleDeg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let rotatedF = rotationMatrix.multiplyVector3(f);
        this.at = this.eye.add(rotatedF);
    }
}