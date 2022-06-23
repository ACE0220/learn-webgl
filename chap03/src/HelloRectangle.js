var VSHAER_SHOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
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

    if(!initShaders(gl, VSHAER_SHOURCE, FSHADER_SOURCE)) {
        return;
    }

    var n = initVertexBuffer(gl);
    if(n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 3、gl.TRIANGLES 改为 gl.TRIANGLE_STRIP
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    // 实验程序
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);


}

function initVertexBuffer(gl) {

    // 2、顶点数修改为4
    var n = 4;

    var vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 1、左上角v0，左下角v1，右上角v2，右下角v3
    var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

main();