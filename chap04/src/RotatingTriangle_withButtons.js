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

var ANGLE_STEP = 45.0;

function main() {
    var canvas = document.getElementById("canvas");
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    var n = initVextexBuffer(gl);
    if(n < 0) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    var currentAngle = 0.0;

    var modelMatrix = new Matrix4();

    var requestID = null;

    var tick = function() {

        currentAngle = animate(currentAngle);

        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);

        // 接收函数返回的请求ID
        requestID = requestAnimationFrame(tick);
    }
    tick();

    // 注册点击函数，提高速度
    var upBtn = document.getElementById("up");
    upBtn.onmousedown = function() {
        ANGLE_STEP += 10; 
        // 清除请求再重新请求
        cancleRequest(requestID);
        tick();
    }

    // 注册点击函数，降低速度
    var downBtn = document.getElementById("down");
    downBtn.onmousedown = function() {
        if(ANGLE_STEP - 10 <= 0) {
            ANGLE_STEP = 0;
        } else {
            ANGLE_STEP -= 10;
        }
        // 清除请求再重新请求
        cancleRequest(requestID);
        tick();
    }
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
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


var g_last = Date.now();
function animate(angle) {
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    var newAngle = angle + ANGLE_STEP / 1000.0 * elapsed;
    return newAngle %= 360;
}

main();