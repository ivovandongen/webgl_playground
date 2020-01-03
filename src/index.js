import { glMatrix, mat4, vec3 } from "gl-matrix";

export function deg2rad(deg) {
    return deg * Math.PI / 180;
};

export function rad2deg(deg) {
    return deg * 180 / Math.PI;
};

export function start() {
    var m = ThreeDMath;

    var cubeVertices = [
        1, 1, 0, 1, 1,
        1, 0, 0, 1, 0,
        0, 0, 0, 0, 0,
        0, 1, 0, 0, 1
    ];
    var indices = [
        0, 1, 3,
        1, 2, 3
    ];

    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert("no webgl");
        return;
    }

    var program = webglUtils.createProgramFromScripts(
        gl, ["2d-vertex-shader", "2d-fragment-shader"]);
    gl.useProgram(program);

    var positionLoc = gl.getAttribLocation(program, "a_position");
    var texCoordsLoc = gl.getAttribLocation(program, "a_texCoords");
    var modelLoc = gl.getUniformLocation(program, "u_model");
    var viewLoc = gl.getUniformLocation(program, "u_view");
    var projectionLoc = gl.getUniformLocation(program, "u_projection");

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(cubeVertices),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(texCoordsLoc);
    gl.vertexAttribPointer(texCoordsLoc, 2, gl.FLOAT, false, 20, 12);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW);

    function render() {

        webglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        // Projection
        var projection = mat4.create();
        // mat4.scale(projection, projection, vec3.fromValues(1/10, 1/10, 1));

        var fieldOfView = deg2rad(90);
        var aspect = canvas.clientWidth / canvas.clientHeight;
        var perspective = mat4.create();
        mat4.perspective(perspective, fieldOfView, aspect, 0.1, 100);

        mat4.multiply(projection, perspective, projection);
        gl.uniformMatrix4fv(projectionLoc, false, projection);

        // View
        var eye = vec3.fromValues(1, 0, 3);
        var target = vec3.fromValues(0, 0, 0);
        var up = vec3.fromValues(0, 1, 0);
        var view = mat4.create();
        mat4.lookAt(view, eye, target, up);

        gl.uniformMatrix4fv(viewLoc, false, view);

        // Model
        var model = m.identity();
        // mat4.translate(model, model, vec3.fromValues(10,10,0));

        gl.uniformMatrix4fv(modelLoc, false, model);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


start();
