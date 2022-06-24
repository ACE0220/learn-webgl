var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
    }
`

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVertexBuffer(gl);
    if(n < 0) return;

    // 此处开始模型变换
    var modelMatrix = new Matrix4();

    var ANGLE = 60.0; // 旋转角
    var Tx = 0.5;

    // 示例代码
    // modelMatrix.setRotate(ANGLE, 0, 0, 1);
    // modelMatrix.translate(Tx, 0, 0);

    // 实验代码，对调顺序
    modelMatrix.setTranslate(Tx, 0, 0);
    modelMatrix.rotate(ANGLE, 0, 0, 1);
    
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffer(gl) {

    var n = 3;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    if(!vertexBuffer) return -1;
    
    var vertices = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3])

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

main();