// asg0.js

function main() {
    // Get the canvas element
    var canvas = document.getElementById("example");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    // Get the 2D rendering context
    var ctx = canvas.getContext("2d");
    
    function resetCanvas() {
        // Reset transform to clear the entire canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Restore the center transform
        ctx.translate(canvas.width / 2, canvas.height / 2);
    }

    resetCanvas();

    function drawVector(v, color) {
        ctx.beginPath();
        ctx.moveTo(0, 0); 
        ctx.lineTo(v.elements[0] * 20, -v.elements[1] * 20);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Helper to compute the angle (in degrees) between two vectors.
    function angleBetween(v1, v2) {
        // dot(v1, v2) = ||v1|| * ||v2|| * cos(theta)
        let dotVal = Vector3.dot(v1, v2);
        let mag1   = v1.magnitude();
        let mag2   = v2.magnitude();

        if (mag1 === 0 || mag2 === 0) {
            return 0; 
        }

        let cosTheta = dotVal / (mag1 * mag2);

        if (cosTheta > 1)  cosTheta = 1;
        if (cosTheta < -1) cosTheta = -1;

        // Convert from radians to degrees
        let radians = Math.acos(cosTheta);
        let degrees = radians * (180 / Math.PI);
        return degrees;
    }

    function areaTriangle(v1, v2) {
        let crossVec = Vector3.cross(v1, v2);
        let parallelogramArea = crossVec.magnitude();
        return parallelogramArea / 2;
    }

    // Handle the "Draw" button (just draws v1 and v2).
    function handleDrawEvent() {
        // Clear and reset canvas
        resetCanvas();

        // Get vector coordinates and draw v1
        let x1 = parseFloat(document.getElementById("v1x").value);
        let y1 = parseFloat(document.getElementById("v1y").value);
        let v1 = new Vector3([x1, y1, 0]);
        drawVector(v1, "red");

        // Get vector coordinates and draw v2
        let x2 = parseFloat(document.getElementById("v2x").value);
        let y2 = parseFloat(document.getElementById("v2y").value);
        let v2 = new Vector3([x2, y2, 0]);
        drawVector(v2, "blue");
    }

    // Handle the second "Draw" button (performs operations).
    function handleDrawOperationEvent() {
        // 1) Clear & reset canvas
        resetCanvas();
    
        // 2) Read user input for v1, v2
        let x1 = parseFloat(document.getElementById("v1x").value);
        let y1 = parseFloat(document.getElementById("v1y").value);
        let x2 = parseFloat(document.getElementById("v2x").value);
        let y2 = parseFloat(document.getElementById("v2y").value);
    
        // Create v1, v2
        let v1 = new Vector3([x1, y1, 0]);
        let v2 = new Vector3([x2, y2, 0]);
    
        // Draw them in red and blue so user sees the originals
        drawVector(v1, "red");
        drawVector(v2, "blue");
    
        // 3) Determine which operation user selected
        let operation = document.getElementById("operation").value;
        let scalar    = parseFloat(document.getElementById("scalar").value);
    
        // 4) Perform the operation
        if (operation === "magnitude") {
            console.log("Magnitude v1:", v1.magnitude());
            console.log("Magnitude v2:", v2.magnitude());
        } 
        else if (operation === "normalize") {
            console.log("Magnitude v1:", v1.magnitude());
            console.log("Magnitude v2:", v2.magnitude());
            v1.normalize();
            v2.normalize();
            drawVector(v1, "green");
            drawVector(v2, "green");
        } 
        else if (operation === "add") {
            let v3 = new Vector3([x1, y1, 0]);
            v3.add(v2);
            drawVector(v3, "green");
        } 
        else if (operation === "subtract") {
            let v3 = new Vector3([x1, y1, 0]);
            v3.sub(v2);
            drawVector(v3, "green");
        } 
        else if (operation === "multiply") {
            let v3 = new Vector3([x1, y1, 0]);
            let v4 = new Vector3([x2, y2, 0]);
            v3.mul(scalar);
            v4.mul(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
        } 
        else if (operation === "divide") {
            let v3 = new Vector3([x1, y1, 0]);
            let v4 = new Vector3([x2, y2, 0]);
            v3.div(scalar);
            v4.div(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
        }
        else if (operation === "angleBetween") {
            let angleDeg = angleBetween(v1, v2);
            console.log("Angle:", angleDeg);
        }
        // Step 8: "Area" option
        else if (operation === "area") {
            let areaVal = areaTriangle(v1, v2);
            console.log("Area of the triangle:", areaVal);
        }
    }

    // Attach event listeners
    document.getElementById("drawButton").addEventListener("click", handleDrawEvent);
    document.getElementById("operationButton").addEventListener("click", handleDrawOperationEvent);

    // Draw initial vectors
    handleDrawEvent();
}

// Fire main() when the DOM is loaded
document.addEventListener("DOMContentLoaded", main);

