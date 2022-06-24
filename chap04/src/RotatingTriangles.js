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
`

// 1.设置每秒旋转的角度，45度
var ANGLE_STEP = 45.0;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVextexBuffer(gl);
    if(n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    // 2.currentAngle表示每次绘制时，三角形对于初始状态被旋转的角度值
    var currentAngle = 0.0;

    // 3.在main内部创建modelMatrix，如果在draw内部创建每次调用都会创建一个新的Matrix4对象
    var modelMatrix = new Matrix4();

    // 4.tick函数实现机制一，该函数将会被反复调用，每次调用就会更新currentAngle
    var tick = function() {
        // 更新旋转角
        currentAngle = animate(currentAngle);
        // 绘制三角形
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        // 请求浏览器调用tick，告知浏览器在将来某个时间调用作为第一个参数的函数tick，那时tick将再次执行
        // requestAnimationFrame的基本思想是与刷新率保持同步，利用刷新屏幕进行页面重绘
        // 我们先在48行主动调用tick，然后在46行告诉浏览器调用tick
        requestAnimationFrame(tick);
    }
    tick();
}

function initVextexBuffer(gl) {
    var vBuffer = gl.createBuffer();
    if(!vBuffer) return -1;

    var n = 3;
    var vertices = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    // 实验程序，取消注释查看效果
    // modelMatrix.translate(0.35, 0, 0);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// 记录上一次调用函数的时刻
var g_last = Date.now();
function animate(angle) {
    // 计算距离上次调用经过了多长时间
    var now = Date.now();
    var elapsed = now - g_last;
    // 更新上一次调用时刻为当前时间
    g_last = now;
    // 45度 / 1000 = 每毫秒应该走多少度
    // 再乘以elapsed毫秒，代表时间上应该旋转多少度
    var newAngle = angle + ANGLE_STEP / 1000.0 * elapsed;

    // 保持newAngle在0～360度之间
    return newAngle %= 360;
}

main();