var VSHAER_SHOURCE = `
    attribute vec4 a_Position;
    uniform float u_CosB, u_SinB;
    // 笔记中的旋转公式
    // x' = xcosβ - ysinβ
    // y' = xsinβ + ycosβ
    // z' = z
    void main() {
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        gl_Position.z = a_Position.z;
        gl_Position.w = 1.0;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

var PI = Math.PI;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHAER_SHOURCE, FSHADER_SOURCE)){
        return;
    }

    var n = initVertexBuffer(gl);

    if(n < 0) return;

    rotation(gl, n, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // 到这里为止按照默认位置绘制了一个红色三角形


    // 这里注册点击函数，触发旋转，平移函数位于63行
    var btn = document.getElementById("trigger_button");
    btn.onmousedown = function() {
        rotation(gl, n, 90);
    }
}

function initVertexBuffer(gl) {

    var n = 3;

    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    var vextexBuffer = gl.createBuffer();
    if(!vextexBuffer) {
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vextexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

// 旋转函数
function rotation(gl, n, angle) {
    var radian = angle / 180 * PI; // 弧度
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
    var u_SinB = gl.getUniformLocation(gl.program, "u_SinB");

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);
    // 所处位置已经更新，需要清除再重新绘制
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

main();