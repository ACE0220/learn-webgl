var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize; // gl_PointSize接收a_PointSize;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVertexBuffers(gl);
    if(n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    var vBuffer = gl.createBuffer(); // 步骤1
    var sBuffer = gl.createBuffer(); // 步骤1
    if(!vBuffer || !sBuffer) return -1;

    var n = 3;
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var sizes = new Float32Array([10.0, 20.0, 30.0]);

    // 将坐标传入着色器
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); // 步骤2
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 步骤3
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // 步骤4
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position); // 步骤5

    // 将顶点大小传入着色器，重复步骤2，3，4，5
    gl.bindBuffer(gl.ARRAY_BUFFER, sBuffer); // 步骤2
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW); // 步骤3
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize'); // 步骤4
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize); // 步骤5

    return n;
}

main();