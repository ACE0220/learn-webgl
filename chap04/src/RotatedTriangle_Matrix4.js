var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main() {
        gl_Position = u_xformMatrix * a_Position;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

var ANGLE = 45;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = WebGLUtils.setupWebGL(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    }

    var n = initVextexBuffer(gl);

    if(n < 0) return;

    /*
     * 旧的创建方式
    var radian = ANGLE / 180 * Math.PI;
    var cosB = Math.cos(radian), sinB = Math.sin(radian);

    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ])
    */

    // 新的创建方式
    // 为旋转矩阵创建Matrix对象
    var xformMatrix = new Matrix4();
    // 将xformMatrix设置为旋转矩阵
    xformMatrix.setRotate(ANGLE, 0, 0, 1);

    // 测试代码，自行修改测试
    // 注释46行，取消注释50～51行，可以看到平移+旋转
    // xformMatrix.setTranslate(0.5, 0.5,0.0);
    // xformMatrix.rotate(ANGLE, 0, 0, 1);

    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    
    
    // 旧的创建方式
    // gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
    // 新的创建方式
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

    draw(gl, n);
}

function initVextexBuffer(gl) {
    var n = 3;

    var vBuffer = gl.createBuffer();
    if(!vBuffer) return -1;
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;

}

function draw(gl, n) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

main();