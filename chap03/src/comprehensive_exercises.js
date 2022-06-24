// 顶点着色器，矩阵乘法
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 matrix;
    void main() {
        gl_Position = matrix * a_Position;
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
    var gl = WebGLUtils.setupWebGL(canvas);

    // 同时学习了一下创建program的流程，这个综合练习没有使用书提供的cuon-util.js
    // 而是自己封装的program-utils.js
    var program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
    gl.program = program;

    var n = initVertexBuffer(gl);

    if(n < 0) return;

    rotation(gl, n, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // 到这里为止按照默认位置绘制了一个红色三角形

    // 这里注册点击函数，触发旋转
    var rotation_btn = document.getElementById("rotation_button");
    rotation_btn.onmousedown = function() {
        rotation(gl, n, 90);
    }

    // 这里注册点击函数，触发平移
    var trans_btn = document.getElementById("trans_btn");
    trans_btn.onmousedown = function() {
        translate(gl, n);
    }

    // 这里注册点击函数，触发缩放
    var scale_btn = document.getElementById("scale_btn");
    scale_btn.onmousedown = function() {
        scale(gl, n);
    }

    // 这里注册点击函数，触发平移+缩放
    var trans_scale_btn = document.getElementById("trans_scale_btn");
    trans_scale_btn.onmousedown = function() {
        trans_scale(gl, n);
    }
}

function initVertexBuffer(gl) {

    var n = 3;

    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    var vextexBuffer = gl.createBuffer();
    if(!vextexBuffer) {
        return -1;
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

    // 旋转矩阵
    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 
    ]);

    redraw(gl, n, xformMatrix)
}

// 平移函数
function translate(gl, n) {
    var translateMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.0, 1.0,
    ])

    redraw(gl, n, translateMatrix);
}

// 缩放函数
function scale(gl, n) {
    var scaleMatrix = new Float32Array([
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ])
    redraw(gl, n, scaleMatrix)
}

function trans_scale(gl, n) {
    var transScaleMatrix = new Float32Array([
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.5, 0.5, 0.5, 1.0,
    ])
    redraw(gl, n, transScaleMatrix)
}

// 重新绘制
function redraw(gl, n, matrixArray){
    var matrix = gl.getUniformLocation(gl.program, "matrix");
    gl.uniformMatrix4fv(matrix, false, matrixArray);

    // 所处位置已经更新，需要清除再重新绘制
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

main();

