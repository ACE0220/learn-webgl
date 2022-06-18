// 顶点着色器，使用了attribute变量
var vertex_shader_source = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 5.0;
    }
`;

// 片元着色器，使用uniform变量
var fragment_shader_source = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

// 颜色
var colors = {
    1: [1.0, 0.0, 0.0, 1.0], // 红色
    2: [0.0, 1.0, 0.0, 1.0], // 蓝色
    3: [1.0, 1.0, 0.0, 1.0]  // 黄色
}

function main() {
    // 获取canvas元素和上下文
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);
    
    // 初始化shader
    if(!initShaders(gl, vertex_shader_source, fragment_shader_source)) {
        console.log("Init shaders fail");
        return;
    }

    // 获取attribute变量和uniform变量
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

    // 注册点击响应函数
    canvas.onmousedown = function(ev) {
        clickFunc(ev, gl, canvas, a_Position, u_FragColor);
    }

    // 清除缓冲区，给一个黑色背景
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = []
function clickFunc(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2) / (canvas.height / 2);
    y = ((canvas.width/2) - (y - rect.top)) / (canvas.width / 2);

    g_points.push({x, y});
    g_colors.push(colors[getRndInteger(1, 3)])

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++) {
        gl.vertexAttrib3f(a_Position, g_points[i].x, g_points[i].y, 0, 0);
        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    
}

// 左闭右开
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

main();

